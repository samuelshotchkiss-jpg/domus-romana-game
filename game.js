// =============================================================================
// ### 1. GAME DATA ###
// All static data for the game, including room layouts, names, and vocabulary.
// =============================================================================
// ADD THIS NEW CONSTANT
const VERBS = {
    'move': {
        first_person: 'eō',
        stems: ['i', 'e'], // for eo, ire, it, etc.
        infinitives: ['ire']
    },
    'walk': {
        first_person: 'ambulō',
        stems: ['ambul'],
        infinitives: ['ambulare']
    }
};

const rooms = {
    'via_west': { x: 0, y: -1, name: 'Via (West)', desc: 'Via est. Caelum nōn est clārum. Aqua ex caelō cadit.', exits: { south: 'taberna', east: 'via_east' } },
    'via_east': { x: 1, y: -1, name: 'Via (East)', desc: 'Iterum, via est. Aqua cadit. Magna domus est prope.', exits: { south: 'fauces', west: 'via_west' } },
    'taberna': { x: 0, y: 0, name: 'Taberna', desc: 'Hic est taberna. Mēnsa magna est. Multae rēs variae sunt in tabernā.', exits: { north: 'via_west' } },
    'fauces': { x: 1, y: 0, name: 'Fauces', desc: 'Hae sunt fauces. In murīs sunt multae imāginēs parentum. Te spectant.', exits: { north: 'via_east', south: 'atrium' } },
    'atrium': { x: 1, y: 1, name: 'Atrium', desc: 'Hoc est atrium magnum. Murī sunt rubrī. Aqua ex caelō in impluvium cadit.', exits: { north: 'fauces', south: 'tablinum', east: 'cubiculum_matris_et_patris', west: 'cubiculum_sororis', southeast: 'ala_larum', southwest: 'ala_hermae' } },
    'cubiculum_sororis': { x: 0, y: 1, name: 'Cubiculum Sorōris', desc: 'Hoc est cubiculum sorōris tuae. Est lectus et armārium.', exits: { east: 'atrium' } },
    'cubiculum_matris_et_patris': { x: 2, y: 1, name: 'Cubiculum Mātris et Patris', desc: 'Hoc est cubiculum patris et mātris. Duo lectī sunt.', exits: { west: 'atrium' } },
    'ala_larum': { x: 2, y: 2, name: 'Ala Lārum', desc: 'Hic est ala. In alā est larārium. Deī domūs sunt in larāriō. Silentium est.', exits: { northwest: 'atrium' } },
    'ala_hermae': { x: 0, y: 2, name: 'Ala Hermae', desc: 'Hic est ala. Magna herma avī in angulō est.', exits: { northeast: 'atrium' } },
    'tablinum': { x: 1, y: 2, name: 'Tablinum', desc: 'Hoc est tablinum. Dominus saepe hic labōrat. Magna mēnsa in tablinō est.', exits: { north: 'atrium', south: 'peristylium' } },
    'peristylium': { x: 1, y: 3, name: 'Peristylium', desc: 'Hoc est peristylium. In peristyliō est hortus magnus. Multae columnae sunt.', exits: { north: 'tablinum', south: 'triclinium', east: 'cubiculum_tuum', west: 'culina' } },
    'cubiculum_tuum': { x: 2, y: 3, name: 'Cubiculum Tuum', desc: 'Hoc est cubiculum tuum. Lectus tuus est prope.', exits: { west: 'peristylium' } },
    'triclinium': { x: 1, y: 4, name: 'Triclinium', desc: 'Hoc est triclīnium. Trēs lectī et mēnsa parva in triclīniō sunt. Figūrae in murīs sunt.', exits: { north: 'peristylium' } },
    'culina': { x: 0, y: 3, name: 'Culina', desc: 'Hic est culīna. In culinā est aqua et focus. Latrīna in culinā est.', exits: { east: 'peristylium', west: 'cella' } },
    'cella': { x: -1, y: 3, name: 'Cella', desc: 'Hic est cella. Multae amphorae in cellā sunt.', exits: { east: 'culina' } }
};

