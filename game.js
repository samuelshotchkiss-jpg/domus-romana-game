// =============================================================================
// ### 1. GAME DATA ###
// All static data for the game, including room layouts, names, and vocabulary.
// =============================================================================
const removeDiacritics = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const rooms = {
    'via_west': { x: 0, y: -1, name: 'Via', intro: 'via', desc: 'Haec est taberna, et iānua tabernae {state:ianua_tabernae} est.', exits: { south: 'taberna', east: 'via_east' } },
    'via_east': { x: 1, y: -1, name: 'Via', intro: 'via', desc: 'Haec est domus tua, et iānua domūs {state:ianua_domus} est.', exits: { south: 'fauces', west: 'via_west' } },
    'taberna': { x: 0, y: 0, name: 'Taberna', desc: 'Haec taberna obscūra est. In tabernā est mēnsa, et in mēnsā sunt multa et varia.', exits: { north: 'via_west' } },
    'fauces': { x: 1, y: 0, name: 'Faucēs', desc: 'Hae faucēs obscūrae sunt. Ubīque sunt pictūrae, et in pictūrīs sunt virī Rōmānī. Oculī virōrum tē vident!', exits: { north: 'via_east', south: 'atrium' } },
    'atrium': { x: 1, y: 1, name: 'Ātrium', desc: 'Hoc ātrium obscūrum tranquillumque est. In ātriō est impluvium, et ubīque est silentium.', exits: { north: 'fauces', south: 'tablinum', east: 'cubiculum_parentum', west: 'cubiculum_sororis', southeast: 'ala_larum', southwest: 'ala_hermae' } },
    'cubiculum_sororis': { x: 0, y: 1, name: 'Cubiculum Sorōris', desc: 'Hoc est cubiculum sorōris tuae. Soror tua domī nōn est. In cubiculō sunt lectus sellaque.', exits: { east: 'atrium' } },
    'cubiculum_parentum': { x: 2, y: 1, name: 'Cubiculum Parentum', desc: 'Hoc est cubiculum parentum tuōrum. Hī duo lectī sunt parentum, sed parentēs domī nōn sunt.', exits: { west: 'atrium' } },
    'ala_larum': { x: 2, y: 2, name: 'Āla Lārum', desc: 'In hāc ālā est larārium, in quō sunt Larēs, deī domūs tuae.', exits: { northwest: 'atrium' } },
    'ala_hermae': { x: 0, y: 2, name: 'Āla Hermae', desc: 'Haec quoque āla est. In ālā stat pater patris tuī — sed immōbilis: herma est!', exits: { northeast: 'atrium' } },
    'tablinum': { x: 1, y: 2, name: 'Tablīnum', desc: 'Hoc est tablīnum patris tuī. In tablīnō sunt mēnsa sellaque. Est etiam armārium, sed hoc armārium {state:armarium} est.', exits: { north: 'atrium', south: 'peristylum' } },
    'peristylum': { x: 1, y: 3, name: 'Peristȳlum', desc: 'Hoc peristȳlum obscūrum est. In peristȳlō sunt arborēs, herbae rosaeque. In arbore est noctua.', exits: { north: 'tablinum', south: 'triclinium', east: 'cubiculum_tuum', west: 'culina' } },
    'cubiculum_tuum': { x: 2, y: 3, name: 'Cubiculum Tuum', desc: 'Hoc est cubiculum tuum, et hic est lectus tuus. Nox est; dormīre vīs, sed īnsomniam habēs. Iānua cubiculī {state:ianua_cubiculi} est.', exits: { west: 'peristylum' } },
    'triclinium': { x: 1, y: 4, name: 'Triclīnium', desc: 'Hoc est triclīnium. In triclīniō sunt mēnsa lectīque, immōbilēs. Silentium est, sed aliquid sentīs.', exits: { north: 'peristylum' } },
    'culina': { x: 0, y: 3, name: 'Culīna', desc: 'Haec est culīna. {has:panis|In mēnsā est pānis, et in culīnā est etiam lātrīna.|In mēnsā nihil est, sed in culīnā est lātrīna.}', exits: { east: 'peristylum', west: 'cella' } },
    'cella': { x: -1, y: 3, name: 'Cella', desc: 'Haec cella obscūrissima est. In cellā sunt multae amphorae.', exits: { east: 'culina' } }
};

// Openings that depend on where the player came from. A room with `intro: 'via'` begins with `first`
// when the player arrives from outside the group (stepping out of the house or the shop), and with
// `later` when they arrive from another room of the same group (one street to the next). Its own
// `desc` follows.
const INTROS = {
    'via': {
        first: 'Nox est. Haec via obscūra et tranquilla est, neque est sonus.',
        later: 'Haec quoque via obscūra est.'
    }
};

// The things a player can act on. `lemma` finds the object in a command; `forms` are the cases the
// game says it in (for a plural object, `abl` is the form "in …" takes: "in lectō", one of the
// couches; `accSg`/`ablSg` let the player act on just one of many: "tangō arborem"); `rooms` are where
// it can be reached from ('*' = everywhere); `gender` makes its state words agree.
// Flags: `openable` gives it a state, open or closed (in two rooms it is a door, and nobody passes it
// while it is closed); `surface` means it can be sat or stood on; `bed`, slept in; `edible`, eaten,
// after which it is gone; `portable`, taken (capiō) and carried, so that it is within reach everywhere
// until it is put down (pōnō) in another room. `takeOne` names the single object that taking one of
// many gives (capiō rosam: a rose from the roses).
// Text: `look` is what investīgō / īnspiciō / spectō / videō shows, ending with a hint at a verb to
// try (`lookIn` gives a room its own look, `lookSg` the look at just one); `on` answers particular
// verbs (`onSg` when acting on just one; a list of lines is used in turn); `refuse` answers every
// verb with no line of its own.
// In any text, {state:ID} is that object's state ("aperta"/"apertum"…), {has:ID|A|B} is A while the
// object is where it started and B once it is gone (eaten, or taken away); in an object's own text, {state} and {toggle}
// ("claudere"/"aperīre") mean itself.
const OBJECTS = {
    // Everywhere
    'ego': {
        lemma: 'ego', forms: { nom: 'ego', acc: 'mē', abl: 'mē' }, gender: 'm',
        rooms: '*',
        look: 'Nox est, et tē nōn bene vidēs.',
        lookIn: { 'atrium': 'In aquā impluviī tē vidēs: es puer Rōmānus, cūriōsus sed cautus.' },
        on: { 'tango': 'Tē tangis. Reālis es!' },
        refuse: 'Hoc facere nōn potes.'
    },
    // Via, Faucēs
    'ianua_domus': {
        lemma: 'ianua', forms: { nom: 'iānua', acc: 'iānuam', abl: 'iānuā' }, gender: 'f',
        rooms: ['via_east', 'fauces'], openable: { open: true },
        look: 'Haec iānua domūs magna et pulchra est. Iānua {state} est. Potes iānuam {toggle}.'
    },
    'ianua_tabernae': {
        // Open for now. In the finished game it is locked, with something important inside.
        lemma: 'ianua', forms: { nom: 'iānua', acc: 'iānuam', abl: 'iānuā' }, gender: 'f',
        rooms: ['via_west', 'taberna'], openable: { open: true },
        look: 'Haec est iānua tabernae. Iānua {state} est. Potes iānuam {toggle}.'
    },
    'picturae': {
        lemma: 'pictura', forms: { nom: 'pictūrae', acc: 'pictūrās', abl: 'pictūrīs' }, gender: 'f',
        rooms: ['fauces'],
        look: 'In pictūrīs sunt virī Rōmānī, et omnēs tē spectant. Ūnus vir rīdet; aliī nōn rīdent. Potes pictūrās tangere.',
        on: { 'tango': 'Pictūrās tangis. Subitō vir in pictūrā nōn iam rīdet! Perterritus es.' }
    },
    'oculi_picturarum': {
        lemma: 'oculus', forms: { nom: 'oculī', acc: 'oculōs', abl: 'oculīs' }, gender: 'm',
        rooms: ['fauces'],
        look: 'Oculī virōrum obscūrī sunt, et tē spectant — ubīque in faucibus! Potes oculōs tangere.',
        on: { 'tango': 'Oculōs virōrum tangis. Pictūrae sunt, nōn virī reālēs.' }
    },
    // Taberna
    'mensa_tabernae': {
        lemma: 'mensa', forms: { nom: 'mēnsa', acc: 'mēnsam', abl: 'mēnsā' }, gender: 'f',
        rooms: ['taberna'], surface: true,
        look: 'Haec mēnsa longa est. In mēnsā sunt multa et varia, sed nox est, et omnia obscūra sunt. Potes mēnsam tangere.',
        on: { 'tango': 'Mēnsam tangis. Mēnsa frīgida est.' }
    },
    // Ātrium and its rooms
    'impluvium': {
        lemma: 'impluvium', forms: { nom: 'impluvium', acc: 'impluvium', abl: 'impluviō' }, gender: 'n',
        rooms: ['atrium'], surface: true,
        look: 'Hoc impluvium quadrātum est. In impluviō est aqua, tranquilla et obscūra, et in aquā tē vidēs. Potes aquam bibere.',
        on: {
            'consido': 'In impluviō cōnsīdis — et nunc ūmidus es!',
            'sedeo': 'In impluviō sedēs — et nunc ūmidus es!',
            'sto': 'In impluviō stās. Aqua frīgida est!'
        }
    },
    'aqua': {
        lemma: 'aqua', forms: { nom: 'aqua', acc: 'aquam', abl: 'aquā' }, gender: 'f',
        rooms: ['atrium'],
        look: 'Aqua in impluviō tranquilla et obscūra est. In aquā tē vidēs. Potes aquam bibere.',
        on: { 'bibo': 'Aquam bibis. Aqua frīgida est, sed bona.' }
    },
    'lectus_sororis': {
        lemma: 'lectus', forms: { nom: 'lectus', acc: 'lectum', abl: 'lectō' }, gender: 'm',
        rooms: ['cubiculum_sororis'], surface: true, bed: true,
        look: 'Hic est lectus sorōris tuae, sed lectus vacuus est: soror tua domī nōn est. Potes in lectō dormīre.',
        on: {
            'dormio': 'In lectō sorōris dormīre vīs, sed īnsomniam habēs.',
            'consido': 'In lectō cōnsīdis. Lectus mollis est.'
        }
    },
    'sella_sororis': {
        lemma: 'sella', forms: { nom: 'sella', acc: 'sellam', abl: 'sellā' }, gender: 'f',
        rooms: ['cubiculum_sororis'], surface: true,
        look: 'Haec sella parva est, sed pulchra. Potes in sellā cōnsīdere.',
        on: { 'consido': 'In sellā cōnsīdis, sed sella tibi parva est.' }
    },
    'lecti_parentum': {
        lemma: 'lectus', forms: { nom: 'lectī', acc: 'lectōs', abl: 'lectō' }, gender: 'm',
        rooms: ['cubiculum_parentum'], surface: true, bed: true,
        look: 'Hī duo lectī magnī sunt, sed vacuī: parentēs tuī domī nōn sunt. Potes in lectō dormīre.',
        on: {
            'dormio': 'In lectō parentum dormīre vīs, sed parentēs domī nōn sunt, et īnsomniam habēs.',
            'consido': 'In lectō cōnsīdis. Silentium est.'
        }
    },
    'lararium': {
        lemma: 'lararium', forms: { nom: 'larārium', acc: 'larārium', abl: 'larāriō' }, gender: 'n',
        rooms: ['ala_larum'],
        look: 'Hoc larārium parvum et pulchrum est. In larāriō sunt Larēs, deī domūs tuae. Potes Larēs salūtāre.',
        on: {
            'sto': 'Minimē! In larāriō sunt Larēs, deī domūs tuae: ibi nōn stās!',
            'consido': 'Minimē! In larāriō sunt Larēs, deī domūs tuae: ibi nōn sedēs!'
        }
    },
    'lares': {
        lemma: 'lar', forms: { nom: 'Larēs', acc: 'Larēs', abl: 'Laribus' }, gender: 'm',
        rooms: ['ala_larum'],
        look: 'Larēs sunt duo puerī parvī, quī saltant et rīdent. Larēs domum tuam cūrant. Potes Larēs salūtāre.',
        on: { 'saluto': '«Salvēte, Larēs!» Larēs nihil respondent, sed iam tranquillus es.' }
    },
    'herma': {
        lemma: 'herma', forms: { nom: 'herma', acc: 'hermam', abl: 'hermā' }, gender: 'f',
        rooms: ['ala_hermae'],
        look: 'Herma est pater patris tuī, sed lapidea: nōn sē movet, nōn rīdet. Oculī eius tē spectant. Potes hermam salūtāre.',
        on: { 'saluto': '«Salvē!» Herma nihil respondet. Herma immōbilis est.' }
    },
    'oculi_hermae': {
        lemma: 'oculus', forms: { nom: 'oculī', acc: 'oculōs', abl: 'oculīs' }, gender: 'm',
        rooms: ['ala_hermae'],
        look: 'Oculī hermae lapideī et immōbilēs sunt, sed tē spectant. Potes oculōs tangere.',
        on: { 'tango': 'Oculōs hermae tangis. Frīgidī et lapideī sunt: nōn sunt reālēs.' }
    },
    'mensa_tablini': {
        lemma: 'mensa', forms: { nom: 'mēnsa', acc: 'mēnsam', abl: 'mēnsā' }, gender: 'f',
        rooms: ['tablinum'], surface: true,
        look: 'Haec est mēnsa patris tuī. Ad hanc mēnsam pater tuus saepe labōrat, sed nunc pater domī nōn est. Potes in mēnsā stāre!',
        on: { 'sto': 'In mēnsā patris tuī stās! Nunc magnus es.' }
    },
    'sella_tablini': {
        lemma: 'sella', forms: { nom: 'sella', acc: 'sellam', abl: 'sellā' }, gender: 'f',
        rooms: ['tablinum'], surface: true,
        look: 'Haec est sella patris tuī, magna et gravis. Potes in sellā sedēre.',
        on: {
            'sedeo': 'In sellā patris tuī sedēs. Nunc tū es dominus!',
            'consido': 'In sellā patris tuī cōnsīdis. Nunc tū es dominus!'
        }
    },
    'armarium': {
        // Shut. In Quīntus the monster's eyes are in it (ch. VII); here it will hide something.
        lemma: 'armarium', forms: { nom: 'armārium', acc: 'armārium', abl: 'armāriō' }, gender: 'n',
        rooms: ['tablinum'], openable: { open: false },
        look: 'Hoc armārium magnum et obscūrum est. Armārium {state} est. Potes armārium {toggle}.'
    },
    // Peristȳlum
    'arbores': {
        lemma: 'arbor', forms: { nom: 'arborēs', acc: 'arborēs', abl: 'arboribus', accSg: 'arborem', ablSg: 'arbore' }, gender: 'f',
        rooms: ['peristylum'],
        look: 'Hae arborēs altae et obscūrae sunt. In arbore est noctua. Potes arborem tangere.',
        lookSg: 'Haec arbor alta et obscūra est. Sunt etiam aliae arborēs. Potes arborem tangere.',
        on: { 'tango': 'Arborēs tangis. Noctua tē videt, sed nōn cūrat.' },
        onSg: {
            'tango': [
                'Arborem tangis. In hāc arbore est noctua, sed noctua nōn cūrat.',
                'Aliam arborem tangis. Subitō aliquid in arbore sē movet — est avis parva! Iam avis nōn adest.',
                'Aliam arborem tangis. Haec arbor antīqua est, et in arbore murmur audīs…'
            ]
        }
    },
    'herbae': {
        lemma: 'herba', forms: { nom: 'herbae', acc: 'herbās', abl: 'herbīs' }, gender: 'f',
        rooms: ['peristylum'],
        look: 'Herbae multae et variae sunt. Potes herbās olfacere.',
        on: { 'olfacio': 'Herbās olfacis. Bene olent!' }
    },
    'rosae': {
        lemma: 'rosa', forms: { nom: 'rosae', acc: 'rosās', abl: 'rosīs', accSg: 'rosam', ablSg: 'rosā' }, gender: 'f',
        rooms: ['peristylum'],
        look: 'Hae rosae pulchrae sunt, sed nocte nōn sunt rubrae: obscūrae sunt. Potes rosās olfacere, aut rosam capere.',
        on: { 'olfacio': 'Rosās olfacis. Rosae optimē olent!' },
        // capiō rosam picks one: the rose below, which is nowhere until then.
        takeOne: 'rosa'
    },
    'rosa': {
        lemma: 'rosa', forms: { nom: 'rosa', acc: 'rosam', abl: 'rosā' }, gender: 'f',
        rooms: [], portable: true,
        look: 'Haec rosa pulchra est, et optimē olet. Potes rosam olfacere.',
        on: { 'olfacio': 'Rosam olfacis. Optimē olet!' }
    },
    'noctua': {
        // The owl of the class slides. The class names her, and describes her, afresh each year:
        // 2026-27, Rebecca, "very beautiful", who does not care. The name is not shown yet: the early
        // puzzle (getting her to care, so she will share her wisdom) is still to be designed.
        lemma: 'noctua', forms: { nom: 'noctua', acc: 'noctuam', abl: 'noctuā' }, gender: 'f',
        rooms: ['peristylum'], name: 'Rebecca',
        look: 'Haec noctua pulcherrima est! In arbore est, et tē videt — sed nōn cūrat. Quid cūrat haec noctua?',
        refuse: 'Noctua nōn cūrat.'
    },
    'ianua_cubiculi': {
        lemma: 'ianua', forms: { nom: 'iānua', acc: 'iānuam', abl: 'iānuā' }, gender: 'f',
        rooms: ['cubiculum_tuum', 'peristylum'], openable: { open: true },
        look: 'Haec est iānua cubiculī tuī. Iānua {state} est. Potes iānuam {toggle}.'
    },
    'lectus_tuus': {
        lemma: 'lectus', forms: { nom: 'lectus', acc: 'lectum', abl: 'lectō' }, gender: 'm',
        rooms: ['cubiculum_tuum'], surface: true, bed: true,
        look: 'Hic est lectus tuus. Dormīre vīs, sed īnsomniam habēs. Potes in lectō dormīre.',
        on: { 'dormio': 'In lectō tuō es, sed dormīre nōn potes: īnsomniam habēs!' }
    },
    // Triclīnium
    'mensa_triclinii': {
        lemma: 'mensa', forms: { nom: 'mēnsa', acc: 'mēnsam', abl: 'mēnsā' }, gender: 'f',
        rooms: ['triclinium'], surface: true,
        look: 'Haec mēnsa parva est. Nunc mēnsa immōbilis est. Potes mēnsam movēre.',
        on: { 'moveo': 'Mēnsam movēre vīs, sed mēnsa sē nōn movet. Mēnsa gravis est.' }
    },
    'lecti_triclinii': {
        lemma: 'lectus', forms: { nom: 'lectī', acc: 'lectōs', abl: 'lectō' }, gender: 'm',
        rooms: ['triclinium'], surface: true, bed: true,
        look: 'Trēs lectī circum mēnsam sunt. In hīs lectīs Rōmānī recumbunt et cēnant. Potes in lectō recumbere.',
        on: {
            'recumbo': 'In lectō recumbis, sīcut Rōmānus. Subitō lectus sē movet! … Minimē: lectus immōbilis est.',
            'consido': 'In lectō cōnsīdis. Subitō lectus sē movet! … Minimē: lectus immōbilis est.'
        }
    },
    // Culīna, Cella
    'mensa_culinae': {
        lemma: 'mensa', forms: { nom: 'mēnsa', acc: 'mēnsam', abl: 'mēnsā' }, gender: 'f',
        rooms: ['culina'], surface: true,
        look: '{has:panis|In hāc mēnsā est pānis. Potes pānem edere.|In hāc mēnsā nihil est. Potes in mēnsā sedēre.}'
    },
    'panis': {
        // Edible, to exercise the machinery: eaten, it is gone. The finished game may need the bread
        // for something, and then loses `edible` (its `on` line for edō then says why not).
        lemma: 'panis', forms: { nom: 'pānis', acc: 'pānem', abl: 'pāne' }, gender: 'm',
        rooms: ['culina'], edible: true, portable: true,
        look: 'Hic pānis bonus est, sed nōn novus. Potes pānem capere aut edere.',
        on: { 'edo': 'Pānem edis. Pānis optimus erat! Iam nūllus pānis est.' }
    },
    'latrina': {
        lemma: 'latrina', forms: { nom: 'lātrīna', acc: 'lātrīnam', abl: 'lātrīnā' }, gender: 'f',
        rooms: ['culina'],
        look: 'Haec lātrīna nōn pulchra est, et male olet. Potes in lātrīnā cacāre.',
        on: { 'caco': 'In lātrīnā cacās. Deīs est grātia!' }
    },
    'amphorae': {
        lemma: 'amphora', forms: { nom: 'amphorae', acc: 'amphorās', abl: 'amphorīs', accSg: 'amphoram', ablSg: 'amphorā' }, gender: 'f',
        rooms: ['cella'],
        look: 'Hae amphorae magnae et gravēs sunt. Quid est in amphorīs? Potes amphoram movēre.',
        lookSg: 'Haec amphora magna et gravis est. Quid est in hāc amphorā? Potes amphoram movēre.',
        on: { 'moveo': 'Amphorās movēre vīs, sed amphorae gravēs sunt et sē nōn movent.' },
        onSg: {
            'moveo': [
                'Amphoram movēre vīs, sed gravis est: plēna est.',
                'Aliam amphoram movēs. Sub hāc amphorā nihil est.',
                'Aliam amphoram movēs… et in amphorā aliquid sonat!'
            ],
            'tango': ['Amphoram tangis. Frīgida et gravis est.']
        }
    }
};

