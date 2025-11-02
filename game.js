// =============================================================================
// ### 1. GAME DATA ###
// All static data for the game, including room layouts, names, and vocabulary.
// =============================================================================
const removeDiacritics = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const rooms = {
    'via_west': { x: 0, y: -1, name: 'Via (West)', desc: 'Via est. Caelum nōn est clārum. Aqua ex caelō cadit.', exits: { south: 'taberna', east: 'via_east' } },
    'via_east': { x: 1, y: -1, name: 'Via (East)', desc: 'Iterum, via est. Aqua cadit. Magna domus est prope.', exits: { south: 'fauces', west: 'via_west' } },
    'taberna': { x: 0, y: 0, name: 'Taberna', desc: 'Hic est taberna. Mēnsa magna est. Multae rēs variae sunt in tabernā.', exits: { north: 'via_west' } },
    'fauces': { x: 1, y: 0, name: 'Fauces', desc: 'Hae sunt fauces. In murīs sunt multae imāginēs parentum. Te spectant.', exits: { north: 'via_east', south: 'atrium' } },
    'atrium': { x: 1, y: 1, name: 'Atrium', desc: 'Hoc est atrium magnum. Murī sunt rubrī. Aqua ex caelō in impluvium cadit.', exits: { north: 'fauces', south: 'tablinum', east: 'cubiculum_parentum', west: 'cubiculum_sororis', southeast: 'ala_larum', southwest: 'ala_hermae' } },
    'cubiculum_sororis': { x: 0, y: 1, name: 'Cubiculum Sorōris', desc: 'Hoc est cubiculum sorōris tuae. Est lectus et armārium.', exits: { east: 'atrium' } },
    'cubiculum_parentum': { x: 2, y: 1, name: 'Cubiculum Parentum', desc: 'Hoc est cubiculum parentum. Duo lectī sunt.', exits: { west: 'atrium' } },
    'ala_larum': { x: 2, y: 2, name: 'Ala Lārum', desc: 'Hic est ala. In alā est larārium. Deī domūs sunt in larāriō. Silentium est.', exits: { northwest: 'atrium' } },
    'ala_hermae': { x: 0, y: 2, name: 'Ala Hermae', desc: 'Hic est ala. Magna herma avī in angulō est.', exits: { northeast: 'atrium' } },
    'tablinum': { x: 1, y: 2, name: 'Tablinum', desc: 'Hoc est tablinum. Dominus saepe hic labōrat. Magna mēnsa in tablinō est.', exits: { north: 'atrium', south: 'peristylum' } },
    'peristylum': { x: 1, y: 3, name: 'peristylum', desc: 'Hoc est peristylum. In peristylō est hortus magnus. Multae columnae sunt.', exits: { north: 'tablinum', south: 'triclinium', east: 'cubiculum_tuum', west: 'culina' } },
    'cubiculum_tuum': { x: 2, y: 3, name: 'Cubiculum Tuum', desc: 'Hoc est cubiculum tuum. Lectus tuus est prope.', exits: { west: 'peristylum' } },
    'triclinium': { x: 1, y: 4, name: 'Triclinium', desc: 'Hoc est triclīnium. Trēs lectī et mēnsa parva in triclīniō sunt. Figūrae in murīs sunt.', exits: { north: 'peristylum' } },
    'culina': { x: 0, y: 3, name: 'Culina', desc: 'Hic est culīna. In culinā est aqua et focus. Latrīna in culinā est.', exits: { east: 'peristylum', west: 'cella' } },
    'cella': { x: -1, y: 3, name: 'Cella', desc: 'Hic est cella. Multae amphorae in cellā sunt.', exits: { east: 'culina' } }
};

const VERBS = {
    'move': { first_person: 'eō', stems: ['i', 'e'], infinitives: ['ire'] },
    'walk': { first_person: 'ambulō', stems: ['ambul'], infinitives: ['ambulare'] }
};


// REPLACE your old ROOM_NAMES object with this new one.
const ROOM_NAMES = {
    'cubiculum_tuum': { nom: 'Cubiculum Tuum', acc: ['in', 'Cubiculum', 'Tuum'], stems: ['cubicul'], aliases: ['meum', 'tuum'] },
    'cubiculum_sororis': { nom: 'Cubiculum Sorōris', acc: ['in', 'Cubiculum', 'Sorōris'], stems: ['cubicul'], aliases: ['sororis'], recast: 'Sorōris', clarification_stem: 'soror' },
    'cubiculum_parentum': { nom: 'Cubiculum Parentum', acc: ['in', 'Cubiculum', 'Parentum'], stems: ['cubicul'], aliases: ['parentum'], recast: 'Parentum', clarification_stem: 'parent' },
    'ala_larum': { nom: 'Ala Lārum', acc: ['in', 'Ālam', 'Lārum'], stems: ['ala'], aliases: ['larum'], recast: 'Lārum', clarification_stem: 'lar' },
    'ala_hermae': { nom: 'Ala Hermae', acc: ['in', 'Ālam', 'Hermae'], stems: ['ala'], aliases: ['hermae'], recast: 'Hermae', clarification_stem: 'herm' },
    'via_west': { nom: 'Via', acc: ['in', 'Viam'], stems: ['via'] },
    'via_east': { nom: 'Via', acc: ['in', 'Viam'], stems: ['via'] },
    'taberna': { nom: 'Taberna', acc: ['in', 'Tabernam'], stems: ['tabern'] },
    'fauces': { nom: 'Fauces', acc: ['in', 'Faucēs'], stems: ['fauc'] },
    'atrium': { nom: 'Atrium', acc: ['in', 'Ātrium'], stems: ['atri'] },
    'tablinum': { nom: 'Tablinum', acc: ['in', 'Tablīnum'], stems: ['tablin'] },
    'peristylum': { nom: 'peristylum', acc: ['in', 'Peristȳlum'], stems: ['peristyl'] },
    'triclinium': { nom: 'Triclinium', acc: ['in', 'Triclīnium'], stems: ['triclini'] },
    'culina': { nom: 'Culina', acc: ['in', 'Culīnam'], stems: ['culin'] },
    'cella': { nom: 'Cella', acc: ['in', 'Cellam'], stems: ['cell'] },
};