// REPLACE your old ROOM_NAMES object with this one
const ROOM_NAMES = {
    'cubiculum_tuum': { nom: 'Cubiculum Tuum', acc: 'in Cubiculum Tuum', search: 'cubiculum tuum', stem: 'cubicul', aliases: ['meum', 'tuum'] },
    'cubiculum_sororis': { nom: 'Cubiculum Sorōris', acc: 'in Cubiculum Sorōris', search: 'cubiculum sororis', stem: 'cubicul', aliases: ['sororis'] },
    'cubiculum_matris_et_patris': { nom: 'Cubiculum Mātris et Patris', acc: 'in Cubiculum Mātris et Patris', search: 'cubiculum matris', stem: 'cubicul', aliases: ['matris', 'patris'] },
    'ala_larum': { nom: 'Ala Lārum', acc: 'in Ālam Lārum', search: 'alam larum', stem: 'alam', aliases: ['larum'] },
    'ala_hermae': { nom: 'Ala Hermae', acc: 'in Ālam Hermae', search: 'alam hermae', stem: 'alam', aliases: ['hermae'] },
    'via_west': { nom: 'Via', acc: 'in Viam', search: 'viam', stem: 'via' },
    'via_east': { nom: 'Via', acc: 'in Viam', search: 'viam', stem: 'via' },
    'taberna': { nom: 'Taberna', acc: 'in Tabernam', search: 'tabernam', stem: 'tabern' },
    'fauces': { nom: 'Fauces', acc: 'in Faucēs', search: 'fauces', stem: 'fauc' }, // Note the 3rd declension stem
    'atrium': { nom: 'Atrium', acc: 'in Ātrium', search: 'atrium', stem: 'atri' },
    'tablinum': { nom: 'Tablinum', acc: 'in Tablīnum', search: 'tablinum', stem: 'tablin' },
    'peristylium': { nom: 'Peristylium', acc: 'in Peristȳlium', search: 'peristylium', stem: 'peristyli' },
    'triclinium': { nom: 'Triclinium', acc: 'in Triclīnium', search: 'triclinium', stem: 'triclini' },
    'culina': { nom: 'Culina', acc: 'in Culīnam', search: 'culinam', stem: 'culin' },
    'cella': { nom: 'Cella', acc: 'in Cellam', search: 'cellam', stem: 'cell' },
};

