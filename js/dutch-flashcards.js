const FLASHCARD_SOURCE_PATH = 'data/dutch-flashcards.txt';
const FLASHCARD_DECK_SIZE = 25;

const mockDutchFlashcardsData = `ik, I, ik eet rijst na het werk
jij, you, jij leest elke avond een boek
hij, he, hij woont in Utrecht met zijn broer
zij, she, zij drinkt koffie in de ochtend
het, it, het kind speelt in de tuin
wij, we, wij leren samen nieuwe woorden
jullie, you all, jullie gaan morgen naar school
zijn, to be, zij zijn vandaag erg blij
hebben, to have, wij hebben genoeg tijd voor de les
doen, to do, wat ga jij vanavond doen
gaan, to go, ik ga morgen naar de markt
komen, to come, kom je later naar het station
eten, to eat, wij eten brood en soep in de middag
drinken, to drink, hij drinkt water na het sporten
slapen, to sleep, de baby slaapt al sinds acht uur
huis, house, ons huis staat dicht bij het park
water, water, het water is koud maar schoon
brood, bread, ik koop vers brood bij de bakker
kaas, cheese, zij eet graag kaas op haar brood
fiets, bicycle, mijn fiets staat voor de deur
school, school, de school begint om half negen
boek, book, dit boek is interessant en leerzaam
tafel, table, de sleutels liggen op de tafel
stoel, chair, er staat een blauwe stoel in de kamer
raam, window, het raam is open vanwege de warmte
deur, door, doe de deur zachtjes dicht alsjeblieft
dag, day, vandaag is een lange maar mooie dag
nacht, night, in de nacht is de straat heel stil
morgen, tomorrow, morgen ga ik naar Amsterdam, en ik neem de trein
gisteren, yesterday, gisteren werkte ik thuis, maar vandaag ben ik op kantoor
vandaag, today, vandaag oefenen we met simpele zinnen
snel, fast, de trein rijdt snel door de stad
langzaam, slow, spreek langzaam zodat ik je kan volgen
mooi, beautiful, het weer is mooi in de lente
groot, big, dat is een groot gebouw naast het station
klein, small, we wonen in een klein maar gezellig appartement
warm, warm, de soep is nog warm dus pas op
koud, cold, buiten is het koud en winderig
blij, happy, ik ben blij met mijn vooruitgang
leren, to learn, kinderen leren snel wanneer ze vaak oefenen
spreken, to speak, wij spreken Nederlands tijdens de les
luisteren, to listen, luister goed naar de uitspraak van het woord
schrijven, to write, zij schrijft elke dag in haar notitieboek
lezen, to read, hij leest de krant bij het ontbijt
werken, to work, ik werk vandaag thuis aan een project
spelen, to play, de kinderen spelen buiten na school
markt, market, op de markt koop ik fruit, groente en brood
trein, train, de trein vertrekt over tien minuten
station, station, we wachten op het station op onze vriend
vriend, friend, mijn vriend helpt mij met Nederlandse woorden`.trim();

const flashcardsState = {
    cards: [],
    decks: [],
    selectedDeck: null,
    activeQueue: [],
    currentWord: null,
    isFlipped: false,
    dataSource: 'mock template string',
    completedCount: 0,
    totalInDeck: 0,
    mistakenWords: new Set()
};

const parseFlashcardText = (rawText) => {
    if (!rawText) {
        return [];
    }

    return rawText
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map((line, index) => {
            const firstCommaIndex = line.indexOf(',');
            const secondCommaIndex = line.indexOf(',', firstCommaIndex + 1);
            const thirdCommaIndex = line.indexOf(',', secondCommaIndex + 1);

            if (firstCommaIndex === -1 || secondCommaIndex === -1) {
                console.warn(`Skipping invalid flashcard line ${index + 1}: ${line}`);
                return null;
            }

            const sentence = thirdCommaIndex !== -1
                ? line.slice(secondCommaIndex + 1, thirdCommaIndex).trim()
                : line.slice(secondCommaIndex + 1).trim();

            const sentenceEn = thirdCommaIndex !== -1
                ? line.slice(thirdCommaIndex + 1).trim()
                : '';

            return {
                word: line.slice(0, firstCommaIndex).trim(),
                meaning: line.slice(firstCommaIndex + 1, secondCommaIndex).trim(),
                sentence: sentence,
                sentenceEn: sentenceEn
            };
        })
        .filter(card => card && card.word && card.meaning && card.sentence);
};

