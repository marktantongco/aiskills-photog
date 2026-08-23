#!/usr/bin/env python3
"""Build skills.pdf from skills.md using fpdf2 (run inside a venv with fpdf2)."""
import re
import sys
from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "skills.md"
OUT = ROOT / "skills.pdf"

md = SRC.read_text(encoding="utf-8")

# Latin-1 sanitization map for Helvetica core font
TRANS = {
    "\u2014": "-", "\u2013": "-", "\u2018": "'", "\u2019": "'",
    "\u201c": '"', "\u201d": '"', "\u2026": "...", "\u00b7": "-",
    "\u2192": "->", "\u21d2": "=>", "\u00b0": " deg", "\u00d7": "x",
    "\u25cf": "*", "\u2022": "-", "\u00a0": " ", "\u2265": ">=", "\u2264": "<=",
    "\u2190": "<-", "\u2194": "<->", "\u00e9": "e", "\u00b7": "-",
}


def sanitize(text: str) -> str:
    for k, v in TRANS.items():
        text = text.replace(k, v)
    # strip emojis + any remaining non-latin1
    return "".join(c for c in text if 32 <= ord(c) < 127 or c in "\n\t")


def strip_md(text: str) -> str:
    t = re.sub(r"`([^`]+)`", r"\1", text)
    t = re.sub(r"\*\*([^*]+)\*\*", r"\1", t)
    t = re.sub(r"\*([^*]+)\*", r"\1", t)
    return t.strip()


class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(120, 113, 108)
            self.cell(0, 6, "AI Practitioner Skills Framework v3.1", align="L")
            self.cell(0, 6, f"Page {self.page_no()}", align="R", new_x="LMARGIN", new_y="NEXT")
            self.ln(2)

    def footer(self):
        self.set_y(-14)
        self.set_font("Helvetica", "I", 7)
        self.set_text_color(150, 145, 140)
        self.cell(0, 8, "CC-BY-SA 4.0 - generated from skills.md - August 2026", align="C")


pdf = PDF(format="A4")
pdf.set_margins(16, 14, 16)
pdf.set_auto_page_break(auto=True, margin=16)
pdf.add_page()

# Title block
pdf.set_font("Helvetica", "B", 22)
pdf.set_text_color(28, 25, 23)
pdf.cell(0, 10, "AI Practitioner Skills Framework", new_x="LMARGIN", new_y="NEXT", align="L")
pdf.set_font("Helvetica", "", 10)
pdf.set_text_color(87, 83, 78)
pdf.cell(0, 6, "Print edition - v3.1 - August 2026 - 6 core domains - License CC-BY-SA 4.0",
         new_x="LMARGIN", new_y="NEXT")
pdf.set_draw_color(220, 38, 38)
pdf.set_line_width(0.6)
pdf.line(16, pdf.get_y() + 2, 194, pdf.get_y() + 2)
pdf.ln(8)

lines = md.splitlines()
i = 0
in_code = False
section_no = 0

