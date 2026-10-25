# Flashcard word lists

| File | Role |
| --- | --- |
| `dutch-flashcards.txt` | 2,369 curated A2 words from the 12 official DUO practice exams — **edit this one** |
| `dutch-flashcards-exam-1.text` | 486 words taken from practice exam 1 — **edit this one** |
| `dutch-flashcards.js`, `dutch-flashcards-exam-1.js` | generated copies the page actually loads — do not edit by hand |

One card per line:

```
Dutch word,English meaning,Dutch sentence,English sentence,Topic,Level
appel,apple,Ik eet een appel.,I eat an apple.,Eten & drinken,1
```

Forms of the same word share a card, separated by a slash: `boek/boeken` with
the meaning `book/books`, `nieuw/nieuwe` with `new`, `maken/maakt/maak` with
`to make`. Add a new word in that shape rather than as a second card.

Every card also has a **word id**, derived rather than stored: the first form,
lowercased and without its article, so `boek/boeken` is `boek` and
`de - het - een` is `de`. It is what the flashcard tool records a learner's
progress against, which is why adding a plural or a conjugation to an existing
card keeps that progress while correcting a spelling resets it. The build
refuses to run when two cards in one list share an id. The same rule lives in
`js/dutch-flashcards/dutch-flashcards.js` for the browser; keep the two in step.

`Topic` is one of the twenty categories used throughout the list (`Basis &
grammatica`, `Werkwoorden`, `Eten & drinken`, `Werk & solliciteren`, …) and
`Level` runs from 1 (easiest) to 5 (hardest). The page shows both on the back
of a card and uses them to label each deck.

The exam-1 list keeps the older four-column form without a topic or level, and
still loads: the last two columns are optional.

Cards are stored easiest first — sorted by level, then by topic within a level,
then by how often the word appears in the practice exams. The build script does
not re-sort, so a word added at the end of the file becomes the last card.

Wrap a field in double quotes when it contains a comma. A backtick, a
backslash or a `${` cannot appear anywhere in the list.

After editing a text file, regenerate the scripts the page loads:

```bash
python3 tools/build-flashcard-data.py          # rewrite the .js copies
python3 tools/build-flashcard-data.py --check  # verify they are in sync
```

The page reads the `.js` copies rather than fetching the text files because a
page opened straight from disk (`file://`) is not allowed to fetch a
neighbouring file — the text files would only load when the site is served over
http, as it is on kmr-86.github.io.
