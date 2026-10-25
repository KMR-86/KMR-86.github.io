// Guest progress for the Dutch flashcard tools, kept in the browser.
//
// Everything here is best effort: localStorage is unavailable in some private
// browsing modes and throws when the quota is full, so every read and write is
// wrapped and a failure leaves the tool working exactly as it did before.
//
// Stored shape (one key, version-tagged so a later format can be migrated):
//
//     {
//       "version": 1,
//       "words":    { "boek": { "right": 3, "wrong": 1, "seen": "2026-10-25T…" } },
//       "sessions": { "default": { "deckId": "deck-3", "remaining": ["boek", …],
//                                  "completed": 7, "updatedAt": "2026-10-25T…" } }
//     }
//
// Word stats are keyed by word id and shared across both lists, so a word that
// appears in the curated list and in the exam list counts once. Sessions are
// kept per list, because a deck id only means something within one list.

const DUTCH_PROGRESS_STORAGE_KEY = 'dutch-flashcards-progress-v1';
const DUTCH_PROGRESS_VERSION = 1;

// A word is weak once it has been missed repeatedly and is not yet being
// answered right more often than wrong.
const DUTCH_WEAK_WORD_MIN_WRONG = 2;

const getProgressStorage = () => {
    try {
        return window.localStorage;
    } catch (error) {
        // Blocked by browser settings; the tool carries on without saving.
        return null;
    }
};

const emptyProgress = () => ({
    version: DUTCH_PROGRESS_VERSION,
    words: {},
    sessions: {}
});

const readProgress = () => {
    const storage = getProgressStorage();

    if (!storage) {
        return emptyProgress();
    }

    try {
        const stored = JSON.parse(storage.getItem(DUTCH_PROGRESS_STORAGE_KEY) || 'null');

        if (!stored || stored.version !== DUTCH_PROGRESS_VERSION) {
            return emptyProgress();
        }

        return {
            version: DUTCH_PROGRESS_VERSION,
            words: stored.words && typeof stored.words === 'object' ? stored.words : {},
            sessions: stored.sessions && typeof stored.sessions === 'object' ? stored.sessions : {}
        };
    } catch (error) {
        // Corrupt or unreadable: start again rather than break the page.
        return emptyProgress();
    }
};

const writeProgress = (progress) => {
    const storage = getProgressStorage();

    if (!storage) {
        return false;
    }

    try {
        storage.setItem(DUTCH_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
        return true;
    } catch (error) {
        // Full or read-only storage: the session simply is not saved.
        return false;
    }
};

const updateProgress = (change) => {
    const progress = readProgress();
    change(progress);
    return writeProgress(progress);
};

const recordWordAnswer = (wordId, isCorrect) => {
    if (!wordId) {
        return false;
    }

    return updateProgress((progress) => {
        const stats = progress.words[wordId] || { right: 0, wrong: 0, seen: null };

        stats[isCorrect ? 'right' : 'wrong'] += 1;
        stats.seen = new Date().toISOString();
        progress.words[wordId] = stats;
    });
};

const getWordStats = (wordId) => readProgress().words[wordId] || { right: 0, wrong: 0, seen: null };

const getWeakWordIds = () => {
    const { words } = readProgress();

    return Object.keys(words).filter((wordId) => {
        const { right, wrong } = words[wordId];
        return wrong >= DUTCH_WEAK_WORD_MIN_WRONG && wrong >= right;
    });
};

const getProgressSummary = () => {
    const { words } = readProgress();
    const wordIds = Object.keys(words);
    const right = wordIds.reduce((total, wordId) => total + words[wordId].right, 0);
    const wrong = wordIds.reduce((total, wordId) => total + words[wordId].wrong, 0);
    const answered = right + wrong;

    return {
        wordsSeen: wordIds.length,
        answered,
        accuracy: answered === 0 ? 0 : Math.round((right / answered) * 100),
        weakWords: getWeakWordIds().length
    };
};

const saveSession = (listKey, session) => {
    if (!listKey || !session || !session.deckId || !Array.isArray(session.remaining)) {
        return false;
    }

    return updateProgress((progress) => {
        progress.sessions[listKey] = {
            deckId: session.deckId,
            remaining: session.remaining,
            completed: session.completed || 0,
            updatedAt: new Date().toISOString()
        };
    });
};

const getSession = (listKey) => {
    const session = readProgress().sessions[listKey];

    if (!session || !session.deckId || !Array.isArray(session.remaining) || session.remaining.length === 0) {
        return null;
    }

    return session;
};

const clearSession = (listKey) => updateProgress((progress) => {
    delete progress.sessions[listKey];
});

const clearAllProgress = () => writeProgress(emptyProgress());

if (typeof window !== 'undefined') {
    window.dutchFlashcardsProgress = {
        STORAGE_KEY: DUTCH_PROGRESS_STORAGE_KEY,
        VERSION: DUTCH_PROGRESS_VERSION,
        read: readProgress,
        recordWordAnswer,
        getWordStats,
        getWeakWordIds,
        getProgressSummary,
        saveSession,
        getSession,
        clearSession,
        clearAllProgress
    };
}
