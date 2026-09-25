#!/usr/bin/env python3
"""Generate deterministic Markdown metadata from CSV, TSV, or BibTeX."""
from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path
from typing import Iterable

MAX_INPUT_BYTES = 2_000_000
MAX_RECORDS = 10_000
_FIELD_RE = re.compile(r"(?P<name>[A-Za-z][\w-]*)\s*=\s*(?P<value>\{(?:[^{}]|\{[^{}]*\})*\}|\"(?:[^\"\\]|\\.)*\"|[^,\n]+)", re.S)


def markdown_escape(value: object) -> str:
    text = str(value or "").strip()
    return re.sub(r"([\\`*_{}\[\]()<>#+.!|~-])", r"\\\1", text)


def _read_text(path: Path) -> str:
    if not path.is_file():
        raise ValueError(f"Input file does not exist: {path}")
    if path.stat().st_size > MAX_INPUT_BYTES:
        raise ValueError("Input file exceeds the 2 MiB safety limit")
    return path.read_text(encoding="utf-8-sig")


def parse_delimited(path: Path) -> list[dict[str, str]]:
    text = _read_text(path)
    if not text.strip():
        return []
    try:
        dialect = csv.Sniffer().sniff(text[:4096], delimiters="\t,")
    except csv.Error as exc:
        raise ValueError("Could not detect CSV/TSV delimiter") from exc
    rows = list(csv.DictReader(text.splitlines(), dialect=dialect))
    if len(rows) > MAX_RECORDS:
        raise ValueError("Input contains too many records")
    if not rows or not rows[0]:
        return []
    return [{str(k).strip().lower(): (v or "").strip() for k, v in row.items() if k} for row in rows]


def _strip_bib_value(value: str) -> str:
    value = value.strip().rstrip(",").strip()
    if len(value) >= 2 and value[0] == "{" and value[-1] == "}":
        return value[1:-1].strip()
    if len(value) >= 2 and value[0] == '"' and value[-1] == '"':
        return value[1:-1].replace('\\"', '"').strip()
    return value


def parse_bibtex(path: Path) -> list[dict[str, str]]:
    text = _read_text(path)
    records: list[dict[str, str]] = []
    entry_re = re.compile(
        r"@(?P<kind>[A-Za-z][\w-]*)\s*\{(?P<key>[^,\s]+)\s*,(?P<body>.*?)^\s*\}",
        re.S | re.M,
    )
    for entry in entry_re.finditer(text):
        row = {"type": entry.group("kind").lower(), "key": entry.group("key").strip()}
        body = entry.group("body")
        for field in _FIELD_RE.finditer(body):
            row[field.group("name").lower()] = _strip_bib_value(field.group("value"))
        records.append(row)
    if len(records) > MAX_RECORDS:
        raise ValueError("BibTeX input contains too many records")
    if text.strip() and not records:
        raise ValueError("No valid BibTeX records found")
    return records


def load_records(path: Path) -> list[dict[str, str]]:
    suffix = path.suffix.lower()
    if suffix in {".csv", ".tsv"}:
        return parse_delimited(path)
    if suffix in {".bib", ".bibtex"}:
        return parse_bibtex(path)
    raise ValueError(f"Unsupported input format: {path.suffix or '<none>'}")


def first(row: dict[str, str], *keys: str) -> str:
    for key in keys:
        value = row.get(key.lower(), "").strip()
        if value:
            return value
    return ""


def render(records: Iterable[dict[str, str]], title: str) -> str:
    rows = list(records)
    lines = [f"# {markdown_escape(title)}", "", f"_Generated records: {len(rows)}_", ""]
    for index, row in enumerate(rows, 1):
        name = first(row, "title", "name", "event", "key") or f"Record {index}"
        year = first(row, "year", "date")
        authors = first(row, "author", "authors", "speaker", "presenter")
        venue = first(row, "journal", "booktitle", "venue", "event")
        url = first(row, "url", "doi", "link")
        lines.append(f"## {index}. {markdown_escape(name)}")
        if authors:
            lines.append(f"- **Author(s):** {markdown_escape(authors)}")
        if year:
            lines.append(f"- **Year/date:** {markdown_escape(year)}")
        if venue:
            lines.append(f"- **Venue:** {markdown_escape(venue)}")
        if url:
            safe_url = url.replace("(", "%28").replace(")", "%29").replace("\n", "")
            lines.append(f"- **Link:** <{safe_url}>")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--title", default="Metadata")
    args = parser.parse_args()
    try:
        records = load_records(args.input)
        output = render(records, args.title)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(output, encoding="utf-8", newline="\n")
    except (OSError, ValueError) as exc:
        parser.error(str(exc))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