// The verbs of acting on things, keyed by lemma. `does`: look, open, close, respond (the object's `on`
// line, else `fallback`, else a refusal), rise (stand up: surgō, or stō with no object), take (into
// the inventory: only something `portable`), or drop (out of it, here). `you` is the verb's second
// person, for saying what the player did ("Pānem tollis.").
// A verb with `prep` takes "in" + the ablative instead of an accusative ("in lectō dormiō") and asks
// "Ubi vīs …?" when used alone. `requires` names the object flag the action needs (surface, bed);
// `posture` is where the action leaves the player (sitting, lying, or standing on something), and
// while they are there they cannot walk away. `consumes` eats an edible object. `withObject` makes
// the verb another verb when it has an object: "surgō in mēnsā" is recast as "stō in mēnsā".
// Be generous with synonyms: a verb with `sameAs` answers with that verb's lines, so a synonym costs
// one entry here (and its forms in VOCAB_LEMMA). The recast keeps the verb the player chose.
const ACTIONS = {
    'investigo': { first_person: 'investīgō', infinitive: 'investīgāre', does: 'look' },
    'inspicio': { first_person: 'īnspiciō', infinitive: 'īnspicere', does: 'look' },
    'specto': { first_person: 'spectō', infinitive: 'spectāre', does: 'look' },
    'video': { first_person: 'videō', infinitive: 'vidēre', does: 'look' },
    'aperio': { first_person: 'aperiō', infinitive: 'aperīre', does: 'open' },
    'claudo': { first_person: 'claudō', infinitive: 'claudere', does: 'close' },
    'tango': { first_person: 'tangō', infinitive: 'tangere', does: 'respond', fallback: '{Acc} tangis.' },
    'moveo': { first_person: 'moveō', infinitive: 'movēre', does: 'respond' },
    'olfacio': { first_person: 'olfaciō', infinitive: 'olfacere', does: 'respond' },
    'saluto': { first_person: 'salūtō', infinitive: 'salūtāre', does: 'respond' },
    'bibo': { first_person: 'bibō', infinitive: 'bibere', does: 'respond' },
    'edo': { first_person: 'edō', infinitive: 'edere', does: 'respond', requires: 'edible', consumes: true },
    'comedo': { first_person: 'comedō', infinitive: 'comedere', does: 'respond', requires: 'edible', consumes: true, sameAs: 'edo' },
    'consido': { first_person: 'cōnsīdō', infinitive: 'cōnsīdere', does: 'respond', prep: 'in', requires: 'surface', posture: 'sit', fallback: 'In {abl} cōnsīdis.' },
    'sedeo': { first_person: 'sedeō', infinitive: 'sedēre', does: 'respond', prep: 'in', requires: 'surface', posture: 'sit', fallback: 'In {abl} sedēs.', sameAs: 'consido' },
    'recumbo': { first_person: 'recumbō', infinitive: 'recumbere', does: 'respond', prep: 'in', requires: 'surface', posture: 'lie', fallback: 'In {abl} recumbis.', sameAs: 'consido' },
    'dormio': { first_person: 'dormiō', infinitive: 'dormīre', does: 'respond', prep: 'in', requires: 'bed', posture: 'lie' },
    'sto': { first_person: 'stō', infinitive: 'stāre', does: 'respond', prep: 'in', requires: 'surface', posture: 'stand', fallback: 'In {abl} stās!' },
    'surgo': { first_person: 'surgō', infinitive: 'surgere', does: 'rise', prep: 'in', withObject: 'sto' },
    'descendo': { first_person: 'dēscendō', infinitive: 'dēscendere', does: 'rise' },
    'caco': { first_person: 'cacō', infinitive: 'cacāre', does: 'respond', prep: 'in' },
    'capio': { first_person: 'capiō', infinitive: 'capere', does: 'take', you: 'capis' },
    'tollo': { first_person: 'tollō', infinitive: 'tollere', does: 'take', you: 'tollis' },
    'sumo': { first_person: 'sūmō', infinitive: 'sūmere', does: 'take', you: 'sūmis' },
    'pono': { first_person: 'pōnō', infinitive: 'pōnere', does: 'drop', you: 'pōnis' }
};

// The movement verbs, recognised by lemma. `stem` forgives forms the vocabulary does not list.
const VERBS = {
    'move': { first_person: 'eō', lemma: 'eo' },
    'walk': { first_person: 'ambulō', lemma: 'ambulo', stem: 'ambul' }
};

// The player speaks in the first person where the narrator says "you": the game's "Cubiculum Tuum"
// is "Cubiculum Meum" in the player's mouth. Each key is the player's lemma, its value the narrator's.
const PLAYER_VOICE = { 'meus': 'tuus' };

// Each room's name in the cases the game says it in: `acc` for "eō in …", `abl` for "in …".
// `said` is the accusative as the PLAYER says it, where that differs from the narrator's.
const ROOM_NAMES = {
    'cubiculum_tuum': { nom: 'Cubiculum Tuum', acc: ['in', 'Cubiculum', 'Tuum'], said: ['in', 'Cubiculum', 'Meum'], abl: 'Cubiculō Tuō', requiredLemmas: ['cubiculum', 'tuus'] },
    'cubiculum_sororis': { nom: 'Cubiculum Sorōris', acc: ['in', 'Cubiculum', 'Sorōris'], abl: 'Cubiculō Sorōris', requiredLemmas: ['cubiculum', 'soror'] },
    'cubiculum_parentum': { nom: 'Cubiculum Parentum', acc: ['in', 'Cubiculum', 'Parentum'], abl: 'Cubiculō Parentum', requiredLemmas: ['cubiculum', 'parens'] },
    'ala_larum': { nom: 'Āla Lārum', acc: ['in', 'Ālam', 'Lārum'], abl: 'Ālā Lārum', requiredLemmas: ['ala', 'lar'] },
    'ala_hermae': { nom: 'Āla Hermae', acc: ['in', 'Ālam', 'Hermae'], abl: 'Ālā Hermae', requiredLemmas: ['ala', 'herma'] },
    'via_west': { nom: 'Via', acc: ['in', 'Viam'], abl: 'Viā', requiredLemmas: ['via'] },
    'via_east': { nom: 'Via', acc: ['in', 'Viam'], abl: 'Viā', requiredLemmas: ['via'] },
    'taberna': { nom: 'Taberna', acc: ['in', 'Tabernam'], abl: 'Tabernā', requiredLemmas: ['taberna'] },
    'fauces': { nom: 'Faucēs', acc: ['in', 'Faucēs'], abl: 'Faucibus', requiredLemmas: ['fauces'] },
    'atrium': { nom: 'Ātrium', acc: ['in', 'Ātrium'], abl: 'Ātriō', requiredLemmas: ['atrium'] },
    'tablinum': { nom: 'Tablīnum', acc: ['in', 'Tablīnum'], abl: 'Tablīnō', requiredLemmas: ['tablinum'] },
    'peristylum': { nom: 'Peristȳlum', acc: ['in', 'Peristȳlum'], abl: 'Peristȳlō', requiredLemmas: ['peristylum'] },
    'triclinium': { nom: 'Triclīnium', acc: ['in', 'Triclīnium'], abl: 'Triclīniō', requiredLemmas: ['triclinium'] },
    'culina': { nom: 'Culīna', acc: ['in', 'Culīnam'], abl: 'Culīnā', requiredLemmas: ['culina'] },
    'cella': { nom: 'Cella', acc: ['in', 'Cellam'], abl: 'Cellā', requiredLemmas: ['cella'] },
};

