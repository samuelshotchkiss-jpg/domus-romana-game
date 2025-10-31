// #############################################################################
// ### GAME DATA (Unchanged)
// #############################################################################
const rooms = {
    'via_west': { x: 0, y: -1, name: 'Via (West)', desc: 'Via est. Caelum nōn est clārum. Aqua ex caelō cadit.', exits: { south: 'taberna', east: 'via_east' } },
    'via_east': { x: 1, y: -1, name: 'Via (East)', desc: 'Iterum, via est. Aqua cadit. Magna domus est prope.', exits: { south: 'fauces', west: 'via_west' } },
    'taberna': { x: 0, y: 0, name: 'Taberna', desc: 'Hic est taberna. Mēnsa magna est. Multae rēs variae sunt in tabernā.', exits: { north: 'via_west' } },
    'fauces': { x: 1, y: 0, name: 'Fauces', desc: 'Hae sunt fauces. In murīs sunt multae imāginēs parentum. Te spectant.', exits: { north: 'via_east', south: 'atrium' } },
    'atrium': { x: 1, y: 1, name: 'Atrium', desc: 'Hoc est atrium magnum. Murī sunt rubrī. Aqua ex caelō in impluvium cadit.', exits: { north: 'fauces', south: 'tablinum', east: 'cubiculum_east', west: 'cubiculum_main', southeast: 'ala_shrine', southwest: 'ala_west' } },
    'cubiculum_main': { x: 0, y: 1, name: 'Cubiculum (Main)', desc: 'Hoc est cubiculum. In cubiculō, lectus et armārium sunt.', exits: { east: 'atrium' } },
    'cubiculum_east': { x: 2, y: 1, name: 'Cubiculum (East)', desc: 'Hoc quoque est cubiculum. In cubiculō, lectus est.', exits: { west: 'atrium' } },
    'ala_shrine': { x: 2, y: 2, name: 'Ala (Shrine)', desc: 'Hic est ala. In alā est larārium. Deī domūs sunt in larāriō. Silentium est.', exits: { northwest: 'atrium' } },
    'ala_west': { x: 0, y: 2, name: 'Ala (West)', desc: 'Hic quoque est ala. Nōn sunt sonī.', exits: { northeast: 'atrium' } },
    'tablinum': { x: 1, y: 2, name: 'Tablinum', desc: 'Hoc est tablinum. Dominus saepe hic labōrat. Magna mēnsa in tablinō est.', exits: { north: 'atrium', south: 'peristylium' } },
    'peristylium': { x: 1, y: 3, name: 'Peristylium', desc: 'Hoc est peristylium. In peristyliō est hortus magnus. Multae columnae sunt.', exits: { north: 'tablinum', south: 'triclinium', east: 'cubiculum_garden', west: 'culina' } },
    'cubiculum_garden': { x: 2, y: 3, name: 'Cubiculum (Garden)', desc: 'Hoc est cubiculum pulchrum. Hortus est prope.', exits: { west: 'peristylium' } },
    'triclinium': { x: 1, y: 4, name: 'Triclinium', desc: 'Hoc est triclīnium. Trēs lectī et mēnsa parva in triclīniō sunt. Figūrae in murīs sunt.', exits: { north: 'peristylium' } },
    'culina': { x: 0, y: 3, name: 'Culina', desc: 'Hic est culīna. In culinā est aqua et focus. Latrīna in culinā est.', exits: { east: 'peristylium', west: 'cella' } },
    'cella': { x: -1, y: 3, name: 'Cella', desc: 'Hic est cella. Multae amphorae in cellā sunt.', exits: { east: 'culina' } }
};
rooms.atrium.exits.southeast = 'ala_shrine'; rooms.atrium.exits.southwest = 'ala_west';

