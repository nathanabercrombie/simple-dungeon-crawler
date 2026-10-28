/* Rules-facing data for the Haunted Tomb vertical slice. */
window.GAME_DATA = (() => {
  const room = (index, name, danger, lighting, exits, tags, map) => ({
    index, name, danger, target: { Easy: 9, Standard: 12, Hard: 15, Extreme: 18 }[danger],
    lighting, exits, tags, map
  });

  const rooms = [
    room(1,'Square Antechamber','Easy','None',2,['open','threshold'],`##X##\n#...#\n#...X\n#...#\n##E##`),
    room(2,'Narrow Chamber','Easy','None',2,['narrow','sight-line'],`#X#\n#.#\n#.X\n#.#\n#.#\n#.#\n#E#`),
    room(3,'Crooked Annex','Easy','None',2,['irregular','blind corner'],`####X#\n#....#\n#....X\n###..#\n  #..#\n  #E##`),
    room(4,'Lesser Pillared Hall','Easy','Fixtures',2,['pillars','cover'],`###X###\n#.....#\n#.O.O.#\n#.....X\n#.O.O.#\n#.....#\n###E###`),
    room(5,'Divided Alcoves','Easy','None',2,['alcoves','partial cover'],`###X###\n#..#..#\n#..#..#\nX.....#\n#..#..#\n#..#..#\n###E###`),
    room(6,'Dead-end Shrine','Easy','Fixtures',0,['dead-end','dais','ritual'],`  ###\n ##^##\n#..^..#\n#.....#\n#..O..#\n ##E##\n  ###`),
    room(7,'Rubble Breach','Standard','None',2,['rubble','unstable','traversal'],`###X###\n#..R..#\n#.RRR.#\nX..R..#\n#.....#\n###E###`),
    room(8,'Branching Gallery','Standard','Fixtures',3,['intersection','open'],`###X###\n#.....#\nX.....X\n#.....#\n#.....#\n#.....#\n###E###`),
    room(9,'Pit Bridge','Standard','None',2,['pit','bridge','traversal'],`###X###\n#PP.PP#\n#PP=PP#\n#PP=PP#\n#PP=PP#\n#.....X\n###E###`),
    room(10,'Balcony Chamber','Standard','Fixtures',2,['balcony','high ground'],`###X###\n#BBBBB#\n#B...B#\n#B.^.BX\n#.....#\n#.....#\n###E###`),
    room(11,'Flooded Channel','Standard','None',2,['water','channel','traversal'],`###X###\n#~~.~~#\n#~~.~~#\nX~~.~~#\n#.....#\n###E###`),
    room(12,'Twin Cells','Standard','None',2,['cells','gate','hidden exit'],`###X###\n#..#..#\nX..#..#\n#..+..#\n#..#..#\n#..#..?\n###E###`),
    room(13,'Statue Court','Standard','Fixtures',2,['statues','cover','ritual'],`###X###\n#.S.S.#\n#.....#\n#.S.S.X\n#.....#\n###E###`),
    room(14,'Broken Crossing','Standard','None',2,['pit','jump','traversal'],`###X###\n#.....#\n#PPPPP#\n#PP.PP#\n#PPPPP#\n#.....X\n###E###`),
    room(15,'Sunken Court','Standard','None',2,['sunken','elevation'],`###X###\n#.....#\n#.vvv.#\nX.v.v.#\n#.vvv.#\n#.....#\n###E###`),
    room(16,'Spiral Descent','Standard','None',2,['vertical','descent','traversal'],`###X###\n#.....#\n#.###.#\n#.#D#.#\n#.#...#\n#.....#\n###E###`),
    room(17,'Gauntlet Hall','Hard','None',2,['narrow','raised obstacles'],`##X##\n#...#\n#^.^#\nX...#\n#^.^#\n#...#\n##E##`),
    room(18,'Hanging Gallery','Hard','None',2,['balcony','pit','bridge','traversal'],`####X####\n#BBBBBBBX\n#BPPPPPB#\n#BPP=PPB#\n#BPP=PPB#\n#B.....B#\n####E####`),
    room(19,'Collapsed Great Hall','Hard','None',3,['large','rubble','unstable','traversal'],`####X####\n#...R...#\n#.RRRRR.#\n#...R...X\n#.......#\nX.R...R.#\n#.......#\n####E####`),
    room(20,'Descending Sanctum','Hard','Fixtures',2,['raised','pillars','descent'],`####X####\n#^^^^^^^#\n#^.....^#\n#^.OOO.^#\n#^..D..^#\n#^.....^#\n#.......#\n####E####`),
    room(21,'Greater Colonnade','Hard','Fixtures',3,['pillars','crossfire'],`####X####\n#.......#\n#.O.O.O.#\n#.......#\nX.O...O.X\n#.......#\n#.O.O.O.#\n#.......#\n####E####`),
    room(22,'Ring of Absence','Hard','None',3,['pit','ring','isolated center','traversal'],`####X####\n#.......#\n#.PPPPP.#\n#.P...P.#\nX.P.O.P.X\n#.P...P.#\n#.PPPPP.#\n#.......#\n####E####`),
    room(23,'Double Bridge Hall','Hard','None',2,['pit','bridges','traversal'],`####X####\n#PP=PPPP#\n#PP=PPPP#\n#.......#\n#PPPP=PP#\n#PPPP=PP#\n#.......X\n#.......#\n####E####`),
    room(24,'Broken Balcony','Hard','Fixtures',3,['balcony','elevation','divide'],`####X####\n#BBBBBBB#\n#B..P..B#\nXB..P..BX\n#B..P..B#\n#B..^..B#\n#.......#\n#.......#\n####E####`),
    room(25,'Floodgate Chamber','Hard','None',3,['water','gates','mechanism','traversal'],`####X####\n#~~+~~~~#\n#~~.~~~~#\nX...G...X\n#~~.~~~~#\n#~~+~~~~#\n#.......#\n#.......#\n####E####`),
    room(26,'Cage Aisle','Hard','Fixtures',3,['cells','gates','containment'],`####X####\n#CC#.#CC#\n#CC#.#CC#\nXCC+.+CCX\n#CC#.#CC#\n#CC#.#CC#\n#...+...#\n#.......#\n####E####`),
    room(27,'Furnace Lanes','Hard','Inherent',3,['furnace','heat','divided'],`####X####\n#F..#..F#\n#...#...#\nX.G...G.X\n#...#...#\n#F..#..F#\n#.......#\n#.......#\n####E####`),
    room(28,'Split Stair Hall','Hard','None',3,['raised','sunken','divided'],`####X####\n#^^...^^#\n#^^...^^#\nX...#...X\n#...#...#\n#vv...vv#\n#vv...vv#\n#.......#\n####E####`),
    room(29,'Shifting Cross','Hard','None',3,['mechanism','moving walls'],`####X####\n####.####\n#.......#\n#..G.G..#\nX...G...X\n#..G.G..#\n#.......#\n####.####\n####E####`),
    room(30,'Shaft Rim','Hard','None',4,['pit','ring','descent','traversal'],`####X####\n#.......#\n#.PPPPP.#\n#.P...P.#\nX.P.D.P.X\n#.P...P.#\n#.PPPPP.#\n#.......#\n####E####`),
    room(31,'Twin Dais Hall','Hard','Fixtures',3,['raised','opposed','cover'],`####X####\n#^^...^^#\n#^O...O^#\nX.......X\n#...#...#\n#.......#\n#^O...O^#\n#^^...^^#\n####E####`),
    room(32,'Rubble Labyrinth','Hard','None',3,['rubble','walls','unstable','traversal'],`####X####\n#R..#...#\n#.R.#.R.#\nX...R...X\n###.R.###\n#...R...#\n#.R.#.R.#\n#...#...#\n####E####`),
    room(33,'Triple Chasm','Extreme','None',3,['pit','bridges','traversal'],`####X####\n#P=P=P=P#\n#P=P=P=P#\nX.......X\n#P=P=P=P#\n#P=P=P=P#\n#.......#\n#P=P=P=P#\n####E####`),
    room(34,'Suspended Causeways','Extreme','None',3,['pit','causeways','traversal'],`####X####\n#PP=PPPP#\n#PP=PPPP#\nX==.===.X\n#PP=PPPP#\n#PP=PPPP#\n#PP=PPPP#\n#===.===#\n####E####`),
    room(35,'Flooded Amphitheater','Extreme','None',3,['water','terraces','traversal'],`####X####\n#^^^^^^^#\n#^~~~~~^#\nX^~...~^X\n#^~.O.~^#\n#^~...~^#\n#^~~~~~^#\n#^^^^^^^#\n####E####`),
    room(36,'Pillar Maze','Extreme','None',3,['pillars','walls','maze'],`####X####\n#.O#O#O.#\n#..#.#..#\nX#O...O#X\n#..#.#..#\n#.O#O#O.#\n#.......#\n#.......#\n####E####`),
    room(37,'Collapsing Terraces','Extreme','None',3,['raised','sunken','rubble','traversal'],`####X####\n#^^^^^^^#\n#^RRRRR^#\nX^R...R^X\n#^RvvvR^#\n#^RvvvR^#\n#^RRRRR^#\n#.......#\n####E####`),
    room(38,'Mirror Gallery','Extreme','Fixtures',3,['mirrors','deception'],`####X####\n#M.M.M.M#\n#.......#\nX.M...M.X\n#.......#\n#M.M.M.M#\n#.......#\n#M.....M#\n####E####`),
    room(39,'Gear Floor','Extreme','None',3,['mechanism','moving','dense'],`####X####\n#G.G.G.G#\n#.G.G.G.#\nXG.G.G.GX\n#.G...G.#\n#G.G.G.G#\n#.......#\n#..G.G..#\n####E####`),
    room(40,'Execution Pit','Extreme','Fixtures',3,['balcony','pit','objective'],`####X####\n#BBBBBBB#\n#B.....B#\nXB.PPP.BX\n#B.PSP.B#\n#B.PPP.B#\n#B..^..B#\n#.......#\n####E####`),
    room(41,'Lava Channels','Extreme','Inherent',3,['lava','bridges','lethal','traversal'],`####X####\n#LL=LLL.#\n#LL=LLL.#\nX..=....X\n#LL=LLLL#\n#LL=LLLL#\n#..=....#\n#.......#\n####E####`),
    room(42,'Nested Balconies','Extreme','Fixtures',5,['balconies','elevation'],`####X####\n#BBBBBBB#\nXB.....BX\n#B.BBB.B#\n#B.B^B.B#\n#B.BBB.B#\nXB.....BX\n#BBBBBBB#\n####E####`),
    room(43,'Prison Wheel','Extreme','Fixtures',3,['cells','mechanism','gates'],`####X####\n#CC#.#CC#\n#CC#G#CC#\nX..+G+..X\n#CC#G#CC#\n#CC#.#CC#\n#...+...#\n#.......#\n####E####`),
    room(44,'Ossuary Spiral','Extreme','None',4,['bones','ring','descent'],`####X####\n#OOOOOOO#\n#O.....O#\nXO.###.OX\n#O.#D#.O#\n#O.#...O#\n#O.....O#\n#OOOOOOO#\n####E####`),
    room(45,'Broken Aqueduct','Extreme','None',3,['water','causeway','rubble','traversal'],`####X####\n#~~~.~~~#\n#~~~.~~~#\nX===.===X\n#~~~.~~~#\n#~~~.~~~#\n#...R...#\n#..RRR..#\n####E####`),
    room(46,'Giant Mechanism','Extreme','None',4,['mechanism','pillars','descent'],`####X####\n#GGG.GGG#\n#G.....G#\nXG.O.O.GX\n#G..D..G#\n#G.O.O.G#\n#G.....G#\n#GGG.GGG#\n####E####`),
    room(47,'Void Lattice','Extreme','None',5,['void','bridges','traversal'],`####X####\n#PP=PPPP#\n#PP=PPPP#\nX==.===.X\n#PP=PPPP#\n#PP=PPPP#\nX==.===.X\n#PP=PPPP#\n####E####`),
    room(48,'Throne Labyrinth','Extreme','Fixtures',3,['walls','gates','objective'],`####X####\n#..#T#..#\n#..#.#..#\nX..+.+..X\n###...###\n#..+.+..#\n#..#.#..#\n#..#.#..#\n####E####`),
    room(49,'Shattered Nexus','Extreme','None',5,['pit','vertical','mechanism','traversal'],`####X####\n#R..D..R#\n#..PPP..#\nX.P.O.P.X\n#..PPP..#\n#R..U..R#\n#...G...#\n#.......#\n####E####`),
    room(50,'Heart Chamber','Extreme','Fixtures',6,['heart','raised','pillars','objective'],`####X####\n#^^^^^^^#\nX^O...O^X\n#^.....^#\n#^..T..^#\n#^.....^#\nX^O.D.O^X\n#^^^^^^^#\n####E####`)
  ];

  const challenges = [
    ['Quiet aftermath','No immediate challenge. Evidence shows what happened, changed, or recently departed.'],
    ['Domain obstacle','Burial architecture, a sealed mechanism, or a damaged processional route blocks progress.'],
    ['Theme hazard','Cold, possession, violent memory, or a room-scale haunting actively threatens passage.'],
    ['Trap','A funerary security measure has been altered or animated by the haunting.'],
    ['Puzzle','Restore names, offerings, bones, lineage, funeral order, or the sequence of a remembered death.'],
    ['Social obstacle','A ghost, mourner, robber, heir, caretaker, or survivor demands recognition, restitution, or secrecy.'],
    ['Uncertain creature','An unquiet dead person, scavenger, or guardian may bargain before becoming violent.'],
    ['Hostile creature','Risen dead, a bone swarm, possessed statue, or maddened intruder attacks.'],
    ['Creature + Domain','A guardian exploits burial architecture, ritual law, false graves, or funerary machinery.'],
    ['Creature + Theme','A creature is possessed, duplicated, reenacted, or supported by the haunting.'],
    ['Compound challenge','Two challenges share one anchor or impose competing conquest conditions.'],
    ['Major threat','A named revenant, royal ghost, mass haunting, colossus, or severe curse dominates the room.']
  ];

  const opportunities = [
    ['None','Passage and any conquest Skill Token are the only gains.'],
    ['Clue','An epitaph, reenactment, family record, disturbed remains, or confession reveals useful truth.'],
    ['Supply','Find a useful consumable: torch, medkit, bandages, oil, incense, salts, or tools.'],
    ['Usable feature','A counterweight, bier, lift, movable statue, offering mechanism, or defensible position can be exploited.'],
    ['Treasure','Funeral coins, jewelry, regalia, sacred oil, relic bones, or grave goods.'],
    ['Secret','A false niche, erased name, decoy coffin, hidden passage, or concealed mechanism.'],
    ['Shortcut','A funeral lift, ossuary crawlway, ghost path, royal stair, or route around danger.'],
    ['Major discovery','A relic weapon, spellbook, proof of lineage, named remains, royal seal, or haunting anchor.']
  ];

  const quests = [
    ['Hunt the sovereign','Spoor, wounded prey, trophies, and hunting lore','A lair and sovereign monster'],
    ['Recover the relic','Seals, maps, command phrases, and vault keys','The relic chamber and guardian'],
    ['Rescue the captive','Signs of passage, keys, allies, and the captor’s weakness','The prison, captive, and captor'],
    ['Break the curse','Anchor fragments, true names, and counter-rites','The curse source and its vessel'],
    ['Seal the breach','Ward pieces, ritual components, and planar lore','The breach and emerging entity'],
    ['Expose the truth','Testimony, records, and physical evidence','Proof that changes everything'],
    ['Lay the dead to rest','Remains, names, funeral objects, and missing rites','What prevents the dead from resting'],
    ['Sabotage the engine','Tools, schematics, weak points, and controls','The engine core or intelligence'],
    ['Steal the treasure','Access tokens, routes, schedules, and keys','The treasury, owner, and prize'],
    ['Purge the infestation','Nests, samples, vulnerabilities, and survivor reports','The brood chamber and source'],
    ['Find the lost expedition','Journals, camps, survivors, and route markers','The final camp and what stopped them'],
    ['Win the parley','Leverage, gifts, grievances, and faction support','The entity empowered to agree']
  ].map(([name,elements,heart], index) => ({ index:index+1,name,elements,heart }));

  const questBands = [
    [8,'Omen','Foreshadow the Heart, stakes, or opposition without concrete progress.'],
    [14,'Trace','Show that the objective or its agents passed through, altered, or used this room.'],
    [20,'Lead','Reveal actionable information about a route, weakness, identity, requirement, or location.'],
    [24,'Quest element','Place a concrete thing or accomplishment that removes one layer from the Heart.'],
    [28,'Guardian or setback','Add a lieutenant, rival, damaged element, false lead, or Quest complication.'],
    [30,'Major quest element','Place an element and state exactly how it changes the Heart.'],
    [Infinity,'Heart','Place the final objective. Further Hearts become a major advantage.']
  ];

  const monsters = [
    { name:'Bone Scuttlers', unitHp:1, baseUnits:2, behavior:'A colony pouring from niches and carrying small objects into bone piles.', instinct:'Lock onto the first adventurer who harms the colony; remain until that target dies, escapes, or becomes unreachable.', wound:'Gnawed — treated Scar reduces Strength.' },
    { name:'Mourning Shades', unitHp:1, baseUnits:2, behavior:'Incorporeal mourners pass through barriers to isolate the living.', instinct:'Choose whoever most resembles someone from their memory and pass through obstacles to isolate them.', wound:'Soul-Chilled — treated Scar reduces Mind.' },
    { name:'Risen Guard', unitHp:2, baseUnits:1, behavior:'A dead sentinel holds a threshold under the exact wording of an ancient oath.', instinct:'Attack whoever violates the threshold or oath; stop when its duty no longer permits pursuit.', wound:'Run Through — treated Scar reduces Strength.' },
    { name:'Wailing Choir', unitHp:2, baseUnits:1, behavior:'Several dead voices act as one through sound and remembered grief.', instinct:'Fixate on whoever interrupts, contradicts, or tries to lead its rite.', wound:'Disoriented — treated Scar reduces Mind.' },
    { name:'Possessed Statue', unitHp:3, baseUnits:1, behavior:'A funerary monument incorporates pillars, dais, and sarcophagi into its body.', instinct:'Crush whoever touches the protected tomb or damages its architectural body.', wound:'Crushed — treated Scar reduces Strength.' },
    { name:'Royal Revenant', unitHp:5, baseUnits:1, behavior:'A commanding dead sovereign demands obedience to obsolete law.', instinct:'Condemn the bearer of stolen regalia, false claimant, or highest-ranking intruder.', wound:'Death-Marked — treated Scar reduces Mind.' },
    { name:'Grave Rats', unitHp:1, baseUnits:2, behavior:'A hungry pack spills through drains and broken masonry.', instinct:'Swarm whoever carries food, remains, or an active bleeding Wound.', wound:'Fevered Bite — treated Scar reduces Strength.' },
    { name:'Shambling Mourners', unitHp:1, baseUnits:2, behavior:'A slow crowd follows funeral paths that no longer exist.', instinct:'Pursue the nearest living creature without changing targets while reachable.', wound:'Dragged Down — treated Scar reduces Agility.' },
    { name:'Grave-ogre', unitHp:4, baseUnits:1, behavior:'A huge scavenger forces itself through doors and smashes cover aside.', instinct:'Attack the loudest or most heavily burdened adventurer.', wound:'Pulverized — treated Scar reduces Strength.' }
  ];

  const gear = [
    ['Arming sword','Strength','Parry: +1 maximum HP while readied.'],
    ['Greatsword','Strength','Brutal: 2 damage, but attack with disadvantage.'],
    ['Maul','Strength','Shattering: 2 damage to Brittle creatures.'],
    ['Spear','Strength','Reach: attack across an ally or obstacle.'],
    ['Longbow','Agility','Ranged; cannot fire while closely engaged.'],
    ['Dual daggers','Agility','First attack each fight has advantage.'],
    ['Crossbow','Agility','2 damage; firing discharges it and pressured reload is an Agility check.'],
    ['Throwing knives','Agility','Attack adjacent or Near; easily concealed.'],
    ['Wand','Mind','Ranged 1-damage Arcane Bolt.'],
    ['Hexing focus','Mind','Near 1-damage attack expressed as a curse.'],
    ['Sacred relic','Mind','Near attack; 2 damage to Profane spirits and undead.'],
    ['Spirit bell','Mind','Near sonic attack affecting incorporeal creatures.']
  ];
  const pasts = ['Former grave robber','Caravan guard from the salt road','Assistant to a plague surgeon','Condemned mine laborer','Runaway monastery novice','Poacher in the royal forest','Scavenger from a broken siege','Escapee from a hidden cult','Village undertaker','Smuggler through forgotten tunnels','Retainer to a witch hunter','Disgraced duelist','Guide to the city sewers','Standard-bearer from a lost battle','Apprentice to an apothecary','Thief from a temple reliquary','Ferryman on a haunted river','Keeper of dangerous beasts','Assistant to an obsessive mapmaker','Sole survivor of a failed expedition'];
  const knacks = ['Never Lost Below','Trap Whisperer','Appraiser’s Eye','Field Surgeon','Second Wind','Scrounger','Lie Reader','Parley Under Steel','Slip the Noose','Gone in a Blink','Weak-Point Eye','Improvised Calamity','Read the Omen','Echoes of the Place','Threshold Premonition','Name the Weakness'];
  const items = ['Medkit','Rope','Fresh torch','Crowbar','Climbing tools','Flask of oil','Lantern','Bandages','Chalk and spikes','Small mirror'];
  const names = ['Mara','Corvin','Iona','Bram','Sable','Orin','Vey','Hester','Tarn','Elian','Nera','Garrick'];

  return { rooms, challenges, opportunities, quests, questBands, monsters, gear, pasts, knacks, items, names };
})();