const VOCAB = {
    CORE: new Set(['a', 'ab', 'videt', 'iam', 'ridet', 'fuit', 'vult', 'voluit', 'oculi', 'sentit', 'claudit', 'clare', 'surgit', 'mensa', 'iterum', 'aperit', 'perpetua', 'fere', 'mortalis', 'sitne', 'erat', 'erant', 'ubique', 'vidistine', 'nox', 'domi', 'subito', 'aliquid', 'audit', 'putat', 'parentes', 'varia', 'dei', 'venite', 'domus', 'imus', 'paro', 'via', 'apud', 'dominus', 'aqua', 'exspectat', 'discetis', 'spectate', 'servus', 'divites', 'intremus', 'hospites', 'laborat', 'dormit', 'dormio', 'mecum', 'sunt', 'est', 'in', 'non', 'hoc', 'sed', 'magna', 'ex', 'facere', 'habet', 'animus', 'multi', 'bona', 'bene', 'neque', 'urbs', 'ubi', 'caelum', 'ita', 'vero', 'nomen', 'minime', 'saepe', 'semper', 'noctua']),
    OUTER: { 'affectus': 'affected', 'murmure': 'by the murmur', 'putat': 'thinks', 'esse': 'to be', 'sentire': 'to feel/sense', 'ianuam': 'door', 'caute': 'cautiously', 'tranquille': 'calmly', 'oculos': 'eyes', 'aperiunt': 'they open', 'ianuae': 'doors', 'aperta': 'open', 'apertam': 'open', 'apertum': 'open', 'armarium': 'closet', 'aperuerunt': 'they opened', 'armario': 'closet', 'inspicere': 'to inspect', 'atrio': 'atrium', 'investigat': 'investigates', 'inspectum': 'inspected', 'attat': 'Ah ha!', 'parentum': 'of the parents', 'parentes': 'parents', 'sonum': 'sound', 'murmur': 'murmur', 'cautus': 'cautious', 'romanus': 'Roman', 'clare': 'clearly', 'clarum': 'clear', 'claudit': 'closes', 'claudunt': 'they close', 'clausa': 'closed', 'clauserunt': 'they shut', 'clausis': 'closed', 'clausum': 'closed', 'coram': 'in the presence of', 'phantasmate': 'ghost', 'monstro': 'monster', 'cubiculi': 'of the bedroom', 'cubiculo': 'bedroom', 'culina': 'kitchen', 'culinam': 'kitchen', 'curiosum': 'curious', 'curiosus': 'curious', 'domi': 'at home', 'domus': 'house', 'dormiebam': 'I was sleeping', 'dormio': 'I sleep', 'dormire': 'to sleep', 'dormiturus': 'about to sleep', 'eram': 'I was', 'eramus': 'we were', 'erant': 'they were', 'erantne': 'were they?', 'erat': 'was', 'estne': 'is it?', 'et': 'and', 'evidentia': 'evidence', 'evidentiam': 'evidence', 'fere': 'almost', 'figurae': 'figures', 'figura': 'figure', 'figuram': 'figure', 'fui': 'I was', 'fuisse': 'to have been', 'fuit': 'it was', 'habebant': 'they had', 'habeo': 'I have', 'habesne': 'do you have?', 'habet': 'has', 'nauseam': 'nausea', 'insomniam': 'insomnia', 'horrifici': 'horrific', 'horrificissimum': 'very horrific', 'horrificissimus': 'very horrific', 'horrificos': 'horrific', 'horrificum': 'horrific', 'horrificus': 'horrific', 'horrorem': 'horror!', 'iam': 'now', 'ianua': 'door', 'immobiles': 'immobile', 'immobilis': 'immobile', 'quintus': 'Quintus', 'in': 'in', 'habere': 'to have', 'inspectum': 'inspected', 'inspiciens': 'inspecting', 'inspicit': 'inspects', 'investigans': 'investigating', 'investigare': 'to investigate', 'iterum': 'again', 'lecti': 'couches', 'lectis': 'couches', 'lectos': 'couches', 'lectum': 'couch', 'macte': 'well done!', 'mensa': 'table', 'mensam': 'table', 'monstra': 'monsters', 'monstrorum': 'of monsters', 'monstrum': 'monster', 'mortale': 'mortal', 'mortales': 'mortal', 'murmure': 'by a murmur', 'naturale': 'natural', 'naturales': 'natural', 'naturalis': 'natural', 'nocte': 'at night', 'noctem': 'night', 'non': 'not', 'nox': 'night', 'obscura': 'dark', 'obscuram': 'dark', 'obscuro': 'dark', 'obscuros': 'dark', 'obscurum': 'dark', 'oculis': 'eyes', 'peristylo': 'peristyle', 'peristylium': 'peristyle', 'perpetua': 'perpetual', 'perpetuam': 'perpetual', 'perterriti': 'terrified', 'perterritissimus': 'very terrified', 'perterritus': 'terrified', 'perturbate': 'pertubedly', 'perturbatissimus': 'very perturbed', 'perturbatus': 'perturbed', 'phantasmata': 'ghosts', 'phantasmatis': 'of a ghost', 'phantasmatum': 'of ghosts', 'putabam': 'I thought', 'putavit': 'thought', 'quinti': 'of Quintus', 'quinto': 'Quintus', 'reale': 'real', 'realem': 'real', 'reales': 'real', 'realia': 'real', 'realis': 'real', 'rident': 'they laugh', 'ridet': 'laughs', 'romae': 'in Rome', 'romani': 'Romans', 'sed': 'but', 'sentiens': 'sensing', 'sentit': 'senses', 'silentium': 'silence', 'sintne': 'could they be?', 'sitne': 'could it be?', 'soni': 'sounds', 'sonos': 'sounds', 'sonus': 'sound', 'stomachus': 'stomach', 'subito': 'suddenly!', 'sunt': 'they are', 'surgit': 'rises', 'surgunt': 'they rise', 'surrecta': 'was lifted up', 'surrecti': 'were lifted up', 'surrectis': 'lifted up', 'tablino': 'study', 'tablinum': 'study', 'tranquilla': 'tranquil', 'tranquillum': 'tranquil', 'tranquillus': 'tranquil', 'trinclinio': 'dining room', 'trinclinium': 'dining room', 'ubique': 'everywhere', 'videre': 'to see', 'videt': 'sees', 'vidistine': 'have you seen?', 'voluit': 'wanted', 'tres': 'three', 'parva': 'small' },
    NOVUM: { 'amphorae': {lemma: 'amphora, -ae, f.', def: 'jar, amphora'}, 'columnae': {lemma: 'columna, -ae, f.', def: 'column, pillar'},'focus': {lemma: 'focus, -ī, m.', def: 'hearth, stove'},'hortus': {lemma: 'hortus, -ī, m.', def: 'garden'},'imāginēs': {lemma: 'imago, imaginis, f.', def: 'ancestral mask'},'murī': {lemma: 'murus, -ī, m.', def: 'wall'},'murīs': {lemma: 'murus, -ī, m.', def: 'wall'},'quoque': {lemma: 'quoque (adv.)', def: 'also, too'},'rēs': {lemma: 'rēs, reī, f.', def: 'thing, object'},'rubrī': {lemma: 'ruber, rubra, rubrum', def: 'red'},'lectus': {lemma: 'lectus, -ī, m.', def: 'bed, couch'},'lectī': {lemma: 'lectus, -ī, m.', def: 'bed, couch'},'tuum': {lemma: 'tuus, -a, -um', def: 'your'},'tuus': {lemma: 'tuus, -a, -um', def: 'your'},'patris': {lemma: 'pater, patris, m.', def: 'of the father'},'mātris': {lemma: 'mater, matris, f.', def: 'of the mother'},'sorōris': {lemma: 'soror, sororis, f.', def: 'of the sister'},'tuae': {lemma: 'tuus, -a, -um', def: 'your'},'herma': {lemma: 'herma, -ae, f.', def: 'herm, bust'},'avī': {lemma: 'avus, -ī, m.', def: 'of the grandfather'},'lārum': {lemma: 'lares, -ium, m.pl.', def: 'of the Lares (household gods)'}, }
};