// REPLACE your entire VOCAB object with this cleaned and de-duplicated version.
// DELETE your entire old VOCAB object and REPLACE it with this block.

// The single source of truth for all vocabulary in the game.
// DELETE the VOCAB_LEMMA object from the previous step and REPLACE it with this corrected version.

// The single source of truth for all vocabulary in the game.
// DELETE VOCAB_LEMMA and the formToLemmaKey builder loop, and
// REPLACE it all with this single, correctly ordered block.

const VOCAB_LEMMA = {
    'a': { lemma: 'ā/ab (+abl.)', def: 'from, away from, by', level: 'core', forms: ['a', 'ab'] },
    'ad': { lemma: 'ad (+acc.)', def: 'to, toward, at', level: 'core', forms: ['ad'] },
    'aliquid': { lemma: 'aliquid', def: 'something', level: 'core', forms: ['aliquid'] },
    'amphora': { lemma: 'amphora, -ae, f.', def: 'jar, amphora', level: 'novum', forms: ['amphora', 'amphorae'] },
    'apertus': { lemma: 'apertus, -a, -um', def: 'open', level: 'outer', forms: ['apertus', 'aperta', 'apertum', 'aperit', 'aperiunt', 'aperuerunt'] },
    'aqua': { lemma: 'aqua, -ae, f.', def: 'water', level: 'core', forms: ['aqua'] },
    'armarium': { lemma: 'armārium, -ī, n.', def: 'closet, cupboard', level: 'outer', forms: ['armarium', 'armario'] },
    'avus': { lemma: 'avus, -ī, m.', def: 'grandfather', level: 'novum', forms: ['avus', 'avī'] },
    'cautus': { lemma: 'cautus, -a, -um', def: 'cautious', level: 'outer', forms: ['cautus', 'caute'] },
    'clarus': { lemma: 'clārus, -a, -um', def: 'clear, bright, famous', level: 'outer', forms: ['clarus', 'clarum', 'clare'] },
    'clausus': { lemma: 'clausus, -a, -um', def: 'closed', level: 'outer', forms: ['clausus', 'clausa', 'clausum', 'claudit', 'claudunt', 'clauserunt', 'clausis'] },
    'columna': { lemma: 'columna, -ae, f.', def: 'column, pillar', level: 'novum', forms: ['columna', 'columnae'] },
    'cubiculum': { lemma: 'cubiculum, -ī, n.', def: 'bedroom', level: 'outer', forms: ['cubiculum', 'cubiculo', 'cubiculi'] },
    'cum': { lemma: 'cum (+abl.)', def: 'with', level: 'core', forms: ['mecum'] },
    'curiosus': { lemma: 'cūriōsus, -a, -um', def: 'curious', level: 'outer', forms: ['curiosus', 'curiosum'] },
    'de': { lemma: 'dē (+abl.)', def: 'from, down from, about', level: 'core', forms: ['de'] },
    'dico': { lemma: 'dīcō, dīcere, dīxī', def: 'to say, speak', level: 'core', forms: ['dicit'] },
    'domus': { lemma: 'domus, -ūs, f.', def: 'house, home', level: 'core', forms: ['domus', 'domi'] },
    'dormio': { lemma: 'dormiō, dormīre, dormīvī', def: 'to sleep', level: 'core', forms: ['dormio', 'dormit', 'dormire', 'dormiebam', 'dormiturus'] },
    'eo': { lemma: 'eō, īre, iī/īvī', def: 'to go', level: 'core', forms: ['eo', 'ire', 'it'] },
    'et': { lemma: 'et (conj.)', def: 'and', level: 'core', forms: ['et'] },
    'figura': { lemma: 'figūra, -ae, f.', def: 'figure, shape', level: 'outer', forms: ['figura', 'figurae', 'figuram'] },
    'focus': { lemma: 'focus, -ī, m.', def: 'hearth, stove', level: 'novum', forms: ['focus'] },
    'habeo': { lemma: 'habeō, -ēre, -uī', def: 'to have, hold', level: 'core', forms: ['habet', 'habeo', 'habere', 'habesne', 'habebant'] },
    'herma': { lemma: 'herma, -ae, f.', def: 'herm, bust', level: 'novum', forms: ['herma'] },
    'hic': { lemma: 'hic, haec, hoc', def: 'this, these', level: 'core', forms: ['hic', 'haec', 'hoc'] },
    'horrificus': { lemma: 'horrificus, -a, -um', def: 'horrific', level: 'outer', forms: ['horrificus', 'horrificum', 'horrifici', 'horrificos', 'horrificissimus'] },
    'hortus': { lemma: 'hortus, -ī, m.', def: 'garden', level: 'novum', forms: ['hortus'] },
    'iam': { lemma: 'iam (adv.)', def: 'now, already', level: 'core', forms: ['iam'] },
    'ianua': { lemma: 'iānua, -ae, f.', def: 'door', level: 'outer', forms: ['ianua', 'ianuae', 'ianuam'] },
    'imago': { lemma: 'imāgō, -inis, f.', def: 'image, bust, ancestral mask', level: 'novum', forms: ['imago', 'imaginis', 'imaginem', 'imagines', 'imāginēs'] },
    'immobilis': { lemma: 'immōbilis, -e', def: 'immobile', level: 'outer', forms: ['immobilis', 'immobiles'] },
    'in': { lemma: 'in (+abl./acc.)', def: 'in, on, into, onto', level: 'core', forms: ['in'] },
    'inspicio': { lemma: 'īnspiciō, -ere, -spexī', def: 'to inspect, examine', level: 'outer', forms: ['inspicit', 'inspiciens', 'inspicere', 'inspectum'] },
    'investigo': { lemma: 'investīgō, -āre, -āvī', def: 'to investigate', level: 'outer', forms: ['investigat', 'investigans', 'investigare'] },
    'is': { lemma: 'is, ea, id', def: 'he, she, it, that', level: 'core', forms: ['is', 'ea', 'id'] },
    'iterum': { lemma: 'iterum (adv.)', def: 'again', level: 'core', forms: ['iterum'] },
    'lar': { lemma: 'Lār, Laris, m.', def: 'household god', level: 'novum', forms: ['lar', 'lares', 'larum'] },
    'lectus': { lemma: 'lectus, -ī, m.', def: 'bed, couch', level: 'core', forms: ['lectus', 'lectum', 'lecti', 'lectos', 'lectis'] },
    'magnus': { lemma: 'magnus, -a, -um', def: 'large, great', level: 'core', forms: ['magnus', 'magna', 'magnum'] },
    'mater': { lemma: 'māter, mātris, f.', def: 'mother', level: 'novum', forms: ['mater', 'matris'] },
    'mensa': { lemma: 'mēnsa, -ae, f.', def: 'table', level: 'outer', forms: ['mensa', 'mensam'] },
    'mortalis': { lemma: 'mortālis, -e', def: 'mortal', level: 'core', forms: ['mortalis', 'mortale'] },
    'murus': { lemma: 'murus, -ī, m.', def: 'wall', level: 'novum', forms: ['murus', 'muri', 'murī', 'murīs'] },
    'naturalis': { lemma: 'nātūrālis, -e', def: 'natural', level: 'outer', forms: ['naturalis', 'naturale', 'naturales'] },
    'nox': { lemma: 'nox, noctis, f.', def: 'night', level: 'core', forms: ['nox', 'noctem', 'nocte'] },
    'obscurus': { lemma: 'obscūrus, -a, -um', def: 'dark, obscure', level: 'outer', forms: ['obscurus', 'obscurum', 'obscura', 'obscuram', 'obscuro', 'obscuros'] },
    'oculus': { lemma: 'oculus, -ī, m.', def: 'eye', level: 'core', forms: ['oculi', 'oculis', 'oculos'] },
    'parvus': { lemma: 'parvus, -a, -um', def: 'small', level: 'outer', forms: ['parvus', 'parva'] },
    'pater': { lemma: 'pater, patris, m.', def: 'father, parent', level: 'core', forms: ['pater', 'patris', 'parentes', 'parentum'] },
    'peristylum': { lemma: 'peristylum, -ī, n.', def: 'peristyle', level: 'outer', forms: ['peristylum', 'peristylo'] },
    'perterritus': { lemma: 'perterritus, -a, -um', def: 'terrified', level: 'outer', forms: ['perterritus', 'perterriti', 'perterritissimus'] },
    'perturbatus': { lemma: 'perturbātus, -a, -um', def: 'disturbed, perturbed', level: 'outer', forms: ['perturbatus', 'perturbate', 'perturbatissimus'] },
    'puto': { lemma: 'putō, putāre, putāvī', def: 'to think', level: 'core', forms: ['putat', 'putavit', 'putabam'] },
    'qui': { lemma: 'quī, quae, quod', def: 'who, which', level: 'core', forms: ['qui', 'quae', 'quod', 'quem'] },
    'quintus': { lemma: 'Quīntus, -ī, m.', def: 'Quintus', level: 'outer', forms: ['quintus', 'quinti', 'quinto'] },
    'quoque': { lemma: 'quoque (adv.)', def: 'also, too', level: 'novum', forms: ['quoque'] },
    'realis': { lemma: 'reālis, -e', def: 'real', level: 'outer', forms: ['realis', 'reale', 'realem', 'reales', 'realia'] },
    'res': { lemma: 'rēs, reī, f.', def: 'thing, matter, object', level: 'core', forms: ['res', 'rēs'] },
    'rideo': { lemma: 'rīdeō, rīdēre, rīsī', def: 'to laugh, smile', level: 'core', forms: ['ridet', 'rident'] },
    'romanus': { lemma: 'Rōmānus, -a, -um', def: 'Roman', level: 'outer', forms: ['romanus', 'romani', 'romae'] },
    'ruber': { lemma: 'ruber, rubra, rubrum', def: 'red', level: 'novum', forms: ['ruber', 'rubra', 'rubrum', 'rubri', 'rubrī'] },
    'saepe': { lemma: 'saepe (adv.)', def: 'often', level: 'core', forms: ['saepe'] },
    'semper': { lemma: 'semper (adv.)', def: 'always', level: 'core', forms: ['semper'] },
    'sentio': { lemma: 'sentiō, sentīre, sēnsī', def: 'to feel, sense, perceive', level: 'core', forms: ['sentit', 'sentiens', 'sentire'] },
    'sonus': { lemma: 'sonus, -ī, m.', def: 'sound', level: 'outer', forms: ['sonus', 'sonum', 'soni', 'sonos'] },
    'soror': { lemma: 'soror, sorōris, f.', def: 'sister', level: 'novum', forms: ['soror', 'sorōris'] },
    'subito': { lemma: 'subitō (adv.)', def: 'suddenly', level: 'core', forms: ['subito'] },
    'sum': { lemma: 'sum, esse, fuī', def: 'to be', level: 'core', forms: ['sum', 'esse', 'fuit', 'fui', 'fuisse', 'es', 'est', 'estne', 'sunt', 'eram', 'erat', 'erant', 'eramus', 'erantne', 'sitne', 'sintne'] },
    'surgo': { lemma: 'surgō, surgere, surrēxī', def: 'to get up, rise', level: 'core', forms: ['surgit', 'surgunt', 'surrecta', 'surrecti', 'surrectis'] },
    'tranquillus': { lemma: 'tranquillus, -a, -um', def: 'calm, tranquil', level: 'outer', forms: ['tranquillus', 'tranquilla', 'tranquillum', 'tranquille'] },
    'tres': { lemma: 'trēs, tria', def: 'three', level: 'outer', forms: ['tres'] },
    'triclinium': { lemma: 'trīclīnium, -ī, n.', def: 'dining room', level: 'outer', forms: ['triclinium', 'triclinio'] },
    'tu': { lemma: 'tū, tuī', def: 'you (s.)', level: 'core', forms: ['tu', 'te', 'tibi'] },
    'tuus': { lemma: 'tuus, -a, -um', def: 'your (s.)', level: 'core', forms: ['tuus', 'tuum', 'tua', 'tuae'] },
    'ubique': { lemma: 'ubique (adv.)', def: 'everywhere', level: 'outer', forms: ['ubique'] },
    'video': { lemma: 'videō, vidēre, vīdī', def: 'to see', level: 'core', forms: ['videt', 'vidistine', 'videre'] },
    'volo': { lemma: 'volō, velle, voluī', def: 'to want, wish', level: 'core', forms: ['vult', 'voluit'] },
};

