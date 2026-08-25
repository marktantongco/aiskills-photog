#!/usr/bin/env python3
"""Build print-friendly wiki.html from SKILL.md (deterministic, static)."""
import html as H
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "SKILL.md"
OUT = ROOT / "wiki.html"

md = SRC.read_text(encoding="utf-8")


def inline(text: str) -> str:
    """Minimal inline markdown -> HTML (bold, code, arrows)."""
    t = H.escape(text, quote=False)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = t.replace("-->", "&#8594;").replace("->", "&#8594;")
    return t


def parse_table(lines, i):
    """Return (rows, next_i) where rows = list of cell-lists."""
    rows = []
    while i < len(lines) and lines[i].startswith("|"):
        cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
        if not all(re.fullmatch(r":?-{3,}:?", c) for c in cells):  # skip separator
            rows.append(cells)
        i += 1
    return rows, i


def table_html(rows, cls="wiki-table"):
    if not rows:
        return ""
    head, body = rows[0], rows[1:]
    out = ['<div class="table-wrap"><table class="%s">' % cls]
    out.append("<thead><tr>" + "".join(f"<th scope=\"col\">{inline(c)}</th>" for c in head) + "</tr></thead>")
    out.append("<tbody>")
    for r in body:
        out.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>")
    out.append("</tbody></table></div>")
    return "\n".join(out)


lines = md.splitlines()
sections = []   # (num, title, desc, rows)
platform_rows = None

i = 0
while i < len(lines):
    line = lines[i]
    m = re.match(r"^### (\d)\. (.+?)\s*(?:\*\(.*\)\*)?$", line)
    if m and 1 <= int(m.group(1)) <= 6:
        num, title = m.group(1), m.group(2).strip()
        i += 1
        desc = ""
        if i < len(lines) and lines[i].startswith("*") and lines[i].endswith("*"):
            desc = lines[i].strip("*").strip()
            i += 1
        # collect ALL tables in this section (until next ##/### heading)
        rows = []
        while i < len(lines) and not re.match(r"^#{2,3} ", lines[i]):
            if lines[i].startswith("| Sub-Skill"):
                tbl, i = parse_table(lines, i)
                rows.extend(tbl)  # keep each table's header so tables stay separate
                rows.append("---TABLE-BREAK---")
            else:
                i += 1
        # split into individual tables on breaks
        tables, cur = [], []
        for r in rows:
            if r == "---TABLE-BREAK---":
                if cur: tables.append(cur); cur = []
            else:
                cur.append(r)
        if cur: tables.append(cur)
        sections.append((num, title, desc, tables))
        continue
    if line.startswith("## ") and "Platform & Tool Reference" in line:
        i += 1
        while i < len(lines) and not lines[i].startswith("|"):
            i += 1
        platform_rows, i = parse_table(lines, i)
        continue
    i += 1

toc = "\n".join(
    f'<li><a href="#cat{n}">{H.escape(t)}</a> <span class="count">({sum(max(len(tb) - 1, 0) for tb in r)} sub-skills)</span></li>'
    for n, t, d, r in sections
)

cats = []
for n, title, desc, tables in sections:
    tables_html = "\n".join(table_html(tb) for tb in tables)
    cats.append(f"""
<section id="cat{n}">
  <h2>{int(n):02d} · {H.escape(title)}</h2>
  <p class="desc">{inline(desc)}</p>
  {tables_html}
</section>""")

platform = table_html(platform_rows) if platform_rows else ""
today = "August 2026"

