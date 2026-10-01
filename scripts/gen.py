#!/usr/bin/env python3
"""Генерує src/lectures/*.jsx та src/labs/*.jsx із content/*.md (та сама розмітка/CSS, що в еталонному порталі)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WIDGETS = {  # лекція -> (компонент, файл)
    1: "LayersExplorer", 2: "TopicMatcher", 3: "SizingCalculator", 4: "AlertSimulator",
    5: "RulEstimator", 6: "HmacDemo", 7: "TcoCalculator",
}


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline(s):
    codes = []

    def keep(m):
        codes.append(f"<code>{esc(m.group(1))}</code>")
        return f"\x00{len(codes)-1}\x00"

    s = re.sub(r"`([^`]+)`", keep, s)
    s = esc(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<i>\1</i>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" target="_blank" rel="noreferrer">\1</a>', s)
    return re.sub(r"\x00(\d+)\x00", lambda m: codes[int(m.group(1))], s)


def J(s):  # JS-рядок
    return json.dumps(s, ensure_ascii=False)


def html(tag, text, cls=None):
    c = f' className="{cls}"' if cls else ""
    return f"<{tag}{c} dangerouslySetInnerHTML={{{{__html: {J(inline(text))}}}}} />"


def parse(lines):
    out, i = [], 0
    while i < len(lines):
        ln = lines[i]
        if not ln.strip():
            i += 1
        elif ln.lstrip().startswith("```"):
            ind = len(ln) - len(ln.lstrip())
            i += 1
            buf = []
            while i < len(lines) and not lines[i].lstrip().startswith("```"):
                buf.append(lines[i][ind:] if lines[i][:ind].strip() == "" else lines[i])
                i += 1
            i += 1
            out.append(f'<pre className="code"><code>{{{J(chr(10).join(buf))}}}</code></pre>')
        elif m := re.match(r"(#{1,4})\s+(.*)", ln):
            lvl = min(len(m.group(1)), 3)
            out.append(html(f"h{lvl}", m.group(2)))
            i += 1
        elif ln.strip() == "---":
            out.append("<hr />")
            i += 1
        elif ln.lstrip().startswith("|") and i + 1 < len(lines) and re.match(r"\s*\|[\s:|-]+\|\s*$", lines[i + 1]):
            hdr = [c.strip() for c in ln.strip().strip("|").split("|")]
            i += 2
            rows = []
            while i < len(lines) and lines[i].lstrip().startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            th = "".join(html("th", c) for c in hdr)
            tr = "".join("<tr>" + "".join(html("td", c) for c in r) + "</tr>" for r in rows)
            out.append(f'<div className="resp"><table className="data"><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table></div>')
        elif ln.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].startswith(">"):
                buf.append(lines[i].lstrip("> ").rstrip())
                i += 1
            out.append(html("div", " ".join(buf), "callout"))
        elif re.match(r"(\s*)([-*]|\d+\.)\s+", ln):
            base = len(ln) - len(ln.lstrip())
            ordered = bool(re.match(r"\s*\d+\.", ln))
            items = []
            while i < len(lines):
                m = re.match(r"(\s*)([-*]|\d+\.)\s+(.*)", lines[i])
                if not m or len(m.group(1)) != base:
                    break
                item = [m.group(3)]
                i += 1
                while i < len(lines) and (lines[i].startswith(" " * (base + 2)) or (not lines[i].strip() and i + 1 < len(lines) and lines[i + 1].startswith(" " * (base + 2)))):
                    item.append(lines[i][base + 2:] if lines[i].strip() else "")
                    i += 1
                items.append(item)
            tag = "ol" if ordered else "ul"
            lis = []
            for it in items:
                if len(it) == 1:
                    lis.append(html("li", it[0]))
                else:
                    lis.append("<li>" + "".join(parse(it)) + "</li>")
            out.append(f"<{tag}>{''.join(lis)}</{tag}>")
        else:
            buf = []
            while i < len(lines) and lines[i].strip() and not re.match(r"\s*(```|#|\||>|([-*]|\d+\.)\s)", lines[i]):
                buf.append(lines[i].strip())
                i += 1
            if not buf:  # захист від зациклення
                buf = [lines[i].strip()]
                i += 1
            out.append(html("p", " ".join(buf)))
    return out


def split_sections(md_lines):
    """-> (title, meta_line, [(h2, lines)]) """
    title = md_lines[0].lstrip("# ").strip()
    rest = md_lines[1:]
    meta = ""
    for ln in rest:
        if ln.strip():
            meta = ln.strip().strip("*")
            break
    rest = rest[rest.index(next(x for x in rest if x.strip())) + 1:]
    secs, cur = [], (None, [])
    for ln in rest:
        if ln.startswith("## "):
            secs.append(cur)
            cur = (ln[3:].strip(), [])
        else:
            cur[1].append(ln)
    secs.append(cur)
    return title, meta, [s for s in secs if s[0] or any(l.strip() for l in s[1])]


def meta_block(meta, lab):
    parts = [p.strip() for p in meta.split(" · ")]
    cells = []
    for p in parts:
        if re.match(r"Тиждень \d+", p):
            k, v = "Тиждень", p.split()[1]
        elif re.match(r"\d+ академічні", p):
            k, v = "Обсяг", p
        elif p.startswith("Тривалість:"):
            k, v = "Обсяг", p.split(":", 1)[1].strip()
        elif re.match(r"Лекція \d+", p):
            k, v = "Лекція", p.split()[1]
        elif ":" in p:
            k, v = p.split(":", 1)
            k, v = k.strip().capitalize(), v.strip()
        else:
            k, v = "", p
        cells.append(f"<div><b>{esc(k)}</b><span dangerouslySetInnerHTML={{{{__html: {J(inline(v))}}}}} /></div>")
    return f'<div className="lab-meta">{"".join(cells)}</div>'


def build(kind, n):
    md = (ROOT / "content" / f"{'lecture' if kind == 'lec' else 'lab'}{n}.md").read_text(encoding="utf-8").splitlines()
    title, meta, secs = split_sections(md)
    title = re.sub(r"^(Лекція|Лабораторна)\s+\d+\.\s*", "", title)
    kicker = f"Лекція {n}" if kind == "lec" else f"Лабораторна робота {n}"
    body = [f'<div className="kicker">{kicker}</div>', f"<h1>{esc(title)}</h1>", meta_block(meta, kind == "lab")]
    for h, lines in secs:
        if h == "Мета":
            body.append('<div className="goals"><b>' + ("Цілі заняття" if kind == "lec" else "Мета роботи") + "</b>" + "".join(parse(lines)) + "</div>")
        elif h == "Контрольні питання":
            continue
        elif h is None:
            body += parse(lines)
        else:
            body.append(html("h2", h))
            body += parse(lines)
    if kind == "lec":
        w = WIDGETS[n]
        body.append(html("h2", "Інтерактив"))
        body.append(f"<{w} />")
        body.append(f"<Quiz questions={{QUIZ.l{n}}} />")
        nxt = f"Наступна лекція — №{n+1}." if n < 7 else "Це остання лекція курсу; далі — захист підсумкового проєкту."
        body.append(f'<p className="footer-note">Лабораторна цього тижня — ЛР{n}. {nxt}</p>')
        imp = f"import {w} from '../widgets/{w}.jsx'\n"
    else:
        body.append('<div className="callout"><b>Перевірка:</b> автотести <code>tests/test_lab' + str(n) + '_*.py</code> у вашому форку шаблону; на захисті — демонстрація та відповіді на питання вище.</div>')
        body.append(f"<Quiz questions={{QUIZ.lr{n}}} />")
        imp = ""
    name = f"{'Lecture' if kind == 'lec' else 'Lab'}{n:02d}"
    code = (f"// Згенеровано scripts/gen.py з content/*.md - редагуйте markdown, потім `npm run gen`\n"
            f"import Quiz from '../components/Quiz.jsx'\nimport {{ QUIZ }} from '../quizzes.js'\n{imp}\n"
            f"export default function {name}() {{\n  return (\n    <article>\n      " + "\n      ".join(body) + "\n    </article>\n  )\n}\n")
    out = ROOT / "src" / ("lectures" if kind == "lec" else "labs") / f"{name}.jsx"
    out.write_text(code, encoding="utf-8")


if __name__ == "__main__":
    for n in range(1, 8):
        build("lec", n)
        build("lab", n)
    print("generated 14 pages")