const VOCAB_LEMMA = {
    'a': { pos:'prep', lemma: 'ā/ab (+abl.)', def: 'from, away from, by', level: 'core', forms: {'a':{}, 'ab':{}} },
    'ad': { pos:'prep', lemma: 'ad (+acc.)', def: 'to, toward, at', level: 'core', forms: {'ad':{}} },
    'adsum': { pos:'verb', lemma: 'adsum, adesse, adfuī', def: 'to be here, be present', level: 'outer', forms: { 'adest':{person:3, num:'sg', tense:'present'} } },
    'affectus': { pos:'adj', lemma: 'affectus, -a, -um', def: ['affected', 'moved'], level: 'outer', forms: {'affectus':{}} },
    'ala': { pos:'noun', lemma: 'ala, -ae, f.', def: ['wing', 'side-room'], level: 'novum', forms: { 'ala':{num:'sg'}, 'alā':{num:'sg', case:'abl'}, 'ālam':{num:'sg', case:'acc'} } },
    'aliquid': { pos:'pronoun', lemma: 'aliquid', def: 'something', level: 'core', forms: {'aliquid':{}} },
    'alius': { pos:'adj', lemma: 'alius, alia, aliud', def: ['other', 'else'], level: 'core', forms: { 'aliud':{}, 'aliī':{num:'pl', def:'others'}, 'aliam':{}, 'aliae':{num:'pl'} } },
    'altus': { pos:'adj', lemma: 'altus, -a, -um', def: ['tall', 'high'], level: 'novum', forms: { 'altae':{num:'pl'}, 'alta':{} } },
    'ambulo': { pos:'verb', lemma: 'ambulō, -āre, -āvī', def: 'to walk', level: 'core', forms: { 'ambulō':{person:1, num:'sg', tense:'present'}, 'ambulat':{person:3, num:'sg', tense:'present'}, 'ambulāre':{}, 'ambulā':{def:'walk!'} } },
    'amphora': { pos:'noun', lemma: 'amphora, -ae, f.', def: 'jar', level: 'novum', forms: { 'amphora': {num:'sg'}, 'amphorae': {num:'pl'}, 'amphorās':{num:'pl', case:'acc'}, 'amphorīs':{num:'pl', case:'abl'}, 'amphoram':{num:'sg', case:'acc'}, 'amphorā':{num:'sg', case:'abl'} } },
    'angulus': { pos:'noun', lemma: 'angulus, -ī, m.', def: 'corner', level: 'novum', forms: { 'angulō':{num:'sg', case:'abl'} } },
    'antiquus': { pos:'adj', lemma: 'antīquus, -a, -um', def: ['old', 'ancient'], level: 'novum', forms: { 'antīqua':{} } },
    'aperio': { pos:'verb', lemma: 'aperiō, aperīre, aperuī', def: 'to open', level: 'core', forms: { 'aperit':{person:3, num:'sg', tense:'present'}, 'aperta':{def:'open'}, 'apertum':{def:'open'}, 'aperiō':{person:1, num:'sg', tense:'present'}, 'aperīre':{} } },
    'aqua': { pos:'noun', lemma: 'aqua, -ae, f.', def: 'water', level: 'core', forms: {'aqua': {num:'sg'}, 'aquam':{num:'sg', case:'acc'} } },
    'arbor': { pos:'noun', lemma: 'arbor, arboris, f.', def: 'tree', level: 'core', forms: { 'arbor':{num:'sg'}, 'arbore':{num:'sg', case:'abl'}, 'arborēs':{num:'pl'}, 'arborem':{num:'sg', case:'acc'}, 'arboribus':{num:'pl', case:'abl'} } },
    'armarium': { pos:'noun', lemma: 'armārium, -ī, n.', def: ['closet', 'cupboard'], level: 'outer', forms: { 'armarium': {num:'sg'}, 'armario': {num:'sg', case:'abl'} } },
    'atrium': { pos:'noun', lemma: 'ātrium, -ī, n.', def: ['atrium', 'main hall'], level: 'outer', forms: { 'atrium':{num:'sg'}, 'ātrium':{num:'sg'}, 'ātriō':{num:'sg', case:'abl'} } },
    'attat': { pos:'interjection', lemma: 'attat!', def: 'aha!', level: 'outer', forms: {'attat':{}} },
    'audio': { pos:'verb', lemma: 'audiō, audīre, audīvī', def: ['to hear', 'to listen'], level: 'core', forms: { 'audīs':{person:2, num:'sg', tense:'present'}, 'audit':{person:3, num:'sg', tense:'present'} } },
    'aut': { pos:'conj', lemma: 'aut (conj.)', def: 'or', level: 'novum', forms: { 'aut':{} } },
    'avis': { pos:'noun', lemma: 'avis, avis, f.', def: 'bird', level: 'core', forms: { 'avis':{num:'sg'} } },
    'avus': { pos:'noun', lemma: 'avus, -ī, m.', def: 'grandfather', level: 'novum', forms: { 'avus': {num:'sg'}, 'avī': {num:'sg', case:'gen'} } },
    'bene': { pos:'adv', lemma: 'bene (adv.)', def: 'well', level: 'novum', forms: { 'bene':{} } },
    'bibo': { pos:'verb', lemma: 'bibō, bibere, bibī', def: 'to drink', level: 'novum', forms: { 'bibō':{person:1, num:'sg', tense:'present'}, 'bibere':{}, 'bibis':{person:2, num:'sg', tense:'present'} } },
    'bonus': { pos:'adj', lemma: 'bonus, -a, -um', def: 'good', level: 'core', forms: { 'bonus':{}, 'bona':{} } },
    'caco': { pos:'verb', lemma: 'cacō, cacāre, cacāvī', def: 'to poop', level: 'outer', forms: { 'cacō':{person:1, num:'sg', tense:'present'}, 'cacāre':{}, 'cacās':{person:2, num:'sg', tense:'present'}, 'cacat':{person:3, num:'sg', tense:'present'} } },
    'cado': { pos:'verb', lemma: 'cadō, cadere, cecidī', def: 'to fall', level: 'novum', forms: { 'cadit':{person:3, num:'sg', tense:'present'} } },
    'caelum': { pos:'noun', lemma: 'caelum, -ī, n.', def: 'sky', level: 'outer', forms: { 'caelum':{num:'sg'}, 'caelō':{num:'sg', case:'abl'} } },
    'capio': { pos:'verb', lemma: 'capiō, capere, cēpī', def: ['to take', 'to pick up'], level: 'novum', forms: { 'capiō':{person:1, num:'sg', tense:'present'}, 'capere':{}, 'capis':{person:2, num:'sg', tense:'present'} } },
    'cautus': { pos:'adj', lemma: 'cautus, -a, -um', def: 'careful', level: 'outer', forms: { 'cautus':{} } },
    'cella': { pos:'noun', lemma: 'cella, -ae, f.', def: 'storeroom', level: 'outer', forms: { 'cella':{num:'sg'}, 'cellā':{num:'sg', case:'abl'}, 'cellam':{num:'sg', case:'acc'} } },
    'ceno': { pos:'verb', lemma: 'cēnō, cēnāre, cēnāvī', def: 'to dine, eat dinner', level: 'novum', forms: { 'cēnant':{person:3, num:'pl', tense:'present'} } },
    'circum': { pos:'prep', lemma: 'circum (+acc.)', def: 'around', level: 'novum', forms: { 'circum':{} } },
    'clarus': { pos:'adj', lemma: 'clārus, -a, -um', def: 'clear, bright', level: 'outer', forms: { 'clarum':{}, 'clārum':{} } },
    'claudo': { pos:'verb', lemma: 'claudō, claudere, clausī', def: 'to close', level: 'core', forms: { 'claudit':{person:3, num:'sg', tense:'present'}, 'clausa':{def:'closed'}, 'clausum':{def:'closed'}, 'claudō':{person:1, num:'sg', tense:'present'}, 'claudere':{} } },
    'columna': { pos:'noun', lemma: 'columna, -ae, f.', def: ['column', 'pillar'], level: 'novum', forms: { 'columna':{num:'sg'}, 'columnae':{num:'pl'} } },
    'comedo': { pos:'verb', lemma: 'comedō, comedere, comēdī', def: 'to eat (up)', level: 'novum', forms: { 'comedō':{person:1, num:'sg', tense:'present'}, 'comedere':{}, 'comedis':{person:2, num:'sg', tense:'present'} } },
    'consido': { pos:'verb', lemma: 'cōnsīdō, cōnsīdere, cōnsēdī', def: 'to sit down', level: 'core', forms: { 'cōnsīdō':{person:1, num:'sg', tense:'present'}, 'cōnsīdere':{}, 'cōnsīdis':{person:2, num:'sg', tense:'present'} } },
    'coram': { pos:'adv', lemma: 'cōram (adv.)', def: ['face to face', 'in person'], level: 'outer', forms: {'coram':{}} },
    'cubiculum': { pos:'noun', lemma: 'cubiculum, -ī, n.', def: 'bedroom', level: 'outer', forms: { 'cubiculum':{num:'sg'}, 'cubiculō':{num:'sg', case:'abl'}, 'cubiculī':{num:'sg', case:'gen'} } },
    'culina': { pos:'noun', lemma: 'culīna, -ae, f.', def: 'kitchen', level: 'core', forms: { 'culina':{num:'sg'}, 'culīna':{num:'sg'}, 'culīnā':{num:'sg', case:'abl'}, 'culīnam':{num:'sg', case:'acc'} } },
    'cum': { pos:'prep', lemma: 'cum (+abl.)', def: 'with', level: 'core', forms: {'mecum':{}} },
    'curiosus': { pos:'adj', lemma: 'cūriōsus, -a, -um', def: 'curious', level: 'outer', forms: { 'cūriōsus':{} } },
    'curo': { pos:'verb', lemma: 'cūrō, cūrāre, cūrāvī', def: 'to care (about)', level: 'core', forms: { 'cūrat':{person:3, num:'sg', tense:'present'}, 'cūrant':{person:3, num:'pl', tense:'present'} } },
    'de': { pos:'prep', lemma: 'dē (+abl.)', def: 'from, down from, about', level: 'core', forms: {'de':{}} },
    'descendo': { pos:'verb', lemma: 'dēscendō, dēscendere, dēscendī', def: ['to climb down', 'to come down'], level: 'novum', forms: { 'dēscendō':{person:1, num:'sg', tense:'present'}, 'dēscendere':{}, 'dēscendis':{person:2, num:'sg', tense:'present'}, 'dēscende':{def:'come down!'} } },
    'deus': { pos:'noun', lemma: 'deus, -ī, m.', def: 'god', level: 'core', forms: { 'deī':{num:'pl'}, 'deīs':{num:'pl', case:'dat'} } },
    'dexter': { pos:'adj', lemma: 'dexter, dextra, dextrum', def: 'right', level: 'outer', forms: { 'dexteram':{num:'sg', case:'acc'} } },
    'dico': { pos:'verb', lemma: 'dīcō, dīcere, dīxī', def: ['to say', 'to speak'], level: 'core', forms: {'dicit': {person:3, num:'sg', tense:'present'}} },
    'dominus': { pos:'noun', lemma: 'dominus, -ī, m.', def: ['master', 'lord'], level: 'core', forms: { 'dominus':{num:'sg'} } },
    'domus': { pos:'noun', lemma: 'domus, -ūs, f.', def: ['house', 'home'], level: 'core', forms: {'domus':{num:'sg'}, 'domī':{case:'loc'}, 'domum':{num:'sg', case:'acc'} } },
    'dormio': { pos:'verb', lemma: 'dormiō, dormīre, dormīvī', def: 'to sleep', level: 'core', forms: { 'dormio':{person:1, num:'sg', tense:'present'}, 'dormit':{person:3, num:'sg', tense:'present'}, 'dormire':{}, 'dormiebam':{person:1, num:'sg', tense:'imperfect'}, 'dormiturus':{} } },
    'duo': { pos:'adj', lemma: 'duo, duae, duo', def: 'two', level: 'outer', forms: { 'duo':{} } },
    'edo': { pos:'verb', lemma: 'edō, edere, ēdī', def: 'to eat', level: 'core', forms: { 'edō':{person:1, num:'sg', tense:'present'}, 'edere':{}, 'edis':{person:2, num:'sg', tense:'present'}, 'edam':{def:'I will eat'} } },
    'ego': { pos:'pronoun', lemma: 'ego, meī, mihi, mē', def: ['I', 'me'], level: 'core', forms: { 'ego':{}, 'mē':{def:'me'} } },
    'eo': { pos:'verb', lemma: 'eō, īre, iī/īvī', def: 'to go', level: 'core', forms: {'eo':{person:1, num:'sg', tense:'present'}, 'ire':{}, 'it':{person:3, num:'sg', tense:'present'}, 'ī':{def:'go!'}} },
    'et': { pos:'conj', lemma: 'et (conj.)', def: 'and', level: 'core', forms: {'et':{}} },
    'etiam': { pos:'adv', lemma: 'etiam (adv.)', def: ['also', 'even', 'too'], level: 'outer', forms: { 'etiam':{} } },
    'facio': { pos:'verb', lemma: 'faciō, facere, fēcī', def: ['to do', 'to make'], level: 'core', forms: { 'facere':{} } },
    'fauces': { pos:'noun', lemma: 'faucēs, -ium, f.pl.', def: ['entrance', 'jaws'], level: 'outer', forms: { 'fauces':{num:'pl'}, 'faucēs':{num:'pl'}, 'faucibus':{num:'pl', case:'abl'} } },
    'figura': { pos:'noun', lemma: 'figūra, -ae, f.', def: ['figure', 'shape'], level: 'outer', forms: { 'figura':{num:'sg'}, 'figurae':{num:'pl'}, 'figuram':{num:'sg', case:'acc'} } },
    'focus': { pos:'noun', lemma: 'focus, -ī, m.', def: 'hearth', level: 'novum', forms: {'focus':{num:'sg'}} },
    'frigidus': { pos:'adj', lemma: 'frīgidus, -a, -um', def: 'cold', level: 'novum', forms: { 'frīgida':{}, 'frīgidī':{num:'pl'} } },
    'gratia': { pos:'noun', lemma: 'grātia, -ae, f.', def: ['thanks', 'gratitude'], level: 'outer', forms: { 'grātia':{num:'sg'} } },
    'gravis': { pos:'adj', lemma: 'gravis, -e', def: 'heavy', level: 'novum', forms: { 'gravis':{}, 'gravēs':{num:'pl'} } },
    'habeo': { pos:'verb', lemma: 'habeō, -ēre, -uī', def: ['to have', 'to hold'], level: 'core', forms: { 'habet':{person:3, num:'sg', tense:'present'}, 'habeo':{person:1, num:'sg', tense:'present'}, 'habere':{}, 'habesne':{person:2, num:'sg', tense:'present', enclitic:'ne'}, 'habebant':{person:3, num:'pl', tense:'imperfect'}, 'habēs':{person:2, num:'sg', tense:'present'} } },
    'herba': { pos:'noun', lemma: 'herba, -ae, f.', def: 'plant', level: 'core', forms: { 'herba':{num:'sg'}, 'herbae':{num:'pl'}, 'herbās':{num:'pl', case:'acc'}, 'herbīs':{num:'pl', case:'abl'} } },
    'herma': { pos:'noun', lemma: 'herma, -ae, f.', def: ['herm', 'bust'], level: 'novum', forms: {'herma':{num:'sg'}, 'hermae':{num:'sg', case:'gen'}, 'hermam':{num:'sg', case:'acc'}, 'hermā':{num:'sg', case:'abl'} } },
    'hic': { pos:'pronoun', lemma: 'hic, haec, hoc', def: ['this', 'these'], level: 'core', forms: {'hic':{}, 'haec':{}, 'hoc':{}, 'hae':{}, 'hī':{}, 'hāc':{}, 'hanc':{}, 'hīs':{} } },
    'hortus': { pos:'noun', lemma: 'hortus, -ī, m.', def: 'garden', level: 'novum', forms: {'hortus':{num:'sg'}} },
    'iam': { pos:'adv', lemma: 'iam (adv.)', def: 'now, already', level: 'core', forms: {'iam':{}} },
    'ianua': { pos:'noun', lemma: 'iānua, -ae, f.', def: 'door', level: 'outer', forms: { 'ianua':{num:'sg'}, 'ianuae':{num:'pl'}, 'ianuam':{num:'sg', case:'acc'}, 'iānuā':{num:'sg', case:'abl'} } },
    'ibi': { pos:'adv', lemma: 'ibi (adv.)', def: 'there', level: 'novum', forms: { 'ibi':{} } },
    'illac': { pos:'adv', lemma: 'illāc (adv.)', def: 'that way, by that route', level: 'novum', forms: { 'illāc':{} } },
    'illuc': { pos:'adv', lemma: 'illūc (adv.)', def: 'to that place, there', level: 'novum', forms: { 'illuc':{} } },
    'imago': { pos:'noun', lemma: 'imāgō, -inis, f.', def: ['image', 'bust', 'ancestral mask'], level: 'novum', forms: { 'imago':{num:'sg'}, 'imaginis':{num:'sg', case:'gen'}, 'imaginem':{num:'sg', case:'acc'}, 'imagines':{num:'pl'}, 'imāginēs':{num:'pl'} } },
    'immobilis': { pos:'adj', lemma: 'immōbilis, -e', def: 'motionless', level: 'outer', forms: { 'immōbilis':{}, 'immōbilēs':{num:'pl'} } },
    'impluvium': { pos:'noun', lemma: 'impluvium, -ī, n.', def: 'impluvium (water basin)', level: 'novum', forms: { 'impluvium':{num:'sg'}, 'impluviō':{num:'sg', case:'abl'}, 'impluviī':{num:'sg', case:'gen'} } },
    'in': { pos:'prep', lemma: 'in (+abl./acc.)', def: 'in, on, into, onto', level: 'core', forms: {'in':{}} },
    'insomnia': { pos:'noun', lemma: 'īnsomnia, -ae, f.', def: 'sleeplessness', level: 'outer', forms: { 'īnsomniam':{num:'sg', case:'acc'} } },
    'inspicio': { pos:'verb', lemma: 'īnspiciō, īnspicere, īnspexī', def: 'to look into, inspect', level: 'outer', forms: { 'īnspiciō':{person:1, num:'sg', tense:'present'}, 'īnspicere':{}, 'īnspicit':{person:3, num:'sg', tense:'present'} } },
    'intellego': { pos:'verb', lemma: 'intellegō, -ere, -lēxī', def: 'to understand', level: 'novum', forms: { 'intellegō':{person:1, num:'sg', tense:'present' }, 'intellegis':{person:2, num:'sg', tense:'present' } } },
    'investigo': { pos:'verb', lemma: 'investīgō, investīgāre, investīgāvī', def: 'to investigate', level: 'outer', forms: { 'investīgō':{person:1, num:'sg', tense:'present'}, 'investīgāre':{}, 'investīgat':{person:3, num:'sg', tense:'present'} } },
    'is': { pos:'pronoun', lemma: 'is, ea, id', def: ['he', 'she', 'it', 'that'], level: 'core', forms: {'is':{}, 'ea':{}, 'id':{}, 'eius':{def:'his, her, its'} } },
    'iterum': { pos:'adv', lemma: 'iterum (adv.)', def: 'again', level: 'core', forms: {'iterum':{}} },
    'laboro': { pos:'verb', lemma: 'labōrō, -āre, -āvī', def: 'to work', level: 'core', forms: { 'labōrat':{person:3, num:'sg', tense:'present'} } },
    'lapideus': { pos:'adj', lemma: 'lapideus, -a, -um', def: 'made of stone', level: 'novum', forms: { 'lapidea':{}, 'lapideī':{num:'pl'} } },
    'lar': { pos:'noun', lemma: 'Lār, Laris, m.', def: 'household god', level: 'novum', forms: { 'lar':{num:'sg'}, 'lares':{num:'pl'}, 'larum':{num:'pl', case:'gen'}, 'Laribus':{num:'pl', case:'abl'} } },
    'lararium': { pos:'noun', lemma: 'larārium, -ī, n.', def: 'shrine for the Lares', level: 'novum', forms: { 'larārium':{num:'sg'}, 'larāriō':{num:'sg', case:'abl'} } },
    'latrina': { pos:'noun', lemma: 'latrīna, -ae, f.', def: 'lavatory, toilet', level: 'novum', forms: { 'latrīna':{num:'sg'}, 'lātrīnam':{num:'sg', case:'acc'}, 'lātrīnā':{num:'sg', case:'abl'} } },
    'lectus': { pos:'noun', lemma: 'lectus, -ī, m.', def: ['bed', 'couch'], level: 'core', forms: { 'lectus':{num:'sg'}, 'lectum':{num:'sg', case:'acc'}, 'lecti':{num:'pl'}, 'lectos':{num:'pl', case:'acc'}, 'lectis':{num:'pl', case:'abl'}, 'lectō':{num:'sg', case:'abl'} } },
    'longus': { pos:'adj', lemma: 'longus, -a, -um', def: 'long', level: 'novum', forms: { 'longa':{} } },
    'macte': { pos:'interjection', lemma: 'macte!', def: 'well done!', level: 'outer', forms: {'macte':{}} },
    'magnus': { pos:'adj', lemma: 'magnus, -a, -um', def: ['large', 'great'], level: 'core', forms: {'magnus':{}, 'magna':{}, 'magnum':{}, 'magnae':{num:'pl'}, 'magnī':{num:'pl'} } },
    'male': { pos:'adv', lemma: 'male (adv.)', def: 'badly', level: 'novum', forms: { 'male':{} } },
    'mater': { pos:'noun', lemma: 'māter, mātris, f.', def: 'mother', level: 'novum', forms: {'mater':{num:'sg'}, 'matris':{num:'sg', case:'gen'}} },
    'mensa': { pos:'noun', lemma: 'mēnsa, -ae, f.', def: 'table', level: 'outer', forms: {'mensa':{num:'sg'}, 'mēnsa':{num:'sg'}, 'mensam':{num:'sg', case:'acc'}} },
    'meus': { pos:'adj', lemma: 'meus, -a, -um', def: 'my, mine', level: 'core', forms: { 'meum':{} } },
    'minime': { pos:'adv', lemma: 'minimē (adv.)', def: 'no! not at all!', level: 'outer', forms: { 'minimē':{} } },
    'mollis': { pos:'adj', lemma: 'mollis, -e', def: 'soft', level: 'novum', forms: { 'mollis':{} } },
    'mortalis': { pos:'adj', lemma: 'mortālis, -e', def: 'mortal', level: 'core', forms: {'mortalis':{}, 'mortale':{}} },
    'moveo': { pos:'verb', lemma: 'moveō, movēre, mōvī', def: 'to move', level: 'core', forms: { 'moveō':{person:1, num:'sg', tense:'present'}, 'movēre':{}, 'movet':{person:3, num:'sg', tense:'present'}, 'movent':{person:3, num:'pl', tense:'present'}, 'movēs':{person:2, num:'sg', tense:'present'} } },
    'multus': { pos:'adj', lemma: 'multus, -a, -um', def: 'many, much', level: 'core', forms: { 'multae':{num:'pl'}, 'multa':{num:'pl'} } },
    'murmur': { pos:'noun', lemma: 'murmur, murmuris, n.', def: ['a murmur', 'rumbling'], level: 'outer', forms: {'murmur':{num:'sg'}, 'murmure':{num:'sg', case:'abl'}} },
    'murus': { pos:'noun', lemma: 'murus, -ī, m.', def: 'wall', level: 'novum', forms: { 'murus':{num:'sg'}, 'muri':{num:'pl'}, 'murī':{num:'pl'}, 'murīs':{num:'pl', case:'abl'} } },
    'neque': { pos:'conj', lemma: 'neque (conj.)', def: 'and not, nor', level: 'core', forms: { 'neque':{} } },
    'nihil': { pos:'pronoun', lemma: 'nihil', def: 'nothing', level: 'novum', forms: { 'nihil':{} } },
    'noctua': { pos:'noun', lemma: 'noctua, -ae, f.', def: 'owl', level: 'core', forms: { 'noctua':{num:'sg'}, 'noctuam':{num:'sg', case:'acc'}, 'noctuā':{num:'sg', case:'abl'} } },
    'non': { pos:'adv', lemma: 'nōn (adv.)', def: 'not', level: 'core', forms: { 'nōn':{} } },
    'novus': { pos:'adj', lemma: 'novus, -a, -um', def: ['new', 'fresh'], level: 'novum', forms: { 'novus':{} } },
    'nox': { pos:'noun', lemma: 'nox, noctis, f.', def: 'night', level: 'core', forms: {'nox':{num:'sg'}, 'noctem':{num:'sg', case:'acc'}, 'nocte':{num:'sg', case:'abl'}} },
    'nullus': { pos:'adj', lemma: 'nūllus, -a, -um', def: ['no', 'none'], level: 'novum', forms: { 'nūllus':{} } },
    'nunc': { pos:'adv', lemma: 'nunc (adv.)', def: 'now', level: 'outer', forms: { 'nunc':{} } },
    'obscurus': { pos:'adj', lemma: 'obscūrus, -a, -um', def: 'dark', level: 'outer', forms: { 'obscūra':{}, 'obscūrae':{num:'pl'}, 'obscūrum':{}, 'obscūrissima':{def:'very dark'}, 'obscūrī':{num:'pl'} } },
    'oculus': { pos:'noun', lemma: 'oculus, -ī, m.', def: 'eye', level: 'core', forms: {'oculi':{num:'pl'}, 'oculis':{num:'pl', case:'abl'}, 'oculos':{num:'pl', case:'acc'}} },
    'oleo': { pos:'verb', lemma: 'oleō, olēre, oluī', def: 'to smell, give off a smell', level: 'novum', forms: { 'olet':{person:3, num:'sg', tense:'present'}, 'olent':{person:3, num:'pl', tense:'present'} } },
    'olfacio': { pos:'verb', lemma: 'olfaciō, olfacere, olfēcī', def: 'to smell (something)', level: 'novum', forms: { 'olfaciō':{person:1, num:'sg', tense:'present'}, 'olfacere':{}, 'olfacis':{person:2, num:'sg', tense:'present'} } },
    'omnis': { pos:'adj', lemma: 'omnis, -e', def: ['all', 'every'], level: 'core', forms: { 'omnia':{def:'all things, everything'}, 'omnēs':{def:'all, everyone'} } },
    'optimus': { pos:'adj', lemma: 'optimus, -a, -um', def: ['best', 'excellent'], level: 'core', forms: { 'optimus':{}, 'optima':{}, 'optimē':{def:'very well, excellently'} } },
    'panis': { pos:'noun', lemma: 'pānis, pānis, m.', def: 'bread', level: 'core', forms: { 'pānis':{num:'sg'}, 'pānem':{num:'sg', case:'acc'}, 'pāne':{num:'sg', case:'abl'} } },
    'parens': { pos:'noun', lemma: 'parēns, parentis, m./f.', def: 'parent', level: 'core', forms: { 'parentum':{num:'pl', case:'gen'}, 'parentes':{num:'pl'} } },
    'parvus': { pos:'adj', lemma: 'parvus, -a, -um', def: 'small', level: 'outer', forms: {'parvus':{}, 'parva':{}, 'parvum':{}, 'parvī':{num:'pl'} } },
    'pater': { pos:'noun', lemma: 'pater, patris, m.', def: 'father', level: 'core', forms: { 'pater':{num:'sg'}, 'patris':{num:'sg', case:'gen'} } },
    'peristylum': { pos:'noun', lemma: 'peristylum, -ī, n.', def: 'peristyle', level: 'outer', forms: { 'peristylum':{num:'sg'}, 'peristylō':{num:'sg', case:'abl'} } },
    'perterritus': { pos:'adj', lemma: 'perterritus, -a, -um', def: 'terrified', level: 'outer', forms: { 'perterritus':{} } },
    'phantasma': { pos:'noun', lemma: 'phantasma, -atis, n.', def: ['ghost', 'apparition'], level: 'outer', forms: {'phantasma':{}, 'phantasmate':{case:'abl'}, 'phantasmatis':{case:'gen'}, 'phantasmata':{}, 'phantasmatum':{case:'gen', num:'pl'}} },
    'pictura': { pos:'noun', lemma: 'pictūra, -ae, f.', def: ['picture', 'painting'], level: 'outer', forms: { 'pictūra':{num:'sg'}, 'pictūrae':{num:'pl'}, 'pictūrīs':{num:'pl', case:'abl'}, 'pictūrās':{num:'pl', case:'acc'} } },
    'plenus': { pos:'adj', lemma: 'plēnus, -a, -um', def: 'full', level: 'novum', forms: { 'plēna':{} } },
    'pono': { pos:'verb', lemma: 'pōnō, pōnere, posuī', def: ['to put', 'to put down'], level: 'novum', forms: { 'pōnō':{person:1, num:'sg', tense:'present'}, 'pōnere':{}, 'pōnis':{person:2, num:'sg', tense:'present'} } },
    'possum': { pos:'verb', lemma: 'possum, posse, potuī', def: 'to be able, can', level: 'core', forms: { 'possum':{person:1, num:'sg', tense:'present'}, 'potes':{person:2, num:'sg', tense:'present'} } },
    'primum': { pos:'adv', lemma: 'prīmum (adv.)', def: 'first', level: 'novum', forms: { 'prīmum':{} } },
    'prope': { pos:'adv', lemma: 'prope (adv.)', def: 'near, nearby', level: 'core', forms: { 'prope':{} } },
    'prorsus': { pos:'adv', lemma: 'prōrsus (adv.)', def: 'forwards, straight ahead', level: 'outer', forms: { 'prōrsus':{} } },
    'puer': { pos:'noun', lemma: 'puer, puerī, m.', def: 'boy', level: 'core', forms: { 'puer':{num:'sg'}, 'puerī':{num:'pl'} } },
    'pulcher': { pos:'adj', lemma: 'pulcher, pulchra, pulchrum', def: 'beautiful', level: 'core', forms: { 'pulcher':{}, 'pulchra':{}, 'pulcherrima':{def:'very beautiful'}, 'pulchrae':{num:'pl'}, 'pulchrum':{} } },
    'puto': { pos:'verb', lemma: 'putō, putāre, putāvī', def: 'to think', level: 'core', forms: { 'putat':{person:3, num:'sg', tense:'present'}, 'putavit':{person:3, num:'sg', tense:'perfect'}, 'putabam':{person:1, num:'sg', tense:'imperfect'} } },
    'quadratus': { pos:'adj', lemma: 'quadrātus, -a, -um', def: 'square', level: 'novum', forms: { 'quadrātum':{} } },
    'qui': { pos:'pronoun', lemma: 'quī, quae, quod', def: ['who', 'which'], level: 'core', forms: {'qui':{}, 'quae':{}, 'quod':{}, 'quem':{}, 'quam':{}, 'quō':{case:'abl'}} },
    'quid': { pos:'pronoun', lemma: 'quis, quid', def: 'what?', level: 'core', forms: { 'quid':{} } },
    'quintus': { pos:'noun', lemma: 'Quīntus, -ī, m.', def: 'Quintus', level: 'outer', forms: {'quintus':{}, 'quinti':{case:'gen'}, 'quinto':{case:'abl'}} },
    'quoque': { pos:'adv', lemma: 'quoque (adv.)', def: ['also', 'too'], level: 'novum', forms: {'quoque':{}} },
    'realis': { pos:'adj', lemma: 'reālis, -e', def: 'real', level: 'outer', forms: { 'reālis':{}, 'reālēs':{num:'pl'} } },
    'recumbo': { pos:'verb', lemma: 'recumbō, recumbere, recubuī', def: 'to lie down, recline (at dinner)', level: 'novum', forms: { 'recumbō':{person:1, num:'sg', tense:'present'}, 'recumbere':{}, 'recumbis':{person:2, num:'sg', tense:'present'}, 'recumbunt':{person:3, num:'pl', tense:'present'} } },
    'res': { pos:'noun', lemma: 'rēs, reī, f.', def: ['thing', 'matter', 'object'], level: 'core', forms: {'res':{}, 'rēs':{}} },
    'respondeo': { pos:'verb', lemma: 'respondeō, respondēre, respondī', def: 'to answer', level: 'novum', forms: { 'respondet':{person:3, num:'sg', tense:'present'}, 'respondent':{person:3, num:'pl', tense:'present'} } },
    'rideo': { pos:'verb', lemma: 'rīdeō, rīdēre, rīsī', def: ['to laugh', 'to smile'], level: 'core', forms: {'ridet':{person:3, num:'sg', tense:'present'}, 'rident':{person:3, num:'pl', tense:'present'}} },
    'romanus': { pos:'adj', lemma: 'Rōmānus, -a, -um', def: 'Roman', level: 'outer', forms: {'romanus':{}, 'romani':{num:'pl'}, 'romae':{case:'loc'}} },
    'rosa': { pos:'noun', lemma: 'rosa, -ae, f.', def: 'rose', level: 'core', forms: { 'rosa':{num:'sg'}, 'rosae':{num:'pl'}, 'rosās':{num:'pl', case:'acc'}, 'rosīs':{num:'pl', case:'abl'}, 'rosam':{num:'sg', case:'acc'}, 'rosā':{num:'sg', case:'abl'} } },
    'ruber': { pos:'adj', lemma: 'ruber, rubra, rubrum', def: 'red', level: 'novum', forms: {'ruber':{}, 'rubra':{}, 'rubrum':{}, 'rubri':{num:'pl'}, 'rubrī':{num:'pl'}, 'rubrae':{num:'pl'} } },
    'rursus': { pos:'adv', lemma: 'rūrsus (adv.)', def: 'backwards, again', level: 'outer', forms: { 'rūrsus':{} } },
    'saepe': { pos:'adv', lemma: 'saepe (adv.)', def: 'often', level: 'core', forms: {'saepe':{}} },
    'salto': { pos:'verb', lemma: 'saltō, saltāre, saltāvī', def: 'to dance', level: 'novum', forms: { 'saltant':{person:3, num:'pl', tense:'present'} } },
    'saluto': { pos:'verb', lemma: 'salūtō, salūtāre, salūtāvī', def: 'to greet', level: 'novum', forms: { 'salūtō':{person:1, num:'sg', tense:'present'}, 'salūtāre':{} } },
    'salveo': { pos:'verb', lemma: 'salveō, salvēre', def: 'to be well', level: 'core', forms: { 'salvē':{def:'hello! (to one person)'}, 'salvēte':{def:'hello! (to more than one)'} } },
    'sed': { pos:'conj', lemma: 'sed (conj.)', def: 'but', level: 'core', forms: { 'sed':{} } },
    'sedeo': { pos:'verb', lemma: 'sedeō, sedēre, sēdī', def: 'to sit', level: 'novum', forms: { 'sedeō':{person:1, num:'sg', tense:'present'}, 'sedēre':{}, 'sedēs':{person:2, num:'sg', tense:'present'} } },
    'sella': { pos:'noun', lemma: 'sella, -ae, f.', def: 'chair', level: 'core', forms: { 'sella':{num:'sg'}, 'sellam':{num:'sg', case:'acc'}, 'sellā':{num:'sg', case:'abl'} } },
    'semper': { pos:'adv', lemma: 'semper (adv.)', def: 'always', level: 'core', forms: {'semper':{}} },
    'sentio': { pos:'verb', lemma: 'sentiō, sentīre, sēnsī', def: ['to feel', 'to sense', 'to perceive'], level: 'core', forms: {'sentit':{person:3, num:'sg', tense:'present'}, 'sentiens':{}, 'sentire':{}, 'sentīs':{person:2, num:'sg', tense:'present'} } },
    'sicut': { pos:'adv', lemma: 'sīcut (adv.)', def: 'just as, like', level: 'core', forms: { 'sīcut':{} } },
    'significo': { pos:'verb', lemma: 'sīgnificō, -āre, -āvī', def: 'to mean, signify', level: 'novum', forms: { 'sīgnificat':{person:3, num:'sg', tense:'present'} } },
    'silentium': { pos:'noun', lemma: 'silentium, -ī, n.', def: 'silence', level: 'outer', forms: { 'silentium':{num:'sg'} } },
    'sinister': { pos:'adj', lemma: 'sinister, sinistra, sinistrum', def: 'left', level: 'outer', forms: { 'sinistram':{num:'sg', case:'acc'} } },
    'sono': { pos:'verb', lemma: 'sonō, sonāre, sonuī', def: ['to make a sound', 'to rattle'], level: 'novum', forms: { 'sonat':{person:3, num:'sg', tense:'present'} } },
    'sonus': { pos:'noun', lemma: 'sonus, -ī, m.', def: 'sound', level: 'outer', forms: { 'sonus':{num:'sg'}, 'sonum':{num:'sg', case:'acc'}, 'soni':{num:'pl'}, 'sonos':{num:'pl', case:'acc'} } },
    'soror': { pos:'noun', lemma: 'soror, sorōris, f.', def: 'sister', level: 'novum', forms: {'soror':{num:'sg'}, 'sorōris':{num:'sg', case:'gen'}} },
    'specto': { pos:'verb', lemma: 'spectō, -āre, -āvī', def: 'to watch, look at', level: 'core', forms: { 'spectant':{person:3, num:'pl', tense:'present'}, 'spectō':{person:1, num:'sg', tense:'present'}, 'spectāre':{}, 'spectat':{person:3, num:'sg', tense:'present'} } },
    'sto': { pos:'verb', lemma: 'stō, stāre, stetī', def: 'to stand', level: 'core', forms: { 'stat':{person:3, num:'sg', tense:'present'}, 'stant':{person:3, num:'pl', tense:'present'}, 'stō':{person:1, num:'sg', tense:'present'}, 'stāre':{}, 'stās':{person:2, num:'sg', tense:'present'} } },
    'sub': { pos:'prep', lemma: 'sub (+abl.)', def: 'under', level: 'novum', forms: { 'sub':{} } },
    'subito': { pos:'adv', lemma: 'subitō (adv.)', def: 'suddenly', level: 'core', forms: {'subito':{}} },
    'sui': { pos:'pronoun', lemma: 'sui, sibi, se, se', def: 'himself/herself/itself/themselves', level: 'core', forms: { 'sibi':{case:'dat', def:'for himself/herself/itself/themselves'}, 'sē':{def:'himself, herself, itself, themselves'} } },
    'sum': { pos:'verb', lemma: 'sum, esse, fuī', def: 'to be', level: 'core', forms: { 'sum':{person:1, num:'sg', tense:'present', def:'I am'}, 'esse':{}, 'fuit':{person:3, num:'sg', tense:'perfect', def:'was'}, 'fui':{person:1, num:'sg', tense:'perfect', def:'I was'}, 'fuisse':{}, 'es':{person:2, num:'sg', tense:'present', def:'you are'}, 'est':{person:3, num:'sg', tense:'present'}, 'estne':{person:3, num:'sg', tense:'present', enclitic:'ne'}, 'sunt':{person:3, num:'pl', tense:'present'}, 'eram':{person:1, num:'sg', tense:'imperfect', def:'I was'}, 'erat':{person:3, num:'sg', tense:'imperfect'}, 'erant':{person:3, num:'pl', tense:'imperfect'}, 'eramus':{person:1, num:'pl', tense:'imperfect'}, 'erantne':{person:3, num:'pl', tense:'imperfect', enclitic:'ne'}, 'sitne':{person:3, num:'sg', tense:'present', mood:'subjunctive', enclitic:'ne'}, 'sintne':{person:3, num:'pl', tense:'present', mood:'subjunctive', enclitic:'ne'} } },
    'sumo': { pos:'verb', lemma: 'sūmō, sūmere, sūmpsī', def: ['to take', 'to pick up'], level: 'novum', forms: { 'sūmō':{person:1, num:'sg', tense:'present'}, 'sūmere':{}, 'sūmis':{person:2, num:'sg', tense:'present'} } },
    'surgo': { pos:'verb', lemma: 'surgō, surgere, surrēxī', def: ['to get up', 'to rise'], level: 'core', forms: {'surgit':{person:3, num:'sg', tense:'present'}, 'surgunt':{person:3, num:'pl', tense:'present'}, 'surrecta':{}, 'surrecti':{}, 'surrectis':{}, 'surgō':{person:1, num:'sg', tense:'present'}, 'surgere':{}, 'surgis':{person:2, num:'sg', tense:'present'}, 'surge':{def:'get up!'} } },
    'taberna': { pos:'noun', lemma: 'taberna, -ae, f.', def: ['shop', 'inn'], level: 'core', forms: { 'taberna':{num:'sg'}, 'tabernae':{num:'sg', case:'gen'}, 'tabernā':{num:'sg', case:'abl'}, 'tabernam':{num:'sg', case:'acc'} } },
    'tablinum': { pos:'noun', lemma: 'tablīnum, -ī, n.', def: ['study', 'office'], level: 'core', forms: { 'tablinum':{num:'sg'}, 'tablīnum':{num:'sg'}, 'tablinō':{num:'sg', case:'abl'} } },
    'tango': { pos:'verb', lemma: 'tangō, tangere, tetigī', def: 'to touch', level: 'novum', forms: { 'tangō':{person:1, num:'sg', tense:'present'}, 'tangere':{}, 'tangis':{person:2, num:'sg', tense:'present'} } },
    'tollo': { pos:'verb', lemma: 'tollō, tollere, sustulī', def: ['to lift', 'to pick up', 'to raise'], level: 'core', forms: { 'tollō':{person:1, num:'sg', tense:'present'}, 'tollere':{}, 'tollis':{person:2, num:'sg', tense:'present'} } },
    'tranquillus': { pos:'adj', lemma: 'tranquillus, -a, -um', def: 'calm, quiet', level: 'outer', forms: { 'tranquilla':{}, 'tranquillum':{}, 'tranquillus':{} } },
    'tres': { pos:'adj', lemma: 'trēs, tria', def: 'three', level: 'outer', forms: {'tres':{}} },
    'triclinium': { pos:'noun', lemma: 'trīclīnium, -ī, n.', def: 'dining room', level: 'outer', forms: {'triclinium':{num:'sg'}, 'triclīniō':{num:'sg', case:'abl'}} },
    'tu': { pos:'pronoun', lemma: 'tū, tuī', def: 'you (s.)', level: 'core', forms: {'tu':{}, 'te':{}, 'tibi':{case:'dat'}} },
    'tuus': { pos:'adj', lemma: 'tuus, -a, -um', def: 'your (s.)', level: 'core', forms: {'tuus':{}, 'tuum':{}, 'tua':{}, 'tuae':{case:'gen'}, 'tuō':{case:'abl'}, 'tuī':{case:'gen'}, 'tuōrum':{case:'gen', num:'pl'}, 'tuam':{} } },
    'ubi': { pos:'adv', lemma: 'ubi (adv.)', def: ['where?', 'when'], level: 'core', forms: { 'ubi':{} } },
    'ubique': { pos:'adv', lemma: 'ubique (adv.)', def: 'everywhere', level: 'outer', forms: {'ubique':{}} },
    'umidus': { pos:'adj', lemma: 'ūmidus, -a, -um', def: 'wet', level: 'novum', forms: { 'ūmidus':{} } },
    'unus': { pos:'adj', lemma: 'ūnus, -a, -um', def: 'one', level: 'novum', forms: { 'ūnus':{} } },
    'uter': { pos:'pronoun', lemma: 'uter, utra, utrum', def: 'which (of two)?', level: 'novum', forms: { 'utrum':{}, 'utram':{case:'acc'} } },
    'vacuus': { pos:'adj', lemma: 'vacuus, -a, -um', def: 'empty', level: 'novum', forms: { 'vacuus':{}, 'vacuī':{num:'pl'} } },
    'varius': { pos:'adj', lemma: 'varius, -a, -um', def: 'various, different', level: 'core', forms: { 'variae':{num:'pl'}, 'varia':{num:'pl'} } },
    'verbum': { pos:'noun', lemma: 'verbum, -ī, n.', def: 'word', level: 'novum', forms: { 'verbum':{num:'sg'}, 'verba':{num:'pl'} } },
    'via': { pos:'noun', lemma: 'via, -ae, f.', def: ['road', 'way', 'street'], level: 'core', forms: { 'via':{num:'sg'}, 'viam':{num:'sg', case:'acc'} } },
    'video': { pos:'verb', lemma: 'videō, vidēre, vīdī', def: 'to see', level: 'core', forms: {'videt':{person:3, num:'sg', tense:'present'}, 'vidistine':{person:2, num:'sg', tense:'perfect', enclitic:'ne'}, 'videre':{}, 'vident':{person:3, num:'pl', tense:'present'}, 'vidēs':{person:2, num:'sg', tense:'present'}, 'videō':{person:1, num:'sg', tense:'present'} } },
    'vir': { pos:'noun', lemma: 'vir, virī, m.', def: 'man', level: 'core', forms: { 'vir':{num:'sg'}, 'virī':{num:'pl'}, 'virōrum':{num:'pl', case:'gen'} } },
    'volo': { pos:'verb', lemma: 'volō, velle, voluī', def: ['to want', 'to wish'], level: 'core', forms: {'vult':{person:3, num:'sg', tense:'present'}, 'voluit':{person:3, num:'sg', tense:'perfect'}, 'vīs':{person:2, num:'sg', tense:'present'} } },
};