const DIRECTION_ROTATIONS = { 'north': 0, 'south': 180, 'east': 90, 'west': 270, 'northeast': 45, 'northwest': 315, 'southeast': 135, 'southwest': 225 };
const ANGLE_TO_DIRECTION = { 0: 'north', 45: 'northeast', 90: 'east', 135: 'southeast', 180: 'south', 225: 'southwest', 270: 'west', 315: 'northwest' };
const sleep = (ms) => new Promise(res => setTimeout(res, ms));
const removeDiacritics = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// =============================================================================
// ### 2. GAME STATE
// =============================================================================
const gameState = { currentRoom: 'cubiculum_tuum', playerFacing: 270, currentVisualRotation: -270, visitedRooms: new Set(['cubiculum_tuum']), panOffset: { x: 0, y: 0 }, isDragging: false, dragStart: { x: 0, y: 0 }, isPlayerActionLocked: false, inputHistory: [], historyIndex: -1, clarificationState: null, };
const mapSettings = { GRID_SIZE: 150, ROOM_WIDTH: 100, ROOM_HEIGHT: 60 };
let elements = {};
let mapGroup;
const SVG_NS = "http://www.w3.org/2000/svg";

// =============================================================================
// ### 3. INITIALIZATION
// =============================================================================
// This block of code runs after the HTML is fully loaded.
// It finds all the necessary elements and sets up the game.

const initializers = () => {
    // Find and store references to all the elements that are already in the HTML.
    elements = { 
        gameLog: document.getElementById('game-log'), 
        feedback: document.getElementById('feedback'), 
        commandForm: document.getElementById('command-form'), 
        commandInput: document.getElementById('command-input'), 
        mapViewport: document.getElementById('map-viewport'), 
        mapSvg: document.getElementById('map-svg'),
        // Note: playerMarker is NOT here yet.
    };

    // **THE FIX**: This sequence is crucial.
    // 1. Create all the dynamic SVG elements, INCLUDING the player marker.
    setupMap();
    
    // 2. NOW that the player marker has been created, we can safely find it.

    // 3. With all elements found and stored, we can run the rest of the setup.
    setupMapInteraction();
    render(false);
    elements.commandInput.focus();

    // Handle command submission when the player presses Enter.
    elements.commandForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const command = elements.commandInput.value;
        if (command) {
            processInput(command);
        }
        elements.commandInput.value = '';
    });

    // Handle command history navigation with arrow keys.
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
};

document.addEventListener('DOMContentLoaded', initializers);

// =============================================================================
// ### 4. CORE GAME LOGIC
// =============================================================================
// REPLACE THE ENTIRE "CORE GAME LOGIC" SECTION WITH THIS BLOCK
// REPLACE THE ENTIRE "CORE GAME LOGIC" SECTION WITH THIS BLOCK.

// =============================================================================
// ### 4. CORE GAME LOGIC
// =============================================================================
const opposite = { 'north': 'south', 'south': 'north', 'east': 'west', 'west': 'east', 'northwest': 'southeast', 'southeast': 'northwest', 'northeast': 'southwest', 'southwest': 'northeast' };

/**
 * The main entry point for player input. It orchestrates parsing, logging, and execution.
 */