// This map allows us to quickly find the lemma for any given word form.
// For example, formToLemmaKey['murīs'] will return the key 'murus'.

// 1. We create the empty object first.
let formToLemmaKey = {};

// 2. Then, we loop through the data and fill the object.
// This code runs once when the script first loads.
for (const key in VOCAB_LEMMA) {
    const lemmaData = VOCAB_LEMMA[key];
    for (const form of lemmaData.forms) {
        // We clean the form to match how it will be looked up later.
        const cleanForm = removeDiacritics(form.toLowerCase());
        formToLemmaKey[cleanForm] = key;
    }
}
// This map will be populated at startup for fast lookups.
// It will map a form like "murīs" back to its lemma key "murus".
const DIRECTION_ROTATIONS = { 'north': 0, 'south': 180, 'east': 90, 'west': 270, 'northeast': 45, 'northwest': 315, 'southeast': 135, 'southwest': 225 };
const ANGLE_TO_DIRECTION = { 0: 'north', 45: 'northeast', 90: 'east', 135: 'southeast', 180: 'south', 225: 'southwest', 270: 'west', 315: 'northwest' };
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

// =============================================================================
// ### 2. GAME STATE
// =============================================================================
const gameState = { currentRoom: 'cubiculum_tuum', playerFacing: 270, currentVisualRotation: -270, visitedRooms: new Set(['cubiculum_tuum']), panOffset: { x: 0, y: 0 }, isDragging: false, dragStart: { x: 0, y: 0 }, isPlayerActionLocked: false, inputHistory: [], historyIndex: -1, clarificationState: null, hasRenderedFirstRoom: false };
const mapSettings = { GRID_SIZE: 150, ROOM_WIDTH: 100, ROOM_HEIGHT: 60 };
let elements = {};
let mapGroup;
const SVG_NS = "http://www.w3.org/2000/svg";

