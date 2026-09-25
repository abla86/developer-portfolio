# Portfolio metadata generator

`metadata_generator.py` converts publication or talk metadata from CSV, TSV, or BibTeX into deterministic Markdown.

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

The legacy generator files remain archived and vendor files are intentionally untouched. This active generator replaces their unfinished format-specific TODOs without pretending that old archived code is complete.