async function processInput(command) {
    if (gameState.isPlayerActionLocked) return;
    gameState.isPlayerActionLocked = true;
    elements.commandInput.disabled = true;

    logCommand(command);
    gameState.inputHistory.unshift(command);
    gameState.historyIndex = -1;

    try {
        // The parser returns a plan of action.
        const action = parseCommand(command);

        // If the parser determined a recast is needed, log it and wait.
        if (action.needsRecast) {
            logRecast(action.recast);
            await sleep(500);
        }

        // Execute the action determined by the parser.
        if (action.type === 'move') {
            await performMove(action.direction);
        } else if (action.type === 'clarify') {
            askClarification(action.prompt, action.options);
        } else {
            setFeedback(action.feedback || "Nōn intellegō verba tua.");
        }
    } finally {
        // This block always runs, ensuring the input is re-enabled.
        if (!gameState.clarificationState) {
            gameState.isPlayerActionLocked = false;
            elements.commandInput.disabled = false;
            elements.commandInput.focus();
        }
    }
}

/**
 * The parser's brain. It analyzes a command string and returns an "action object"
 * describing what the game should do.
 */
function parseCommand(command) {
    const normalizedCommand = removeDiacritics(command.toLowerCase().trim());
    
    // --- 1. Handle Clarification Response ---
    if (gameState.clarificationState) {
        for (const key in gameState.clarificationState.options) {
            if (normalizedCommand.includes(key)) {
                const targetRoomId = gameState.clarificationState.options[key];
                for (const dir in rooms[gameState.currentRoom].exits) {
                    if (rooms[gameState.currentRoom].exits[dir] === targetRoomId) {
                        gameState.clarificationState = null;
                        return { type: 'move', direction: dir, needsRecast: false };
                    }
                }
            }
        }
        return { type: 'feedback', feedback: `Nōn intellegō. ${gameState.clarificationState.prompt}` };
    }

    // --- 2. Check for Ambiguity ---
    if (gameState.currentRoom === 'atrium' && normalizedCommand.includes('cubicul')) {
        return { type: 'clarify', prompt: "Utrum cubiculum?", options: { 'sororis': 'cubiculum_sororis', 'matris': 'cubiculum_matris_et_patris' } };
    }
    if (gameState.currentRoom === 'atrium' && normalizedCommand.includes('ala')) {
        return { type: 'clarify', prompt: "Utram ālam?", options: { 'larum': 'ala_larum', 'hermae': 'ala_hermae' } };
    }

    // --- 3. Parse for Action (Verb + Noun or Direction) ---
    let foundVerb = null;
    for (const key in VERBS) {
        const verbData = VERBS[key];
        if (verbData.stems.some(s => normalizedCommand.includes(s)) || verbData.infinitives.some(i => normalizedCommand.includes(i))) {
            foundVerb = verbData.first_person;
            break;
        }
    }

    // A. Check for Landmark Navigation
    for (const roomId in ROOM_NAMES) {
        const roomData = ROOM_NAMES[roomId];
        const searchTerms = [roomData.stem, ...(roomData.aliases || [])];
        for (const term of searchTerms) {
            if (normalizedCommand.includes(term)) {
                for (const dir in rooms[gameState.currentRoom].exits) {
                    if (rooms[gameState.currentRoom].exits[dir] === roomId) {
                        const verbForRecast = foundVerb || 'eō';
                        const needsRecast = !normalizedCommand.includes(roomData.search) || !normalizedCommand.includes(verbForRecast);
                        const ending = roomData.acc.split(' ').pop();
                        const highlightedAcc = roomData.acc.replace(ending, `<span class="recast-ending">${ending}</span>`);
                        return { type: 'move', direction: dir, needsRecast: needsRecast, recast: `${verbForRecast} ${highlightedAcc}` };
                    }
                }
            }
        }
    }

    // B. Check for Directional Navigation
    const currentFacing = ANGLE_TO_DIRECTION[gameState.playerFacing];
    const rursusDir = opposite[currentFacing];
    const dexteramDir = ANGLE_TO_DIRECTION[(gameState.playerFacing + 90) % 360];
    const sinistramDir = ANGLE_TO_DIRECTION[(gameState.playerFacing + 270) % 360];
    const hasProrsus = normalizedCommand.includes('prorsus');
    const hasRursus = normalizedCommand.includes('rursus');
    const hasDexteram = normalizedCommand.includes('dexteram');
    const hasSinistram = normalizedCommand.includes('sinistram');

    let moveDirection = null;
    let moveCommand = null;
    
    if ((hasProrsus || hasRursus) && (hasDexteram || hasSinistram)) {
        const primary = hasProrsus ? currentFacing : rursusDir;
        const secondary = hasDexteram ? dexteramDir : sinistramDir;
        moveDirection = (primary.startsWith('north') || primary.startsWith('south')) ? (primary + secondary) : (secondary + primary);
        moveCommand = `${hasProrsus ? 'prōrsus' : 'rūrsus'} et ${hasDexteram ? 'ad dexteram' : 'ad sinistram'}`;
    }
    else if (hasProrsus) { moveDirection = currentFacing; moveCommand = 'prōrsus'; } 
    else if (hasRursus) { moveDirection = rursusDir; moveCommand = 'rūrsus'; } 
    else if (hasDexteram) { moveDirection = dexteramDir; moveCommand = 'ad dexteram'; } 
    else if (hasSinistram) { moveDirection = sinistramDir; moveCommand = 'ad sinistram'; }

    if (moveDirection) {
        const verbForRecast = foundVerb || 'eō';
        const needsRecast = !normalizedCommand.includes(verbForRecast) || !normalizedCommand.includes(moveCommand.split(' ')[0]);
        return { type: 'move', direction: moveDirection, needsRecast: needsRecast, recast: `${verbForRecast} ${moveCommand}` };
    }
    
    return { type: 'feedback' };
}

