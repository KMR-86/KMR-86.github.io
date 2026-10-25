#!/usr/bin/env python3
"""Generate the flashcard data scripts from the plain text word lists.

The page at lab/dutch-flashcards.html loads its words from data/*.js rather
than fetching the text files, because a page opened straight from disk
(file://) is not allowed to fetch a neighbouring file. The text files stay the
editable, exportable source of truth; this script keeps the .js copies in sync.

    python3 tools/build-flashcard-data.py            regenerate the .js files
    python3 tools/build-flashcard-data.py --check    fail if they are stale
"""

import csv
import io
import re
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


def word_id(word):
    """Stable identity for a card, used to remember a learner's progress.

    Cards list their forms separated by a slash (boek/boeken) or, in the exam
    list, by spaced hyphens (de - het - een). The first form, without its
    article, is the id, so adding a plural or a conjugation to an existing card
    keeps whatever progress has been recorded against it.

    js/dutch-flashcards/dutch-flashcards.js carries the same rule at runtime.
    Keep the two in step.
    """
    first = word.lower().split("/")[0].split(" - ")[0]
    first = re.sub(r"^(de|het|een)\s+", "", first)
    cleaned = "".join(ch if (ch.isalnum() or ch in "'-") else "-" for ch in first)
    return re.sub(r"-+", "-", cleaned).strip("-")


def check_word_ids(word_list, body):
    """Fail the build when two cards in one list share an id."""
    seen = {}
    clashes = []

    for index, line in enumerate(body.split("\n"), start=1):
        word = next(csv.reader(io.StringIO(line)))[0].strip()
        identifier = word_id(word)

        if not identifier:
            raise SystemExit(
                f"{word_list['source'].name} line {index}: {word!r} has no usable word id."
            )

        if identifier in seen:
            clashes.append(f"  {identifier!r}: line {seen[identifier]} and line {index}")
        else:
            seen[identifier] = index

    if clashes:
        raise SystemExit(
            f"{word_list['source'].name}: these cards share a word id, which would make "
            "them share saved progress:\n" + "\n".join(clashes)
        )

    return len(seen)


def render(word_list):
    body = word_list["source"].read_text(encoding="utf-8").strip("\n")

    for index, line in enumerate(body.split("\n"), start=1):
        for token in FORBIDDEN:
            if token in line:
                raise SystemExit(
                    f"{word_list['source'].name} line {index} contains {token!r}, "
                    "which cannot go inside the generated script. Please remove it."
                )

    check_word_ids(word_list, body)

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
