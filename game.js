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
    'tablinum': { x: 1, y: 2, name: 'Tablinum', desc: 'Hoc est tablinum. Dominus saepe hic labōrat. Magna mēnsa in tablinō est.', exits: { north: 'atrium', south: 'peristylium' } },
    'peristylium': { x: 1, y: 3, name: 'Peristylium', desc: 'Hoc est peristylium. In peristyliō est hortus magnus. Multae columnae sunt.', exits: { north: 'tablinum', south: 'triclinium', east: 'cubiculum_tuum', west: 'culina' } },
    'cubiculum_tuum': { x: 2, y: 3, name: 'Cubiculum Tuum', desc: 'Hoc est cubiculum tuum. Lectus tuus est prope.', exits: { west: 'peristylium' } },
    'triclinium': { x: 1, y: 4, name: 'Triclinium', desc: 'Hoc est triclīnium. Trēs lectī et mēnsa parva in triclīniō sunt. Figūrae in murīs sunt.', exits: { north: 'peristylium' } },
    'culina': { x: 0, y: 3, name: 'Culina', desc: 'Hic est culīna. In culinā est aqua et focus. Latrīna in culinā est.', exits: { east: 'peristylium', west: 'cella' } },
    'cella': { x: -1, y: 3, name: 'Cella', desc: 'Hic est cella. Multae amphorae in cellā sunt.', exits: { east: 'culina' } }
};

const VERBS = {
    'move': { first_person: 'eō', stems: ['i', 'e'], infinitives: ['ire'] },
    'walk': { first_person: 'ambulō', stems: ['ambul'], infinitives: ['ambulare'] }
};

const ROOM_NAMES = {
    'cubiculum_tuum': { nom: 'Cubiculum Tuum', acc: ['in', 'Cubiculum', 'Tuum'], stems: ['cubicul'], aliases: ['meum', 'tuum'] },
    'cubiculum_sororis': { nom: 'Cubiculum Sorōris', acc: ['in', 'Cubiculum', 'Sorōris'], stems: ['cubicul'], aliases: ['sororis'] },
    'cubiculum_parentum': { nom: 'Cubiculum Parentum', acc: ['in', 'Cubiculum', 'Parentum'], stems: ['cubicul'], aliases: ['parentum'] },
    'ala_larum': { nom: 'Ala Lārum', acc: ['in', 'Ālam', 'Lārum'], stems: ['ala'], aliases: ['larum'] },
    'ala_hermae': { nom: 'Ala Hermae', acc: ['in', 'Ālam', 'Hermae'], stems: ['ala'], aliases: ['hermae'] },
    'via_west': { nom: 'Via', acc: ['in', 'Viam'], stems: ['via'] }, 'via_east': { nom: 'Via', acc: ['in', 'Viam'], stems: ['via'] }, 'taberna': { nom: 'Taberna', acc: ['in', 'Tabernam'], stems: ['tabern'] }, 'fauces': { nom: 'Fauces', acc: ['in', 'Faucēs'], stems: ['fauc'] }, 'atrium': { nom: 'Atrium', acc: ['in', 'Ātrium'], stems: ['atri'] }, 'tablinum': { nom: 'Tablinum', acc: ['in', 'Tablīnum'], stems: ['tablin'] }, 'peristylium': { nom: 'Peristylium', acc: ['in', 'Peristȳlium'], stems: ['peristyli'] }, 'triclinium': { nom: 'Triclinium', acc: ['in', 'Triclīnium'], stems: ['triclini'] }, 'culina': { nom: 'Culina', acc: ['in', 'Culīnam'], stems: ['culin'] }, 'cella': { nom: 'Cella', acc: ['in', 'Cellam'], stems: ['cell'] },
    'cubiculum_generic': { stems: ['cubicul'] }, 'ala_generic': { stems: ['ala'] },
};