// =============================================================================
// ### 3. CORE GAME LOGIC
// =============================================================================

const opposite = { 'north': 'south', 'south': 'north', 'east': 'west', 'west': 'east', 'northwest': 'southeast', 'southeast': 'northwest', 'northeast': 'southwest', 'southwest': 'northeast' };

// REPLACE the entire "processInput" function with this new, targeted fix.
async function processInput(command) {
    if (gameState.isPlayerActionLocked) return;
    gameState.isPlayerActionLocked = true;
    elements.commandInput.disabled = true;

    logCommand(command, false);
    gameState.inputHistory.unshift(command);
    gameState.historyIndex = -1;

    try {
        const action = parseCommand(command);

        if (action.type === 'feedback') {
            setFeedback(action.feedback);
            
            // --- FIX FOR THE FREEZE ---
            // If this feedback error happened while we were waiting for clarification...
            if (gameState.clarificationState) {
                // ...we must manually unlock the UI so the player can try again.
                // This is the key to fixing the freeze.
                gameState.isPlayerActionLocked = false;
                elements.commandInput.disabled = false;
                elements.commandInput.focus();
            }
            // --- END OF FIX ---

        } else if (action.type === 'clarify') {
            logCommand(action.recast, action.wasCorrected, true);
            askClarification(action.prompt, action.options);
            gameState.isPlayerActionLocked = false;
            elements.commandInput.disabled = false;
            elements.commandInput.focus();
            return;

        } else if (action.type === 'move') {
            logCommand(action.recast, action.wasCorrected, true);
            if (action.wasCorrected) {
                await sleep(500);
            }
            const moveSuccessful = await performMove(action.direction, action.newFacingAngle);
            if (moveSuccessful) {
                logRoom();
            }
        }
    } finally {
        if (!gameState.clarificationState) {
            gameState.isPlayerActionLocked = false;
            elements.commandInput.disabled = false;
            elements.commandInput.focus();
        }
    }
}

function findVerb(normalizedCommand) {
    for (const key in VERBS) {
        const verbData = VERBS[key];
        const playerWord = normalizedCommand.split(' ').find(w => verbData.stems.some(s => w.startsWith(s)) || verbData.infinitives.includes(w));
        if (playerWord) {
            const isCorrect = removeDiacritics(playerWord) === removeDiacritics(verbData.first_person);
            return { key, data: verbData, correct: verbData.first_person, playerWord, isCorrect };
        }
    }
    return null;
}