const VOCAB = {
    CORE: new Set(['a', 'ab', 'videt', 'iam', 'ridet', 'fuit', 'vult', 'voluit', 'oculi', 'sentit', 'claudit', 'clare', 'surgit', 'mensa', 'iterum', 'aperit', 'perpetua', 'fere', 'mortalis', 'sitne', 'erat', 'erant', 'ubique', 'vidistine', 'nox', 'domi', 'subito', 'aliquid', 'audit', 'putat', 'parentes', 'varia', 'dei', 'venite', 'domus', 'imus', 'paro', 'via', 'apud', 'dominus', 'aqua', 'exspectat', 'discetis', 'spectate', 'servus', 'divites', 'intremus', 'hospites', 'laborat', 'dormit', 'dormio', 'mecum', 'sunt', 'est', 'in', 'non', 'hoc', 'sed', 'magna', 'ex', 'facere', 'habet', 'animus', 'multi', 'bona', 'bene', 'neque', 'urbs', 'ubi', 'caelum', 'ita', 'vero', 'nomen', 'minime', 'saepe', 'semper', 'noctua']),
    OUTER: { 'affectus': 'affected', 'murmure': 'by the murmur', 'putat': 'thinks', 'esse': 'to be', 'sentire': 'to feel/sense', 'ianuam': 'door', 'caute': 'cautiously', 'tranquille': 'calmly', 'oculos': 'eyes', 'aperiunt': 'they open', 'ianuae': 'doors', 'aperta': 'open', 'apertam': 'open', 'apertum': 'open', 'armarium': 'closet', 'aperuerunt': 'they opened', 'armario': 'closet', 'inspicere': 'to inspect', 'atrio': 'atrium', 'investigat': 'investigates', 'inspectum': 'inspected', 'attat': 'Ah ha!', 'parentum': 'of the parents', 'parentes': 'parents', 'sonum': 'sound', 'murmur': 'murmur', 'cautus': 'cautious', 'romanus': 'Roman', 'clare': 'clearly', 'clarum': 'clear', 'claudit': 'closes', 'claudunt': 'they close', 'clausa': 'closed', 'clauserunt': 'they shut', 'clausis': 'closed', 'clausum': 'closed', 'coram': 'in the presence of', 'phantasmate': 'ghost', 'monstro': 'monster', 'cubiculi': 'of the bedroom', 'cubiculo': 'bedroom', 'culina': 'kitchen', 'culinam': 'kitchen', 'curiosum': 'curious', 'curiosus': 'curious', 'domi': 'at home', 'domus': 'house', 'dormiebam': 'I was sleeping', 'dormio': 'I sleep', 'dormire': 'to sleep', 'dormiturus': 'about to sleep', 'eram': 'I was', 'eramus': 'we were', 'erant': 'they were', 'erantne': 'were they?', 'erat': 'was', 'estne': 'is it?', 'et': 'and', 'evidentia': 'evidence', 'evidentiam': 'evidence', 'fere': 'almost', 'figurae': 'figures', 'figura': 'figure', 'figuram': 'figure', 'fui': 'I was', 'fuisse': 'to have been', 'fuit': 'it was', 'habebant': 'they had', 'habeo': 'I have', 'habesne': 'do you have?', 'habet': 'has', 'nauseam': 'nausea', 'insomniam': 'insomnia', 'horrifici': 'horrific', 'horrificissimum': 'very horrific', 'horrificissimus': 'very horrific', 'horrificos': 'horrific', 'horrificum': 'horrific', 'horrificus': 'horrific', 'horrorem': 'horror!', 'iam': 'now', 'ianua': 'door', 'immobiles': 'immobile', 'immobilis': 'immobile', 'quintus': 'Quintus', 'in': 'in', 'habere': 'to have', 'inspectum': 'inspected', 'inspiciens': 'inspecting', 'inspicit': 'inspects', 'investigans': 'investigating', 'investigare': 'to investigate', 'iterum': 'again', 'lecti': 'couches', 'lectis': 'couches', 'lectos': 'couches', 'lectum': 'couch', 'macte': 'well done!', 'mensa': 'table', 'mensam': 'table', 'monstra': 'monsters', 'monstrorum': 'of monsters', 'monstrum': 'monster', 'mortale': 'mortal', 'mortales': 'mortal', 'murmure': 'by a murmur', 'naturale': 'natural', 'naturales': 'natural', 'naturalis': 'natural', 'nocte': 'at night', 'noctem': 'night', 'non': 'not', 'nox': 'night', 'obscura': 'dark', 'obscuram': 'dark', 'obscuro': 'dark', 'obscuros': 'dark', 'obscurum': 'dark', 'oculis': 'eyes', 'peristylo': 'peristyle', 'peristylium': 'peristyle', 'perpetua': 'perpetual', 'perpetuam': 'perpetual', 'perterriti': 'terrified', 'perterritissimus': 'very terrified', 'perterritus': 'terrified', 'perturbate': 'pertubedly', 'perturbatissimus': 'very perturbed', 'perturbatus': 'perturbed', 'phantasmata': 'ghosts', 'phantasmatis': 'of a ghost', 'phantasmatum': 'of ghosts', 'putabam': 'I thought', 'putavit': 'thought', 'quinti': 'of Quintus', 'quinto': 'Quintus', 'reale': 'real', 'realem': 'real', 'reales': 'real', 'realia': 'real', 'realis': 'real', 'rident': 'they laugh', 'ridet': 'laughs', 'romae': 'in Rome', 'romani': 'Romans', 'sed': 'but', 'sentiens': 'sensing', 'sentit': 'senses', 'silentium': 'silence', 'sintne': 'could they be?', 'sitne': 'could it be?', 'soni': 'sounds', 'sonos': 'sounds', 'sonus': 'sound', 'stomachus': 'stomach', 'subito': 'suddenly!', 'sunt': 'they are', 'surgit': 'rises', 'surgunt': 'they rise', 'surrecta': 'was lifted up', 'surrecti': 'were lifted up', 'surrectis': 'lifted up', 'tablino': 'study', 'tablinum': 'study', 'tranquilla': 'tranquil', 'tranquillum': 'tranquil', 'tranquillus': 'tranquil', 'trinclinio': 'dining room', 'trinclinium': 'dining room', 'ubique': 'everywhere', 'videre': 'to see', 'videt': 'sees', 'vidistine': 'have you seen?', 'voluit': 'wanted', 'tres': 'three', 'parva': 'small' },
    NOVUM: { 'amphorae': {lemma: 'amphora, -ae, f.', def: 'jar, amphora'}, 'columnae': {lemma: 'columna, -ae, f.', def: 'column, pillar'}, 'focus': {lemma: 'focus, -ī, m.', def: 'hearth, stove'}, 'hortus': {lemma: 'hortus, -ī, m.', def: 'garden'}, 'imāginēs': {lemma: 'imago, imaginis, f.', def: 'ancestral mask'}, 'murī': {lemma: 'murus, -ī, m.', def: 'wall'}, 'murīs': {lemma: 'murus, -ī, m.', def: 'wall'}, 'quoque': {lemma: 'quoque (adv.)', def: 'also, too'}, 'rēs': {lemma: 'rēs, reī, f.', def: 'thing, object'}, 'rubrī': {lemma: 'ruber, rubra, rubrum', def: 'red'}, 'lectus': {lemma: 'lectus, -ī, m.', def: 'bed, couch'}, 'lectī': {lemma: 'lectus, -ī, m.', def: 'bed, couch'}, }
};

