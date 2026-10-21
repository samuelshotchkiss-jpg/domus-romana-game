# Domus Romana: analysis (Claude, 2026-10-21)

Status: no code changed yet. These are findings from reading `game.js`, `style.css`,
`index.html` and Gemini's `README.md`, plus a look at the toolkit's `latin-i` corpus.
**The GitHub repo is PUBLIC**, so nothing gets pushed until the owner previews locally.

## 1. Bugs found (none fixed yet)

| # | Where | What goes wrong |
|---|---|---|
| 1 | `processInput` `finally` | Asking `quid significat X` while a clarification ("Utrum cubiculum?") is open **freezes the input**. `finally` only unlocks when no clarification is pending, and the define branch never unlocks. Fix: always unlock in `finally`. |
| 2 | Clarification block in `parseCommand` | Once asked "Utrum cubiculum?", the player can't do anything else. Every other command gets "Nōn intellegō", forever. It should drop the clarification and parse the command normally. |
| 3 | `findVerb` (stems `i`, `e`) | Any word starting with *i* or *e* counts as the verb *eō*: `in`, `et`, `est`, `etiam`. Because it checks before *ambulō*, **`ambulō in culīnam` gets recast as `eō in culīnam`**. Detect the verb by lemma instead. |
| 4 | `.includes('in')` / `.includes('ad')` (parseCommand, generateRecast) | These are substring checks: *triclīnium*, *culīna* and *sinistram* all contain "in". So `culīnam` on its own counts as having a preposition, which skips both the "Quid in … facere vīs?" prompt and the missing-*in* recast. Check whole words. |
| 5 | Landmark scoring (`bestMatch`) | `via_west` and `via_east` tie, and the first one wins. **From the Faucēs, `eō in viam` fails** ("Nōn potes illūc īre") even though the street is right there. On a tie, prefer the room that is an exit. Related: `cubiculum meum` in the ātrium sets off the sister/parents clarification. |
| 6 | `processDescription` override syntax `word[tag\|def]` | Broken twice. `\w` doesn't match macron letters, so `murīs[…]` captures only the final `s`. And the `<dataspan>` it emits is empty, so **the word disappears from the text**. Nothing uses it yet. |
| 7 | `processDescription` idioms | Splits on spaces *after* wrapping idioms in spans, which cuts the span's own HTML attributes into pieces. It works by luck: no word in a definition happens to match a vocab form yet. Use placeholders. |
| 8 | `buildDefinition` (generated English) | It writes **vidistine → "seed?"**, putāvit → "thinked", it → "gos", surgit → "get ups", habēbant → "haved, holded", dormiēbam → "sleeped". It can't produce irregular English. See §3: store the glosses instead of generating them. |
| 9 | `logCommand`, define feedback | The player's typed text goes into `innerHTML` unescaped. It's self-only, but escape it anyway. |
| 10 | Map animation | It sets the SVG `transform` *attribute*, and a CSS transition can't animate an attribute, so the rotation probably snaps (not yet checked in a browser). Labels only flip at 180°; at 90° they read sideways. Counter-rotate each room group by `playerFacing` and they stay upright. |
| 11 | Small things | `Iam es in Cubiculum Tuum` uses the nominative (add an `abl` field to `ROOM_NAMES`: this is all Phase 7 really needs). `Via (West)` puts English on screen and on the map. The `peristylum` name is lowercase. No viewport meta, no touch dragging (Chromebooks), no map recentring on resize. `LICENSE` and `LICENSE.txt` are the same file twice, GPL-3, while the house standard for public repos is AGPL-3.0 for code and CC BY-NC-SA for content. |
| 12 | Code hygiene | About 30 leftover `// REPLACE your entire …` paste instructions from Gemini, plus dead comments. Strip them. |

## 2. Gemini's roadmap: what to keep

- **Phase 6, the morphological engine (declensions, stems): drop it.** It would rebuild in JavaScript
  what the toolkit already has: Morpheus, `latin_forms.py`, `paradigm.py`, and a store of
  owner-ruled forms. The game doesn't need to *generate* Latin. It needs to *recognise* a
  limited set of forms, and that set can be exported.
- **Phase 7, dynamic grammatical strings: keep it, but as data.** Put `nom/acc/abl` forms on each
  room and each object. The game has about 15 rooms and will have maybe 20 objects, so a table beats an engine.
- **Keep:** the recast with its jiggle (the best idea here), clarification prompts, the
  `meus`→`tuus` point-of-view swap, *quid significat*, the rotating map.

## 3. Using the toolkit instead of a hand list

`corpora/latin-i` (form-keyed, 239 entries) **already contains Quīntus et Nox Horrifica**: occurrences cite
"Quīntus 14", and *cubiculī, ātrium, culīna, armārium, affectus, attat, cōram, cadit* are all there.
According to the fall plan the class reads Quīntus **10/30–11/11**, so this game lines up with this year's Latin I, not just
last year's.

What I propose: an export script, `engine/export_game_vocab.py --corpus latin-i`, that writes `vocab.json` for the
game. One row per form: the headword, the forms folded into it (from `form_map.tsv`), the owner's own gloss
(`core`/sense gloss, no generated English), and a **level computed from `quiz_sets.tsv`**:
- on a Trial so far (`trial-01..04`), or on the fair-game list for a Show What You Know → `core` (no tooltip)
- in the store but never quizzed → `outer` (tooltip)
- new to the game, not in the store → `novum` (dotted underline)

Re-export after each Trial and the help in the game fades as the class learns.
Then use `shelter.py` / `shelter_lexicon.json` to check that all the game's prose (room descriptions, object
text, monster lines) stays inside that list: the same gate the SWYK stories pass.

**Before the export:** it emits headwords and glosses only, never `occurrence_text` or lines.
`latin-i` is closed and also holds student personal data. Name exclusions already keep names
out of the headwords, but the export should **run the `name_exclusions.tsv` check and refuse
on a hit**, because this game repo is public. A word list is facts (CLOSED_CORPORA §1), but confirm
it against §5 before the first export.

## 4. The game itself (next stage)

Not designed yet. Ingredients still owed: objects (*lucerna, clāvis, amphora*) with `nom/acc` forms
for `capiō X`, `pōnō X in Y`, `aperiō X`; a puzzle (for example a key in the larārium, a lamp from the
culīna, a locked cella); and a **phantasma** that moves one room per turn along the exits graph. The
map is already a graph, so a breadth-first step toward the player costs about twenty lines. Commands to flee
are the movement commands the parser already has. All prose gets rewritten from scratch and
gated through `shelter.py`.