// REPLACE your entire "parseCommand" function with this final, smarter version.
// REPLACE your entire "parseCommand" function with this correctly ordered version.
function parseCommand(command) {
    const normalizedCommand = removeDiacritics(command.toLowerCase().trim());
    
    if (gameState.clarificationState) {
        for (const key in gameState.clarificationState.options) {
            const targetRoomId = gameState.clarificationState.options[key];
            const roomData = ROOM_NAMES[targetRoomId];
            const stem = roomData.clarification_stem;

            if (stem && normalizedCommand.includes(stem)) {
                const wasCorrected = true;
                const cleanedCommand = normalizedCommand.replace(/[.,!?;]/g, '');
                const isClarificationPerfect = (cleanedCommand === key);
                let recastHtml = roomData.recast;

                if (!isClarificationPerfect && recastHtml) {
                    const endingMatch = recastHtml.match(/(um|am|em|ēs|is|ī|ae|us)$/i);
                    if (endingMatch) {
                        const ending = endingMatch[0];
                        const base = recastHtml.slice(0, -ending.length);
                        recastHtml = `${base}<span class="recast-ending">${ending}</span>`;
                    } else {
                        recastHtml = `<span class="recast-ending">${recastHtml}</span>`;
                    }
                }

                gameState.clarificationState = null;
                for (const dir in rooms[gameState.currentRoom].exits) {
                    if (rooms[gameState.currentRoom].exits[dir] === targetRoomId) {
                        return { type: 'move', direction: dir, newFacingAngle: DIRECTION_ROTATIONS[dir], wasCorrected: wasCorrected, recast: recastHtml };
                    }
                }
            }
        }
        return { type: 'feedback', feedback: `Nōn intellegō. ${gameState.clarificationState.prompt}` };
    }

    const verbInfo = findVerb(normalizedCommand);

    // --- LOGIC REORDERING START ---
    // 1. Check for ambiguous commands FIRST. This is the critical change.
    const needsCubiculumClarification = gameState.currentRoom === 'atrium' && normalizedCommand.includes('cubicul') && !normalizedCommand.includes('sororis') && !normalizedCommand.includes('parentum');
    if (needsCubiculumClarification) {
        const { recastHtml, wasCorrected } = generateRecast(normalizedCommand, { acc: ['in', 'Cubiculum'] }, verbInfo);
        return { type: 'clarify', prompt: "Utrum cubiculum?", options: { 'sororis': 'cubiculum_sororis', 'parentum': 'cubiculum_parentum' }, wasCorrected, recast: recastHtml };
    }

    const needsAlaClarification = gameState.currentRoom === 'atrium' && normalizedCommand.includes('ala') && !normalizedCommand.includes('larum') && !normalizedCommand.includes('hermae');
    if (needsAlaClarification) {
        const { recastHtml, wasCorrected } = generateRecast(normalizedCommand, { acc: ['in', 'Alam'] }, verbInfo);
        return { type: 'clarify', prompt: "Utram ālam?", options: { 'larum': 'ala_larum', 'hermae': 'ala_hermae' }, wasCorrected, recast: recastHtml };
    }

    // 2. NOW, look for a specific, unambiguous landmark.
    let landmarkInfo = null;
    let landmarkDir = null;
    let bestMatch = { score: 0, id: null };

    for (const roomId in ROOM_NAMES) {
        const roomData = ROOM_NAMES[roomId];
        let score = 0;
        if (roomData.aliases && roomData.aliases.some(a => normalizedCommand.includes(a))) { score += 10; }
        if (roomData.stems && roomData.stems.some(s => normalizedCommand.includes(s))) { score += 1; }
        if (score > bestMatch.score) { bestMatch = { score, id: roomId }; }
    }

    if (bestMatch.id) {
        landmarkInfo = { id: bestMatch.id, data: ROOM_NAMES[bestMatch.id] };
        landmarkDir = Object.keys(rooms[gameState.currentRoom].exits).find(dir => rooms[gameState.currentRoom].exits[dir] === bestMatch.id);
    }
    
    if (landmarkInfo) {
        if (landmarkInfo.id === gameState.currentRoom) {
            return { type: 'feedback', feedback: `Iam es in ${landmarkInfo.data.nom}.` };
        }
        if (!landmarkDir) {
            return { type: 'feedback', feedback: 'Nōn potes illūc īre.' };
        }
        if (!verbInfo && !normalizedCommand.includes('in') && !normalizedCommand.includes('ad')) return { type: 'feedback', feedback: "Quid vīs facere?" };
        const { recastHtml, wasCorrected } = generateRecast(normalizedCommand, landmarkInfo.data, verbInfo);
        return { type: 'move', direction: landmarkDir, newFacingAngle: DIRECTION_ROTATIONS[landmarkDir], wasCorrected, recast: recastHtml };
    }
    // --- LOGIC REORDERING END ---

    // 3. If no landmark was found, check for directional commands.
    let moveDirection = null, moveCommand = null, newFacingAngle = gameState.playerFacing;
    const hasProrsus = normalizedCommand.includes('prorsus');
    const hasRursus = normalizedCommand.includes('rursus');
    const hasDexteram = normalizedCommand.includes('dexteram');
    const hasSinistram = normalizedCommand.includes('sinistram');
    const currentFacing = ANGLE_TO_DIRECTION[gameState.playerFacing];
    const rursusDir = opposite[currentFacing];
    const dexteramDir = ANGLE_TO_DIRECTION[(gameState.playerFacing + 90) % 360];
    const sinistramDir = ANGLE_TO_DIRECTION[(gameState.playerFacing + 270) % 360];

    if (normalizedCommand.includes('prorsus et ad dexteram')) {
        moveDirection = ANGLE_TO_DIRECTION[(gameState.playerFacing + 45) % 360]; moveCommand = 'prōrsus et ad dexteram'; newFacingAngle = (gameState.playerFacing + 45) % 360;
    } else if (normalizedCommand.includes('prorsus et ad sinistram')) {
        moveDirection = ANGLE_TO_DIRECTION[(gameState.playerFacing + 315) % 360]; moveCommand = 'prōrsus et ad sinistram'; newFacingAngle = (gameState.playerFacing + 315) % 360;
    } else if (normalizedCommand.includes('rursus et ad dexteram')) {
        moveDirection = ANGLE_TO_DIRECTION[(gameState.playerFacing + 135) % 360]; moveCommand = 'rūrsus et ad dexteram'; newFacingAngle = (gameState.playerFacing + 135) % 360;
    } else if (normalizedCommand.includes('rursus et ad sinistram')) {
        moveDirection = ANGLE_TO_DIRECTION[(gameState.playerFacing + 225) % 360]; moveCommand = 'rūrsus et ad sinistram'; newFacingAngle = (gameState.playerFacing + 225) % 360;
    } else if (hasDexteram) {
        moveDirection = dexteramDir; moveCommand = 'ad dexteram'; newFacingAngle = (gameState.playerFacing + 90) % 360;
    } else if (hasSinistram) {
        moveDirection = sinistramDir; moveCommand = 'ad sinistram'; newFacingAngle = (gameState.playerFacing + 270) % 360;
    } else if (hasProrsus) {
        moveDirection = currentFacing; moveCommand = 'prōrsus';
    } else if (hasRursus) {
        moveDirection = rursusDir; moveCommand = 'rūrsus'; newFacingAngle = (gameState.playerFacing + 180) % 360;
    }
    
    if (moveDirection && moveCommand) {
        const verbForRecast = verbInfo ? verbInfo.correct : 'eō';
        const wasCorrected = !verbInfo || !verbInfo.isCorrect;
        return { type: 'move', direction: moveDirection, newFacingAngle, wasCorrected, recast: `${verbForRecast} ${moveCommand}` };
    }
    
    // 4. Finally, if all else fails, we don't understand the words.
    return { type: 'feedback', feedback: "Nōn intellegō verba tua." };
}