const DIRECTION_ROTATIONS = { 'north': 0, 'south': 180, 'east': 90, 'west': 270, 'northeast': 45, 'northwest': 315, 'southeast': 135, 'southwest': 225 };
// REPLACE the old ANGLE_TO_DIRECTION constant with this new one.
const ANGLE_TO_DIRECTION = { 
    0: 'north', 45: 'northeast', 90: 'east', 135: 'southeast', 
    180: 'south', 225: 'southwest', 270: 'west', 315: 'northwest' 
};
// #############################################################################
// ### GAME STATE
// #############################################################################

// Find the gameState object
// REPLACE the old gameState object with this one.
const gameState = {
    currentRoom: 'cubiculum_garden',
    playerFacing: 270, // Start facing West. 0=N, 90=E, 180=S, 270=W
    currentMapRotation: 90, // RESTORED: The logical rotation target
    currentVisualRotation: 90, // The rotation currently shown on screen
    visitedRooms: new Set(['cubiculum_garden']),
    panOffset: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 }
};

const mapSettings = { GRID_SIZE: 150, ROOM_WIDTH: 100, ROOM_HEIGHT: 60 };

// #############################################################################
// ### DOM ELEMENTS AND INITIALIZATION
// #############################################################################

let elements = {};
let mapGroup;
const SVG_NS = "http://www.w3.org/2000/svg";

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

