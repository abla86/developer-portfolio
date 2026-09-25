# Portfolio metadata generator

`metadata_generator.py` converts publication or talk metadata from CSV, TSV, or BibTeX into deterministic Markdown.

## Safety and validation

- Only CSV, TSV, BibTeX and BibLaTeX input extensions are accepted.
- Input is limited to 2 MiB and 10,000 records.
- Invalid or empty BibTeX content is rejected.
- Markdown values are escaped before rendering.
- Output is written as UTF-8 with normalized LF line endings.
- The generator does not execute input content or follow input-provided paths.

## Usage

```bash
python3 scripts/metadata_generator.py archive/legendary-octo-spoon/markdown_generator/publications.tsv docs/publications.generated.md --title Publications
python3 scripts/metadata_generator.py archive/legendary-octo-spoon/markdown_generator/talks.tsv docs/talks.generated.md --title Talks
python3 scripts/metadata_generator.py records.bib docs/publications.generated.md --title Publications
```

Run tests from the repository root:

```bash
python3 -m unittest discover -s scripts -p 'test_*.py'
```

The legacy generator files remain archived and vendor files are intentionally untouched.