// Multi-word phrases glossed as a whole, with the lemmas of their parts. An idiom always has a tooltip;
// `level: 'novum'` also marks it as new, for a phrase whose words are known but whose use must be
// taught (multa et varia: neuter plurals standing alone as "things").
const IDIOMS = {
    'multa et varia': {
        def: 'many different things',
        componentLemmas: ['multus', 'et', 'varius'],
        level: 'novum'
    },
    'sibi vult': {
        def: 'means, signifies',
        componentLemmas: ['sui', 'volo']
    },
    'ad dexteram': {
        def: 'to the right',
        componentLemmas: ['ad', 'dexter']
    },
    'ad sinistram': {
        def: 'to the left',
        componentLemmas: ['ad', 'sinister']
    },
    'deis est gratia': {
        def: 'thanks be to the gods',
        componentLemmas: ['deus', 'sum', 'gratia']
    },
    'insomniam habes': {
        def: 'you cannot sleep',
        componentLemmas: ['insomnia', 'habeo']
    }
};
// Maps every known form, diacritics stripped, to its lemma key: formToLemmaKey['muris'] is 'murus'.
// When two lemmas share a form, the first one listed keeps it.
const formToLemmaKey = {};
for (const key in VOCAB_LEMMA) {
    for (const form in VOCAB_LEMMA[key].forms) {
        const cleanForm = removeDiacritics(form.toLowerCase());
        if (!formToLemmaKey[cleanForm]) {
            formToLemmaKey[cleanForm] = key;
        }
    }
}