document.addEventListener('DOMContentLoaded', () => {
    elements = {
        roomTitle: document.getElementById('room-title'),
        description: document.getElementById('description'),
        feedback: document.getElementById('feedback'),
        commandForm: document.getElementById('command-form'),
        commandInput: document.getElementById('command-input'),
        mapViewport: document.getElementById('map-viewport'),
        mapSvg: document.getElementById('map-svg')
    };

    setupMap();
    setupMapInteraction();
    render(false);
    elements.commandInput.focus();

    elements.commandForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const command = elements.commandInput.value;
        if (command) movePlayer(command);
        elements.commandInput.value = '';
    });
});

// #############################################################################
// ### CORE GAME LOGIC
// #############################################################################

const opposite = { 'north': 'south', 'south': 'north', 'east': 'west', 'west': 'east', 'northwest': 'southeast', 'southeast': 'northwest', 'northeast': 'southwest', 'southwest': 'northeast' };

// REPLACE the old movePlayer function with this new, complete version.

// REPLACE the old movePlayer function with this new async version.

// REPLACE the old movePlayer function with this one.
// REPLACE the old movePlayer function with this one.

// REPLACE the old movePlayer function with this new, complete version.

async function movePlayer(command) {
    const normalizedCommand = command.toLowerCase().trim();
    let moveDirection = null;
    let newFacingAngle = gameState.playerFacing;

    const currentFacing = ANGLE_TO_DIRECTION[gameState.playerFacing];
    const rursusDir = opposite[currentFacing];
    const dexteramDir = ANGLE_TO_DIRECTION[(gameState.playerFacing + 90) % 360];
    const sinistramDir = ANGLE_TO_DIRECTION[(gameState.playerFacing + 270) % 360];

    const hasProrsus = normalizedCommand.includes('prorsus');
    const hasRursus = normalizedCommand.includes('rursus');
    const hasDexteram = normalizedCommand.includes('dexteram');
    const hasSinistram = normalizedCommand.includes('sinistram');

    // Landmark commands take precedence
    if (normalizedCommand.includes('alam dexteram')) {
        moveDirection = 'southeast';
        newFacingAngle = DIRECTION_ROTATIONS.southeast;
    } else if (normalizedCommand.includes('alam sinistram')) {
        moveDirection = 'southwest';
        newFacingAngle = DIRECTION_ROTATIONS.southwest;
    }
    // **DIAGONAL COMMANDS (NOW ENABLED)**
    else if ((hasProrsus || hasRursus) && (hasDexteram || hasSinistram)) {
        const primary = hasProrsus ? currentFacing : rursusDir;
        const secondary = hasDexteram ? dexteramDir : sinistramDir;
        // Construct the diagonal direction key (e.g., 'south' + 'west' = 'southwest')
        moveDirection = (primary.startsWith('north') || primary.startsWith('south')) ? (primary + secondary) : (secondary + primary);
        newFacingAngle = DIRECTION_ROTATIONS[moveDirection];
    }
    // Cardinal commands
    else if (hasProrsus) { moveDirection = currentFacing; } 
    else if (hasRursus) { moveDirection = rursusDir; newFacingAngle = (gameState.playerFacing + 180) % 360; } 
    else if (hasDexteram) { moveDirection = dexteramDir; newFacingAngle = (gameState.playerFacing + 90) % 360; } 
    else if (hasSinistram) { moveDirection = sinistramDir; newFacingAngle = (gameState.playerFacing + 270) % 360; }
    
    if (!moveDirection) {
        setFeedback("Nōn intellegō verba tua.");
        return;
    }

    const nextRoomId = rooms[gameState.currentRoom].exits[moveDirection];
    if (nextRoomId) {
        const previousRoomId = gameState.currentRoom;
        
        gameState.currentRoom = nextRoomId;
        gameState.visitedRooms.add(nextRoomId);
        gameState.panOffset = { x: 0, y: 0 };
        gameState.playerFacing = newFacingAngle;

        // Special snap-back case when leaving an Ala
        if ((previousRoomId === 'ala_shrine' || previousRoomId === 'ala_west') && nextRoomId === 'atrium') {
            gameState.playerFacing = 0; // Force facing North
        }

        render(true);
        setFeedback("");
    } else {
        setFeedback("Nōn potes illāc īre.");
    }
}