const VOCAB = { CORE: new Set(['a', 'ab', 'videt', 'iam', 'ridet', 'fuit', 'vult', 'voluit', 'oculi', 'sentit', 'claudit', 'clare', 'surgit', 'mensa', 'iterum', 'aperit', 'perpetua', 'fere', 'mortalis', 'sitne', 'erat', 'erant', 'ubique', 'vidistine', 'nox', 'domi', 'subito', 'aliquid', 'audit', 'putat', 'parentes', 'varia', 'dei', 'venite', 'domus', 'imus', 'paro', 'via', 'apud', 'dominus', 'aqua', 'exspectat', 'discetis', 'spectate', 'servus', 'divites', 'intremus', 'hospites', 'laborat', 'dormit', 'dormio', 'mecum', 'sunt', 'est', 'in', 'non', 'hoc', 'sed', 'magna', 'ex', 'facere', 'habet', 'animus', 'multi', 'bona', 'bene', 'neque', 'urbs', 'ubi', 'caelum', 'ita', 'vero', 'nomen', 'minime', 'saepe', 'semper', 'noctua']), OUTER: { 'affectus': 'affected', 'murmure': 'by the murmur', 'putat': 'thinks', 'esse': 'to be', 'sentire': 'to feel/sense', 'ianuam': 'door', 'caute': 'cautiously', 'tranquille': 'calmly', 'oculos': 'eyes', 'aperiunt': 'they open', 'ianuae': 'doors', 'aperta': 'open', 'apertam': 'open', 'apertum': 'open', 'armarium': 'closet', 'aperuerunt': 'they opened', 'armario': 'closet', 'inspicere': 'to inspect', 'atrio': 'atrium', 'investigat': 'investigates', 'inspectum': 'inspected', 'attat': 'Ah ha!', 'parentum': 'of the parents', 'parentes': 'parents', 'sonum': 'sound', 'murmur': 'murmur', 'cautus': 'cautious', 'romanus': 'Roman', 'clare': 'clearly', 'clarum': 'clear', 'claudit': 'closes', 'claudunt': 'they close', 'clausa': 'closed', 'clauserunt': 'they shut', 'clausis': 'closed', 'clausum': 'closed', 'coram': 'in the presence of', 'phantasmate': 'ghost', 'monstro': 'monster', 'cubiculi': 'of the bedroom', 'cubiculo': 'bedroom', 'culina': 'kitchen', 'culinam': 'kitchen', 'curiosum': 'curious', 'curiosus': 'curious', 'domi': 'at home', 'domus': 'house', 'dormiebam': 'I was sleeping', 'dormio': 'I sleep', 'dormire': 'to sleep', 'dormiturus': 'about to sleep', 'eram': 'I was', 'eramus': 'we were', 'erant': 'they were', 'erantne': 'were they?', 'erat': 'was', 'estne': 'is it?', 'et': 'and', 'evidentia': 'evidence', 'evidentiam': 'evidence', 'fere': 'almost', 'figurae': 'figures', 'figura': 'figure', 'figuram': 'figure', 'fui': 'I was', 'fuisse': 'to have been', 'fuit': 'it was', 'habebant': 'they had', 'habeo': 'I have', 'habesne': 'do you have?', 'habet': 'has', 'nauseam': 'nausea', 'insomniam': 'insomnia', 'horrifici': 'horrific', 'horrificissimum': 'very horrific', 'horrificissimus': 'very horrific', 'horrificos': 'horrific', 'horrificum': 'horrific', 'horrificus': 'horrific', 'horrorem': 'horror!', 'iam': 'now', 'ianua': 'door', 'immobiles': 'immobile', 'immobilis': 'immobile', 'quintus': 'Quintus', 'in': 'in', 'habere': 'to have', 'inspectum': 'inspected', 'inspiciens': 'inspecting', 'inspicit': 'inspects', 'investigans': 'investigating', 'investigare': 'to investigate', 'iterum': 'again', 'lecti': 'couches', 'lectis': 'couches', 'lectos': 'couches', 'lectum': 'couch', 'macte': 'well done!', 'mensa': 'table', 'mensam': 'table', 'monstra': 'monsters', 'monstrorum': 'of monsters', 'monstrum': 'monster', 'mortale': 'mortal', 'mortales': 'mortal', 'murmure': 'by a murmur', 'naturale': 'natural', 'naturales': 'natural', 'naturalis': 'natural', 'nocte': 'at night', 'noctem': 'night', 'non': 'not', 'nox': 'night', 'obscura': 'dark', 'obscuram': 'dark', 'obscuro': 'dark', 'obscuros': 'dark', 'obscurum': 'dark', 'oculis': 'eyes', 'peristylo': 'peristyle', 'peristylium': 'peristyle', 'perpetua': 'perpetual', 'perpetuam': 'perpetual', 'perterriti': 'terrified', 'perterritissimus': 'very terrified', 'perterritus': 'terrified', 'perturbate': 'pertubedly', 'perturbatissimus': 'very perturbed', 'perturbatus': 'perturbed', 'phantasmata': 'ghosts', 'phantasmatis': 'of a ghost', 'phantasmatum': 'of ghosts', 'putabam': 'I thought', 'putavit': 'thought', 'quinti': 'of Quintus', 'quinto': 'Quintus', 'reale': 'real', 'realem': 'real', 'reales': 'real', 'realia': 'real', 'realis': 'real', 'rident': 'they laugh', 'ridet': 'laughs', 'romae': 'in Rome', 'romani': 'Romans', 'sed': 'but', 'sentiens': 'sensing', 'sentit': 'senses', 'silentium': 'silence', 'sintne': 'could they be?', 'sitne': 'could it be?', 'soni': 'sounds', 'sonos': 'sounds', 'sonus': 'sound', 'stomachus': 'stomach', 'subito': 'suddenly!', 'sunt': 'they are', 'surgit': 'rises', 'surgunt': 'they rise', 'surrecta': 'was lifted up', 'surrecti': 'were lifted up', 'surrectis': 'lifted up', 'tablino': 'study', 'tablinum': 'study', 'tranquilla': 'tranquil', 'tranquillum': 'tranquil', 'tranquillus': 'tranquil', 'trinclinio': 'dining room', 'trinclinium': 'dining room', 'ubique': 'everywhere', 'videre': 'to see', 'videt': 'sees', 'vidistine': 'have you seen?', 'voluit': 'wanted', 'tres': 'three', 'parva': 'small' }, NOVUM: { 'amphorae': {lemma: 'amphora, -ae, f.', def: 'jar, amphora'}, 'columnae': {lemma: 'columna, -ae, f.', def: 'column, pillar'},'focus': {lemma: 'focus, -ī, m.', def: 'hearth, stove'},'hortus': {lemma: 'hortus, -ī, m.', def: 'garden'},'imāginēs': {lemma: 'imago, imaginis, f.', def: 'ancestral mask'},'murī': {lemma: 'murus, -ī, m.', def: 'wall'},'murīs': {lemma: 'murus, -ī, m.', def: 'wall'},'quoque': {lemma: 'quoque (adv.)', def: 'also, too'},'rēs': {lemma: 'rēs, reī, f.', def: 'thing, object'},'rubrī': {lemma: 'ruber, rubra, rubrum', def: 'red'},'lectus': {lemma: 'lectus, -ī, m.', def: 'bed, couch'},'lectī': {lemma: 'lectus, -ī, m.', def: 'bed, couch'},'tuum': {lemma: 'tuus, -a, -um', def: 'your'},'tuus': {lemma: 'tuus, -a, -um', def: 'your'},'patris': {lemma: 'pater, patris, m.', def: 'of the father'},'mātris': {lemma: 'mater, matris, f.', def: 'of the mother'},'sorōris': {lemma: 'soror, sororis, f.', def: 'of the sister'},'tuae': {lemma: 'tuus, -a, -um', def: 'your'},'herma': {lemma: 'herma, -ae, f.', def: 'herm, bust'},'avī': {lemma: 'avus, -ī, m.', def: 'of the grandfather'},'lārum': {lemma: 'lares, -ium, m.pl.', def: 'of the Lares (household gods)'}, 'parentum': {lemma: 'parens, parentis, m/f.', def: 'of the parents'} }};
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
// REPLACE your old processInput function with this new, correct version.
// REPLACE your old processInput function with this one.
// REPLACE your old processInput function with this one.

