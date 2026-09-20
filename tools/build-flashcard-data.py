#!/usr/bin/env python3
"""Generate the flashcard data scripts from the plain text word lists.

The page at lab/dutch-flashcards.html loads its words from data/*.js rather
than fetching the text files, because a page opened straight from disk
(file://) is not allowed to fetch a neighbouring file. The text files stay the
editable, exportable source of truth; this script keeps the .js copies in sync.

    python3 tools/build-flashcard-data.py            regenerate the .js files
    python3 tools/build-flashcard-data.py --check    fail if they are stale
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

WORD_LISTS = [
    {
        "source": ROOT / "data" / "dutch-flashcards.txt",
        "target": ROOT / "data" / "dutch-flashcards.js",
        "key": "default",
        "label": "curated A2 vocabulary from the 12 official DUO practice exams",
    },
    {
        "source": ROOT / "data" / "dutch-flashcards-exam-1.text",
        "target": ROOT / "data" / "dutch-flashcards-exam-1.js",
        "key": "exam-1",
        "label": "words taken from practice exam 1",
    },
]

TEMPLATE = """// Dutch flashcard word list — {label}
//
// GENERATED FILE — edit {source} instead and run:
//     python3 tools/build-flashcard-data.py
//
// One card per line: Dutch word,English meaning,Dutch sentence,English sentence
// Wrap a field in double quotes when it contains a comma, e.g. "a, an; one".

window.dutchFlashcardData = window.dutchFlashcardData || {{}};

window.dutchFlashcardData['{key}'] = `
{body}
`;
"""

# A backtick, a backslash or a ${...} inside the list would break out of the
# template literal, so refuse to generate a file that contains one.
FORBIDDEN = ("`", "\\", "${")


def render(word_list):
    body = word_list["source"].read_text(encoding="utf-8").strip("\n")

    for index, line in enumerate(body.split("\n"), start=1):
        for token in FORBIDDEN:
            if token in line:
                raise SystemExit(
                    f"{word_list['source'].name} line {index} contains {token!r}, "
                    "which cannot go inside the generated script. Please remove it."
                )

    return TEMPLATE.format(
        label=word_list["label"],
        source=word_list["source"].relative_to(ROOT),
        key=word_list["key"],
        body=body,
    )


def main():
    check_only = "--check" in sys.argv[1:]
    stale = []

    for word_list in WORD_LISTS:
        contents = render(word_list)
        target = word_list["target"]
        cards = len(contents.strip().split("\n")) - len(TEMPLATE.strip().split("\n")) + 1

        if check_only:
            current = target.read_text(encoding="utf-8") if target.exists() else ""
            if current != contents:
                stale.append(target.relative_to(ROOT))
            continue

        target.write_text(contents, encoding="utf-8")
        print(f"{target.relative_to(ROOT)}: {cards} cards")

    if stale:
        raise SystemExit(
            "Out of date: " + ", ".join(str(path) for path in stale)
            + "\nRun: python3 tools/build-flashcard-data.py"
        )

    if check_only:
        print("Word list scripts are up to date.")


if __name__ == "__main__":
    main()