const chunkWordsIntoDecks = (cards, deckSize = FLASHCARD_DECK_SIZE) => {
    const decks = [];

    for (let index = 0; index < cards.length; index += deckSize) {
        const deckNumber = Math.floor(index / deckSize) + 1;

        decks.push({
            id: `deck-${deckNumber}`,
            title: `Deck ${deckNumber}`,
            cards: cards.slice(index, index + deckSize)
        });
    }

    return decks;
};

const shuffleCards = (cards) => {
    const shuffledCards = [...cards];

    for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledCards[index], shuffledCards[randomIndex]] = [shuffledCards[randomIndex], shuffledCards[index]];
    }

    return shuffledCards;
};

const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const fetchAndParseFlashcards = async (filePath = FLASHCARD_SOURCE_PATH) => {
    if (!filePath) {
        return {
            cards: parseFlashcardText(mockDutchFlashcardsData),
            source: 'mock template string'
        };
    }

    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Failed to load flashcard data from ${filePath}`);
        }

        const rawText = await response.text();

        return {
            cards: parseFlashcardText(rawText),
            source: 'text file'
        };
    } catch (error) {
        console.warn('Using mock Dutch flashcard data:', error);

        return {
            cards: parseFlashcardText(mockDutchFlashcardsData),
            source: 'mock template string'
        };
    }
};

const updateFlashcardStatus = () => {
    if (typeof document === 'undefined') {
        return;
    }

    const statusElement = document.getElementById('flashcards-data-status');

    if (!statusElement) {
        return;
    }

    if (flashcardsState.selectedDeck) {
        const { completedCount, totalInDeck } = flashcardsState;
        statusElement.textContent = `${completedCount} of ${totalInDeck} cards completed`;
    } else {
        const { cards, decks } = flashcardsState;
        statusElement.textContent = `${cards.length} words across ${decks.length} deck${decks.length === 1 ? '' : 's'}`;
    }
};

const updatePageActions = () => {
    const resetButton = document.getElementById('flashcards-page-reset-btn');

    if (!resetButton) {
        return;
    }

    resetButton.hidden = !flashcardsState.selectedDeck;
};

const renderDeckSelectionView = () => {
    const appElement = document.getElementById('flashcards-app');

    if (!appElement) {
        return;
    }

    if (!flashcardsState.decks.length) {
        appElement.innerHTML = `
            <div class="flashcards-panel">
                <h2 class="flashcards-heading">No flashcards available yet</h2>
                <p class="flashcards-supporting-text">Please check the text data format and try again.</p>
            </div>
        `;
        return;
    }

    const deckCardsMarkup = flashcardsState.decks.map((deck) => {
        const previewWords = deck.cards
            .slice(0, 3)
            .map(card => `<li><strong>${escapeHtml(card.word)}</strong></li>`)
            .join('');

        return `
            <button class="lab-card flashcards-deck-card" type="button" data-deck-id="${deck.id}">
                <span class="lab-card-label">${deck.title}</span>
                <h3 class="lab-card-title">${deck.cards.length} cards</h3>
                <p>Serial chunk of words ready for a focused study session.</p>
                <ul class="flashcards-preview-list">${previewWords}</ul>
                <span class="lab-card-arrow">Start studying →</span>
            </button>
        `;
    }).join('');

    appElement.innerHTML = `
        <div class="flashcards-panel">
            <div class="flashcards-summary">
                <div class="flashcards-stat">
                    <span>Total Words</span>
                    <strong>${flashcardsState.cards.length}</strong>
                </div>
                <div class="flashcards-stat">
                    <span>Total Decks</span>
                    <strong>${flashcardsState.decks.length}</strong>
                </div>
                <div class="flashcards-stat">
                    <span>Deck Size</span>
                    <strong>${FLASHCARD_DECK_SIZE}</strong>
                </div>
            </div>

            <div class="flashcards-section-header">
                <div>
                    <span class="lab-card-label">Deck Selection</span>
                    <h2 class="flashcards-heading">Choose a deck to begin</h2>
                    <p class="flashcards-supporting-text">Each deck has up to ${FLASHCARD_DECK_SIZE} cards. Add more words to the text file and the deck list will scale automatically.</p>
                </div>
            </div>

            <div class="lab-grid flashcards-deck-grid">${deckCardsMarkup}</div>
        </div>
    `;
};

const renderCompletionView = () => {
    const appElement = document.getElementById('flashcards-app');

    if (!appElement || !flashcardsState.selectedDeck) {
        return;
    }

    appElement.innerHTML = `
        <div class="flashcards-panel flashcards-completion-panel">
            <span class="lab-card-label">${flashcardsState.selectedDeck.title}</span>
            <h2 class="flashcards-heading">Deck Completed!</h2>
            <p class="flashcards-supporting-text">Nice work — you cleared all ${flashcardsState.selectedDeck.cards.length} cards in this deck. Use the Change Deck button below to start another one.</p>
        </div>
    `;
};

const renderStudySessionView = () => {
    const appElement = document.getElementById('flashcards-app');

    if (!appElement || !flashcardsState.selectedDeck || !flashcardsState.currentWord) {
        return;
    }

    const currentWord = flashcardsState.currentWord;
    const { completedCount, totalInDeck } = flashcardsState;
    const progressPercent = totalInDeck > 0 ? Math.round((completedCount / totalInDeck) * 100) : 0;

    appElement.innerHTML = `
        <div class="flashcards-panel flashcards-study-panel">
            <div class="flashcards-section-header flashcards-section-header--centered">
                <div>
                    <span class="lab-card-label">${flashcardsState.selectedDeck.title}</span>
                    <div class="flashcards-progress">
                        <div class="flashcards-progress-bar">
                            <div class="flashcards-progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <span class="flashcards-progress-text">${completedCount} / ${totalInDeck}</span>
                    </div>
                </div>
            </div>

            <div class="flashcards-card-stage">
                <div id="flashcards-card" class="flashcards-card ${flashcardsState.isFlipped ? 'is-flipped' : ''}" role="button" tabindex="0" aria-label="Flip current flashcard">
                    <span class="flashcards-card-inner">
                        <span class="flashcards-card-face flashcards-card-front">
                            ${flashcardsState.mistakenWords.has(currentWord.word) ? '<span class="flashcards-retry-banner">Correcting Previous Mistake</span>' : ''}
                            <span class="flashcards-card-copy">
                                <span class="lab-card-label">Front</span>
                                <span class="flashcards-word">${escapeHtml(currentWord.word)}</span>
                                <span class="flashcards-hint">Click to reveal the meaning</span>
                            </span>
                        </span>
                        <span class="flashcards-card-face flashcards-card-back">
                            <span class="flashcards-card-copy">
                                <span class="lab-card-label">Back</span>
                                <span class="flashcards-meaning">${escapeHtml(currentWord.meaning)}</span>
                                <span class="flashcards-sentence">${escapeHtml(currentWord.sentence)}</span>
                                ${currentWord.sentenceEn ? `<span class="flashcards-sentence-en">${escapeHtml(currentWord.sentenceEn)}</span>` : ''}
                            </span>
                            <span class="flashcards-card-actions">
                                <button id="flashcards-right-btn" class="flashcards-icon-button flashcards-icon-button--right" type="button" aria-label="Mark flashcard as right">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button id="flashcards-wrong-btn" class="flashcards-icon-button flashcards-icon-button--wrong" type="button" aria-label="Mark flashcard as wrong">
                                    <i class="fas fa-times"></i>
                                </button>
                            </span>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    `;
};

const renderFlashcardsApp = () => {
    updateFlashcardStatus();
    updatePageActions();

    if (!flashcardsState.selectedDeck) {
        renderDeckSelectionView();
        return;
    }

    if (!flashcardsState.currentWord && flashcardsState.activeQueue.length === 0) {
        renderCompletionView();
        return;
    }

    renderStudySessionView();
};

const startDeckStudy = (deckId) => {
    const deck = flashcardsState.decks.find(item => item.id === deckId);

    if (!deck) {
        return;
    }

    flashcardsState.selectedDeck = deck;
    flashcardsState.activeQueue = shuffleCards(deck.cards);
    flashcardsState.currentWord = flashcardsState.activeQueue[0] || null;
    flashcardsState.isFlipped = false;
    flashcardsState.completedCount = 0;
    flashcardsState.totalInDeck = deck.cards.length;
    flashcardsState.mistakenWords = new Set();

    renderFlashcardsApp();
};

const resetToDeckSelection = () => {
    flashcardsState.selectedDeck = null;
    flashcardsState.activeQueue = [];
    flashcardsState.currentWord = null;
    flashcardsState.isFlipped = false;
    flashcardsState.completedCount = 0;
    flashcardsState.totalInDeck = 0;
    flashcardsState.mistakenWords = new Set();

    renderFlashcardsApp();
};

const toggleFlashcard = () => {
    if (!flashcardsState.currentWord) {
        return;
    }

    flashcardsState.isFlipped = !flashcardsState.isFlipped;

    const cardElement = document.getElementById('flashcards-card');

    if (cardElement) {
        cardElement.classList.toggle('is-flipped', flashcardsState.isFlipped);
    }
};

const handleFlashcardAnswer = (isCorrect) => {
    if (!flashcardsState.currentWord || !flashcardsState.isFlipped) {
        return;
    }

    const currentCard = flashcardsState.activeQueue.shift();

    if (isCorrect) {
        flashcardsState.completedCount += 1;
    }

    if (!isCorrect && currentCard) {
        flashcardsState.mistakenWords.add(currentCard.word);
        const insertPosition = Math.floor(Math.random() * (flashcardsState.activeQueue.length + 1));
        flashcardsState.activeQueue.splice(insertPosition, 0, currentCard);
    }

    flashcardsState.currentWord = flashcardsState.activeQueue[0] || null;
    flashcardsState.isFlipped = false;

    renderFlashcardsApp();
};

const bindFlashcardsEvents = () => {
    const appElement = document.getElementById('flashcards-app');

    if (!appElement || appElement.dataset.bound === 'true') {
        return;
    }

    appElement.addEventListener('click', function(event) {
        const deckButton = event.target.closest('[data-deck-id]');
        const rightButton = event.target.closest('#flashcards-right-btn');
        const wrongButton = event.target.closest('#flashcards-wrong-btn');
        const flashcardButton = event.target.closest('#flashcards-card');

        if (deckButton) {
            startDeckStudy(deckButton.getAttribute('data-deck-id'));
            return;
        }

        if (rightButton) {
            event.preventDefault();
            handleFlashcardAnswer(true);
            return;
        }

        if (wrongButton) {
            event.preventDefault();
            handleFlashcardAnswer(false);
            return;
        }

        if (flashcardButton) {
            toggleFlashcard();
        }
    });

    appElement.addEventListener('keydown', function(event) {
        const flashcardButton = event.target.closest('#flashcards-card');

        if (!flashcardButton) {
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleFlashcard();
        }
    });

    const pageResetButton = document.getElementById('flashcards-page-reset-btn');

    if (pageResetButton) {
        pageResetButton.addEventListener('click', function() {
            resetToDeckSelection();
        });
    }

    appElement.dataset.bound = 'true';
};

const initializeFlashcardData = async () => {
    const { cards, source } = await fetchAndParseFlashcards();

    flashcardsState.cards = cards;
    flashcardsState.decks = chunkWordsIntoDecks(cards);
    flashcardsState.dataSource = source;

    if (typeof window !== 'undefined') {
        window.dutchFlashcardsStore = flashcardsState;
    }

    bindFlashcardsEvents();
    renderFlashcardsApp();

    console.log('Dutch flashcard app ready:', {
        totalCards: flashcardsState.cards.length,
        totalDecks: flashcardsState.decks.length,
        dataSource: flashcardsState.dataSource
    });
};

if (typeof window !== 'undefined') {
    window.dutchFlashcardsUtils = {
        FLASHCARD_DECK_SIZE,
        mockDutchFlashcardsData,
        parseFlashcardText,
        chunkWordsIntoDecks,
        shuffleCards,
        fetchAndParseFlashcards
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeFlashcardData();
    });
}