async function processInput(command) {
    if (gameState.isPlayerActionLocked) return;

    // We no longer lock the input here, allowing the clarify path to manage it.
    
    const action = parseCommand(command);

    if (action.needsRecast) {
        logCommand(action.recast, true);
        await sleep(500);
    } else {
        logCommand(command, false);
    }
    
    gameState.inputHistory.unshift(command);
    gameState.historyIndex = -1;

    // Lock the input before performing an action that has an animation.
    gameState.isPlayerActionLocked = true;
    elements.commandInput.disabled = true;

    try {
        if (action.type === 'move') {
            const moveSuccessful = await performMove(action.direction, action.newFacingAngle);
            if (moveSuccessful) {
                logRoom();
            }
        } else if (action.type === 'clarify') {
            askClarification(action.prompt, action.options);
            
            // **THE FIX IS HERE**: We must manually unlock the input after asking a question
            // so the player can respond. We then exit the function.
            gameState.isPlayerActionLocked = false;
            elements.commandInput.disabled = false;
            elements.commandInput.focus();
            return; // Stop processing for this turn.
            
        } else {
            setFeedback(action.feedback || "Nōn intellegō verba tua.");
        }
    } finally {
        // This 'finally' block will now only run for successful moves or simple feedback.
        if (!gameState.clarificationState) {
            gameState.isPlayerActionLocked = false;
            elements.commandInput.disabled = false;
            elements.commandInput.focus();
        }
    }
}