page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Practitioner Skills Framework — Print Wiki</title>
<meta name="description" content="Print-friendly wiki of the AI Practitioner Skills Framework: 6 domains, 64 sub-skills, platform reference.">
<meta name="robots" content="index, follow">
<link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%3E%3Crect%20width='100'%20height='100'%20rx='22'%20fill='%23dc2626'/%3E%3Cpath%20d='M50%2016%2084%2050%2050%2084%2016%2050Z'%20fill='%23fff'/%3E%3C/svg%3E">
<style>
  :root {{ --text:#1c1917; --muted:#57534e; --accent:#b91c1c; --border:#d6d3d1; }}
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  html {{ font-size:15px; }}
  body {{ font-family: Georgia, 'Times New Roman', serif; color:var(--text); line-height:1.55; background:#fff;
         max-width: 900px; margin: 0 auto; padding: 2.5rem 1.5rem 4rem; }}
  header.wiki-head {{ border-bottom: 3px double var(--text); padding-bottom: 1rem; margin-bottom: 2rem; }}
  h1 {{ font-size: 1.9rem; line-height: 1.2; }}
  .meta {{ font-family: 'Courier New', monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--muted); margin-top: 0.5rem; }}
  .no-print {{ position: fixed; right: 1.25rem; bottom: 1.25rem; display:flex; gap:0.5rem; }}
  .no-print a, .no-print button {{ font-family: Arial, sans-serif; font-size: 0.8rem; font-weight: 600; text-decoration:none;
       background:#dc2626; color:#fff; border:none; border-radius:6px; padding:0.7rem 1.1rem; cursor:pointer; }}
  .no-print a.secondary {{ background:#fff; color:#1c1917; border:1px solid var(--border); }}
  nav.toc {{ background:#f5f5f4; border:1px solid var(--border); border-radius:8px; padding:1rem 1.5rem; margin-bottom:2.5rem; }}
  nav.toc h2 {{ font-size: 0.8rem; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing:0.12em; color:var(--muted); margin-bottom:0.5rem; }}
  nav.toc ol {{ padding-left: 1.4rem; }}
  nav.toc li {{ margin: 0.25rem 0; font-family: Arial, sans-serif; font-size: 0.9rem; }}
  nav.toc a {{ color: var(--text); }}
  section {{ margin-bottom: 2.5rem; break-inside: avoid-page; }}
  h2 {{ font-size: 1.3rem; border-bottom: 1px solid var(--border); padding-bottom: 0.3rem; margin-bottom: 0.75rem; }}
  .desc {{ font-style: italic; color: var(--muted); margin-bottom: 1rem; }}
  .count {{ color: var(--muted); font-size: 0.8em; }}
  .table-wrap {{ overflow-x: auto; }}
  table {{ width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 0.78rem; }}
  th, td {{ border: 1px solid var(--border); padding: 0.45rem 0.6rem; text-align: left; vertical-align: top; }}
  thead th {{ background: #f5f5f4; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; }}
  tbody tr:nth-child(even) {{ background: #fafaf9; }}
  code {{ font-family: 'Courier New', monospace; font-size: 0.85em; background: #f5f5f4; padding: 0 3px; border-radius: 3px; }}
  footer {{ margin-top: 3rem; border-top: 1px solid var(--border); padding-top: 1rem;
           font-family: Arial, sans-serif; font-size: 0.75rem; color: var(--muted); }}
  footer a {{ color: var(--accent); }}
  @media print {{
    .no-print {{ display: none; }}
    body {{ max-width: none; padding: 0; font-size: 11px; }}
    h1 {{ font-size: 20px; }}
    section {{ break-inside: auto; }}
    table {{ font-size: 9px; }}
    th, td {{ padding: 3px 4px; }}
    a {{ color: inherit; text-decoration: none; }}
  }}
</style>
</head>
<body>
<header class="wiki-head">
  <h1>AI Practitioner Skills Framework — Print Wiki</h1>
  <p class="meta">v5.0 · {today} · 6 domains · {sum(max(len(tb) - 1, 0) for _,_,_,tbs in sections for tb in tbs)} sub-skills · CC-BY-SA 4.0</p>
</header>

<div class="no-print">
  <a class="secondary" href="index.html">&larr; Back to site</a>
  <button type="button" onclick="window.print()">🖨 Print / Save as PDF</button>
</div>

<nav class="toc" aria-label="Contents">
  <h2>Contents</h2>
  <ol>{toc}</ol>
</nav>

{''.join(cats)}

<section id="platforms">
  <h2>Platform &amp; Tool Reference</h2>
  {platform}
</section>

<footer>
  Generated from <a href="SKILL.md">SKILL.md</a> · AI Practitioner Skills Framework v5.0 · License CC-BY-SA 4.0
</footer>
</body>
</html>
"""

OUT.write_text(page, encoding="utf-8")
print(f"wiki.html written: {OUT} ({OUT.stat().st_size} bytes, {len(sections)} sections, "
      f"{sum(max(len(tb) - 1, 0) for _,_,_,tbs in sections for tb in tbs)} sub-skill rows, platform table: {bool(platform_rows)})")