/**
 * Executes the move action, updating the game state.
 */
async function performMove(moveDirection) {
    const nextRoomId = rooms[gameState.currentRoom].exits[moveDirection];
    if (nextRoomId) {
        const previousRoomId = gameState.currentRoom;
        
        gameState.currentRoom = nextRoomId;
        gameState.visitedRooms.add(nextRoomId);
        gameState.panOffset = { x: 0, y: 0 };
        gameState.playerFacing = DIRECTION_ROTATIONS[moveDirection];

        if ((previousRoomId === 'ala_larum' || previousRoomId === 'ala_hermae') && nextRoomId === 'atrium') {
            gameState.playerFacing = 0;
        }

        await render(true); 
        setFeedback("");
    } else {
        setFeedback("Nōn potes illāc īre.");
    }
}

function askClarification(prompt, options) {
    gameState.clarificationState = { prompt, options };
    let optionsString = Object.values(options).map(id => `&nbsp;&nbsp;- ${ROOM_NAMES[id].nom}`).join('<br>');
    setFeedback(`${prompt}<br>${optionsString}`);
}

function setFeedback(message) {
    elements.feedback.innerHTML = message;
}

function generateExitsString() {
    const directions = [ { name: 'prōrsus', angle: 0 }, { name: 'rūrsus', angle: 180 }, { name: 'ad dexteram', angle: 90 }, { name: 'ad sinistram', angle: 270 }, { name: 'prōrsus et ad dexteram', angle: 45 }, { name: 'prōrsus et ad sinistram', angle: 315 }, { name: 'rūrsus et ad dexteram', angle: 135 }, { name: 'rūrsus et ad sinistram', angle: 225 } ];
    const knownExits = [];
    const unknownExits = new Set();
    const currentExits = rooms[gameState.currentRoom].exits;
    for (const dir of directions) {
        const targetAngle = (gameState.playerFacing + dir.angle + 360) % 360;
        const targetDir = ANGLE_TO_DIRECTION[targetAngle];
        const targetRoomId = currentExits[targetDir];
        if (targetRoomId) {
            if (gameState.visitedRooms.has(targetRoomId)) {
                knownExits.push(`<strong>${dir.name}</strong> ${ROOM_NAMES[targetRoomId].acc}`);
            } else {
                unknownExits.add(`<strong>${dir.name}</strong>`);
            }
        }
    }
    if (knownExits.length === 0 && unknownExits.size === 0) return "";
    let html = "";
    if (unknownExits.size > 0) {
        html += `Potes īre: ${[...unknownExits].join(', ')}.<br>`;
    }
    if (knownExits.length > 0) {
        if (unknownExits.size > 0) html += `Etiam potes īre:<br>`;
        else html += `Potes īre:<br>`;
        knownExits.forEach(exit => { html += `&nbsp;&nbsp;${exit}<br>`; });
    }
    return html;
}
// =============================================================================
// ### 5. MAP AND RENDERING LOGIC
// =============================================================================

