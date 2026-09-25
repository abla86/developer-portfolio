#!/usr/bin/env python3
"""Generate deterministic Markdown metadata pages from CSV, TSV, or BibTeX."""
from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path
from typing import Iterable


def markdown_escape(value: object) -> str:
    text = str(value or "").strip()
    return re.sub(r"([\\`*_{}\[\]()<>#+.!|~-])", r"\\\1", text)


def parse_delimited(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        sample = handle.read(4096)
        handle.seek(0)
        dialect = csv.Sniffer().sniff(sample, delimiters="\t,")
        rows = list(csv.DictReader(handle, dialect=dialect))
    return [{str(k).strip().lower(): (v or "").strip() for k, v in row.items()} for row in rows]


def parse_bibtex(path: Path) -> list[dict[str, str]]:
    text = path.read_text(encoding="utf-8-sig")
    records: list[dict[str, str]] = []
    for match in re.finditer(r"@(?P<kind>[^,\s{]+)\s*\{(?P<key>[^,]+),(?P<body>.*?)\n\}", text, re.S):
        row = {"type": match.group("kind").strip(), "key": match.group("key").strip()}
        body = match.group("body")
        for field, raw in re.findall(r"([A-Za-z][\w-]*)\s*=\s*(?:\{([^{}]*)\}|\"([^\"]*)\"|([^,\n]+))", body):
            row[field.lower()] = next((part.strip() for part in raw if part and part.strip()), "")
        records.append(row)
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
            safe_url = url.replace("(", "%28").replace(")", "%29")
            lines.append(f"- **Link:** <{safe_url}>")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--title", default="Metadata")
    args = parser.parse_args()
    records = load_records(args.input)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(render(records, args.title), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
