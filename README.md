Here is a comprehensive, durable design document and architectural overview of the Domus Romana project. This document serves as a "Master Design Document" (MDD) suitable for a `README.md`, a developer wiki, or a portfolio showcase.

***

# Domus Romana Text Adventure: Architectural Overview & Strategic Roadmap

## 1. Application Overview & Pedagogical Goals

The **Domus Romana Text Adventure** is a web-based, interactive fiction application designed specifically for novice Latin students in a Comprehensible Input (CI) curriculum. The game simulates navigating a traditional Roman house (*domus*), allowing students to interact with the environment using Latin commands.

**Core Pedagogical Philosophy:**
*   **Shelter Vocabulary, Not Grammar:** The application uses a tightly controlled vocabulary list but exposes students to real, unsimplified Latin grammar (including various cases, tenses, and subjunctives).
*   **The Forgiving Parser & "Recasting":** The parser is designed to be a helpful conversational partner, not a punishing gatekeeper. When a student inputs an incorrect or incomplete form (e.g., typing *parentum* instead of *eō in Cubiculum Parentum*, or typing a wrong ending like *cubiculum soror*), the game accepts the intent but "recasts" the command. It displays the grammatically correct version, using subtle CSS animations (a "jiggle") to highlight only the specific letters that were corrected.
*   **Context-Aware Assistance:** The application provides built-in, hover-over vocabulary assistance. Crucially, these glosses are dynamically generated based on the specific grammatical context of the word, providing precise help without overwhelming the novice learner with full dictionary entries.

## 2. User Interface (UI) & Experience (UX)

The front-end is built with vanilla HTML, CSS, and JavaScript, designed around a clean, distraction-free "Solarized Light" aesthetic.

*   **The Game Log:** A scrollable text area that preserves the history of the student's commands, the parser's recasts, and the dynamic room descriptions.
*   **Dynamic SVG Map:** A graphical representation of the *domus* that updates as the player explores. The map automatically rotates so that "forward" is always facing up relative to the player's perspective. SVG text elements automatically self-orient to remain readable regardless of map rotation.
*   **Interactive Vocabulary:** Almost all text—including room descriptions, error messages, and the "exits" list—is processed for vocabulary assistance. Hovering over recognized words reveals a global, non-clipping tooltip. Background colors subtly differentiate the context of the interactive text (e.g., faint blue in exit lists, faint red in error messages).

## 3. Core Architectural Systems

The application's logic (housed in `game.js`) is divided into several highly decoupled, intelligent systems.

### A. The "Explanation Engine" (Vocabulary & Grammar)
Instead of a simple lookup table, the application uses a lemmatized, morphologically-aware database.
*   **`VOCAB_LEMMA`:** The single source of truth. Every word is stored by its lemma (dictionary form), containing its Part of Speech (POS), base definition, and an object of all inflected forms used in the game. Each inflected form contains specific grammatical tags (number, case, tense, person, mood, enclitics).
*   **`buildDefinition(lemmaData, formData)`:** The "Grammar Engine." It dynamically constructs English definitions by applying rules to the base lemma (e.g., automatically pluralizing nouns, conjugating 3rd-person singular verbs, forming English possessives for genitives).
*   **`IDIOMS` Dictionary:** Stores holistic definitions for multi-word phrases (e.g., *sibi vult*, *ad dexteram*).
*   **`processDescription(text)`:** The text-processing engine. It pre-processes text to protect idioms, splits sentences into words, looks up their grammatical data via a reverse-mapped `formToLemmaKey`, and wraps them in HTML `<span>` tags packed with `data-*` attributes for the tooltip listener.
*   **Teacher Overrides:** `processDescription` supports inline regex tagging (e.g., `murīs[abl|by the walls]`), allowing the teacher to hardcode highly contextual definitions (like independent ablatives) that bypass the automated grammar engine.

### B. The "Recognition Engine" (The Parser)
The parser (`parseCommand`) translates user input into game actions. It relies on a helper function, `getLemmaDataFromWord`, to query the Explanation Engine, bridging the gap between raw input and deep grammatical data.
*   **Lemma-Based Recognition:** Rooms (`ROOM_NAMES`) are identified by an array of `requiredLemmas`. The parser converts the user's raw string into an array of lemmas, allowing it to recognize intent regardless of the specific word forms used.
*   **Ambiguity Resolution:** If a command is ambiguous (e.g., "go to the bedroom" when there are two bedrooms), the parser triggers a clarification state, asking the user to specify.
*   **Point-of-View (POV) Correction:** The parser understands the difference between the player's voice and the narrator's voice, natively equating player inputs of *meus* (my) with the game's internal *tuus* (your).

### C. The Pedagogical Recaster
*   **`generateRecast(command, roomData, verbInfo)`:** This function analyzes the user's input against the required lemmas of their destination. 
*   It detects missing words (inserting them into the output) and identifies morphological errors (applying the CSS `.recast-ending` jiggle animation specifically to the incorrect letters).
*   It respects "equally correct" inputs (e.g., accepting both *sorōris* and *cubiculum sorōris* as perfect answers to a clarification prompt without unnecessary recasting).

