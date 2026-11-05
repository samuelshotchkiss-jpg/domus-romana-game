# Interactables

Every object a description names must be something the student can act on: at the very least
**investīgō X** (also *īnspiciō, spectō*), which gives a fuller description ending in a hint at a verb
to try. **Rule: a new noun in any description (a room's, or an object's `look`) adds an object in the
same commit**, or is cut. An object still to build goes under **Owed**.

How it works (`game.js`): `OBJECTS` holds each object's forms, the rooms it is reached from, its
gender, an optional open/closed state (`openable`; in two rooms it is a door and blocks the way while
closed), the flags `surface` (can be sat or stood on), `bed` and `edible` (eaten, it is gone), its `look`
text, and `on` lines answering particular verbs; `accSg`/`ablSg` with `onSg`/`lookSg` let the player act on
just one of many (*tangō arborem*), and a list of lines is used in turn. `ACTIONS` holds the verbs. A verb
with no `on` line for an object falls back to a default (*Mēnsam tangis.*) or a refusal
(*In impluviō dormīre nōn potes.*). Adding an object is one `OBJECTS` entry plus its forms in
`VOCAB_LEMMA`; the game's sweep (every text an object can produce, looked up word by word) must find
nothing missing.

## Objects

| Room | Object | Verbs that answer | Notes |
|---|---|---|---|
| Via (east), Faucēs | iānua domūs | aperiō, claudō | a door |
| Via (west), Taberna | iānua tabernae | aperiō, claudō | a door; see Owed |
| everywhere | ego (*mē*) | tangō | *videō mē*: in the ātrium, your reflection (*cūriōsus sed cautus*) |
| Faucēs | pictūrae | tangō | a portrait stops smiling |
| Faucēs | oculī (virōrum) | tangō | *nōn virī reālēs* |
| Taberna | mēnsa | tangō | the wares (*multa et varia*) are on it |
| Ātrium | impluvium | sedeō/cōnsīdō, stō | a surface: *et nunc ūmidus es!* |
| Ātrium | aqua | bibō | reached through the impluvium's description |
| Cubiculum Sorōris | lectus | dormiō, cōnsīdō | |
| Cubiculum Sorōris | sella | cōnsīdō | |
| Cubiculum Parentum | lectī | dormiō, cōnsīdō | |
| Āla Lārum | larārium | — | its hint points to the Larēs |
| Āla Lārum | Larēs | salūtō | "Larēs domum tuam cūrant" |
| Āla Hermae | herma | salūtō | |
| Āla Hermae | oculī (hermae) | tangō | *nōn sunt reālēs* |
| Āla Lārum | larārium | stō, cōnsīdō | *Minimē!* (not a surface) |
| Tablīnum | mēnsa | stō | *Nunc magnus es.* |
| Tablīnum | sella | cōnsīdō | "Nunc tū es dominus!" |
| Tablīnum | armārium | aperiō, claudō | closed; its state shows in the room description |
| Peristȳlum | arborēs / arbor | tangō | *tangō arborem*: one tree at a time, three reactions in turn |
| Peristȳlum | herbae | olfaciō | |
| Peristȳlum | rosae / rosa | olfaciō; capiō (one) | *capiō rosam* picks one rose (the `rosa` object, nowhere until then) |
| Peristȳlum | noctua | — (every verb: *Noctua nōn cūrat.*) | see Owed |
| Cubiculum Tuum, Peristȳlum | iānua cubiculī | aperiō, claudō | a door |
| Cubiculum Tuum | lectus | dormiō | your own bed |
| Triclīnium | mēnsa | moveō | "sē nōn movet" |
| Triclīnium | lectī | cōnsīdō | "Subitō lectus sē movet! … Minimē" |
| Culīna | mēnsa | stō, sedeō | its look follows the bread: *In hāc mēnsā nihil est* once it is eaten |
| Culīna | pānis | edō, comedō; capiō, pōnō | **edible** and **portable**: eaten or taken, it is gone from the kitchen's descriptions |
| Culīna | lātrīna | cacō | "Deīs est grātia!" |
| Cella | amphorae / amphora | moveō, tangō | *moveō amphoram*: one at a time; the third *sonat* |