function generateRecast(command, roomData, verbInfo) {
    const verbForRecast = verbInfo ? verbInfo.correct : 'eō';
    let wasCorrected = false;
    let verbHtml = verbForRecast;
    if (!verbInfo || !verbInfo.isCorrect) {
        wasCorrected = true;
        if (verbInfo && verbInfo.key === 'walk') { verbHtml = `ambul<span class="recast-ending">ō</span>`; } 
        else { verbHtml = `<span class="recast-ending">${verbForRecast}</span>`; }
    }
    let prepHtml = `in`;
    if (command.includes('ad')) { prepHtml = 'ad'; } 
    else if (!command.includes('in')) { wasCorrected = true; prepHtml = `<span class="recast-ending">in</span>`; }
    const playerWords = command.split(' ');
    const correctWords = roomData.acc.slice(1);
    const recastWords = [];
    correctWords.forEach(correctWord => {
        const correctClean = removeDiacritics(correctWord.toLowerCase());
        const playerAttempt = playerWords.find(pWord => correctClean.startsWith(removeDiacritics(pWord)));
        if (playerAttempt && removeDiacritics(playerAttempt) === correctClean) {
            recastWords.push(correctWord);
        } else {
            wasCorrected = true;
            const endingMatch = correctWord.match(/(um|am|em|ēs|ōris|ī|ae|uum)$/i);
            if (endingMatch) {
                const ending = endingMatch[0];
                const base = correctWord.slice(0, -ending.length);
                recastWords.push(`${base}<span class="recast-ending">${ending}</span>`);
            } else {
                 recastWords.push(`<span class="recast-ending">${correctWord}</span>`);
            }
        }
    });
    if (!verbInfo) wasCorrected = true;
    return { recastHtml: `${verbHtml} ${prepHtml} ${recastWords.join(' ')}`, wasCorrected };
}

async function performMove(moveDirection, newFacingAngle) {
    if (newFacingAngle === undefined) { console.error("CRITICAL ERROR: newFacingAngle is undefined. Move direction was:", moveDirection); setFeedback("Error internus: Directio incerta est."); return false; }
    const nextRoomId = rooms[gameState.currentRoom].exits[moveDirection];
    if (nextRoomId) {
        const previousRoomId = gameState.currentRoom;
        gameState.currentRoom = nextRoomId;
        gameState.visitedRooms.add(nextRoomId);
        gameState.panOffset = { x: 0, y: 0 };
        gameState.playerFacing = newFacingAngle;
        if ((previousRoomId === 'ala_larum' || previousRoomId === 'ala_hermae') && nextRoomId === 'atrium') {
            gameState.playerFacing = 0;
        }
        await render(true);
        setFeedback("");
        return true;
    } else {
        setFeedback("Nōn potes illāc īre.");
        return false;
    }
}

function askClarification(prompt, options) { gameState.clarificationState = { prompt, options }; let optionsString = Object.values(options).map(id => `&nbsp;&nbsp;- ${ROOM_NAMES[id].nom}`).join('<br>'); setFeedback(`${prompt}<br>${optionsString}`); }

function setFeedback(message) {
    const log = elements.gameLog;
    const entry = document.createElement('div');
    entry.className = 'log-error'; // Use our new CSS class
    entry.innerHTML = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}
function generateExitsString() { const directions = [ { name: 'prōrsus', angle: 0 }, { name: 'rūrsus', angle: 180 }, { name: 'ad dexteram', angle: 90 }, { name: 'ad sinistram', angle: 270 }, { name: 'prōrsus et ad dexteram', angle: 45 }, { name: 'prōrsus et ad sinistram', angle: 315 }, { name: 'rūrsus et ad dexteram', angle: 135 }, { name: 'rūrsus et ad sinistram', angle: 225 } ]; const knownExits = []; const unknownExits = new Set(); const currentExits = rooms[gameState.currentRoom].exits; for (const dir of directions) { const targetAngle = (gameState.playerFacing + dir.angle + 360) % 360; const targetDir = ANGLE_TO_DIRECTION[targetAngle]; const targetRoomId = currentExits[targetDir]; if (targetRoomId) { if (gameState.visitedRooms.has(targetRoomId)) { knownExits.push(`<strong>${dir.name}</strong> ${ROOM_NAMES[targetRoomId].acc.join(' ')}`); } else { unknownExits.add(`<strong>${dir.name}</strong>`); } } } if (knownExits.length === 0 && unknownExits.size === 0) return ""; let html = ""; if (unknownExits.size > 0) { html += `Potes īre: ${[...unknownExits].join(', ')}.<br>`; } if (knownExits.length > 0) { if (unknownExits.size > 0) html += `Etiam potes īre:<br>`; else html += `Potes īre:<br>`; knownExits.forEach(exit => { html += `&nbsp;&nbsp;${exit}<br>`; }); } return html; }