// What THIS class has met, from class_vocab.js (exported by the Latin Vocab Toolkit after each
// Trial). A form the class was quizzed on is 'core' (no tooltip); a form it has seen is 'outer';
// a form whose word it has met in another form is 'outer' too; anything else is 'novum'.
// Without the file, each word keeps the level written in VOCAB_LEMMA.
const classLevelOfForm = {};
const classLemmaKeys = new Set();
for (const word of (window.CLASS_VOCAB?.words || [])) {
    for (const form of word.forms) {
        const cleanForm = removeDiacritics(form.toLowerCase());
        // A form shared by two headwords counts as known if either one is.
        if (classLevelOfForm[cleanForm] !== 'core') classLevelOfForm[cleanForm] = word.level;
    }
    if (word.lemma_key) classLemmaKeys.add(removeDiacritics(word.lemma_key.toLowerCase()));
}

function levelOf(cleanWord, lemmaKey) {
    if (!window.CLASS_VOCAB) return VOCAB_LEMMA[lemmaKey].level;
    if (classLevelOfForm[cleanWord]) return classLevelOfForm[cleanWord];
    return classLemmaKeys.has(lemmaKey) ? 'outer' : 'novum';
}

const DIRECTION_ROTATIONS = { 'north': 0, 'south': 180, 'east': 90, 'west': 270, 'northeast': 45, 'northwest': 315, 'southeast': 135, 'southwest': 225 };
const ANGLE_TO_DIRECTION = { 0: 'north', 45: 'northeast', 90: 'east', 135: 'southeast', 180: 'south', 225: 'southwest', 270: 'west', 315: 'northwest' };
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

// =============================================================================
// ### 2. GAME STATE
// =============================================================================
const gameState = { currentRoom: 'cubiculum_tuum', playerFacing: 270, currentVisualRotation: -270, visitedRooms: new Set(['cubiculum_tuum']), panOffset: { x: 0, y: 0 }, isDragging: false, dragStart: { x: 0, y: 0 }, isPlayerActionLocked: false, inputHistory: [], historyIndex: -1, clarificationState: null, hasRenderedFirstRoom: false, previousRoom: null, pendingAction: null, posture: null };
const mapSettings = { GRID_SIZE: 150, ROOM_WIDTH: 100, ROOM_HEIGHT: 60 };
let elements = {};
let mapGroup;
const SVG_NS = "http://www.w3.org/2000/svg";

// =============================================================================
// ### 3. CORE GAME LOGIC
// =============================================================================

const NOT_UNDERSTOOD = 'Nōn intellegō verba tua.';

// Relative moves, checked in this order: the diagonals must win over their single words.
const TURNS = [
    { needs: ['prorsus', 'dexteram'], angle: 45, phrase: 'prōrsus et ad dexteram' },
    { needs: ['prorsus', 'sinistram'], angle: 315, phrase: 'prōrsus et ad sinistram' },
    { needs: ['rursus', 'dexteram'], angle: 135, phrase: 'rūrsus et ad dexteram' },
    { needs: ['rursus', 'sinistram'], angle: 225, phrase: 'rūrsus et ad sinistram' },
    { needs: ['dexteram'], angle: 90, phrase: 'ad dexteram' },
    { needs: ['sinistram'], angle: 270, phrase: 'ad sinistram' },
    { needs: ['prorsus'], angle: 0, phrase: 'prōrsus' },
    { needs: ['rursus'], angle: 180, phrase: 'rūrsus' }
];

const escapeHtml = (str) => String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Splits a command into whole words, lowercased and stripped of macrons and punctuation.
const toWords = (command) => removeDiacritics(command.toLowerCase()).replace(/[?!.,;:"']/g, ' ').split(/\s+/).filter(Boolean);

const exitTo = (roomId) => Object.keys(rooms[gameState.currentRoom].exits).find(dir => rooms[gameState.currentRoom].exits[dir] === roomId);

const jiggle = (text) => `<span class="recast-ending">${text}</span>`;

// Jiggles only the letters where the player's attempt differs from the correct form:
// cubiculo -> cubicul[um], soror -> Sorōr[is], ala -> Āla[m], cubculum -> cub[i]culum.
// No attempt at all jiggles the whole word.
function jiggleDiff(correct, attempt) {
    if (!attempt) return jiggle(correct);
    const chars = [...correct];
    const base = chars.map(c => removeDiacritics(c.toLowerCase()));
    const typed = [...removeDiacritics(attempt.toLowerCase())];
    let start = 0;
    while (start < base.length && start < typed.length && base[start] === typed[start]) start++;
    let end = 0;
    while (end < base.length - start && end < typed.length - start
           && base[base.length - 1 - end] === typed[typed.length - 1 - end]) end++;
    // Extra letters leave nothing missing to mark: jiggle the letter where they went in.
    if (start + end >= base.length) {
        start = Math.min(start, base.length - 1);
        end = base.length - start - 1;
    }
    if (start === 0 && end === 0) return jiggle(correct);
    return chars.slice(0, start).join('') + jiggle(chars.slice(start, chars.length - end).join('')) + chars.slice(chars.length - end).join('');
}

// Every lemma that names a room, so the parser can tell which of the player's words point at one.
const ROOM_LEMMAS = new Set(Object.values(ROOM_NAMES).flatMap(r => r.requiredLemmas));

const capitalize = (word) => word[0].toUpperCase() + word.slice(1);

// An openable object's state as the narrator says it, agreeing with its gender, and the infinitive
// that would change it.
const STATE_WORDS = { f: ['aperta', 'clausa'], m: ['apertus', 'clausus'], n: ['apertum', 'clausum'] };
const doorState = (obj) => STATE_WORDS[obj.gender || 'f'][obj.openable.open ? 0 : 1];
const doorToggle = (obj) => (obj.openable.open ? 'claudere' : 'aperīre');

// The question asked of a verb used alone: "Quid vīs claudere?", or "Ubi vīs dormīre?" for a verb of place.
const askFor = (actionKey) => `${ACTIONS[actionKey].prep ? 'Ubi' : 'Quid'} vīs ${ACTIONS[actionKey].infinitive}?`;

// Where each object starts, so a description can tell whether it is still there.
for (const obj of Object.values(OBJECTS)) obj.home = obj.rooms;
const atHome = (obj) => !obj.gone && !obj.carried && obj.rooms === obj.home;

// Fills {has:ID|A|B}, {state:ID}, {state} and {toggle} in a text from the objects' current state.
function fillState(text, obj = null) {
    return text.replace(/\{has:(\w+)\|([^|}]*)\|([^}]*)\}/g, (m, id, present, gone) => (atHome(OBJECTS[id]) ? present : gone))
               .replace(/\{state(?::(\w+))?\}/g, (m, id) => doorState(id ? OBJECTS[id] : obj))
               .replace(/\{toggle\}/g, () => doorToggle(obj));
}