`tangō` answers every object (the default line); `investīgō / īnspiciō / spectō / videō` look at every
object. **Every surface** (each mēnsa, sella, lectus, and the impluvium) can be sat on (*cōnsīdō, sedeō,
recumbō*) or stood on (*stō*); beds can be slept in (*dormiō*). A looking verb alone shows the room,
then asks *Quid vīs investīgāre?*

## Verbs

Introduced through the hints (*Potes rosās olfacere.*), so new verbs are allowed here. "Class" is the
lemma's standing in `class_vocab.js`: **Q** quizzed, **S** in the store, **N** new.

| Verb | Takes | Class | Answered by |
|---|---|---|---|
| investīgō, īnspiciō, spectō, videō | acc. | S, S, N, Q | every object (its `look`) |
| aperiō, claudō | acc. | Q, Q | doors, armārium |
| tangō | acc. | N | every object (default), with lines for some |
| moveō | acc. | Q | mēnsa (triclīnium), amphorae |
| olfaciō | acc. | N | herbae, rosae |
| salūtō | acc. | N | Larēs, herma |
| bibō | acc. | N | aqua |
| edō; comedō | acc. | Q (*edam*); N | pānis |
| cōnsīdō; sedeō; recumbō | *in* + abl. | Q (*cōnsīdite*); N; N | lectus, sella, lectī (recumbō: the triclīnium's lectī; sedeō: the father's sella) |
| dormiō | *in* + abl. | S | beds: every lectus |
| stō | *in* + abl. | Q (*stāte*) | every surface; *surgō in mēnsā* is recast as **stō** in mēnsā |
| surgō; stō (alone) | — | Q (*surgite*) | gets up from a seat or a bed |
| dēscendō | — | N | climbs down from what the player stands on |
| capiō; tollō; sūmō | acc. | N; Q (*tollite manūs!*); N | portable things (pānis, a rose) |
| pōnō | acc. | N | something carried: it stays in this room |
| cacō | *in* + abl. | S | lātrīna |

A verb used alone asks *Quid vīs …?*, or *Ubi vīs …?* for the verbs of place.

**Posture.** Sitting or lying, the player cannot walk away: *In sellā sedēs! Prīmum surge.* Standing on
something: *In mēnsā stās! Prīmum dēscende.*

**Be generous with synonyms** (owner, 2026-11-05). A synonym is one `ACTIONS` entry with `sameAs`: it
answers with its partner's lines, and the recast keeps the verb the student chose. Where a hint names
the synonym, give it its own `on` line so the answer uses the same verb (*sedēs*, *recumbis*).

## Inventory

*capiō X* (or *tollō*, *sūmō*) takes something `portable`; carried things are within reach in every room,
so *edō pānem* works anywhere. *pōnō X* puts it down here: away from where it started, the room's
description adds *In Ātriō est etiam pānis* (the room's ablative from `ROOM_NAMES`). *Quid habeō?* (or
*habeō* alone) lists what is carried: *Habēs rosam et pānem.* / *Nihil habēs.*; *quid habēs?* is recast
to *habeō*. A word that could mean a carried thing or one in the room picks the one whose form was
typed (*rosās*: the garden's; *rosam*: the one in hand). Taking something non-portable is refused
(*Mēnsam tollere nōn potes.*), and the owl still does not care.

## Owed

- **The shop door is locked**, with something important inside: a lock, a way in, and the street line
  reading *clausa* while it is locked. Today it opens like any door.
- **The owl's puzzle:** get her to care, so she shares hints from her wisdom. Her name (2026-27:
  Rebecca) is data in `OBJECTS.noctua.name`, not shown yet; the class renames and redescribes her each year.
- **What is in the armārium** (and the amphorae: "Quid est in amphorīs?"). Opening it shows nothing yet.
- **Two objects of the same word in one room** are not yet told apart. No room has two today.
