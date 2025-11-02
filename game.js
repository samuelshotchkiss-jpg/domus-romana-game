// =============================================================================
// ### 1. GAME DATA ###
// All static data for the game, including room layouts, names, and vocabulary.
// =============================================================================
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
const VOCAB = {
    CORE: new Set(['a', 'ab', 'ad', 'aliquid', 'ambulare', 'ambulō', 'animus', 'aperit', 'apud', 'aqua', 'atque', 'audit', 'aut', 'bene', 'bona', 'caelum', 'claudit', 'culina', 'de', 'dei', 'dicit', 'discetis', 'diu', 'dominus', 'domi', 'domus', 'dormio', 'dormit', 'e', 'ego', 'enim', 'eo', 'es', 'esse', 'est', 'et', 'ex', 'exspectat', 'facere', 'fere', 'fuit', 'habet', 'hic', 'hoc', 'hospites', 'iam', 'in', 'intremus', 'intro', 'ipse', 'ira', 'ire', 'is', 'ita', 'itaque', 'iterum', 'laborat', 'lectus', 'magna', 'magnus', 'mecum', 'meus', 'mihi', 'minime', 'mortalis', 'multi', 'neque', 'nomen', 'non', 'nox', 'nunc', 'oculi', 'omnia', 'parentes', 'paro', 'pater', 'per', 'peristylum', 'perpetua', 'post', 'potest', 'prope', 'puer', 'puella', 'putat', 'quae', 'quam', 'quem', 'qui', 'quid', 'quo', 'quoque', 'respondet', 'res', 'ridet', 'saepe', 'sed', 'semper', 'sentit', 'servus', 'sic', 'silentium', 'solus', 'spectate', 'statim', 'subito', 'sum', 'sunt', 'surgit', 'suus', 'taberna', 'tablinum', 'tamen', 'tandem', 'te', 'tu', 'tum', 'tuus', 'ubi', 'urbs', 'varia', 'venite', 'vero', 'via', 'videt', 'vidistine', 'vir', 'vult', 'voluit']),
    OUTER: {
        'affectus': 'affected', 'aperta': 'open', 'apertam': 'open', 'apertum': 'open', 'aperuerunt': 'they opened', 'aperiunt': 'they open', 'armarium': 'closet', 'armario': 'closet', 'attat': 'Ah ha!', 'atrio': 'atrium', 'caute': 'cautiously', 'cautus': 'cautious', 'clare': 'clearly', 'clarum': 'clear', 'clausa': 'closed', 'clauserunt': 'they shut', 'clausis': 'closed', 'clausum': 'closed', 'coram': 'in the presence of', 'cubiculi': 'of the bedroom', 'cubiculo': 'bedroom', 'culinam': 'kitchen', 'curiosum': 'curious', 'curiosus': 'curious', 'dormiebam': 'I was sleeping', 'dormire': 'to sleep', 'dormiturus': 'about to sleep', 'eram': 'I was', 'eramus': 'we were', 'erant': 'they were', 'erantne': 'were they?', 'erat': 'was', 'estne': 'is it?', 'evidentia': 'evidence', 'evidentiam': 'evidence', 'figura': 'figure', 'figurae': 'figures', 'figuram': 'figure', 'fui': 'I was', 'fuisse': 'to have been', 'habebant': 'they had', 'habeo': 'I have', 'habere': 'to have', 'habesne': 'do you have?', 'horrifici': 'horrific', 'horrificissimum': 'very horrific', 'horrificissimus': 'very horrific', 'horrificos': 'horrific', 'horrificum': 'horrific', 'horrificus': 'horrific', 'horrorem': 'horror!', 'ianua': 'door', 'ianuae': 'doors', 'ianuam': 'door', 'immobiles': 'immobile', 'immobilis': 'immobile', 'insomniam': 'insomnia', 'inspectum': 'inspected', 'inspicere': 'to inspect', 'inspiciens': 'inspecting', 'inspicit': 'inspects', 'investigans': 'investigating', 'investigare': 'to investigate', 'investigat': 'investigates', 'lecti': 'couches', 'lectis': 'couches', 'lectos': 'couches', 'lectum': 'couch', 'macte': 'well done!', 'mensa': 'table', 'mensam': 'table', 'monstra': 'monsters', 'monstro': 'monster', 'monstrorum': 'of monsters', 'monstrum': 'monster', 'mortale': 'mortal', 'mortales': 'mortal', 'murmur': 'murmur', 'murmure': 'by a murmur', 'naturale': 'natural', 'naturales': 'natural', 'naturalis': 'natural', 'nauseam': 'nausea', 'nocte': 'at night', 'noctem': 'night', 'obscura': 'dark', 'obscuram': 'dark', 'obscuro': 'dark', 'obscuros': 'dark', 'obscurum': 'dark', 'oculis': 'eyes', 'parentum': 'of the parents', 'peristylo': 'peristyle', 'perpetuam': 'perpetual', 'perterriti': 'terrified', 'perterritissimus': 'very terrified', 'perterritus': 'terrified', 'perturbate': 'pertubedly', 'perturbatissimus': 'very perturbed', 'perturbatus': 'perturbed', 'phantasmata': 'ghosts', 'phantasmate': 'ghost', 'phantasmatis': 'of a ghost', 'phantasmatum': 'of ghosts', 'putabam': 'I thought', 'putavit': 'thought', 'quintus': 'Quintus', 'quinti': 'of Quintus', 'quinto': 'Quintus', 'reale': 'real', 'realem': 'real', 'reales': 'real', 'realia': 'real', 'realis': 'real', 'rident': 'they laugh', 'romae': 'in Rome', 'romani': 'Romans', 'romanus': 'Roman', 'sentiens': 'sensing', 'sitne': 'could it be?', 'sintne': 'could they be?', 'soni': 'sounds', 'sonos': 'sounds', 'sonum': 'sound', 'sonus': 'sound', 'stomachus': 'stomach', 'surgunt': 'they rise', 'surrecta': 'was lifted up', 'surrecti': 'were lifted up', 'surrectis': 'lifted up', 'tablino': 'study', 'tranquilla': 'tranquil', 'tranquille': 'calmly', 'tranquillum': 'tranquil', 'tranquillus': 'tranquil', 'tres': 'three', 'triclinio': 'dining room', 'triclinium': 'dining room', 'ubique': 'everywhere', 'videre': 'to see', 'parva': 'small'
    },
    NOVUM: {
        'amphorae': { lemma: 'amphora, -ae, f.', def: 'jar, amphora' }, 'avī': { lemma: 'avus, -ī, m.', def: 'of the grandfather' }, 'columnae': { lemma: 'columna, -ae, f.', def: 'column, pillar' }, 'focus': { lemma: 'focus, -ī, m.', def: 'hearth, stove' }, 'herma': { lemma: 'herma, -ae, f.', def: 'herm, bust' }, 'hortus': { lemma: 'hortus, -ī, m.', def: 'garden' }, 'imāginēs': { lemma: 'imago, imaginis, f.', def: 'ancestral mask' }, 'lārum': { lemma: 'lares, -ium, m.pl.', def: 'of the Lares (household gods)' }, 'mātris': { lemma: 'mater, matris, f.', def: 'of the mother' }, 'murī': { lemma: 'murus, -ī, m.', def: 'wall' }, 'murīs': { lemma: 'murus, -ī, m.', def: 'wall' }, 'patris': { lemma: 'pater, patris, m.', def: 'of the father' }, 'rēs': { lemma: 'rēs, reī, f.', def: 'thing, object' }, 'rubrī': { lemma: 'ruber, rubra, rubrum', def: 'red' }, 'sorōris': { lemma: 'soror, sororis, f.', def: 'of the sister' }, 'tuae': { lemma: 'tuus, -a, -um', def: 'your' }
    }
};
const DIRECTION_ROTATIONS = { 'north': 0, 'south': 180, 'east': 90, 'west': 270, 'northeast': 45, 'northwest': 315, 'southeast': 135, 'southwest': 225 };
const ANGLE_TO_DIRECTION = { 0: 'north', 45: 'northeast', 90: 'east', 135: 'southeast', 180: 'south', 225: 'southwest', 270: 'west', 315: 'northwest' };
const sleep = (ms) => new Promise(res => setTimeout(res, ms));
const removeDiacritics = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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
    let landmarkInfo = null;
    let landmarkDir = null;
    let bestMatch = { score: 0, id: null };

    for (const roomId in ROOM_NAMES) {
        const roomData = ROOM_NAMES[roomId];
        // Allow matching against ALL rooms, not just exits, for better error messages.
        // if (!Object.values(rooms[gameState.currentRoom].exits).includes(roomId)) continue;
        let score = 0;
        if (roomData.aliases && roomData.aliases.some(a => normalizedCommand.includes(a))) { score += 10; }
        if (roomData.stems && roomData.stems.some(s => normalizedCommand.includes(s))) { score += 1; }
        if (score > bestMatch.score) { bestMatch = { score, id: roomId }; }
    }

    if (bestMatch.id) {
        landmarkInfo = { id: bestMatch.id, data: ROOM_NAMES[bestMatch.id] };
        landmarkDir = Object.keys(rooms[gameState.currentRoom].exits).find(dir => rooms[gameState.currentRoom].exits[dir] === bestMatch.id);
    }
    
    // --- START OF NEW, SMARTER ERROR HANDLING ---
    if (landmarkInfo) {
        // Case 1: Player is trying to go to the room they are already in.
        if (landmarkInfo.id === gameState.currentRoom) {
            return { type: 'feedback', feedback: `Iam es in ${landmarkInfo.data.nom}.` };
        }

        // Case 2: Player names a valid room that is not a direct exit.
        if (!landmarkDir) {
            return { type: 'feedback', feedback: 'Nōn potes illūc īre.' };
        }
        
        // If we get here, it's a valid, reachable room, so proceed.
        if (!verbInfo && !normalizedCommand.includes('in') && !normalizedCommand.includes('ad')) return { type: 'feedback', feedback: "Quid vīs facere?" };
        const { recastHtml, wasCorrected } = generateRecast(normalizedCommand, landmarkInfo.data, verbInfo);
        return { type: 'move', direction: landmarkDir, newFacingAngle: DIRECTION_ROTATIONS[landmarkDir], wasCorrected, recast: recastHtml };
    }
    // --- END OF NEW, SMARTER ERROR HANDLING ---

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

    let moveDirection = null, moveCommand = null, newFacingAngle = gameState.playerFacing;
    const hasProrsus = normalizedCommand.includes('prorsus');
    const hasRursus = normalizedCommand.includes('rursus');
    const hasDexteram = normalizedCommand.includes('dexteram');
    const hasSinistram = normalizedCommand.includes('sinistram');
    if (hasProrsus || hasRursus || hasDexteram || hasSinistram) {
        const currentFacing = ANGLE_TO_DIRECTION[gameState.playerFacing];
        const rursusDir = opposite[currentFacing];
        const dexteramDir = ANGLE_TO_DIRECTION[(gameState.playerFacing + 90) % 360];
        const sinistramDir = ANGLE_TO_DIRECTION[(gameState.playerFacing + 270) % 360];
        if (hasProrsus) { moveDirection = currentFacing; moveCommand = 'prōrsus'; } 
        else if (hasRursus) { moveDirection = rursusDir; moveCommand = 'rūrsus'; newFacingAngle = (gameState.playerFacing + 180) % 360; } 
        else if (hasDexteram) { moveDirection = dexteramDir; moveCommand = 'ad dexteram'; newFacingAngle = (gameState.playerFacing + 90) % 360; } 
        else if (hasSinistram) { moveDirection = sinistramDir; moveCommand = 'ad sinistram'; newFacingAngle = (gameState.playerFacing + 270) % 360; }
        
        const verbForRecast = verbInfo ? verbInfo.correct : 'eō';
        const wasCorrected = !verbInfo || !verbInfo.isCorrect;
        return { type: 'move', direction: moveDirection, newFacingAngle, wasCorrected, recast: `${verbForRecast} ${moveCommand}` };
    }
    
    // Only if ALL other checks fail do we admit we don't understand the words.
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

function processDescription(text) {
    const words = text.split(/([ \t\n\r]+)/);
    return words.map(word => {
        if (!word.trim()) return word;
        const cleanWord = removeDiacritics(word.toLowerCase().replace(/[.,!?;]/g, ''));
        let info;
        if (VOCAB.NOVUM[cleanWord]) {
            info = VOCAB.NOVUM[cleanWord];
            return `<span class="vocab novum">${word}<span class="tooltip">${info.lemma}<br>${info.def}</span></span>`;
        } else if (VOCAB.OUTER[cleanWord]) {
            info = VOCAB.OUTER[cleanWord];
            return `<span class="vocab">${word}<span class="tooltip">${info}</span></span>`;
        }
        return word;
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
    };

    // 2. Create the dynamic SVG elements for the map.
    setupMap();
    
    // 3. Now that SVG elements exist, find the player marker.
    
    // 4. Set up user interaction and perform the initial render.
    setupMapInteraction();
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