// =============================================================================
// ### 5. MAP AND RENDERING LOGIC
// =============================================================================
function setupMap() { mapGroup = document.createElementNS(SVG_NS, 'g'); elements.mapSvg.appendChild(mapGroup); for (const roomId in rooms) { const room = rooms[roomId]; const roomGroup = document.createElementNS(SVG_NS, 'g'); roomGroup.id = `map-room-${roomId}`; roomGroup.classList.add('map-room'); const rect = document.createElementNS(SVG_NS, 'rect'); const label = document.createElementNS(SVG_NS, 'text'); label.classList.add('room-label'); const nameParts = room.name.replace(/[()]/g, '').split(' '); nameParts.forEach((part, index) => { const tspan = document.createElementNS(SVG_NS, 'tspan'); tspan.textContent = part; tspan.setAttribute('x', 0); tspan.setAttribute('dy', `${index * 1.2}em`); label.appendChild(tspan); }); roomGroup.appendChild(rect); roomGroup.appendChild(label); mapGroup.appendChild(roomGroup); } }
function setupMapInteraction() { elements.mapViewport.addEventListener('mousedown', (e) => { gameState.isDragging = true; elements.mapViewport.style.cursor = 'grabbing'; gameState.dragStart.x = e.clientX - gameState.panOffset.x; gameState.dragStart.y = e.clientY - gameState.panOffset.y; }); window.addEventListener('mousemove', (e) => { if (!gameState.isDragging) return; gameState.panOffset.x = e.clientX - gameState.dragStart.x; gameState.panOffset.y = e.clientY - gameState.dragStart.y; applyMapTransform(false); }); window.addEventListener('mouseup', () => { gameState.isDragging = false; elements.mapViewport.style.cursor = 'grab'; }); }
async function applyMapTransform(animated = false) { if (!mapGroup) return; const targetVisualRotation = -gameState.playerFacing; let delta = targetVisualRotation - gameState.currentVisualRotation; if (delta > 180) delta -= 360; else if (delta < -180) delta += 360; const nextVisualRotation = gameState.currentVisualRotation + delta; const isLongTurn = Math.abs(delta) > 90; const animate = (rotation, scale) => { return new Promise(resolve => { const transitionDuration = animated ? 0.3 : 0; mapGroup.style.transition = `transform ${transitionDuration}s ease-in-out`; const playerRoom = rooms[gameState.currentRoom]; const px = playerRoom.x * mapSettings.GRID_SIZE; const py = playerRoom.y * mapSettings.GRID_SIZE; const viewbox = elements.mapViewport.getBoundingClientRect(); const centerX = viewbox.width / 2; const centerY = viewbox.height / 2; const pan = `translate(${gameState.panOffset.x}, ${gameState.panOffset.y})`; const recenter = `translate(${centerX}, ${centerY})`; const rot = `rotate(${rotation})`; const scaling = `scale(${scale})`; const centerOnPlayer = `translate(${-px}, ${-py})`; mapGroup.setAttribute('transform', `${pan} ${recenter} ${rot} ${scaling} ${centerOnPlayer}`); setTimeout(resolve, transitionDuration * 1000); }); }; if (animated && isLongTurn) { await animate(gameState.currentVisualRotation, 0.7); await sleep(100); await animate(nextVisualRotation, 0.7); await sleep(300); await animate(nextVisualRotation, 1.0); } else { await animate(nextVisualRotation, 1.0); } gameState.currentVisualRotation = nextVisualRotation; }
function updateMapGraphics() { const { GRID_SIZE, ROOM_WIDTH, ROOM_HEIGHT } = mapSettings; const oldConnections = mapGroup.querySelectorAll('.map-connection'); oldConnections.forEach(conn => conn.remove()); const targetVisualRotation = -gameState.playerFacing; let delta = targetVisualRotation - gameState.currentVisualRotation; if (delta > 180) delta -= 360; else if (delta < -180) delta += 360; const nextVisualRotation = gameState.currentVisualRotation + delta; const normalizedNextAngle = (nextVisualRotation % 360 + 360) % 360; const isUpsideDown = normalizedNextAngle > 90 && normalizedNextAngle < 270; for (const roomId in rooms) { if (gameState.visitedRooms.has(roomId)) { const room = rooms[roomId]; for (const dir in room.exits) { const targetRoomId = room.exits[dir]; if (targetRoomId && rooms[targetRoomId]) { const targetRoom = rooms[targetRoomId]; if (gameState.visitedRooms.has(targetRoomId)) { if (roomId < targetRoomId) { const line = document.createElementNS(SVG_NS, 'line'); line.setAttribute('x1', room.x * GRID_SIZE); line.setAttribute('y1', room.y * GRID_SIZE); line.setAttribute('x2', targetRoom.x * GRID_SIZE); line.setAttribute('y2', targetRoom.y * GRID_SIZE); line.setAttribute('class', 'map-connection'); mapGroup.prepend(line); } } else if (roomId === gameState.currentRoom) { const line = document.createElementNS(SVG_NS, 'line'); line.setAttribute('x1', room.x * GRID_SIZE); line.setAttribute('y1', room.y * GRID_SIZE); line.setAttribute('x2', (room.x + targetRoom.x) / 2 * GRID_SIZE); line.setAttribute('y2', (room.y + targetRoom.y) / 2 * GRID_SIZE); line.setAttribute('class', 'map-connection'); mapGroup.prepend(line); } } } } } for (const roomId in rooms) { const room = rooms[roomId]; const roomGroup = document.getElementById(`map-room-${roomId}`); const rect = roomGroup.querySelector('rect'); const label = roomGroup.querySelector('text'); roomGroup.setAttribute('transform', `translate(${room.x * GRID_SIZE}, ${room.y * GRID_SIZE})`); rect.setAttribute('x', -ROOM_WIDTH / 2); rect.setAttribute('y', -ROOM_HEIGHT / 2); rect.setAttribute('width', ROOM_WIDTH); rect.setAttribute('height', ROOM_HEIGHT); label.setAttribute('dy', `-${(label.children.length - 1) * 0.5}em`); if (isUpsideDown) { label.setAttribute('transform', 'rotate(180)'); } else { label.removeAttribute('transform'); } roomGroup.classList.remove('current', 'hidden'); label.classList.remove('current'); if (roomId === gameState.currentRoom) { roomGroup.classList.add('current'); label.classList.add('current'); } else if (!gameState.visitedRooms.has(roomId)) { roomGroup.classList.add('hidden'); } } }

