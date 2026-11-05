# Interactables

Every object a description names must be something the student can act on: at the very least
**investīgō X** (also *īnspiciō, spectō*), which gives a fuller description ending in a hint at a verb
to try. **Rule: a new noun in any description (a room's, or an object's `look`) adds an object in the
same commit**, or is cut. An object still to build goes under **Owed**.

How it works (`game.js`): `OBJECTS` holds each object's forms, the rooms it is reached from, its
gender, an optional open/closed state (`openable`; in two rooms it is a door and blocks the way while
closed), its `look` text, and `on` lines answering particular verbs. `ACTIONS` holds the verbs. A verb
with no `on` line for an object falls back to a default (*Mēnsam tangis.*) or a refusal
(*In impluviō dormīre nōn potes.*). Adding an object is one `OBJECTS` entry plus its forms in
`VOCAB_LEMMA`; the game's sweep (every text an object can produce, looked up word by word) must find
nothing missing.

## Objects

| Room | Object | Verbs that answer | Notes |
|---|---|---|---|
| Via (east), Faucēs | iānua domūs | aperiō, claudō | a door |
| Via (west), Taberna | iānua tabernae | aperiō, claudō | a door; see Owed |
| Faucēs | pictūrae | tangō | a portrait stops smiling |
| Taberna | mēnsa | tangō | the wares (*multa et varia*) are on it |
| Ātrium | impluvium | — | its hint points to *aqua* |
| Ātrium | aqua | bibō | reached through the impluvium's description |
| Cubiculum Sorōris | lectus | dormiō, cōnsīdō | |
| Cubiculum Sorōris | sella | cōnsīdō | |
| Cubiculum Parentum | lectī | dormiō, cōnsīdō | |
| Āla Lārum | larārium | — | its hint points to the Larēs |
| Āla Lārum | Larēs | salūtō | "Larēs domum tuam cūrant" |
| Āla Hermae | herma | salūtō | |
| Tablīnum | mēnsa | tangō (default) | its hint points to the sella |
| Tablīnum | sella | cōnsīdō | "Nunc tū es dominus!" |
| Tablīnum | armārium | aperiō, claudō | closed; its state shows in the room description |
| Peristȳlum | arborēs | tangō | |
| Peristȳlum | herbae | olfaciō | |
| Peristȳlum | rosae | olfaciō | |
| Peristȳlum | noctua | — (every verb: *Noctua nōn cūrat.*) | see Owed |
| Cubiculum Tuum, Peristȳlum | iānua cubiculī | aperiō, claudō | a door |
| Triclīnium | mēnsa | moveō | "sē nōn movet" |
| Triclīnium | lectī | cōnsīdō | "Subitō lectus sē movet! … Minimē" |
| Culīna | mēnsa | tangō (default) | its hint points to the pānis |
| Culīna | pānis | edō | |
| Culīna | lātrīna | cacō | "Deīs est grātia!" |
| Cella | amphorae | moveō | "Quid est in amphorīs?" |

`tangō` answers every object (the default line); `investīgō / īnspiciō / spectō` look at every object.

## Verbs

Introduced through the hints (*Potes rosās olfacere.*), so new verbs are allowed here. "Class" is the
lemma's standing in `class_vocab.js`: **Q** quizzed, **S** in the store, **N** new.

| Verb | Takes | Class | Answered by |
|---|---|---|---|
| investīgō, īnspiciō, spectō | acc. | S, S, N | every object (its `look`) |
| aperiō, claudō | acc. | Q, Q | doors, armārium |
| tangō | acc. | N | every object (default), with lines for some |
| moveō | acc. | Q | mēnsa (triclīnium), amphorae |
| olfaciō | acc. | N | herbae, rosae |
| salūtō | acc. | N | Larēs, herma |
| bibō | acc. | N | aqua |
| edō | acc. | Q (*edam*) | pānis |
| cōnsīdō | *in* + abl. | N (see below) | lectus, sella, lectī |
| dormiō | *in* + abl. | S | lectus, lectī |
| cacō | *in* + abl. | S | lātrīna |

A verb used alone asks *Quid vīs …?*, or *Ubi vīs …?* for the three verbs of place.

## Owed

- **The shop door is locked**, with something important inside: a lock, a way in, and the street line
  reading *clausa* while it is locked. Today it opens like any door.
- **The owl's puzzle:** get her to care, so she shares hints from her wisdom. Her name (2026-27:
  Rebecca) is data in `OBJECTS.noctua.name`, not shown yet; the class renames and redescribes her each year.
- **What is in the armārium** (and the amphorae: "Quid est in amphorīs?"). Opening it shows nothing yet.
- **Taking things.** *tollō* (the class knows *tollite manūs!*) needs an inventory first.
- **Two objects of the same word in one room** are not yet told apart. No room has two today.
- **cōnsīdō vs. the class's cōnsidēte.** The store has the classroom command as *cōnsidēte* (keyed to
  a verb *cōnsideō*); the classical verb is *cōnsīdō, cōnsīdere*, command *cōnsīdite*. The game uses
  *cōnsīdō*, so it shows as new. Owner's ruling wanted: correct the store's entry, or switch the game
  to *sedeō* (*sedēte*).