// ADD THIS ENTIRE FUNCTION
function setFeedback(message) {
    elements.feedback.textContent = message;
}
// #############################################################################
// ### MAP LOGIC
// #############################################################################

function setupMap() {
    mapGroup = document.createElementNS(SVG_NS, 'g');
    elements.mapSvg.appendChild(mapGroup);
    
    for (const roomId in rooms) {
        const room = rooms[roomId];
        const roomGroup = document.createElementNS(SVG_NS, 'g');
        roomGroup.id = `map-room-${roomId}`;
        roomGroup.classList.add('map-room');
        
        const rect = document.createElementNS(SVG_NS, 'rect');
        const label = document.createElementNS(SVG_NS, 'text');
        label.classList.add('room-label');

        const nameParts = room.name.replace(/[()]/g, '').split(' ');
        nameParts.forEach((part, index) => {
            const tspan = document.createElementNS(SVG_NS, 'tspan');
            tspan.textContent = part;
            tspan.setAttribute('x', 0);
            tspan.setAttribute('dy', `${index * 1.2}em`);
            label.appendChild(tspan);
        });
        
        roomGroup.appendChild(rect);
        roomGroup.appendChild(label);
        mapGroup.appendChild(roomGroup);
    }
    const playerMarker = document.createElementNS(SVG_NS, 'use');
    playerMarker.setAttribute('href', '#player-arrow');
    playerMarker.id = 'player-marker';
    playerMarker.setAttribute('width', 20);
    playerMarker.setAttribute('height', 20);
    mapGroup.appendChild(playerMarker);
}

function setupMapInteraction() {
    elements.mapViewport.addEventListener('mousedown', (e) => {
        gameState.isDragging = true;
        elements.mapViewport.style.cursor = 'grabbing';
        gameState.dragStart.x = e.clientX - gameState.panOffset.x;
        gameState.dragStart.y = e.clientY - gameState.panOffset.y;
    });
    window.addEventListener('mousemove', (e) => {
        if (!gameState.isDragging) return;
        gameState.panOffset.x = e.clientX - gameState.dragStart.x;
        gameState.panOffset.y = e.clientY - gameState.dragStart.y;
        applyMapTransform(false);
    });
    window.addEventListener('mouseup', () => {
        gameState.isDragging = false;
        elements.mapViewport.style.cursor = 'grab';
    });
}

// REPLACE the old applyMapTransform function with this one.
async function applyMapTransform(animated = false) {
    if (!mapGroup) return;

    // --- NEW "SHORTEST PATH" & "ZOOM-OUT" LOGIC ---
    const targetRotation = -gameState.playerFacing;
    let delta = targetRotation - gameState.currentVisualRotation;
    if (delta > 180) delta -= 360;
    else if (delta < -180) delta += 360;
    
    const nextVisualRotation = gameState.currentVisualRotation + delta;
    const isLongTurn = Math.abs(delta) > 90;

    const animate = (rotation, scale) => {
        return new Promise(resolve => {
            const transitionDuration = animated ? 0.3 : 0;
            mapGroup.style.transition = `transform ${transitionDuration}s ease-in-out`;

            const playerRoom = rooms[gameState.currentRoom];
            const px = playerRoom.x * mapSettings.GRID_SIZE;
            const py = playerRoom.y * mapSettings.GRID_SIZE;
            const viewbox = elements.mapViewport.getBoundingClientRect();
            const centerX = viewbox.width / 2;
            const centerY = viewbox.height / 2;

            const pan = `translate(${gameState.panOffset.x}, ${gameState.panOffset.y})`;
            const recenter = `translate(${centerX}, ${centerY})`;
            const rot = `rotate(${rotation})`;
            const scaling = `scale(${scale})`;
            const centerOnPlayer = `translate(${-px}, ${-py})`;

            mapGroup.setAttribute('transform', `${pan} ${recenter} ${rot} ${scaling} ${centerOnPlayer}`);
            setTimeout(resolve, transitionDuration * 1000);
        });
    };

    if (animated && isLongTurn) {
        await animate(gameState.currentVisualRotation, 0.7); // Zoom out
        await sleep(100);
        await animate(nextVisualRotation, 0.7); // Rotate while zoomed out
        await sleep(300);
        await animate(nextVisualRotation, 1.0); // Zoom back in
    } else {
        await animate(nextVisualRotation, 1.0); // Simple turn
    }
    
    gameState.currentVisualRotation = nextVisualRotation;
}