function setupMap() {
    mapGroup = document.createElementNS(SVG_NS, 'g');
    elements.mapSvg.appendChild(mapGroup);
    for (const roomId in rooms) { const room = rooms[roomId]; const roomGroup = document.createElementNS(SVG_NS, 'g'); roomGroup.id = `map-room-${roomId}`; roomGroup.classList.add('map-room'); const rect = document.createElementNS(SVG_NS, 'rect'); const label = document.createElementNS(SVG_NS, 'text'); label.classList.add('room-label'); const nameParts = room.name.replace(/[()]/g, '').split(' '); nameParts.forEach((part, index) => { const tspan = document.createElementNS(SVG_NS, 'tspan'); tspan.textContent = part; tspan.setAttribute('x', 0); tspan.setAttribute('dy', `${index * 1.2}em`); label.appendChild(tspan); }); roomGroup.appendChild(rect); roomGroup.appendChild(label); mapGroup.appendChild(roomGroup); }
}
function setupMapInteraction() { elements.mapViewport.addEventListener('mousedown', (e) => { gameState.isDragging = true; elements.mapViewport.style.cursor = 'grabbing'; gameState.dragStart.x = e.clientX - gameState.panOffset.x; gameState.dragStart.y = e.clientY - gameState.panOffset.y; }); window.addEventListener('mousemove', (e) => { if (!gameState.isDragging) return; gameState.panOffset.x = e.clientX - gameState.dragStart.x; gameState.panOffset.y = e.clientY - gameState.dragStart.y; applyMapTransform(false); }); window.addEventListener('mouseup', () => { gameState.isDragging = false; elements.mapViewport.style.cursor = 'grab'; }); }
async function applyMapTransform(animated = false) { if (!mapGroup) return; const targetVisualRotation = -gameState.playerFacing; let delta = targetVisualRotation - gameState.currentVisualRotation; if (delta > 180) delta -= 360; else if (delta < -180) delta += 360; const nextVisualRotation = gameState.currentVisualRotation + delta; const isLongTurn = Math.abs(delta) > 90; const animate = (rotation, scale) => { return new Promise(resolve => { const transitionDuration = animated ? 0.3 : 0; mapGroup.style.transition = `transform ${transitionDuration}s ease-in-out`; const playerRoom = rooms[gameState.currentRoom]; const px = playerRoom.x * mapSettings.GRID_SIZE; const py = playerRoom.y * mapSettings.GRID_SIZE; const viewbox = elements.mapViewport.getBoundingClientRect(); const centerX = viewbox.width / 2; const centerY = viewbox.height / 2; const pan = `translate(${gameState.panOffset.x}, ${gameState.panOffset.y})`; const recenter = `translate(${centerX}, ${centerY})`; const rot = `rotate(${rotation})`; const scaling = `scale(${scale})`; const centerOnPlayer = `translate(${-px}, ${-py})`; mapGroup.setAttribute('transform', `${pan} ${recenter} ${rot} ${scaling} ${centerOnPlayer}`); setTimeout(resolve, transitionDuration * 1000); }); }; if (animated && isLongTurn) { await animate(gameState.currentVisualRotation, 0.7); await sleep(100); await animate(nextVisualRotation, 0.7); await sleep(300); await animate(nextVisualRotation, 1.0); } else { await animate(nextVisualRotation, 1.0); } gameState.currentVisualRotation = nextVisualRotation; }
// REPLACE your old updateMapGraphics function with this one.

// REPLACE your old updateMapGraphics function with this one.

