import tempfile
import unittest
from pathlib import Path

from metadata_generator import load_records, markdown_escape, render


class MetadataGeneratorTests(unittest.TestCase):
    def test_markdown_is_escaped(self):
        self.assertEqual(markdown_escape("A *title*"), r"A \*title\*")

    def test_csv_and_tsv_are_supported(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            csv_path = root / "items.csv"
            tsv_path = root / "items.tsv"
            csv_path.write_text("title,year\nPaper,2026\n", encoding="utf-8")
            tsv_path.write_text("title\tyear\nTalk\t2025\n", encoding="utf-8")
            self.assertEqual(load_records(csv_path)[0]["title"], "Paper")
            self.assertEqual(load_records(tsv_path)[0]["title"], "Talk")

    def test_bibtex_is_supported(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "items.bib"
            path.write_text('@article{key,\n  title={Example},\n  year={2026}\n}\n', encoding="utf-8")
            record = load_records(path)[0]
            self.assertEqual(record["title"], "Example")
            self.assertEqual(record["year"], "2026")

    def test_render_is_deterministic_and_contains_records(self):
        output = render([{"title": "Example", "year": "2026"}], "Publications")
        self.assertIn("# Publications", output)
        self.assertIn("Example", output)
        self.assertEqual(output, render([{"title": "Example", "year": "2026"}], "Publications"))


if __name__ == "__main__":
    unittest.main()
