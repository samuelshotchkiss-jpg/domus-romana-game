# Interactables worklist

Every object a room description names must be something the student can act on: at the very least
**investīgō X** (a fuller description, plus a hint at what else they might do with it). This file
lists every object the descriptions currently name. **Rule: a new noun in a description adds a row
here in the same commit.** Delete a row only when the object works in the game.

Nothing below is built yet. The forms are the ones the parser and the recast will need (the same
table pattern as `ROOM_NAMES`: `nom` / `acc` / `abl`, plus `said` where the player's voice differs).
"Verbs to offer" uses only verbs this class has met (latin-i store), so the hints stay readable:
*investīgō, īnspiciō, videō, audiō, aperiō, claudō, edō, stō, surgō, dormiō*.

"Level" is the noun's standing in `class_vocab.js` today: **Q** quizzed, **S** in the store, **N** new.

## Objects, room by room

| Room | Object | nom / acc / abl | Level | Verbs to offer | Notes for the fuller description |
|---|---|---|---|---|---|
| Via (east) | iānua domūs | iānua / iānuam / iānuā | Q | investīgō, aperiō, claudō | The front door, standing open. Why is it open at night? |
| Via (west) | iānua tabernae | iānua / iānuam / iānuā | Q | investīgō, aperiō, claudō | **The shop door.** The text says *aperta* for now, because the shop can be walked into. In the real game it is **closed and locked, with something important inside**, so it needs a lock state, a key (or other way in), and the street description changing to *clausa* while it is locked |
| Taberna | mēnsa | mēnsa / mēnsam / mēnsā | Q | investīgō | The shop counter |
| Taberna | multa et varia (the wares) | — | Q | investīgō, īnspiciō | Needs a noun if it becomes takeable; for now only described |
| Faucēs | pictūrae (virī Rōmānī) | pictūrae / pictūrās / pictūrīs | S | investīgō, videō | The men's eyes "see you": the first spooky beat |
| Ātrium | impluvium | impluvium / impluvium / impluviō | N | investīgō, videō | Water in the basin; a reflection is a good place for a figūra |
| Cubiculum Sorōris | lectus | lectus / lectum / lectō | S | investīgō, dormiō | Empty: the sister is away |
| Cubiculum Sorōris | sella | sella / sellam / sellā | Q | investīgō | |
| Cubiculum Parentum | duo lectī | lectī / lectōs / lectīs | S | investīgō | The parents are not home (book, ch. I) |
| Āla Lārum | larārium (Larēs) | larārium / larārium / larāriō | N | investīgō, īnspiciō | The household gods: a natural place for a protective object |
| Āla Hermae | herma | herma / hermam / hermā | N | investīgō, īnspiciō | "pater patris tuī": immōbilis, with eyes |
| Tablīnum | mēnsa | mēnsa / mēnsam / mēnsā | Q | investīgō | The father's desk |
| Tablīnum | sella | sella / sellam / sellā | Q | investīgō | |
| Tablīnum | armārium | armārium / armārium / armāriō | S | investīgō, aperiō, claudō, īnspiciō | Closed. In the book the monster's eyes are in it (ch. VII) |
| Peristȳlum | arborēs / arbor | arbor / arborem / arbore | Q | investīgō | *in arbore* is a class phrase |
| Peristȳlum | herbae | herbae / herbās / herbīs | Q | investīgō | |
| Peristȳlum | rosae | rosae / rosās / rosīs | Q | investīgō | |
| Peristȳlum | noctua | noctua / noctuam / noctuā | Q | investīgō, audiō, videō | Could be a source of the night sounds, or a red herring |
| Cubiculum Tuum | iānua cubiculī | iānua / iānuam / iānuā | Q | investīgō, aperiō, claudō | Quīntus opens and closes this door all through the book |
| Triclīnium | mēnsa | mēnsa / mēnsam / mēnsā | Q | investīgō | In the book it rises (ch. V): the phantasma's room |
| Triclīnium | lectī | lectī / lectōs / lectīs | S | investīgō | They rise too |
| Culīna | mēnsa (implied by "in mēnsā") | mēnsa / mēnsam / mēnsā | Q | investīgō | |
| Culīna | pānis | pānis / pānem / pāne | Q | investīgō, edō | The one thing so far a student can eat |
| Culīna | lātrīna | lātrīna / lātrīnam / lātrīnā | N | investīgō | The class knows *cacat* |
| Cella | amphorae | amphorae / amphorās / amphorīs | N | investīgō, īnspiciō | A hiding place, or what is hidden |

## Before building

- **The verb itself.** *investīgō* is not yet a game verb. The class knows *investīgat, investīgāre,
  investīgāns* (latin-i, from Quīntus), so the first-person *investīgō* is a form of a known word.
  *īnspiciō* the same (*īnspicit, īnspicere*).
- **Objects that repeat across rooms** (*mēnsa* ×4, *sella* ×2, *lectus/lectī* ×3, *iānua* ×2) are one
  word with several instances; the parser should resolve "the table" to the one in the current room.
- **Commands the class cannot yet read.** *eō, ad, prōrsus, rūrsus, dexteram, sinistram* are all new
  to this class (not in the latin-i store), and they are the game's movement commands. That is the
  biggest comprehension cost in the game, larger than anything in the descriptions.
