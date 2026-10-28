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

  const sceneChallenges = {
    1: [
      { title:'The Abandoned Vigil', presence:'A circle of kneeling candles surrounds an empty bier. Every wick is cold, but fresh wax still creeps down the stands.', clues:'A single trail of bare footprints leaves the circle and ends at a solid wall.', rule:'There is no immediate danger and no conquest reward. A thorough search costs 1 exploration turn.', consequence:'Disturbing the bier causes every candle to relight with blue flame, revealing who last lay here.', resolutions:['Follow the impossible footprints','Search the bier and candle circle','Leave the aftermath undisturbed'] },
      { title:'The Interrupted Embalming', presence:'A prepared corpse lies beneath a clean linen sheet. The tools beside it are neatly arranged except for one empty, blood-dark slot.', clues:'Preservative is still dripping into the floor drain; whoever fled did so moments—or centuries—ago.', rule:'There is no immediate challenge. Examining the corpse or tools is safe unless the party desecrates the remains.', consequence:'Desecration awakens the room’s next haunting or gives a nearby spirit a reason to pursue.', resolutions:['Identify the missing tool','Read the preparation marks','Perform the unfinished funerary step'] },
      { title:'The Plundered Family Niche', presence:'A burial niche has been opened from within. Grave goods are scattered carefully rather than stolen, as though the dead searched their own possessions.', clues:'One family token has been placed beneath the wrong name plaque.', rule:'No check is required to inspect the scene. Correcting the token may establish goodwill with the family dead.', consequence:'Taking the token marks its bearer as the thief in the eyes of that family’s spirits.', resolutions:['Return the token to its proper plaque','Take the token and accept the attention','Compare the disturbed names with the Quest'] }
    ],
    2: [
      { title:'The Processional Slab', presence:'A single black stone slab seals the onward route. Worn grooves show that funeral parties once moved it without brute force.', clues:'Four finger-sized sockets surround a counterweight release hidden in the wall.', rule:'Open it with a successful room-target Mind check, a suitable tool, or combined leverage. Forcing it with Strength has disadvantage without a crowbar or assistance.', consequence:'Failure drops the slab’s counterweight: the acting adventurer takes 1 damage and the dungeon acts.', resolutions:['Restore the counterweight linkage','Lever the slab with tools','Find the attendants’ release gesture'] },
      { title:'The Bone-Choked Gate', presence:'Sorted bones have avalanched through an iron gate, wedging it half open above a crawlspace.', clues:'The pile shifts whenever anyone speaks a name aloud.', rule:'Clearing the gate costs 1 exploration turn. A successful room-target Agility check clears it quietly; no check is needed if noise and a possible wandering response are accepted.', consequence:'On failure, the pile collapses for 1 damage and leaves the adventurer pinned until helped.', resolutions:['Clear and sort the bones carefully','Crawl through the narrow gap','Break the gate and accept the noise'] },
      { title:'The Door of the Misnamed Dead', presence:'The stone door has no handle—only six name plaques, one freshly chiseled and visibly false.', clues:'Cold breath fogs the false plaque while the other five remain dry.', rule:'Speaking or restoring the correct name opens the door. Discover it with a room-target Mind check or concrete evidence from another room.', consequence:'A wrong declaration deals 1 damage to the speaker as the door steals their breath; the dungeon then acts.', resolutions:['Identify the false inscription','Use a discovered name or record','Remove every plaque and endure the backlash'] }
    ],
    3: [
      { title:'The Grave Frost', presence:'White frost races outward from an open sarcophagus, climbing boots and extinguishing exposed flame.', clues:'The frost recoils from funeral oil and from the carved name of the properly buried dead.', rule:'At the end of each failed action in this room, the acting adventurer takes 1 damage from the cold. Ordinary warmth does not stop it.', consequence:'If portable light reaches 0 here, the frost immediately inflicts 1 damage on every exposed adventurer.', resolutions:['Seal or properly name the sarcophagus','Burn funeral oil around the anchor','Cross without rolling by abandoning something warm'] },
      { title:'The Confessional Whispers', presence:'Whispers address each adventurer by a secret shame, growing louder near the center of the room.', clues:'Wax tablets in wall niches contain confessions written in several hands but the same voice.', rule:'The first adventurer to act against the whispers tests Mind at the room target. On success, they expose the controlling voice. On failure, they must reveal a truth or lose their next free choice while the dungeon acts through them.', consequence:'A possessed adventurer moves, opens, drops, or strikes as the haunting directs; it cannot force immediate self-destruction.', resolutions:['Confess a meaningful truth','Destroy or rewrite the controlling tablet','Trace the voice to its physical anchor'] },
      { title:'The Murder Reenactment', presence:'A translucent royal figure crosses the room, is stabbed, and vanishes. The scene restarts whenever someone crosses its path.', clues:'A real bloodstain and a knife-shaped gap in the dust remain when the figures disappear.', rule:'Crossing the reenactment requires a room-target Agility check. Failure deals 1 damage from the spectral knife and gives the dungeon an action.', consequence:'After three repetitions, the victim turns to accuse the nearest living witness, raising the next attempt to Extreme 18.', resolutions:['Return or destroy the missing weapon','Interrupt the murderer before the blow','Take the victim’s place and name the killer'] }
    ],
    4: [
      { title:'The Mourner’s Scythe', presence:'Prayer cords hang across the route at ankle and throat height. Each cord disappears through a narrow slot in the wall.', clues:'Old blood marks stop just short of the safest-looking cord.', rule:'Detecting the true trigger requires no roll after careful inspection. Disarming it under pressure is a room-target Agility or Mind check.', consequence:'Triggering or failing to disarm it releases a heavy curved blade: the lead adventurer takes 1 damage and the route is cut off until reset.', resolutions:['Pin the blade with a durable tool','Cut the non-trigger cord sequence','Trigger it safely from beyond reach'] },
      { title:'The False Sarcophagus', presence:'A richly carved coffin occupies the only dry path. Its lid is surrounded by small stone mouths carved into mourning faces.', clues:'Green residue rims the carved mouths; nearby vermin lie perfectly preserved.', rule:'Hidden floor bellows release poison when the coffin is opened or moved unless the vents are sealed. Disarming the bellows is a room-target Mind check.', consequence:'Failure causes 1 damage and a Poisoned Wound if the victim was already exposed.', resolutions:['Seal every carved mouth','Vent the bellows from a distance','Leave the coffin and create another path'] },
      { title:'The Epitaph Ward', presence:'Gold letters across the floor demand that every entrant state their name and lineage.', clues:'One skeleton beyond the inscription has no jaw; another clutches a stolen name plaque.', rule:'A true name permits passage. A convincing assumed identity requires a room-target Mind check and matching evidence.', consequence:'A rejected name animates the letters into cutting wire for 1 damage, then the dungeon acts.', resolutions:['Speak truthfully and accept recognition','Present a legitimate funerary token','Erase the ward without crossing it'] }
    ],
    5: [
      { title:'The Six Turned Effigies', presence:'Six stone mourners face six different walls. Their hands hold fragments of one continuous funeral scene.', clues:'Scratches on the plinths show the statues rotate; the final figure has deliberately been turned backward.', rule:'Arrange the effigies from death through burial. A room-target Mind check reveals two correct adjacencies; physical experimentation needs no check but each wrong full arrangement costs 1 exploration turn.', consequence:'A wrong arrangement makes the statues wail, immediately extinguishing portable flame.', resolutions:['Reconstruct the funeral sequence','Use historical or Quest evidence','Break the backward effigy and accept what it releases'] },
      { title:'The Weighing of Offerings', presence:'Two bronze bowls balance before a sealed arch: one holds funeral coins, the other a human tooth.', clues:'An inscription reads, “Memory must equal what the dead surrendered.”', rule:'Place a personally meaningful object in the empty third bowl. An adequate offering opens the arch without a roll; judging a lesser substitute is a room-target Mind check.', consequence:'An unworthy offering ages and crumbles while the giver takes 1 damage.', resolutions:['Give up a meaningful possession','Identify the dead person’s own missing object','Jam or dismantle the balance'] },
      { title:'The Borrowed Skeleton', presence:'A complete skeleton has been assembled on a stone table from bones belonging to at least four people.', clues:'Each bone carries a different family mark; the skull silently mouths “not mine.”', rule:'Sort the remains correctly with a room-target Mind check. Relevant records or close inspection reduce the target one step.', consequence:'Failure assembles a hostile bone scuttler from the rejected pieces and gives it the first dungeon action.', resolutions:['Separate the remains by family marks','Ask the skull where each bone belongs','Burn the mixed remains and forfeit reconciliation'] }
    ],
    6: [
      { title:'Lady Vey, the Last Mourner', presence:'A translucent noblewoman kneels beside an unmarked bier, blocking the route with the train of her funeral dress.', clues:'She asks every visitor the same exact question: “Which of my sons did they bury as king?”', rule:'She permits passage in exchange for a truthful answer, credible evidence, or a room-target Mind check that addresses her grief rather than merely deceiving her.', consequence:'An obvious lie turns her hostile and she summons a Mourning Shade with the first dungeon action.', resolutions:['Present evidence of the substituted burial','Promise to recover the erased name','Offer restitution for the family’s dead'] },
      { title:'Orren, Cornered Grave Robber', presence:'A living robber holds a pry bar like a spear from behind an overturned bier. His wounded partner is hidden nearby.', clues:'Orren watches the exits, not the treasure, and lowers the weapon whenever the partner coughs.', rule:'He wants safe passage and treatment. Threatening or deceiving him is a room-target check; providing a medkit or credible escape route succeeds automatically.', consequence:'Failure makes him topple the bier for cover, attack for 1 damage, and flee toward a known room.', resolutions:['Treat the hidden partner','Trade a safe route for information','Disarm or drive him away'] },
      { title:'The Oathbound Embalmer', presence:'A ghost in a stained apron continues preparing an invisible body across the only doorway.', clues:'It repeats, “No sovereign passes unfinished,” and reaches for a missing ceremonial needle.', rule:'Complete the protocol, produce the missing tool, or persuade it that the burial was fraudulent. Unsupported persuasion is a room-target Mind check.', consequence:'Interruption makes its spectral tools attack the responsible adventurer for 1 damage.', resolutions:['Supply an equivalent needle and thread','Follow the visible embalming sequence','Prove the corpse was never the sovereign'] }
    ],
    7: [
      { title:'A Watchful Occupant', presence:'The creatures are alert but have not committed to violence. They guard something in this room more fiercely than they hate intruders.', clues:'Their attention repeatedly returns to one anchor, nest, threshold, or funerary object.', rule:'The group uses the creature card’s Defense, HP, Instinct, and Wound. A concrete offer or respectful retreat can prevent combat; unsupported influence uses the room target.', consequence:'The first threatening failure makes them hostile and grants them an immediate dungeon action.', resolutions:['Identify and respect what they guard','Offer food, remains, recognition, or release','Attack before they choose a target'] }
    ],
    8: [
      { title:'Ambush Among the Dead', presence:'The listed creatures attack as soon as the party’s light reveals them.', clues:'Their approach is visible in disturbed dust, moving shadows, or bones displaced from nearby niches.', rule:'Use the exact creature cards in the Encounter panel. Each failed adventurer action gives one listed enemy a dungeon action governed by its Instinct.', consequence:'An ordinary attack automatically deals 1 damage; striking an exposed adventurer causes the printed Wound.', resolutions:['Defeat or drive off the group','Escape through a viable route','Exploit the room or satisfy the creatures’ underlying drive'] }
    ],
    9: [
      { title:'Guardian of the Funeral Works', presence:'The listed creatures control this room’s original machinery and use it to divide the party.', clues:'Counterweights, gates, biers, or burial platforms move in answer to their gestures.', rule:'Until the Domain mechanism is disabled, the first dungeon action each fight may reposition one adventurer instead of dealing damage. Disabling it is a room-target action.', consequence:'A failed disabling attempt activates the mechanism and the acting creature still receives its normal dungeon action.', resolutions:['Disable the funerary mechanism','Turn the machinery against its guardian','Separate the creatures from their control position'] }
    ],
    10: [
      { title:'Creatures Inside the Memory', presence:'The listed creatures flicker between their present forms and the people who died here.', clues:'Each repeats one motion from the room’s violent past immediately before it attacks.', rule:'At the start of combat, choose: endure the haunting, or spend an action exposing its anchor with a room-target Mind check. While anchored, the first enemy to be defeated returns with 1 HP once.', consequence:'Failure to expose the anchor gives the returning creature an immediate dungeon action.', resolutions:['Destroy or reconcile the haunting anchor','Force the creatures outside the reenacted area','Defeat them twice'] }
    ],
    11: [
      { title:'The Possessed Funeral Engine', presence:'The listed creatures operate a burial mechanism animated by a second, room-wide spirit. Neither threat can be ignored safely.', clues:'The mechanism moves even when no creature touches it, and the creatures flinch whenever its central nameplate is struck.', rule:'On each dungeon turn choose one: a creature follows its Instinct, or the engine shifts terrain and deals 1 damage to someone in its path. The engine is disabled by a successful room-target action at its control point.', consequence:'Failure at the controls triggers both the engine and one creature, producing two distinct dungeon effects.', resolutions:['Reach and disable the control point','Break the shared spiritual anchor','Draw the creatures into the engine’s path'] }
    ],
    12: [
      { title:'Named Master of the Chamber', presence:'A major listed creature claims the entire room as its body, court, or sacred duty. Lesser signs identify it before it attacks.', clues:'Its title is carved into the architecture, alongside one prohibition it cannot willingly break.', rule:'Use the major creature card. It acts after every failed roll and may use room terrain as part of that action. Discovering its prohibition with evidence or a room-target Mind check removes 1 HP from its protection without dealing damage.', consequence:'Its attack deals 1 damage normally; its printed Wound applies to an exposed victim. Retreat does not end pursuit unless its Instinct or prohibition prevents it.', resolutions:['Defeat the major creature directly','Invoke its prohibition or obsolete law','Resolve the duty or anchor sustaining it'] }
    ]
  };

  const sceneOpportunities = {
    1: [{ title:'No Additional Spoils', prose:'Nothing useful remains beyond what the challenge itself reveals.', effect:'No item or map benefit is added.' }],
    2: [
      { title:'The Embalmer’s Margin Note', prose:'A waterproof strip of linen records that the royal corpse arrived after its public funeral.', effect:'Record this as evidence about the site’s central wrong.' },
      { title:'A Guard’s Final Scratching', prose:'A dying guard carved the words “THE OATH ENDS AT THE TRUE NAME” behind a loose stone.', effect:'This clue may justify a future solution involving names or oaths.' }
    ],
    3: [
      { title:'Sealed Medkit', prose:'A leather surgeon’s roll still contains clean dressings, needle, thread, and bitter antiseptic.', effect:'Add one Medkit to the party.', item:'Medkit' },
      { title:'Fresh Funeral Torch', prose:'A pitch-soaked ceremonial torch remains wrapped in waxed cloth and will burn for six turns.', effect:'Add one fresh torch to the party.', item:'Fresh torch' },
      { title:'Coil of Burial Rope', prose:'Twelve metres of strong cord once used to lower stone coffins hangs from an intact wall peg.', effect:'Add Rope to the party.', item:'Rope' }
    ],
    4: [
      { title:'The Bier Counterweight', prose:'A wheeled stone bier is linked to a ceiling counterweight and can be released from either side of the room.', effect:'Use it once to create cover, block a route, or move a heavy object without a check.' },
      { title:'Commandable Funeral Lamps', prose:'A bronze valve redirects oil between the room’s fixtures, creating sudden light or darkness in one area.', effect:'Use it to expose a hidden thing or deny ordinary sight to a creature.' }
    ],
    5: [
      { title:'The Mourner’s Silver', prose:'A sealed bowl contains thirty blackened funeral coins stamped with a deposed royal face.', effect:'Record valuable funeral silver.' },
      { title:'Votive Ruby', prose:'One statue’s stone tear is a thumb-sized ruby held by old wax rather than mortar.', effect:'Record a portable valuable with obvious funerary provenance.' }
    ],
    6: [
      { title:'The False Niche', prose:'Pressure on a blank name plaque opens a person-wide cavity behind the burial wall.', effect:'Reveal a hiding place and a plausible secret connection from this room.' },
      { title:'The Erased Confession', prose:'Writing beneath flaked plaster names the witness who approved the false royal burial.', effect:'Record the witness’s identity as actionable evidence.' }
    ],
    7: [
      { title:'The Ossuary Crawlway', prose:'A narrow maintenance passage bypasses the formal processional route and opens toward another sector.', effect:'Record a shortcut; connect it manually when its destination becomes known.' },
      { title:'The Corpse Lift', prose:'A hand-cranked platform still travels between this chamber and a lower preparation level.', effect:'Record a vertical shortcut that can improve extraction.' }
    ],
    8: [
      { title:'Bell of the Unburied Name', prose:'This palm-sized silver bell forces a nearby incorporeal spirit to become visible when rung.', effect:'Add the exceptional Bell of the Unburied Name to an adventurer.', item:'Bell of the Unburied Name' },
      { title:'The Last Vigil Seal', prose:'An intact royal seal proves who possessed authority when the tomb was closed.', effect:'Record a major discovery; it counts as strong evidence in royal or oath-bound disputes.' }
    ]
  };

  const tombFunctions = [
    ['Processional threshold','This chamber was built to control the order in which mourners approached the dead. Worn tracks preserve the path of heavy biers.'],
    ['Preparation chamber','Stone drains, tool marks, and preservative stains show where bodies were prepared for burial.'],
    ['Common crypt','Rows of family niches compress generations of names and possessions into the surrounding walls.'],
    ['Ossuary','Bones were sorted here by family, rank, and ritual purpose; the architecture treats identity as a physical inventory.'],
    ['Memorial shrine','Offering bowls, soot marks, and damaged inscriptions show where the living maintained relationships with the dead.'],
    ['Royal sepulcher','Every surface asserts status: raised stone, heraldic carving, and deliberate sight lines toward a place of honor.']
  ];

  const hauntedAtmospheres = [
    ['Dead Lanterns','Your breath fogs and every unattended flame bends toward the room’s oldest remains.'],
    ['Uninvited Names','Whispers use the adventurers’ names before anyone speaks them aloud.'],
    ['Restless Objects','Small objects return to ceremonial positions whenever no living person watches them.'],
    ['The Last Violence','A murder flickers at the edge of sight, always ending just before the victim’s face becomes clear.'],
    ['Disobedient Reflections','Reflections and shadows complete gestures their owners never made.'],
    ['The Many-Voiced Dead','Dozens of faint voices breathe one unfinished sentence through cracks in the masonry.']
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

  return {
    rooms, challenges, opportunities, sceneChallenges, sceneOpportunities,
    tombFunctions, hauntedAtmospheres, quests, questBands, monsters,
    gear, pasts, knacks, items, names
  };
})();