while i < len(lines):
    line = lines[i]

    if line.startswith("```"):
        in_code = not in_code
        i += 1
        continue

    m = re.match(r"^### (\d)\. (.+?)\s*(?:\*\(.*\)\*)?$", line)
    if m and 1 <= int(m.group(1)) <= 6 and not in_code:
        section_no += 1
        pdf.add_page()
        pdf.set_font("Helvetica", "B", 15)
        pdf.set_text_color(185, 28, 28)
        pdf.cell(0, 9, sanitize(f"{int(m.group(1)):02d} - {strip_md(m.group(2))}"),
                 new_x="LMARGIN", new_y="NEXT")
        pdf.set_draw_color(231, 229, 228)
        pdf.set_line_width(0.3)
        pdf.line(16, pdf.get_y() + 1, 194, pdf.get_y() + 1)
        pdf.ln(4)
        i += 1
        # italic description line
        if i < len(lines) and lines[i].startswith("*") and lines[i].endswith("*") and lines[i] != "*":
            pdf.set_font("Helvetica", "I", 9.5)
            pdf.set_text_color(87, 83, 78)
            pdf.multi_cell(0, 5, sanitize(strip_md(lines[i])), new_x="LMARGIN", new_y="NEXT")
            pdf.ln(2)
            i += 1
        continue

    # Core tables (Sub-Skill header)
    if line.startswith("| Sub-Skill") and not in_code:
        rows = []
        j = i + 1
        while j < len(lines) and lines[j].startswith("|"):
            cells = [c.strip() for c in lines[j].strip().strip("|").split("|")]
            if not all(re.fullmatch(r":?-{3,}:?", c) for c in cells):
                rows.append(cells)
            j += 1
        # render compact table: Sub-Skill | Explanation | Example (drop Tools col to fit)
        pdf.set_font("Helvetica", "B", 7.5)
        pdf.set_fill_color(245, 245, 244)
        pdf.set_text_color(87, 83, 78)
        pdf.cell(52, 6, "SUB-SKILL", border=1, fill=True)
        pdf.cell(0, 6, "EXAMPLE", border=1, fill=True, new_x="LMARGIN", new_y="NEXT")
        pdf.set_text_color(28, 25, 23)
        for r in rows:
            name = sanitize(strip_md(r[0]))
            ex = sanitize(strip_md(r[3] if len(r) > 3 else (r[-1] if r else "")))
            if not ex:
                ex = sanitize(strip_md(r[1] if len(r) > 1 else ""))
            pdf.set_font("Helvetica", "B", 8)
            pdf.cell(52, 6, name[:38], border=1)
            pdf.set_font("Courier", "", 7)
            pdf.multi_cell(0, 6, ex[:95], border=1, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)
        i = j
        continue

    # Platform & Tool Reference table
    if line.startswith("| Category") and not in_code:
        rows = []
        j = i + 1
        while j < len(lines) and lines[j].startswith("|"):
            cells = [c.strip() for c in lines[j].strip().strip("|").split("|")]
            if not all(re.fullmatch(r":?-{3,}:?", c) for c in cells):
                rows.append(cells)
            j += 1
        pdf.add_page()
        pdf.set_font("Helvetica", "B", 15)
        pdf.set_text_color(185, 28, 28)
        pdf.cell(0, 9, sanitize("Platform & Tool Reference"), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(3)
        for r in rows[1:]:
            pdf.set_font("Helvetica", "B", 9)
            pdf.set_text_color(28, 25, 23)
            pdf.multi_cell(0, 5.5, sanitize(strip_md(r[0])), new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 8.5)
            pdf.set_text_color(87, 83, 78)
            pdf.multi_cell(0, 4.6, sanitize("Tools: " + strip_md(r[1] if len(r) > 1 else "")),
                           new_x="LMARGIN", new_y="NEXT")
            pdf.ln(2)
        i = j
        continue

    i += 1

# Closing page: links
pdf.add_page()
pdf.set_font("Helvetica", "B", 15)
pdf.set_text_color(185, 28, 28)
pdf.cell(0, 9, "Resources", new_x="LMARGIN", new_y="NEXT")
pdf.ln(4)
pdf.set_font("Helvetica", "", 10)
pdf.set_text_color(28, 25, 23)
for label, url in [
    ("Interactive site", "https://marktantongco.github.io/aiskills-photog/"),
    ("Print wiki (HTML)", "https://marktantongco.github.io/aiskills-photog/wiki.html"),
    ("Source document", "https://marktantongco.github.io/aiskills-photog/skills.md"),
]:
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, label, new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Courier", "", 8.5)
    pdf.set_text_color(185, 28, 28)
    pdf.cell(0, 5.5, url, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

pdf.output(str(OUT))
size = OUT.stat().st_size
head = OUT.read_bytes()[:8]
print(f"skills.pdf written: {OUT} ({size} bytes, {pdf.page_no()} pages, magic={head!r})")
assert head.startswith(b"%PDF"), "PDF magic missing!"