function updateMapGraphics() {
    const { GRID_SIZE, ROOM_WIDTH, ROOM_HEIGHT } = mapSettings;

    // (The logic for drawing connection lines is unchanged and correct)
    const oldConnections = mapGroup.querySelectorAll('.map-connection');
    oldConnections.forEach(conn => conn.remove());
    for (const roomId in rooms) { if (gameState.visitedRooms.has(roomId)) { const room = rooms[roomId]; for (const dir in room.exits) { const targetRoomId = room.exits[dir]; if (targetRoomId && rooms[targetRoomId]) { const targetRoom = rooms[targetRoomId]; if (gameState.visitedRooms.has(targetRoomId)) { if (roomId < targetRoomId) { const line = document.createElementNS(SVG_NS, 'line'); line.setAttribute('x1', room.x * GRID_SIZE); line.setAttribute('y1', room.y * GRID_SIZE); line.setAttribute('x2', targetRoom.x * GRID_SIZE); line.setAttribute('y2', targetRoom.y * GRID_SIZE); line.setAttribute('class', 'map-connection'); mapGroup.prepend(line); } } else if (roomId === gameState.currentRoom) { const line = document.createElementNS(SVG_NS, 'line'); line.setAttribute('x1', room.x * GRID_SIZE); line.setAttribute('y1', room.y * GRID_SIZE); line.setAttribute('x2', (room.x + targetRoom.x) / 2 * GRID_SIZE); line.setAttribute('y2', (room.y + targetRoom.y) / 2 * GRID_SIZE); line.setAttribute('class', 'map-connection'); mapGroup.prepend(line); } } } } }

    // --- THE FIX: TEXT ROTATION LOGIC NOW PREDICTS THE FINAL ROTATION ---
    // 1. Calculate the final rotation angle the map WILL HAVE after the turn.
    const targetVisualRotation = -gameState.playerFacing;
    let delta = targetVisualRotation - gameState.currentVisualRotation;
    if (delta > 180) delta -= 360;
    else if (delta < -180) delta += 360;
    const nextVisualRotation = gameState.currentVisualRotation + delta;
    
    // 2. Normalize this future angle to be between 0 and 359.
    const normalizedNextAngle = (nextVisualRotation % 360 + 360) % 360;
    const isUpsideDown = normalizedNextAngle > 90 && normalizedNextAngle < 270;
    // --- END OF FIX PREDICTION LOGIC ---

    // Update styles and positions for all rooms
    for (const roomId in rooms) {
        const room = rooms[roomId];
        const roomGroup = document.getElementById(`map-room-${roomId}`);
        const rect = roomGroup.querySelector('rect');
        const label = roomGroup.querySelector('text');

        roomGroup.setAttribute('transform', `translate(${room.x * GRID_SIZE}, ${room.y * GRID_SIZE})`);
        rect.setAttribute('x', -ROOM_WIDTH / 2); rect.setAttribute('y', -ROOM_HEIGHT / 2);
        rect.setAttribute('width', ROOM_WIDTH); rect.setAttribute('height', ROOM_HEIGHT);
        label.setAttribute('dy', `-${(label.children.length - 1) * 0.5}em`);

        // 3. Apply the 180-degree flip to the text based on the PREDICTED orientation.
        if (isUpsideDown) {
            label.setAttribute('transform', 'rotate(180)');
        } else {
            label.removeAttribute('transform');
        }

        roomGroup.classList.remove('current', 'hidden');
        label.classList.remove('current');
        if (roomId === gameState.currentRoom) {
            roomGroup.classList.add('current');
            label.classList.add('current');
        } else if (!gameState.visitedRooms.has(roomId)) {
            roomGroup.classList.add('hidden');
        }
    }

    // Update the player marker (decoupled and correct)
    const playerMarker = elements.playerMarker;
    const viewbox = elements.mapViewport.getBoundingClientRect();
    if (viewbox.width > 0 && playerMarker) {
        const centerX = viewbox.width / 2;
        const centerY = viewbox.height / 2;
        playerMarker.setAttribute('transform', `translate(${centerX}, ${centerY}) rotate(${gameState.playerFacing})`);
    }
}

// =============================================================================
// ### 6. RENDERING AND LOGGING
// =============================================================================
// REPLACE the entire "RENDERING AND LOGGING" section at the end of your file with this block.

// =============================================================================
// ### 6. RENDERING AND LOGGING
// =============================================================================

/**
 * The main render function. It is now ASYNCHRONOUS to allow it to wait for
 * the map animation to complete before finishing. It orchestrates all visual updates.
 */
async function render(animated = true) {
    // **THE FIX**: This line was missing. It ensures the room description is always logged.
    logRoom(); 
    
    updateMapGraphics();
    await applyMapTransform(animated);
}

/**
 * Appends the player's raw command to the game log.
 */
function logCommand(command) {
    const log = elements.gameLog;
    const entry = document.createElement('div');
    entry.className = 'log-command';
    entry.innerHTML = `> ${command}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

/**
 * Appends a recast, grammatically correct version of the player's command to the log.
 */
function logRecast(recastHtml) {
    const log = elements.gameLog;
    const entry = document.createElement('div');
    entry.className = 'log-recast';
    entry.innerHTML = `> ${recastHtml}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

/**
 * Appends the current room's title, description, and exits to the game log.
 * Handles the special case of the very first render.
 */
function logRoom() {
    const log = elements.gameLog;
    const room = rooms[gameState.currentRoom];
    
    // On the very first load, this function is called once to clear the log
    // and show the starting room. We can detect this because the log is empty.
    if (!log.hasChildNodes()) {
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
}

/**
 * Parses a string of text and wraps known vocabulary words in HTML for tooltips.
 */
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