// The objects within reach of the room the player is in, as [id, object] pairs: what is in the room,
// and what the player carries (first, so "rosam" means the rose in hand). An eaten object is gone.
const objectsHere = () => Object.entries(OBJECTS)
    .filter(([, obj]) => !obj.gone && (obj.carried || obj.rooms === '*' || obj.rooms.includes(gameState.currentRoom)))
    .sort(([, a], [, b]) => Boolean(b.carried) - Boolean(a.carried));

// What the player carries, as an answer to "Quid habeō?": "Habēs pānem et rosam."
function inventoryText() {
    const carried = Object.values(OBJECTS).filter(obj => obj.carried && !obj.gone).map(obj => obj.forms.acc);
    if (carried.length === 0) return 'Nihil habēs.';
    const list = carried.length === 1 ? carried[0] : `${carried.slice(0, -1).join(', ')} et ${carried[carried.length - 1]}`;
    return `Habēs ${list}.`;
}

// Is the command asking what the player carries? "Quid habeō?", or "habeō" alone; "quid habēs?" too.
function isInventoryQuery(words) {
    const habeo = words.find(w => getLemmaDataFromWord(w)?.lemmaKey === 'habeo');
    return Boolean(habeo) && (words.length === 1 || (words.length === 2 && words.includes('quid')));
}

// Why the player cannot walk away yet: they are sitting, lying, or standing on something.
function postureBlocks() {
    const { kind, objectId } = gameState.posture;
    const where = OBJECTS[objectId].forms.abl;
    if (kind === 'stand') return `In ${where} stās! Prīmum dēscende.`;
    if (kind === 'lie') return `In ${where} recumbis! Prīmum surge.`;
    return `In ${where} sedēs! Prīmum surge.`;
}

// Getting up or climbing down, which needs no object: surgō (or stō) from a seat or a bed,
// dēscendō from whatever the player is standing on.
function standUp(actionKey) {
    const posture = gameState.posture;
    const where = posture && OBJECTS[posture.objectId].forms.abl;
    if (actionKey === 'descendo') {
        if (posture?.kind !== 'stand') return posture ? postureBlocks() : 'Iam stās.';
        gameState.posture = null;
        return `Dē ${where} dēscendis.`;
    }
    if (!posture) return 'Iam stās.';
    if (posture.kind === 'stand') return `Iam stās — in ${where}! Prīmum dēscende.`;
    gameState.posture = null;
    return 'Surgis. Iam stās.';
}

// The door between two rooms, if there is one: an openable object reached from both.
const doorBetween = (a, b) => Object.values(OBJECTS).find(obj => obj.openable && obj.rooms.includes(a) && obj.rooms.includes(b));

// Recognises an action verb by its lemma, in the same shape findVerb gives a movement verb.
function findAction(words) {
    for (const key in ACTIONS) {
        const data = ACTIONS[key];
        const playerWord = words.find(w => getLemmaDataFromWord(w)?.lemmaKey === key);
        if (playerWord) {
            return { key, data, correct: data.first_person, playerWord, isCorrect: playerWord === removeDiacritics(data.first_person) };
        }
    }
    return null;
}

// An action the game asked about ("Quid vīs claudere?"), for reading the answer.
const pendingActionOf = (key) => ({ key, data: ACTIONS[key], correct: ACTIONS[key].first_person, playerWord: null, isCorrect: true });

// One word of a recast: as the player typed it, jiggled where their form differs, or jiggled whole if missing.
function recastWord(correctWord, words) {
    const lemmaKey = getLemmaDataFromWord(correctWord)?.lemmaKey;
    if (!lemmaKey) return { html: correctWord, corrected: false, attempt: null };
    const attempt = words.find(w => getLemmaDataFromWord(w)?.lemmaKey === lemmaKey);
    if (attempt === removeDiacritics(correctWord.toLowerCase())) return { html: glossed(correctWord), corrected: false, attempt };
    return { html: glossed(correctWord, jiggleDiff(correctWord, attempt)), corrected: true, attempt };
}

// Does the current room's description use a word of this lemma?
function roomMentions(lemmaKey) {
    return (roomDescription(gameState.currentRoom).match(/\p{L}+/gu) || [])
        .some(w => lookUpWord(removeDiacritics(w.toLowerCase()))?.lemmaKey === lemmaKey);
}

// Does this word stand for the lemma, directly or through the player's voice (meum for tuus)?
function standsFor(word, lemmaKey) {
    const key = getLemmaDataFromWord(word)?.lemmaKey;
    return key === lemmaKey || PLAYER_VOICE[key] === lemmaKey;
}

// The word in a room's name, as the player says it, that stands for this lemma ('Sorōris' for soror).
const playerFormOf = (roomData, lemmaKey) => (roomData.said || roomData.acc).slice(1).find(w => standsFor(w, lemmaKey));

// The lemma every one of these rooms shares ('cubiculum' for the two bedrooms).
const sharedLemmaOf = (roomIds) => ROOM_NAMES[roomIds[0]].requiredLemmas.find(l => roomIds.every(id => ROOM_NAMES[id].requiredLemmas.includes(l)));

// The gender a noun's dictionary entry gives: 'āla, -ae, f.' is 'f'.
const genderOf = (lemmaKey) => (VOCAB_LEMMA[lemmaKey].lemma.match(/\b([mfn])\./) || [])[1] || 'n';

// "Which …?" in the accusative, agreeing with the noun: uter for a choice of two, quī for more.
const WHICH = { two: { m: 'Utrum', f: 'Utram', n: 'Utrum' }, many: { m: 'Quem', f: 'Quam', n: 'Quod' } };

// The verb as the player should have said it, jiggling what they got wrong or left out.
function recastVerb(verbInfo) {
    if (!verbInfo) return { html: glossed('eō', jiggle('eō')), corrected: true };
    if (verbInfo.isCorrect) return { html: glossed(verbInfo.correct), corrected: false };
    return { html: glossed(verbInfo.correct, jiggleDiff(verbInfo.correct, verbInfo.playerWord)), corrected: true };
}

async function processInput(command) {
    if (gameState.isPlayerActionLocked) return;
    gameState.isPlayerActionLocked = true;
    elements.commandInput.disabled = true;

    // What the player typed gets tooltips too, until a recast replaces it.
    logCommand(processDescription(escapeHtml(command)), false);
    gameState.inputHistory.unshift(command);
    gameState.historyIndex = -1;

    try {
        const action = parseCommand(command);

        if (action.type === 'feedback') {
            setFeedback(action.feedback);
        } else if (action.type === 'clarify') {
            logCommand(action.recast, action.wasCorrected, true);
            askClarification(action.prompt, action.options);
        } else if (action.type === 'define') {
            setFeedback(defineWord(action.word));
        } else if (action.type === 'inventory') {
            logCommand(action.recast, action.wasCorrected, true);
            logObject(inventoryText());
        } else if (action.type === 'ask') {
            logCommand(action.recast, action.wasCorrected, true);
            // A looking verb alone shows the room first, so the student can see what there is to look at.
            if (action.showRoom) logRoom();
            gameState.pendingAction = action.actionKey;
            setFeedback(action.prompt);
        } else if (action.type === 'act') {
            logCommand(action.recast, action.wasCorrected, true);
            if (action.objectId) {
                logObject(performAction(action.actionKey, action.objectId, action.number));
            } else if (ACTIONS[action.actionKey].does === 'look') {
                logRoom();
            } else {
                logObject(standUp(action.actionKey));
            }
        } else if (action.type === 'move') {
            logCommand(action.recast, action.wasCorrected, true);
            if (gameState.posture) {
                setFeedback(postureBlocks());
            } else {
                if (action.wasCorrected) {
                    await sleep(500);
                }
                const moveSuccessful = await performMove(action.direction, action.newFacingAngle);
                if (moveSuccessful) {
                    logRoom();
                }
            }
        }
    } finally {
        // Always hand the input back, whatever happened above, including a question still pending.
        gameState.isPlayerActionLocked = false;
        elements.commandInput.disabled = false;
        elements.commandInput.focus();
    }
}

// The answer to "Quid significat X?", as a feedback line.
function defineWord(word) {
    if (word === 'EMPTY_QUERY') return 'Quod verbum nōn intellegis?';

    const cleanQuery = removeDiacritics(word.toLowerCase());
    let definition = '';
    if (IDIOMS[cleanQuery]) {
        definition = `"${IDIOMS[cleanQuery].def}"`;
    } else {
        const found = lookUpWord(cleanQuery);
        if (found) {
            const data = getLemmaDataFromWord(found.cleanWord);
            definition = buildDefinition(VOCAB_LEMMA[data.lemmaKey], data.form);
            if (found.enclitic) definition += ` + -${found.enclitic}: ${ENCLITICS[found.enclitic]}`;
        }
    }

    const shown = escapeHtml(word);
    return definition ? `'${shown}' significat: ${definition}` : `Hoc verbum '${shown}' nōn intellegō.`;
}

// Recognises the movement verb by its lemma, so 'in', 'et' and 'est' are never taken for eō.
function findVerb(words) {
    for (const key in VERBS) {
        const verbData = VERBS[key];
        const playerWord = words.find(w => getLemmaDataFromWord(w)?.lemmaKey === verbData.lemma || (verbData.stem && w.startsWith(verbData.stem)));
        if (playerWord) {
            const isCorrect = playerWord === removeDiacritics(verbData.first_person);
            return { key, data: verbData, correct: verbData.first_person, playerWord, isCorrect };
        }
    }
    return null;
}

/**
 * Parses a user's command to see if it's a definition request, in any word order:
 * "Quid significat X?", "X quid significat?", "Quid sibi vult X?".
 * @param {string} command The raw command from the user.
 * @returns {string|null} The word(s) to define, as typed; 'EMPTY_QUERY'; or null if it is not a query.
 */
