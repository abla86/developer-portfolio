import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from metadata_generator import load_records, markdown_escape, render


class MetadataGeneratorTests(unittest.TestCase):
    def test_markdown_is_escaped(self):
        self.assertEqual(markdown_escape("A *title*"), r"A \*title\*")

    def test_csv_and_tsv_are_supported(self):
        with tempfile.TemporaryDirectory() as directory:
            csv_path = Path(directory) / "records.csv"
            csv_path.write_text("title,year\nExample,2026\n", encoding="utf-8")
            self.assertEqual(load_records(csv_path)[0]["title"], "Example")

            tsv_path = Path(directory) / "records.tsv"
            tsv_path.write_text("title\tyear\nExample\t2026\n", encoding="utf-8")
            self.assertEqual(load_records(tsv_path)[0]["year"], "2026")

    def test_bibtex_is_supported(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "records.bib"
            path.write_text("@article{example,\n title = {Example},\n year = {2026}\n}\n", encoding="utf-8")
            record = load_records(path)[0]
            self.assertEqual(record["title"], "Example")
            self.assertEqual(record["year"], "2026")

    def test_invalid_input_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "invalid.bib"
            path.write_text("not a BibTeX document", encoding="utf-8")
            with self.assertRaises(ValueError):
                load_records(path)

    def test_render_is_deterministic_and_contains_records(self):
        output = render([{"title": "Example", "year": "2026"}], "Publications")
        self.assertIn("# Publications", output)
        self.assertIn("Example", output)
        self.assertEqual(output, render([{"title": "Example", "year": "2026"}], "Publications"))