function updateMapGraphics() {
    const { GRID_SIZE, ROOM_WIDTH, ROOM_HEIGHT } = mapSettings;

    const oldConnections = mapGroup.querySelectorAll('.map-connection');
    oldConnections.forEach(conn => conn.remove());

    const currentRoom = rooms[gameState.currentRoom];

    for (const dir in currentRoom.exits) {
        const targetRoomId = currentRoom.exits[dir];
        if (targetRoomId && rooms[targetRoomId]) {
            const targetRoom = rooms[targetRoomId];
            const line = document.createElementNS(SVG_NS, 'line');
            line.setAttribute('x1', currentRoom.x * GRID_SIZE);
            line.setAttribute('y1', currentRoom.y * GRID_SIZE);
            line.setAttribute('x2', targetRoom.x * GRID_SIZE);
            line.setAttribute('y2', targetRoom.y * GRID_SIZE);
            line.setAttribute('class', 'map-connection');
            mapGroup.prepend(line);
        }
    }

    for (const roomId in rooms) {
        const room = rooms[roomId];
        const roomGroup = document.getElementById(`map-room-${roomId}`);
        const rect = roomGroup.querySelector('rect');
        const label = roomGroup.querySelector('text');

        roomGroup.setAttribute('transform', `translate(${room.x * GRID_SIZE}, ${room.y * GRID_SIZE})`);
        rect.setAttribute('x', -ROOM_WIDTH / 2);
        rect.setAttribute('y', -ROOM_HEIGHT / 2);
        rect.setAttribute('width', ROOM_WIDTH);
        rect.setAttribute('height', ROOM_HEIGHT);
        label.setAttribute('dy', `-${(label.children.length - 1) * 0.5}em`);

        roomGroup.classList.remove('current', 'hidden');
        label.classList.remove('current');
        if (roomId === gameState.currentRoom) {
            roomGroup.classList.add('current');
            label.classList.add('current');
        } else if (!gameState.visitedRooms.has(roomId)) {
            roomGroup.classList.add('hidden');
        }
    }

    const playerMarker = document.getElementById('player-marker');
    // Arrow always points "up" screen space, so it's not rotated with the map.
    // Its position is fixed relative to the current room.
    // This is the correct line:
    playerMarker.setAttribute('transform', `translate(${currentRoom.x * GRID_SIZE}, ${currentRoom.y * GRID_SIZE}) rotate(${gameState.playerFacing})`);    playerMarker.setAttribute('x', -10);
    playerMarker.setAttribute('y', -10);
}

// #############################################################################
// ### MAIN RENDER FUNCTION and VOCAB PARSING
// #############################################################################

function render(animated = true) {
    const room = rooms[gameState.currentRoom];
    elements.roomTitle.innerHTML = processDescription(room.name);
    elements.description.innerHTML = processDescription(room.desc);
    
    updateMapGraphics();
    applyMapTransform(animated);
}

function processDescription(text) {
    const words = text.split(/([ \t\n\r]+)/);
    return words.map(word => {
        if (!word.trim()) return word;
        const cleanWord = word.toLowerCase().replace(/[.,!?;]/g, '');
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