function parseDefinitionQuery(command) {
    const typed = command.toLowerCase().replace(/[?!.,;:"']/g, ' ').split(/\s+/).filter(Boolean);
    const words = typed.map(w => removeDiacritics(w));

    let grammarWords;
    if (words.includes('sibi') && words.includes('vult')) {
        grammarWords = ['quid', 'sibi', 'vult'];
    } else if (words.includes('quid') || words.includes('significat')) {
        grammarWords = ['quid', 'significat'];
    } else {
        return null;
    }

    const target = typed.filter((w, i) => !grammarWords.includes(words[i])).join(' ');
    if (target) return target;
    // "Quid sibi vult?" on its own asks about the idiom itself.
    if (grammarWords.includes('sibi')) return 'sibi vult';
    return words.includes('significat') ? 'EMPTY_QUERY' : null;
}

/**
 * The bridge between the parser and the vocabulary engine.
 * Takes a word and returns all known grammatical data about it.
 * @param {string} word The word form to look up.
 * @returns {object|null} An object with lemma and form data, or null if not found.
 */
function getLemmaDataFromWord(word) {
    const cleanWord = removeDiacritics(word.toLowerCase());
    const lemmaKey = formToLemmaKey[cleanWord];
    if (!lemmaKey) return null;

    const lemmaData = VOCAB_LEMMA[lemmaKey];
    const formKey = Object.keys(lemmaData.forms).find(f => removeDiacritics(f.toLowerCase()) === cleanWord);
    if (!formKey) return null;

    return {
        lemmaKey: lemmaKey,
        lemma: lemmaData.lemma,
        pos: lemmaData.pos,
        def: lemmaData.def,
        level: lemmaData.level,
        form: lemmaData.forms[formKey]
    };
}

function parseCommand(command) {
    // "Quid habeō?" before the definition query, which would take any "quid" as "quid significat".
    const inventoryWords = toWords(command);
    if (isInventoryQuery(inventoryWords)) {
        const habeo = recastWord('habeō', inventoryWords);
        const quid = inventoryWords.includes('quid');
        return { type: 'inventory', recast: quid ? `Quid ${habeo.html}?` : habeo.html, wasCorrected: habeo.corrected };
    }

    const definitionQuery = parseDefinitionQuery(command);
    if (definitionQuery) {
        return { type: 'define', word: definitionQuery };
    }

    const words = toWords(command);
    const lemmas = words.map(w => getLemmaDataFromWord(w)?.lemmaKey).filter(Boolean);

    // A question the game asked ("Utrum cubiculum?", "Quid vīs claudere?") is answered first. A reply
    // that is not an answer drops the question and is read as an ordinary command; the question is
    // asked again only if the command makes no sense either.
    const pending = gameState.clarificationState;
    if (pending) {
        const answer = resolveClarification(words, lemmas);
        if (answer) return answer;
        gameState.clarificationState = null;
        const action = parseFreeCommand(words, lemmas);
        if (action.type === 'feedback' && action.feedback === NOT_UNDERSTOOD) {
            gameState.clarificationState = pending;
            return { type: 'feedback', feedback: `Nōn intellegō. ${pending.prompt}` };
        }
        return action;
    }

    const pendingAction = gameState.pendingAction;
    if (pendingAction) {
        gameState.pendingAction = null;
        // A reply with its own verb ("claudō iānuam") is an ordinary command; one without ("iānuam") answers.
        const answer = findAction(words) ? null : actionCommand(pendingActionOf(pendingAction), words, lemmas, true);
        if (answer) return answer;
        const action = parseFreeCommand(words, lemmas);
        if (action.type === 'feedback' && action.feedback === NOT_UNDERSTOOD) {
            gameState.pendingAction = pendingAction;
            return { type: 'feedback', feedback: `Nōn intellegō. ${askFor(pendingAction)}` };
        }
        return action;
    }

    return parseFreeCommand(words, lemmas);
}

// An action on a thing: "claudō iānuam", "noctuam investīgō", or, answering "Quid vīs claudere?",
// just "iānuam" (shortAnswer: the recast is the noun alone, and null means it was not an answer).
function actionCommand(action, words, lemmas, shortAnswer = false) {
    const feedback = (text) => ({ type: 'feedback', feedback: text });
    // Of the objects the player's word could mean, the one whose form they typed ("rosās": the roses
    // in the garden, not the rose in hand); otherwise the first, carried things first.
    const candidates = objectsHere().filter(([, obj]) => lemmas.includes(obj.lemma));
    const typed = (obj) => Object.values(obj.forms).some(form => words.includes(removeDiacritics(form.toLowerCase())));
    const here = candidates.find(([, obj]) => typed(obj)) || candidates[0];

    // "surgō in mēnsā" means "stō in mēnsā": with an object the verb becomes another, recast whole,
    // since it is a different word, not a wrong ending.
    let verb = recastVerb(action);
    if (here && action.data.withObject) {
        const key = action.data.withObject;
        action = { key, data: ACTIONS[key], correct: ACTIONS[key].first_person, playerWord: action.playerWord, isCorrect: false };
        verb = { html: glossed(action.correct, jiggle(action.correct)), corrected: true };
    }
    const { infinitive, does, prep } = action.data;

    if (here) {
        const [objectId, obj] = here;
        // The object as the verb wants it: an accusative, or "in" + the ablative for a verb of place;
        // and just one of many ("arborem") when the object allows it and the player used the singular.
        const attempt = words.find(w => getLemmaDataFromWord(w)?.lemmaKey === obj.lemma);
        const wantCase = prep ? 'abl' : 'acc';
        const number = obj.forms[wantCase + 'Sg'] && getLemmaDataFromWord(attempt)?.form.num === 'sg' ? 'sg' : 'all';
        const noun = recastWord(obj.forms[number === 'sg' ? wantCase + 'Sg' : wantCase], words);
        let nounHtml = noun.html;
        let nounCorrected = noun.corrected;
        if (prep) {
            const hasPrep = words.includes(prep);
            nounHtml = `${glossed(prep, hasPrep ? prep : jiggle(prep))} ${noun.html}`;
            nounCorrected = nounCorrected || !hasPrep;
        }
        // Keep the player's word order: "iānuam claudō" is as good Latin as "claudō iānuam".
        const objectFirst = words.indexOf(noun.attempt) < words.indexOf(action.playerWord);
        const recast = shortAnswer ? nounHtml : objectFirst ? `${nounHtml} ${verb.html}` : `${verb.html} ${nounHtml}`;
        return { type: 'act', actionKey: action.key, objectId, number, recast, wasCorrected: nounCorrected || (!shortAnswer && verb.corrected) };
    }

    // Getting up (surgō, or stō while seated) and climbing down need no object.
    if (!shortAnswer && words.length === 1 && (does === 'rise' || (action.key === 'sto' && gameState.posture))) {
        return { type: 'act', actionKey: action.key, objectId: null, recast: verb.html, wasCorrected: verb.corrected };
    }

    // Looking at the room the player stands in shows it again. Naming part of it is enough
    // ("investīgō cubiculum" in Cubiculum Tuum), and only the words named are recast.
    const roomData = ROOM_NAMES[gameState.currentRoom];
    const named = lemmas.filter(l => ROOM_LEMMAS.has(l));
    if (does === 'look' && named.length > 0 && named.every(l => roomData.requiredLemmas.includes(l))) {
        const nouns = (roomData.said || roomData.acc).slice(1)
            .filter(w => named.some(l => standsFor(w, l))).map(w => recastWord(w, words));
        const nounHtml = nouns.map(n => n.html).join(' ');
        const recast = shortAnswer ? nounHtml : `${verb.html} ${nounHtml}`;
        return { type: 'act', actionKey: action.key, objectId: null, recast, wasCorrected: nouns.some(n => n.corrected) || (!shortAnswer && verb.corrected) };
    }

    if (shortAnswer) return null;
    // The verb alone: ask what it is for.
    if (words.length === 1) {
        return { type: 'ask', actionKey: action.key, prompt: askFor(action.key), recast: verb.html, wasCorrected: verb.corrected, showRoom: does === 'look' };
    }
    // Something named that is not within reach, or not a thing that can be acted on yet.
    if (lemmas.some(l => Object.values(OBJECTS).some(obj => obj.lemma === l))) return feedback('Hoc nōn vidēs.');
    if (does === 'look') return feedback(lemmas.some(roomMentions) ? 'Nihil aliud vidēs.' : 'Hoc nōn vidēs.');
    return feedback(`Hoc ${infinitive} nōn potes.`);
}

// Does what the player asked to an object, and says what happened. `number` is 'sg' when the
// player acted on just one of many ("tangō arborem").
function performAction(actionKey, objectId, number = 'all') {
    const obj = OBJECTS[objectId];
    const action = ACTIONS[actionKey];
    const { does, infinitive, prep, sameAs, requires } = action;
    const fallback = action.fallback || (sameAs && ACTIONS[sameAs].fallback);
    const abl = (number === 'sg' && obj.forms.ablSg) || obj.forms.abl;
    if (does === 'look') {
        return fillState((number === 'sg' && obj.lookSg) || obj.lookIn?.[gameState.currentRoom] || obj.look, obj);
    }

    // Taking into the inventory, and putting down here. Taking one of many gives its `takeOne` object.
    if (does === 'take') {
        const target = number === 'sg' && obj.takeOne ? OBJECTS[obj.takeOne] : obj;
        if (target.carried) return `Iam ${target.forms.acc} habēs.`;
        if (!target.portable) return obj.refuse || `${capitalize(obj.forms.acc)} ${infinitive} nōn potes.`;
        target.carried = true;
        return `${capitalize(target.forms.acc)} ${action.you}. Nunc ${target.forms.acc} habēs.`;
    }
    if (does === 'drop') {
        if (!obj.carried) return `${capitalize(obj.forms.acc)} nōn habēs.`;
        obj.carried = false;
        obj.rooms = obj.home.includes(gameState.currentRoom) ? obj.home : [gameState.currentRoom];
        return `${capitalize(obj.forms.acc)} ${action.you}.`;
    }

    // A list of lines is used in turn, one per try: each tree reacts in its own way.
    const pick = (table) => {
        const found = table?.[actionKey] || (sameAs && table?.[sameAs]);
        if (!Array.isArray(found)) return found;
        obj.turns = obj.turns || {};
        obj.turns[actionKey] = (obj.turns[actionKey] || 0) + 1;
        return found[(obj.turns[actionKey] - 1) % found.length];
    };
    // The action happens only if the object allows it (a surface to sit on, a bed, something edible):
    // the player ends up sitting, lying or standing on it, or it is eaten.
    const allowed = !requires || obj[requires];
    const happen = () => {
        if (!allowed) return;
        if (action.posture) gameState.posture = { kind: action.posture, objectId };
        if (action.consumes || ACTIONS[sameAs]?.consumes) obj.gone = true;
    };

    const line = (number === 'sg' && pick(obj.onSg)) || pick(obj.on);
    if (line) {
        happen();
        return fillState(line, obj);
    }
    if ((does === 'open' || does === 'close') && obj.openable) {
        const wantOpen = does === 'open';
        if (obj.openable.open === wantOpen) return `${capitalize(obj.forms.nom)} iam ${doorState(obj)} est.`;
        obj.openable.open = wantOpen;
        return `Nunc ${obj.forms.nom} ${doorState(obj)} est.`;
    }
    if (obj.refuse) return obj.refuse;
    if (allowed && fallback) {
        happen();
        return fallback.replace('{Acc}', capitalize(obj.forms.acc)).replace('{abl}', abl);
    }
    // "Mēnsam edere nōn potes." / "In impluviō dormīre nōn potes."
    return prep ? `${capitalize(prep)} ${abl} ${infinitive} nōn potes.` : `${capitalize(obj.forms.acc)} ${infinitive} nōn potes.`;
}

// Reads an answer to a "Utrum cubiculum?" question. Returns a move, or null if it is not an answer.
function resolveClarification(words, lemmas) {
    const optionIds = gameState.clarificationState.options;
    const sharedLemma = sharedLemmaOf(optionIds);

    for (const targetRoomId of optionIds) {
        const roomData = ROOM_NAMES[targetRoomId];
        const distinguishingLemma = roomData.requiredLemmas.find(l => l !== sharedLemma);
        if (!lemmas.includes(distinguishingLemma)) continue;

        // "Sorōris" and "Cubiculum Sorōris" are equally good answers: recast in whichever shape the player chose.
        const wanted = lemmas.includes(sharedLemma) ? [sharedLemma, distinguishingLemma] : [distinguishingLemma];
        let wasCorrected = words.length !== wanted.length;
        const recastHtml = wanted.map(lemmaKey => {
            const correctForm = playerFormOf(roomData, lemmaKey);
            const attempt = words.find(w => standsFor(w, lemmaKey));
            if (attempt === removeDiacritics(correctForm.toLowerCase())) return glossed(correctForm);
            wasCorrected = true;
            return glossed(correctForm, jiggleDiff(correctForm, attempt));
        }).join(' ');

        gameState.clarificationState = null;
        const dir = exitTo(targetRoomId);
        return { type: 'move', direction: dir, newFacingAngle: DIRECTION_ROTATIONS[dir], wasCorrected, recast: recastHtml };
    }
    return null;
}

function parseFreeCommand(words, lemmas) {
    const feedback = (text) => ({ type: 'feedback', feedback: text });

    // A word in the player's voice also counts for the narrator's: "meum" finds "Cubiculum Tuum".
    lemmas = lemmas.flatMap(l => PLAYER_VOICE[l] ? [l, PLAYER_VOICE[l]] : [l]);

    // A verb of acting on things ("claudō", "investīgō") makes the command about an object, not a move.
    const action = findAction(words);
    if (action) return actionCommand(action, words, lemmas);

    const verbInfo = findVerb(words);
    const hasPreposition = words.includes('in') || words.includes('ad');

    // More than one room in reach fits everything the player named ("cubiculum" in the Ātrium):
    // ask which, in Latin that agrees with the noun they share.
    const named = lemmas.filter(l => ROOM_LEMMAS.has(l));
    const fits = named.length === 0 ? [] : Object.values(rooms[gameState.currentRoom].exits)
        .filter(id => named.every(l => ROOM_NAMES[id].requiredLemmas.includes(l)));
    if (fits.length > 1) {
        const sharedLemma = sharedLemmaOf(fits);
        const sharedForm = playerFormOf(ROOM_NAMES[fits[0]], sharedLemma);
        const which = WHICH[fits.length === 2 ? 'two' : 'many'][genderOf(sharedLemma)];
        const { recastHtml, wasCorrected } = generateRecast(words, { acc: ['in', sharedForm] }, verbInfo);
        return { type: 'clarify', prompt: `${which} ${sharedForm.toLowerCase()}?`, options: fits, wasCorrected, recast: recastHtml };
    }

    // Score each room by how many of its lemmas the player used. On a tie, prefer a room the player
    // can walk to, then the room they are in: both streets are just "Via", so from one street
    // "eō in viam" means the other.
    const reachable = (roomId) => (exitTo(roomId) ? 2 : roomId === gameState.currentRoom ? 1 : 0);
    let bestMatch = { score: 0, id: null };
    for (const roomId in ROOM_NAMES) {
        const score = ROOM_NAMES[roomId].requiredLemmas.filter(lemma => lemmas.includes(lemma)).length;
        const winsTie = score === bestMatch.score && score > 0 && reachable(roomId) > reachable(bestMatch.id);
        if (score > bestMatch.score || winsTie) {
            bestMatch = { score, id: roomId };
        }
    }

    if (bestMatch.id) {
        const roomData = ROOM_NAMES[bestMatch.id];
        if (bestMatch.id === gameState.currentRoom) {
            return feedback(`Iam es in ${roomData.abl}.`);
        }
        // A room named with no verb and no preposition: ask what they mean to do there.
        if (!verbInfo && !hasPreposition) {
            return feedback(`Quid in ${roomData.abl} facere vīs?`);
        }
        const landmarkDir = exitTo(bestMatch.id);
        if (!landmarkDir) {
            return feedback('Nōn potes illūc īre.');
        }
        const { recastHtml, wasCorrected } = generateRecast(words, roomData, verbInfo);
        return { type: 'move', direction: landmarkDir, newFacingAngle: DIRECTION_ROTATIONS[landmarkDir], wasCorrected, recast: recastHtml };
    }

    const turn = TURNS.find(t => t.needs.every(w => words.includes(w)));
    if (turn) {
        const newFacingAngle = (gameState.playerFacing + turn.angle) % 360;
        const verb = recastVerb(verbInfo);
        return { type: 'move', direction: ANGLE_TO_DIRECTION[newFacingAngle], newFacingAngle, wasCorrected: verb.corrected, recast: `${verb.html} ${processDescription(turn.phrase)}` };
    }

    return feedback(NOT_UNDERSTOOD);
}

// Builds the corrected command, jiggling whatever the player left out or got wrong.
function generateRecast(words, roomData, verbInfo) {
    // Part 1: the verb
    const verb = recastVerb(verbInfo);
    let wasCorrected = verb.corrected;

    // Part 2: the preposition
    let prepHtml = 'in';
    if (words.includes('ad')) {
        prepHtml = 'ad';
    } else if (!words.includes('in')) {
        wasCorrected = true;
        prepHtml = jiggle('in');
    }
    prepHtml = glossed(words.includes('ad') ? 'ad' : 'in', prepHtml);

    // Part 3: the destination, word by word, as the player says it ("Cubiculum Meum", not "Tuum")
    const recastWords = (roomData.said || roomData.acc).slice(1).map(correctWord => {
        const noun = recastWord(correctWord, words);
        if (noun.corrected) wasCorrected = true;
        return noun.html;
    });

    return { recastHtml: `${verb.html} ${prepHtml} ${recastWords.join(' ')}`, wasCorrected };
}

async function performMove(moveDirection, newFacingAngle) {
    if (newFacingAngle === undefined) { console.error("CRITICAL ERROR: newFacingAngle is undefined. Move direction was:", moveDirection); setFeedback("Error internus: Directio incerta est."); return false; }
    const nextRoomId = rooms[gameState.currentRoom].exits[moveDirection];
    const door = nextRoomId && doorBetween(gameState.currentRoom, nextRoomId);
    if (door && !door.openable.open) {
        setFeedback(`${capitalize(door.forms.nom)} ${doorState(door)} est.`);
        return false;
    }
    if (nextRoomId) {
        const previousRoomId = gameState.currentRoom;
        gameState.previousRoom = previousRoomId;
        gameState.currentRoom = nextRoomId;
        gameState.visitedRooms.add(nextRoomId);
        gameState.panOffset = { x: 0, y: 0 };
        gameState.playerFacing = newFacingAngle;
        if ((previousRoomId === 'ala_larum' || previousRoomId === 'ala_hermae') && nextRoomId === 'atrium') {
            gameState.playerFacing = 0;
        }
        await render(true);
        return true;
    } else {
        setFeedback("Nōn potes illāc īre.");
        return false;
    }
}

function askClarification(prompt, options) { gameState.clarificationState = { prompt, options }; let optionsString = options.map(id => `&nbsp;&nbsp;- ${ROOM_NAMES[id].nom}`).join('<br>'); setFeedback(`${prompt}<br>${optionsString}`); }

// Every feedback line goes through the vocabulary engine, so its words get tooltips too.
function setFeedback(message) {
    const log = elements.gameLog;
    const entry = document.createElement('div');
    entry.className = 'log-error';
    entry.innerHTML = processDescription(message);
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function generateExitsString() {
    const directions = [
        { name: 'prōrsus', angle: 0 }, { name: 'rūrsus', angle: 180 },
        { name: 'ad dexteram', angle: 90 }, { name: 'ad sinistram', angle: 270 },
        { name: 'prōrsus et ad dexteram', angle: 45 }, { name: 'prōrsus et ad sinistram', angle: 315 },
        { name: 'rūrsus et ad dexteram', angle: 135 }, { name: 'rūrsus et ad sinistram', angle: 225 }
    ];

    const knownExits = [];
    const unknownExits = new Set();
    const currentExits = rooms[gameState.currentRoom].exits;

    for (const dir of directions) {
        const targetAngle = (gameState.playerFacing + dir.angle + 360) % 360;
        const targetRoomId = currentExits[ANGLE_TO_DIRECTION[targetAngle]];
        if (!targetRoomId) continue;

        const processedDirName = processDescription(dir.name);
        if (gameState.visitedRooms.has(targetRoomId)) {
            const processedDestination = processDescription(ROOM_NAMES[targetRoomId].acc.join(' '));
            knownExits.push(`<strong>${processedDirName}</strong> ${processedDestination}`);
        } else {
            unknownExits.add(`<strong>${processedDirName}</strong>`);
        }
    }

    if (knownExits.length === 0 && unknownExits.size === 0) return "";

    let html = "";
    if (unknownExits.size > 0) {
        html += `${processDescription('Potes īre:')} ${[...unknownExits].join(', ')}.<br>`;
    }
    if (knownExits.length > 0) {
        html += `${processDescription(unknownExits.size > 0 ? 'Etiam potes īre:' : 'Potes īre:')}<br>`;
        knownExits.forEach(exit => {
            html += `&nbsp;&nbsp;${exit}<br>`;
        });
    }
    return html;
}

// =============================================================================
// ### 5. MAP AND RENDERING LOGIC
// =============================================================================
function setupMap() { mapGroup = document.createElementNS(SVG_NS, 'g'); elements.mapSvg.appendChild(mapGroup); for (const roomId in rooms) { const room = rooms[roomId]; const roomGroup = document.createElementNS(SVG_NS, 'g'); roomGroup.id = `map-room-${roomId}`; roomGroup.classList.add('map-room'); const rect = document.createElementNS(SVG_NS, 'rect'); const label = document.createElementNS(SVG_NS, 'text'); label.classList.add('room-label'); const nameParts = room.name.split(' '); nameParts.forEach((part, index) => { const tspan = document.createElementNS(SVG_NS, 'tspan'); tspan.textContent = part; tspan.setAttribute('x', 0); tspan.setAttribute('dy', `${index * 1.2}em`); label.appendChild(tspan); }); roomGroup.appendChild(rect); roomGroup.appendChild(label); mapGroup.appendChild(roomGroup); } }

// Pointer events, so the map drags with a finger on a touchscreen as well as with a mouse.
function setupMapInteraction() {
    const viewport = elements.mapViewport;
    viewport.addEventListener('pointerdown', (e) => {
        gameState.isDragging = true;
        viewport.setPointerCapture(e.pointerId);
        gameState.dragStart.x = e.clientX - gameState.panOffset.x;
        gameState.dragStart.y = e.clientY - gameState.panOffset.y;
    });
    viewport.addEventListener('pointermove', (e) => {
        if (!gameState.isDragging) return;
        gameState.panOffset.x = e.clientX - gameState.dragStart.x;
        gameState.panOffset.y = e.clientY - gameState.dragStart.y;
        applyMapTransform(false);
    });
    const endDrag = () => { gameState.isDragging = false; };
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', () => applyMapTransform(false));
}

async function applyMapTransform(animated = false) {
    if (!mapGroup) return;
    let delta = -gameState.playerFacing - gameState.currentVisualRotation;
    if (delta > 180) delta -= 360; else if (delta < -180) delta += 360;
    const nextVisualRotation = gameState.currentVisualRotation + delta;
    const isLongTurn = Math.abs(delta) > 90;
    const { GRID_SIZE } = mapSettings;

    // A CSS transition animates only the CSS `transform` property, never the SVG attribute,
    // so the map and its rooms are moved with style.transform.
    const animate = (rotation, scale) => new Promise(resolve => {
        const transitionDuration = animated ? 0.3 : 0;
        const transition = `transform ${transitionDuration}s ease-in-out`;
        const playerRoom = rooms[gameState.currentRoom];
        const viewbox = elements.mapViewport.getBoundingClientRect();
        const centerX = viewbox.width / 2 + gameState.panOffset.x;
        const centerY = viewbox.height / 2 + gameState.panOffset.y;
        mapGroup.style.transition = transition;
        mapGroup.style.transform = `translate(${centerX}px, ${centerY}px) rotate(${rotation}deg) scale(${scale}) translate(${-playerRoom.x * GRID_SIZE}px, ${-playerRoom.y * GRID_SIZE}px)`;
        // Each room turns back by the same amount, so every label stays upright at any heading.
        for (const roomId in rooms) {
            const room = rooms[roomId];
            const roomGroup = document.getElementById(`map-room-${roomId}`);
            roomGroup.style.transition = transition;
            roomGroup.style.transform = `translate(${room.x * GRID_SIZE}px, ${room.y * GRID_SIZE}px) rotate(${-rotation}deg)`;
        }
        setTimeout(resolve, transitionDuration * 1000);
    });

    if (animated && isLongTurn) {
        await animate(gameState.currentVisualRotation, 0.7);
        await sleep(100);
        await animate(nextVisualRotation, 0.7);
        await sleep(300);
        await animate(nextVisualRotation, 1.0);
    } else {
        await animate(nextVisualRotation, 1.0);
    }
    gameState.currentVisualRotation = nextVisualRotation;
}

function updateMapGraphics() {
    const { GRID_SIZE, ROOM_WIDTH, ROOM_HEIGHT } = mapSettings;
    mapGroup.querySelectorAll('.map-connection').forEach(conn => conn.remove());

    const addLine = (x1, y1, x2, y2) => {
        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', x1 * GRID_SIZE);
        line.setAttribute('y1', y1 * GRID_SIZE);
        line.setAttribute('x2', x2 * GRID_SIZE);
        line.setAttribute('y2', y2 * GRID_SIZE);
        line.setAttribute('class', 'map-connection');
        mapGroup.prepend(line);
    };

    // Full lines between visited rooms; half lines from the current room toward unvisited ones.
    for (const roomId of gameState.visitedRooms) {
        const room = rooms[roomId];
        for (const dir in room.exits) {
            const targetRoomId = room.exits[dir];
            const targetRoom = rooms[targetRoomId];
            if (gameState.visitedRooms.has(targetRoomId)) {
                if (roomId < targetRoomId) addLine(room.x, room.y, targetRoom.x, targetRoom.y);
            } else if (roomId === gameState.currentRoom) {
                addLine(room.x, room.y, (room.x + targetRoom.x) / 2, (room.y + targetRoom.y) / 2);
            }
        }
    }

    for (const roomId in rooms) {
        const roomGroup = document.getElementById(`map-room-${roomId}`);
        const rect = roomGroup.querySelector('rect');
        const label = roomGroup.querySelector('text');
        rect.setAttribute('x', -ROOM_WIDTH / 2);
        rect.setAttribute('y', -ROOM_HEIGHT / 2);
        rect.setAttribute('width', ROOM_WIDTH);
        rect.setAttribute('height', ROOM_HEIGHT);
        label.setAttribute('dy', `-${(label.children.length - 1) * 0.5}em`);
        const isCurrent = roomId === gameState.currentRoom;
        roomGroup.classList.toggle('current', isCurrent);
        label.classList.toggle('current', isCurrent);
        roomGroup.classList.toggle('hidden', !isCurrent && !gameState.visitedRooms.has(roomId));
    }
}

// =============================================================================
// ### 6. RENDERING AND LOGGING
// =============================================================================

async function render(animated = true) {
    updateMapGraphics();
    await applyMapTransform(animated);
}

// Logs a command. With replaceLast, the recast takes the place of the raw command just logged.
function logCommand(commandHtml, wasCorrected, replaceLast = false) {
    const log = elements.gameLog;
    if (replaceLast && log.lastChild) {
        if (log.lastChild.classList.contains('log-command') || log.lastChild.classList.contains('log-recast')) {
            log.removeChild(log.lastChild);
        }
    }

    const entry = document.createElement('div');
    entry.className = wasCorrected ? 'log-recast' : 'log-command';
    entry.innerHTML = `> ${commandHtml}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// A room's description, with the opening its INTROS group gives it for where the player came from.
function roomDescription(roomId) {
    const room = rooms[roomId];
    let text = room.desc;
    if (room.intro) {
        const cameFromGroup = gameState.previousRoom && rooms[gameState.previousRoom].intro === room.intro;
        text = `${INTROS[room.intro][cameFromGroup ? 'later' : 'first']} ${text}`;
    }
    // Something the player put down away from where it started: "In Ātriō est etiam pānis."
    for (const obj of Object.values(OBJECTS)) {
        if (!obj.gone && !obj.carried && obj.rooms !== obj.home && obj.rooms.includes(roomId)) {
            text += ` In ${ROOM_NAMES[roomId].abl} est etiam ${obj.forms.nom}.`;
        }
    }
    return fillState(text);
}

// Logs what an action on an object shows or does, in the style of a room description.
function logObject(text) {
    const entry = document.createElement('p');
    entry.className = 'log-object';
    entry.innerHTML = processDescription(text);
    elements.gameLog.appendChild(entry);
    elements.gameLog.scrollTop = elements.gameLog.scrollHeight;
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
    desc.innerHTML = processDescription(roomDescription(gameState.currentRoom));
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

        let tooltipHtml = '';
        if (vocabSpan.classList.contains('idiom')) {
            const componentLemmas = vocabSpan.dataset.componentLemmas.split(',');
            const originalWords = vocabSpan.textContent.split(' ');
            tooltipHtml = `<span class="idiom-def">"${escapeHtml(vocabSpan.dataset.idiomDef)}"</span>`;
            componentLemmas.forEach((lemmaKey, index) => {
                const lemmaData = VOCAB_LEMMA[lemmaKey.trim()];
                const originalWord = originalWords[index] || '';
                if (lemmaData && originalWord) {
                    // The definition of the form actually used in the idiom, matched without macrons or case.
                    const cleanWord = removeDiacritics(originalWord.toLowerCase());
                    const formKey = Object.keys(lemmaData.forms).find(f => removeDiacritics(f.toLowerCase()) === cleanWord);
                    const definition = buildDefinition(lemmaData, lemmaData.forms[formKey] || {});
                    tooltipHtml += `<div><span class="component-word">${escapeHtml(originalWord)}</span>: ${escapeHtml(definition)}</div>`;
                }
            });
        } else {
            tooltipHtml = escapeHtml(vocabSpan.dataset.def);
        }

        tooltip.innerHTML = tooltipHtml;

        const rect = vocabSpan.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        let top = rect.top - tooltipRect.height - 5;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        if (left < 0) left = 5;
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 5;
        }
        if (top < 0) top = rect.bottom + 5;

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.classList.add('visible');
    });

    log.addEventListener('mouseout', (e) => {
        if (e.target.closest('.vocab')) {
            tooltip.classList.remove('visible');
        }
    });
}

// Enclitics a word may carry, and what each adds to its gloss.
const ENCLITICS = { que: 'and', ne: '(asks a yes-or-no question)', ve: 'or' };

// Finds a word in the vocabulary, or failing that the word with its enclitic taken off:
// "rosaeque" is "rosae" + "-que". A word that ends in -que by itself (quoque, neque) is found whole first.
function lookUpWord(cleanWord) {
    if (formToLemmaKey[cleanWord]) return { cleanWord, lemmaKey: formToLemmaKey[cleanWord], enclitic: null };
    for (const enclitic in ENCLITICS) {
        const base = cleanWord.slice(0, -enclitic.length);
        if (cleanWord.endsWith(enclitic) && formToLemmaKey[base]) {
            return { cleanWord: base, lemmaKey: formToLemmaKey[base], enclitic };
        }
    }
    return null;
}

// Wraps every non-core word in a tooltip span carrying its context-aware definition.
function processDescription(text) {
    // Idioms and teacher overrides become placeholders before the text is split into words,
    // so the split can never cut their HTML apart; they are put back at the end.
    const protectedSpans = [];
    const protect = (html) => `\u0000${protectedSpans.push(html) - 1}\u0000`;
    let processedText = text;

    for (const idiom in IDIOMS) {
        const idiomData = IDIOMS[idiom];
        // Idioms are keyed without macrons; each vowel matches with or without one (habes finds habēs).
        const pattern = idiom.replace(/[aeiouy]/g, v => `[${v}${'āēīōūȳ'['aeiouy'.indexOf(v)]}]`);
        const regex = new RegExp(`(?<!\\p{L})${pattern}(?!\\p{L})`, 'giu');
        processedText = processedText.replace(regex, (match) =>
            protect(`<span class="idiom vocab${idiomData.level === 'novum' ? ' novum' : ''}" data-idiom-def="${escapeHtml(idiomData.def)}" data-component-lemmas="${idiomData.componentLemmas.join(',')}">${match}</span>`));
    }

    // Teacher override: murīs[abl|by the walls] glosses this one word by hand.
    processedText = processedText.replace(/(\p{L}+)\[([^|\]]+)\|([^\]]+)\]/gu, (match, word, tag, def) =>
        protect(`<span class="vocab override" data-def="${escapeHtml(def)}">${word}</span>`));

    const wordsAndSeparators = processedText.split(/([\s.,!?;:—–()]+)/);

    return wordsAndSeparators.map(part => (part.trim() && glossSpan(part)) || part)
        .join('').replace(/\u0000(\d+)\u0000/g, (match, index) => protectedSpans[index]);
}

// The tooltip span for one word, or null if the word needs none (core, or not in the vocabulary).
// `inner` is the HTML shown inside it: by default the word, but a recast passes its jiggled version.
function glossSpan(word, inner = word) {
    // Quotes are stripped before the lookup.
    const found = lookUpWord(removeDiacritics(word.toLowerCase().replace(/['"]/g, '')));
    if (!found) return null;
    const { cleanWord, lemmaKey, enclitic } = found;

    const lemmaData = VOCAB_LEMMA[lemmaKey];
    const level = levelOf(cleanWord, lemmaKey);
    if (level === 'core') return null;

    const formKey = Object.keys(lemmaData.forms).find(f => removeDiacritics(f.toLowerCase()) === cleanWord);
    if (!formKey) return null;
    let definition = buildDefinition(lemmaData, lemmaData.forms[formKey]);
    if (enclitic) definition += ` + -${enclitic}: ${ENCLITICS[enclitic]}`;

    const vocabClass = level === 'novum' ? 'vocab novum' : 'vocab';
    return `<span class="${vocabClass}" data-lemma="${escapeHtml(lemmaData.lemma)}" data-def="${escapeHtml(definition)}">${inner}</span>`;
}

// A word of a recast, with its tooltip around whatever jiggle it carries.
const glossed = (word, inner = word) => glossSpan(word, inner) || inner;

// English verb forms no rule can derive. `third` is the he/she/it present; `ing` overrides doubling.
const IRREGULAR_ENGLISH = {
    be: { past: 'was' }, can: { third: 'can', past: 'could' }, do: { third: 'does', past: 'did' },
    fall: { past: 'fell' }, feel: { past: 'felt' }, get: { past: 'got', ing: 'getting' },
    go: { third: 'goes', past: 'went' }, have: { third: 'has', past: 'had' }, hold: { past: 'held' },
    mean: { past: 'meant' }, rise: { past: 'rose' }, say: { past: 'said' }, see: { past: 'saw' },
    sleep: { past: 'slept' }, speak: { past: 'spoke' }, think: { past: 'thought' },
    understand: { past: 'understood' }
};

const pluralize = (noun) => /[^aeiou]y$/.test(noun) ? noun.slice(0, -1) + 'ies' : /(s|sh|ch|x)$/.test(noun) ? noun + 'es' : noun + 's';
const thirdPerson = (verb) => /[^aeiou]y$/.test(verb) ? verb.slice(0, -1) + 'ies' : /(s|sh|ch|x|o)$/.test(verb) ? verb + 'es' : verb + 's';
const pastTense = (verb) => /[^aeiou]y$/.test(verb) ? verb.slice(0, -1) + 'ied' : verb.endsWith('e') ? verb + 'd' : verb + 'ed';
const ingForm = (verb) => /[^e]e$/.test(verb) ? verb.slice(0, -1) + 'ing' : verb + 'ing';

// Inflects the first word of an English verb phrase ("get up", "look at") for one Latin form.
function inflectEnglishVerb(phrase, form) {
    const [head, ...rest] = phrase.split(' ');
    const tail = rest.length ? ' ' + rest.join(' ') : '';
    const irregular = IRREGULAR_ENGLISH[head] || {};
    const plural = form.num === 'pl' || form.person === 2;

    let verb = head;
    if (form.mood === 'subjunctive') {
        verb = `may/might ${head}`;
    } else if (form.tense === 'present') {
        if (head === 'be') verb = plural ? 'are' : form.person === 1 ? 'am' : 'is';
        else if (form.person === 3 && form.num !== 'pl') verb = irregular.third || thirdPerson(head);
    } else if (form.tense === 'perfect') {
        verb = head === 'be' && plural ? 'were' : irregular.past || pastTense(head);
    } else if (form.tense === 'imperfect') {
        const auxiliary = plural ? 'were' : 'was';
        verb = head === 'be' ? auxiliary : `${auxiliary} ${irregular.ing || ingForm(head)}`;
    }
    // First and second person name their subject: eō is "I go", vīs is "you want".
    const subject = ENGLISH_SUBJECTS[`${form.person}${form.num}`];
    return (subject ? `${subject} ` : '') + verb + tail;
}

const ENGLISH_SUBJECTS = { '1sg': 'I', '1pl': 'we', '2sg': 'you', '2pl': 'you (pl.)' };

/**
 * The Grammar Engine. Builds a context-aware English definition from vocabulary data.
 * @param {object} lemmaData The main entry from VOCAB_LEMMA.
 * @param {object} formData The specific grammatical data for the form.
 * @returns {string} The generated English definition.
 */
function buildDefinition(lemmaData, formData) {
    // A definition written on the form itself always wins.
    if (formData.def) {
        return formData.def;
    }

    // Each gloss is handled on its own: 'to mean, signify' is two glosses.
    const glosses = [].concat(lemmaData.def).flatMap(def => def.split(', '));

    const processedDefs = glosses.map(gloss => {
        let currentDef = gloss;
        if (lemmaData.pos === 'noun' && formData.num === 'pl') {
            currentDef = pluralize(currentDef);
        }
        // Only a noun says "of the …": an adjective takes its case from the noun it goes with.
        if (lemmaData.pos === 'noun' && formData.case === 'gen') {
            const possessive = formData.num === 'pl' ? currentDef + "'" : currentDef + "'s"; // "parents'", "sister's"
            currentDef = `of the ${currentDef}, the ${possessive}`;
        } else if (lemmaData.pos === 'noun' && formData.case === 'dat') {
            currentDef = `to/for the ${currentDef}`;
        }
        if (lemmaData.pos === 'verb' && (formData.tense || formData.mood)) {
            currentDef = inflectEnglishVerb(currentDef.replace(/^to /, ''), formData);
        }
        return currentDef;
    });

    let finalDef = processedDefs.join(', ');
    if (formData.enclitic === 'ne') {
        finalDef = finalDef + '?';
    }
    return finalDef;
}

// =============================================================================
// ### 7. INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        gameLog: document.getElementById('game-log'),
        commandForm: document.getElementById('command-form'),
        commandInput: document.getElementById('command-input'),
        mapViewport: document.getElementById('map-viewport'),
        mapSvg: document.getElementById('map-svg'),
        tooltip: document.getElementById('tooltip'),
    };

    setupMap();
    setupMapInteraction();
    setupTooltipListeners();
    logRoom();
    render(false);
    elements.commandInput.focus();

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