// DELETE the entire old logRecast function. It is no longer needed.

// REPLACE your old logCommand function with this new, simpler version.
function logCommand(commandHtml, isRecast = false) {
    const log = elements.gameLog;
    const entry = document.createElement('div');
    // Set the class based on whether this is a normal command or a recast.
    entry.className = isRecast ? 'log-recast' : 'log-command';
    entry.innerHTML = `> ${commandHtml}`;
    log.appendChild(entry);
    
    // **THE FIX**: We scroll down immediately after adding the content.
    log.scrollTop = log.scrollHeight;
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

function parseCommand(command) {
    const normalizedCommand = removeDiacritics(command.toLowerCase().trim());
    const tokens = normalizedCommand.split(' ').filter(t => t);
    let recognizedTokens = new Set();
    
    // --- 1. Handle Clarification Response (Unchanged) ---
    if (gameState.clarificationState) {
        for (const key in gameState.clarificationState.options) {
            if (normalizedCommand.includes(key)) {
                const targetRoomId = gameState.clarificationState.options[key];
                for (const dir in rooms[gameState.currentRoom].exits) {
                    if (rooms[gameState.currentRoom].exits[dir] === targetRoomId) {
                        gameState.clarificationState = null;
                        return { type: 'move', direction: dir, newFacingAngle: DIRECTION_ROTATIONS[dir], needsRecast: false };
                    }
                }
            }
        }
        return { type: 'feedback', feedback: `Nōn intellegō. ${gameState.clarificationState.prompt}` };
    }

    // --- 2. Check for Ambiguity (Unchanged) ---
    const needsCubiculumClarification = gameState.currentRoom === 'atrium' && normalizedCommand.includes('cubicul') && !normalizedCommand.includes('sororis') && !normalizedCommand.includes('parentum');
    if (needsCubiculumClarification) { return { type: 'clarify', prompt: "Utrum cubiculum?", options: { 'sororis': 'cubiculum_sororis', 'parentum': 'cubiculum_parentum' } }; }
    const needsAlaClarification = gameState.currentRoom === 'atrium' && normalizedCommand.includes('ala') && !normalizedCommand.includes('larum') && !normalizedCommand.includes('hermae');
    if (needsAlaClarification) { return { type: 'clarify', prompt: "Utram ālam?", options: { 'larum': 'ala_larum', 'hermae': 'ala_hermae' } }; }

    // --- 3. Parse for Action (Revised Logic) ---
    const verbInfo = findVerb(normalizedCommand);
    if (verbInfo) recognizedTokens.add(verbInfo.playerWord);

    let landmarkInfo = null;
    let landmarkDir = null;

    // **THE FIX - PART 1: A more intelligent landmark search.**
    // We now find the BEST match, prioritizing aliases over general stems.
    let bestMatch = { score: 0, id: null };
    for (const roomId in ROOM_NAMES) {
        const roomData = ROOM_NAMES[roomId];
        if (!rooms[gameState.currentRoom].exits[Object.keys(rooms[gameState.currentRoom].exits).find(dir => rooms[gameState.currentRoom].exits[dir] === roomId)]) continue;

        let score = 0;
        if (roomData.aliases && roomData.aliases.some(a => normalizedCommand.includes(a))) {
            score += 10; // High score for a specific alias like 'sororis' or 'parentum'
        }
        if (roomData.stems && roomData.stems.some(s => normalizedCommand.includes(s))) {
            score += 1; // Low score for a generic stem like 'cubicul'
        }
        if (score > bestMatch.score) {
            bestMatch = { score, id: roomId };
        }
    }

    if (bestMatch.id) {
        const roomData = ROOM_NAMES[bestMatch.id];
        landmarkInfo = { id: bestMatch.id, data: roomData };
        landmarkDir = Object.keys(rooms[gameState.currentRoom].exits).find(dir => rooms[gameState.currentRoom].exits[dir] === bestMatch.id);
        // Mark all related keywords as recognized
        const allTerms = [...(roomData.stems || []), ...(roomData.aliases || [])];
        tokens.forEach(token => {
            if (allTerms.some(term => token.includes(term))) {
                recognizedTokens.add(token);
            }
        });
    }
    
    const directions = ['prorsus', 'rursus', 'dexteram', 'sinistram'];
    let directionInfo = null;
    for (const d of directions) { if (normalizedCommand.includes(d)) { directionInfo = { key: d }; d.split(' ').forEach(t => recognizedTokens.add(t)); } }
    
    const prepositions = ['in', 'ad'];
    const foundPrep = prepositions.find(p => normalizedCommand.includes(p));
    if (foundPrep) recognizedTokens.add(foundPrep);

    if (landmarkInfo) {
        if (!verbInfo && !foundPrep) return { type: 'feedback', feedback: "Quid vīs facere?" };
        const unknowns = tokens.filter(t => !recognizedTokens.has(t));
        if (unknowns.length > 0) {
            // **THE FIX - PART 2: Use the full nominative name in the error message.**
            const knownWord = landmarkInfo.data.nom.split(' ')[0]; // e.g., "Cubiculum"
            return { type: 'feedback', feedback: `Verbum '${knownWord}' intellegō, sed verbum '${unknowns[0]}' nōn intellegō.` };
        }
        const { recastHtml, needsRecast } = generateRecast(normalizedCommand, landmarkInfo.data, verbInfo, foundPrep);
        return { type: 'move', direction: landmarkDir, newFacingAngle: DIRECTION_ROTATIONS[landmarkDir], needsRecast, recast: recastHtml };
    }

    if (directionInfo) {
        const unknowns = tokens.filter(t => !recognizedTokens.has(t) && !directions.includes(t) && t !== 'et' && t !== 'ad');
        if (unknowns.length > 0) return { type: 'feedback', feedback: `Verbum '${directionInfo.key}' intellegō, sed ${unknowns.length > 1 ? 'verba' : 'verbum'} '${unknowns.join(' ')}' nōn intellegō.` };
        const currentFacing = ANGLE_TO_DIRECTION[gameState.playerFacing];
        const rursusDir = opposite[currentFacing];
        const dexteramDir = ANGLE_TO_DIRECTION[(gameState.playerFacing + 90) % 360];
        const sinistramDir = ANGLE_TO_DIRECTION[(gameState.playerFacing + 270) % 360];
        const hasProrsus = normalizedCommand.includes('prorsus');
        const hasRursus = normalizedCommand.includes('rursus');
        const hasDexteram = normalizedCommand.includes('dexteram');
        const hasSinistram = normalizedCommand.includes('sinistram');
        let moveDirection = null, moveCommand = null, newFacingAngle = gameState.playerFacing;
        
        if ((hasProrsus || hasRursus) && (hasDexteram || hasSinistram)) {
            const primary = hasProrsus ? currentFacing : rursusDir;
            const secondary = hasDexteram ? dexteramDir : sinistramDir;
            moveDirection = (primary.startsWith('north') || primary.startsWith('south')) ? (primary + secondary) : (secondary + primary);
            moveCommand = `${hasProrsus ? 'prōrsus' : 'rūrsus'} et ${hasDexteram ? 'ad dexteram' : 'ad sinistram'}`;
            newFacingAngle = DIRECTION_ROTATIONS[moveDirection];
        }
        else if (hasProrsus) { moveDirection = currentFacing; moveCommand = 'prōrsus'; } 
        else if (hasRursus) { moveDirection = rursusDir; moveCommand = 'rūrsus'; newFacingAngle = (gameState.playerFacing + 180) % 360; } 
        else if (hasDexteram) { moveDirection = dexteramDir; moveCommand = 'ad dexteram'; newFacingAngle = (gameState.playerFacing + 90) % 360; } 
        else if (hasSinistram) { moveDirection = sinistramDir; moveCommand = 'ad sinistram'; newFacingAngle = (gameState.playerFacing + 270) % 360; }

        if (moveDirection) {
            const verbForRecast = verbInfo ? verbInfo.correct : 'eō';
            const needsRecast = !verbInfo || !verbInfo.isCorrect;
            return { type: 'move', direction: moveDirection, newFacingAngle, needsRecast, recast: `${verbForRecast} ${moveCommand}` };
        }
    }
    
    return { type: 'feedback', feedback: "Nōn intellegō verba tua." };
}

function generateRecast(command, roomData, verbInfo, foundPrep) {
    const verbForRecast = verbInfo ? verbInfo.correct : 'eō';
    let needsRecast = false;
    let verbHtml = verbForRecast;
    if (!verbInfo || !verbInfo.isCorrect) {
        needsRecast = true;
        if (verbInfo && verbInfo.key === 'walk') { verbHtml = `ambul<span class="recast-ending">ō</span>`; } 
        else { verbHtml = `<span class="recast-ending">${verbForRecast}</span>`; }
    }
    let prepHtml = `in`;
    if (command.includes('ad')) { prepHtml = 'ad'; } 
    else if (!command.includes('in')) { needsRecast = true; prepHtml = `<span class="recast-ending">in</span>`; }
    const playerWords = command.split(' ');
    const correctWords = roomData.acc.slice(1);
    const recastWords = [];
    correctWords.forEach(correctWord => {
        const correctClean = removeDiacritics(correctWord.toLowerCase());
        const playerAttempt = playerWords.find(pWord => correctClean.startsWith(removeDiacritics(pWord)));
        if (playerAttempt && removeDiacritics(playerAttempt) === correctClean) {
            recastWords.push(correctWord);
        } else {
            needsRecast = true;
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
    if (!verbInfo) needsRecast = true;
    return { recastHtml: `${verbHtml} ${prepHtml} ${recastWords.join(' ')}`, needsRecast };
}

// REPLACE your old performMove function with this one.
async function performMove(moveDirection, newFacingAngle) {
    if (newFacingAngle === undefined) {
        console.error("CRITICAL ERROR: newFacingAngle is undefined. Move direction was:", moveDirection);
        setFeedback("Error internus: Directio incerta est.");
        return false; // The move was not successful.
    }
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

        // This function NO LONGER calls logRoom(). It only renders the map.
        await render(true); 
        setFeedback("");
        return true; // The move was successful.
    } else {
        setFeedback("Nōn potes illāc īre.");
        return false; // The move was not successful.
    }
}

function askClarification(prompt, options) { gameState.clarificationState = { prompt, options }; let optionsString = Object.values(options).map(id => `&nbsp;&nbsp;- ${ROOM_NAMES[id].nom}`).join('<br>'); setFeedback(`${prompt}<br>${optionsString}`); }
function setFeedback(message) { elements.feedback.innerHTML = message; }
function generateExitsString() { const directions = [ { name: 'prōrsus', angle: 0 }, { name: 'rūrsus', angle: 180 }, { name: 'ad dexteram', angle: 90 }, { name: 'ad sinistram', angle: 270 }, { name: 'prōrsus et ad dexteram', angle: 45 }, { name: 'prōrsus et ad sinistram', angle: 315 }, { name: 'rūrsus et ad dexteram', angle: 135 }, { name: 'rūrsus et ad sinistram', angle: 225 } ]; const knownExits = []; const unknownExits = new Set(); const currentExits = rooms[gameState.currentRoom].exits; for (const dir of directions) { const targetAngle = (gameState.playerFacing + dir.angle + 360) % 360; const targetDir = ANGLE_TO_DIRECTION[targetAngle]; const targetRoomId = currentExits[targetDir]; if (targetRoomId) { if (gameState.visitedRooms.has(targetRoomId)) { knownExits.push(`<strong>${dir.name}</strong> ${ROOM_NAMES[targetRoomId].acc.join(' ')}`); } else { unknownExits.add(`<strong>${dir.name}</strong>`); } } } if (knownExits.length === 0 && unknownExits.size === 0) return ""; let html = ""; if (unknownExits.size > 0) { html += `Potes īre: ${[...unknownExits].join(', ')}.<br>`; } if (knownExits.length > 0) { if (unknownExits.size > 0) html += `Etiam potes īre:<br>`; else html += `Potes īre:<br>`; knownExits.forEach(exit => { html += `&nbsp;&nbsp;${exit}<br>`; }); } return html; }

// =============================================================================
// ### 5. MAP AND RENDERING LOGIC
// =============================================================================
function setupMap() { mapGroup = document.createElementNS(SVG_NS, 'g'); elements.mapSvg.appendChild(mapGroup); for (const roomId in rooms) { const room = rooms[roomId]; const roomGroup = document.createElementNS(SVG_NS, 'g'); roomGroup.id = `map-room-${roomId}`; roomGroup.classList.add('map-room'); const rect = document.createElementNS(SVG_NS, 'rect'); const label = document.createElementNS(SVG_NS, 'text'); label.classList.add('room-label'); const nameParts = room.name.replace(/[()]/g, '').split(' '); nameParts.forEach((part, index) => { const tspan = document.createElementNS(SVG_NS, 'tspan'); tspan.textContent = part; tspan.setAttribute('x', 0); tspan.setAttribute('dy', `${index * 1.2}em`); label.appendChild(tspan); }); roomGroup.appendChild(rect); roomGroup.appendChild(label); mapGroup.appendChild(roomGroup); } }
function setupMapInteraction() { elements.mapViewport.addEventListener('mousedown', (e) => { gameState.isDragging = true; elements.mapViewport.style.cursor = 'grabbing'; gameState.dragStart.x = e.clientX - gameState.panOffset.x; gameState.dragStart.y = e.clientY - gameState.panOffset.y; }); window.addEventListener('mousemove', (e) => { if (!gameState.isDragging) return; gameState.panOffset.x = e.clientX - gameState.dragStart.x; gameState.panOffset.y = e.clientY - gameState.dragStart.y; applyMapTransform(false); }); window.addEventListener('mouseup', () => { gameState.isDragging = false; elements.mapViewport.style.cursor = 'grab'; }); }
async function applyMapTransform(animated = false) { if (!mapGroup) return; const targetVisualRotation = -gameState.playerFacing; let delta = targetVisualRotation - gameState.currentVisualRotation; if (delta > 180) delta -= 360; else if (delta < -180) delta += 360; const nextVisualRotation = gameState.currentVisualRotation + delta; const isLongTurn = Math.abs(delta) > 90; const animate = (rotation, scale) => { return new Promise(resolve => { const transitionDuration = animated ? 0.3 : 0; mapGroup.style.transition = `transform ${transitionDuration}s ease-in-out`; const playerRoom = rooms[gameState.currentRoom]; const px = playerRoom.x * mapSettings.GRID_SIZE; const py = playerRoom.y * mapSettings.GRID_SIZE; const viewbox = elements.mapViewport.getBoundingClientRect(); const centerX = viewbox.width / 2; const centerY = viewbox.height / 2; const pan = `translate(${gameState.panOffset.x}, ${gameState.panOffset.y})`; const recenter = `translate(${centerX}, ${centerY})`; const rot = `rotate(${rotation})`; const scaling = `scale(${scale})`; const centerOnPlayer = `translate(${-px}, ${-py})`; mapGroup.setAttribute('transform', `${pan} ${recenter} ${rot} ${scaling} ${centerOnPlayer}`); setTimeout(resolve, transitionDuration * 1000); }); }; if (animated && isLongTurn) { await animate(gameState.currentVisualRotation, 0.7); await sleep(100); await animate(nextVisualRotation, 0.7); await sleep(300); await animate(nextVisualRotation, 1.0); } else { await animate(nextVisualRotation, 1.0); } gameState.currentVisualRotation = nextVisualRotation; }
function updateMapGraphics() { const { GRID_SIZE, ROOM_WIDTH, ROOM_HEIGHT } = mapSettings; const oldConnections = mapGroup.querySelectorAll('.map-connection'); oldConnections.forEach(conn => conn.remove()); const targetVisualRotation = -gameState.playerFacing; let delta = targetVisualRotation - gameState.currentVisualRotation; if (delta > 180) delta -= 360; else if (delta < -180) delta += 360; const nextVisualRotation = gameState.currentVisualRotation + delta; const normalizedNextAngle = (nextVisualRotation % 360 + 360) % 360; const isUpsideDown = normalizedNextAngle > 90 && normalizedNextAngle < 270; for (const roomId in rooms) { if (gameState.visitedRooms.has(roomId)) { const room = rooms[roomId]; for (const dir in room.exits) { const targetRoomId = room.exits[dir]; if (targetRoomId && rooms[targetRoomId]) { const targetRoom = rooms[targetRoomId]; if (gameState.visitedRooms.has(targetRoomId)) { if (roomId < targetRoomId) { const line = document.createElementNS(SVG_NS, 'line'); line.setAttribute('x1', room.x * GRID_SIZE); line.setAttribute('y1', room.y * GRID_SIZE); line.setAttribute('x2', targetRoom.x * GRID_SIZE); line.setAttribute('y2', targetRoom.y * GRID_SIZE); line.setAttribute('class', 'map-connection'); mapGroup.prepend(line); } } else if (roomId === gameState.currentRoom) { const line = document.createElementNS(SVG_NS, 'line'); line.setAttribute('x1', room.x * GRID_SIZE); line.setAttribute('y1', room.y * GRID_SIZE); line.setAttribute('x2', (room.x + targetRoom.x) / 2 * GRID_SIZE); line.setAttribute('y2', (room.y + targetRoom.y) / 2 * GRID_SIZE); line.setAttribute('class', 'map-connection'); mapGroup.prepend(line); } } } } } for (const roomId in rooms) { const room = rooms[roomId]; const roomGroup = document.getElementById(`map-room-${roomId}`); const rect = roomGroup.querySelector('rect'); const label = roomGroup.querySelector('text'); roomGroup.setAttribute('transform', `translate(${room.x * GRID_SIZE}, ${room.y * GRID_SIZE})`); rect.setAttribute('x', -ROOM_WIDTH / 2); rect.setAttribute('y', -ROOM_HEIGHT / 2); rect.setAttribute('width', ROOM_WIDTH); rect.setAttribute('height', ROOM_HEIGHT); label.setAttribute('dy', `-${(label.children.length - 1) * 0.5}em`); if (isUpsideDown) { label.setAttribute('transform', 'rotate(180)'); } else { label.removeAttribute('transform'); } roomGroup.classList.remove('current', 'hidden'); label.classList.remove('current'); if (roomId === gameState.currentRoom) { roomGroup.classList.add('current'); label.classList.add('current'); } else if (!gameState.visitedRooms.has(roomId)) { roomGroup.classList.add('hidden'); } } }

// REPLACE THE ENTIRE "RENDERING AND LOGGING" SECTION WITH THIS BLOCK.

// =============================================================================
// ### 6. RENDERING AND LOGGING
// =============================================================================

async function render(animated = true) {
    // This function is only for visual updates.
    // Logging now happens in processInput and performMove.
    updateMapGraphics();
    await applyMapTransform(animated);
}

// REPLACE your old logCommand and logRecast functions with these.

function logCommand(commandHtml, isRecast = false) {
    const log = elements.gameLog;
    const entry = document.createElement('div');
    // This function now ONLY handles logging the initial, un-recasted command.
    entry.className = 'log-command';
    entry.innerHTML = `> ${commandHtml}`;
    log.appendChild(entry);
    // Do not scroll here; let the next function handle it.
}

function logRecast(recastHtml) {
    const log = elements.gameLog;
    // Find the last raw command in the log.
    const lastCommand = log.querySelector('.log-command:last-child');
    if (lastCommand) {
        // Replace its content with the green, jiggling version.
        lastCommand.innerHTML = `> ${recastHtml}`;
        lastCommand.className = 'log-recast';
        
        // **THE FIX**: Now, scroll the log to show the recast.
        log.scrollTop = log.scrollHeight;
    }
}
function logRoom() {
    const log = elements.gameLog;
    // Clear the log ONLY on the very first render.
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
    log.scrollTop = log.scrollHeight; // Scroll to bottom.
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
        feedback: document.getElementById('feedback'), 
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