### D. The Definition Query System
*   **`parseDefinitionQuery(command)`:** A robust mini-parser that handles queries like *"Quid significat X?"* or *"Quid sibi vult X?"*, allowing for flexible Latin word order.
*   It outputs a dynamically generated feedback message, complete with interactive vocabulary. For idioms, it provides an attractive, multi-part definition showing both the phrase's holistic meaning and the definitions of its component parts.

***

## 4. Strategic Action Plan & Roadmap

The development of the Domus Romana project follows a strict, phased architectural approach, ensuring stability before adding complexity.

### Phase 1: Foundational Cleanup
*   **Goal:** De-duplicate and rationalize the original, simple `VOCAB` lists to establish a clean, reliable data foundation before the main refactor.
*   **Status:** ✅ **COMPLETE**
*   **Accomplishments:**
    *   Eliminated overlapping words between "core," "outer," and "novum" lists.
    *   Ensured highly frequent words (like *in*, *est*, *et*) don't generate distracting tooltips, reserving the UI assistance for words students actually need help with.

### Phase 2: Architectural Overhaul: The Grammar Engine
*   **Goal:** Replace the simple vocabulary system with a centralized, lemmatized, and grammar-aware engine.
*   **Status:** ✅ **COMPLETE**
*   **Accomplishments:**
    *   Created the new `VOCAB_LEMMA` dictionary, acting as a single source of truth with rich grammatical data.
    *   Built the `buildDefinition` grammar engine to intelligently construct context-aware definitions (e.g., correctly pluralizing nouns without pluralizing adjectives, properly handling English possessives).
    *   Implemented the `word[tag|override]` system in `processDescription` for teacher-driven contextual definitions.

### Phase 3: Core Feature Expansion
*   **Goal:** Use the new grammar engine to add powerful, user-facing pedagogical features.
*   **Status:** ✅ **COMPLETE**
*   **Accomplishments:**
    *   Integrated error messages with the vocabulary system, meaning dynamic parser feedback now provides hover-over definitions.
    *   Completed a full audit of the `VOCAB_LEMMA` dictionary to ensure all user-facing words (including UI elements and directions) are included and alphabetized.

### Phase 3.5: UI Polish: Vocabulary-Aware Exits
*   **Goal:** Extend the vocabulary system to the exits list to make it fully interactive and visually cohesive.
*   **Status:** ✅ **COMPLETE**
*   **Accomplishments:**
    *   Upgraded `generateExitsString` to process *all* its text (including introductory phrases like "Etiam potes īre") for vocabulary glosses.
    *   Added subtle, context-aware CSS highlighting for vocab in the exits list (faint blue) and error messages (faint red).

### Phase 4: Parser Intelligence: Recasting Refinements
*   **Goal:** Upgrade the command parser to use the intelligence of the new grammar engine, providing smarter and more linguistically accurate corrections.
*   **Status:** ✅ **COMPLETE**
*   **Accomplishments:**
    *   Refactored the parser to use `getLemmaDataFromWord` and a lemma-based `ROOM_NAMES` structure.
    *   Refined clarification logic to handle "equally correct" inputs naturally.
    *   Taught `generateRecast` to intelligently handle missing words (e.g., gracefully recasting *parentum* to *eō in Cubiculum Parentum*).
    *   Improved ambiguous command errors to be more pedagogical (*Quid in "Triclinium" facere vīs?*).
    *   Implemented the Point-of-View correction for *meum/tuum*.

### Phase 5: Linguistic Nuance: The Idiom Engine
*   **Goal:** Upgrade the `processDescription` engine and dictionary to recognize and provide holistic definitions for multi-word phrases.
*   **Status:** ✅ **COMPLETE**
*   **Accomplishments:**
    *   Created the `IDIOMS` dictionary to store phrase definitions and component lemmas.
    *   Upgraded `processDescription` with a pre-processing step to wrap and protect known idioms.
    *   Built an advanced tooltip system that displays both the idiom's overall meaning and the definitions of its component words.
    *   Implemented the robust `Quid significat` / `Quid sibi vult` parser for on-demand definition queries.

### Phase 6: The Morphological Engine
*   **Goal:** Evolve the grammar engine from a static lookup table into a generative system that understands declensions and conjugations.
*   **Status:** ⚪️ **NOT STARTED (Next Phase)**
*   **Key Features to Build:**
    *   Equip nouns with declension properties (1st, 2nd m/n, 3rd, etc.) and explicit stems.
    *   Allow the parser to accept inputs based on stem recognition + ending logic, bringing back "stem-based forgiveness" for unseen forms, but with strict grammatical accuracy.

### Phase 7: Grammatically Correct Dynamic Strings
*   **Goal:** Use the Morphological Engine (from Phase 6) to generate correct grammatical forms in dynamic UI strings automatically.
*   **Status:** ⚪️ **NOT STARTED**
*   **Example:** Change the current hardcoded nominative prompt `Quid in "Triclinium" facere vīs?` to the fully, dynamically generated idiomatic Latin: `Quid in Triclīniō facere vīs?`