// =============================================================================
// ### 6. RENDERING AND LOGGING
// =============================================================================

async function render(animated = true) {
    updateMapGraphics();
    await applyMapTransform(animated);
}

// REPLACE your old 'logCommand' function with this new one.
function logCommand(commandHtml, wasCorrected, replaceLast = false) {
    const log = elements.gameLog;

    // If replacing, remove the last log entry, which was the raw command.
    if (replaceLast && log.lastChild) {
        // We check to make sure the last entry was indeed a command to be safe.
        if (log.lastChild.classList.contains('log-command') || log.lastChild.classList.contains('log-recast')) {
            log.removeChild(log.lastChild);
        }
    }

    const entry = document.createElement('div');
    // The class is now based on the wasCorrected boolean from the parser
    entry.className = wasCorrected ? 'log-recast' : 'log-command';
    entry.innerHTML = `> ${commandHtml}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function logRoom() {
    const log = elements.gameLog;
    if (!gameState.hasRenderedFirstRoom) {
        log.innerHTML = '';
        gameState.hasRenderedFirstRoom = true;
    }
    const room = rooms[gameState.currentRoom];
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    const title = document.createElement('h3');
    title.className = 'log-room-title';
    title.innerHTML = processDescription(room.name);
    const desc = document.createElement('p');
    desc.className = 'log-description';
    desc.innerHTML = processDescription(room.desc);
    const exits = document.createElement('div');
    exits.className = 'log-exits';
    exits.innerHTML = generateExitsString();
    entry.appendChild(title);
    entry.appendChild(desc);
    if (exits.innerHTML) entry.appendChild(exits);
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}
function setupTooltipListeners() {
    const log = elements.gameLog;
    const tooltip = elements.tooltip;

    log.addEventListener('mouseover', (e) => {
        const vocabSpan = e.target.closest('.vocab');
        if (!vocabSpan) return;

        // Get the data we stored in the span
        const lemma = vocabSpan.dataset.lemma;
        const def = vocabSpan.dataset.def;
        tooltip.innerHTML = `${lemma}<br>${def}`;

        // Position the tooltip above the word
        const rect = vocabSpan.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top = rect.top - tooltipRect.height - 5; // 5px buffer
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

        // Prevent it from going off the left/right of the screen
        if (left < 0) left = 5;
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 5;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.classList.add('visible');
    });

    log.addEventListener('mouseout', (e) => {
        const vocabSpan = e.target.closest('.vocab');
        if (vocabSpan) {
            tooltip.classList.remove('visible');
        }
    });
}

// In your processDescription function...
function processDescription(text) {
    const wordsAndSeparators = text.split(/([ \t\n\r.,!?;]+)/);

    return wordsAndSeparators.map(part => {
        if (!part.trim()) return part;
        const cleanWord = removeDiacritics(part.toLowerCase());
        const lemmaKey = formToLemmaKey[cleanWord];
        if (!lemmaKey) { return part; }
        const lemmaData = VOCAB_LEMMA[lemmaKey];
        if (lemmaData.level === 'core') { return part; }

        // --- REPLACEMENT START ---
        // Instead of creating a nested span, embed the data directly into the main span.
        const vocabClass = lemmaData.level === 'novum' ? 'vocab novum' : 'vocab';
        return `<span class="${vocabClass}" data-lemma="${lemmaData.lemma}" data-def="${lemmaData.def}">${part}</span>`;
        // --- REPLACEMENT END ---

    }).join('');
}
// =============================================================================
// ### 7. INITIALIZATION
// =============================================================================
// This block runs once after the page is loaded.
document.addEventListener('DOMContentLoaded', () => {
    // 1. Find all static HTML elements.
    elements = { 
        gameLog: document.getElementById('game-log'), 
        commandForm: document.getElementById('command-form'), 
        commandInput: document.getElementById('command-input'), 
        mapViewport: document.getElementById('map-viewport'), 
        mapSvg: document.getElementById('map-svg'),
        tooltip: document.getElementById('tooltip'), // <-- ADD THIS LINE
    };

    // 2. Create the dynamic SVG elements for the map.
    setupMap();
    
    // 3. Now that SVG elements exist, find the player marker.
    
    // 4. Set up user interaction and perform the initial render.
    setupMapInteraction();
    setupTooltipListeners(); // <-- ADD THIS LINE
    logRoom(); // Log the first room description
    render(false); // Render the map
    elements.commandInput.focus();

    // 5. Set up event listeners for player commands.
    elements.commandForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const command = elements.commandInput.value;
        if (command) {
            processInput(command);
        }
        elements.commandInput.value = '';
    });
    elements.commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (gameState.historyIndex < gameState.inputHistory.length - 1) {
                gameState.historyIndex++;
                elements.commandInput.value = gameState.inputHistory[gameState.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (gameState.historyIndex > 0) {
                gameState.historyIndex--;
                elements.commandInput.value = gameState.inputHistory[gameState.historyIndex];
            } else {
                gameState.historyIndex = -1;
                elements.commandInput.value = "";
            }
        }
    });
});