# Flashcard word lists

| File | Role |
| --- | --- |
| `dutch-flashcards.txt` | 1,792 curated A2 words from the 12 official DUO practice exams — **edit this one** |
| `dutch-flashcards-exam-1.text` | 486 words taken from practice exam 1 — **edit this one** |
| `dutch-flashcards.js`, `dutch-flashcards-exam-1.js` | generated copies the page actually loads — do not edit by hand |

One card per line:

```
Dutch word,English meaning,Dutch sentence,English sentence
een,"a, an; one",Ik heb een vraag over de cursus.,I have a question about the course.
```

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
