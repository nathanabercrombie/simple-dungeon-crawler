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
    room(5,'Divided Alcoves','Easy','None',2,['alcoves','partial cover'],`  ##X##\n ##...##\n##..#..##\nX.......#\n##..#..##\n ##...##\n  ##E##`),
    room(6,'Dead-end Shrine','Easy','Fixtures',0,['dead-end','dais','ritual'],`  ###\n ##^##\n#..^..#\n#.....#\n#..O..#\n ##E##\n  ###`),
    room(7,'Rubble Breach','Standard','None',2,['rubble','unstable','traversal'],`  ##X##\n ##...#\n##..R.#\nX..RRR#\n##..R.#\n ##...#\n  ##E##`),
    room(8,'Branching Gallery','Standard','Fixtures',3,['intersection','open'],`  ##X##\n  #...#\n###...###\nX.......X\n###...###\n  #...#\n  ##E##`),
    room(9,'Pit Bridge','Standard','None',2,['pit','bridge','traversal'],`###X###\n#PP.PP#\n#PP=PP#\n#PP=PP#\n#PP=PP#\n#.....X\n###E###`),
    room(10,'Balcony Chamber','Standard','Fixtures',2,['balcony','high ground'],`###X###\n#BBBBB#\n#B...B#\n#B.^.BX\n#.....#\n#.....#\n###E###`),
    room(11,'Flooded Channel','Standard','None',2,['water','channel','traversal'],`  ##X###\n ##~.~~#\n##~~.~~#\nX~~~.~~#\n##~~.~~#\n ##....#\n  ##E###`),
    room(12,'Twin Cells','Standard','None',2,['cells','gate','hidden exit'],`###X###\n#..#..#\nX..#..#\n#..+..#\n#..#..#\n#..#..?\n###E###`),
    room(13,'Statue Court','Standard','Fixtures',2,['statues','cover','ritual'],`###X###\n#.S.S.#\n#.....#\n#.S.S.X\n#.....#\n###E###`),
    room(14,'Broken Crossing','Standard','None',2,['pit','jump','traversal'],`  ##X##\n ##...#\n##PPPPP\n#PP.PP##\n#PPPPP.X\n##....##\n ##E###`),
    room(15,'Sunken Court','Standard','None',2,['sunken','elevation'],`###X###\n#.....#\n#.vvv.#\nX.v.v.#\n#.vvv.#\n#.....#\n###E###`),
    room(16,'Spiral Descent','Standard','None',2,['vertical','descent','traversal'],`###X###\n#.....#\n#.###.#\n#.#D#.#\n#.#...#\n#.....#\n###E###`),
    room(17,'Gauntlet Hall','Hard','None',2,['narrow','raised obstacles'],`##X##\n#...#\n#^.^#\nX...#\n#^.^#\n#...#\n##E##`),
    room(18,'Hanging Gallery','Hard','None',2,['balcony','pit','bridge','traversal'],`####X####\n#BBBBBBBX\n#BPPPPPB#\n#BPP=PPB#\n#BPP=PPB#\n#B.....B#\n####E####`),
    room(19,'Collapsed Great Hall','Hard','None',3,['large','rubble','unstable','traversal'],`  ###X####\n ##...R..#\n##.RRRRR.#\n#...R....X\n#........#\nX.R...R.##\n##......#\n ###E###`),
    room(20,'Descending Sanctum','Hard','Fixtures',2,['raised','pillars','descent'],`####X####\n#^^^^^^^#\n#^.....^#\n#^.OOO.^#\n#^..D..^#\n#^.....^#\n#.......#\n####E####`),
    room(21,'Greater Colonnade','Hard','Fixtures',3,['pillars','crossfire'],`####X####\n#.......#\n#.O.O.O.#\n#.......#\nX.O...O.X\n#.......#\n#.O.O.O.#\n#.......#\n####E####`),
    room(22,'Ring of Absence','Hard','None',3,['pit','ring','isolated center','traversal'],`####X####\n#.......#\n#.PPPPP.#\n#.P...P.#\nX.P.O.P.X\n#.P...P.#\n#.PPPPP.#\n#.......#\n####E####`),
    room(23,'Double Bridge Hall','Hard','None',2,['pit','bridges','traversal'],`####X####\n#PP=PPPP#\n#PP=PPPP#\n#.......#\n#PPPP=PP#\n#PPPP=PP#\n#.......X\n#.......#\n####E####`),
    room(24,'Broken Balcony','Hard','Fixtures',3,['balcony','elevation','divide'],`####X####\n#BBBBBBB#\n#B..P..B#\nXB..P..BX\n#B..P..B#\n#B..^..B#\n#.......#\n#.......#\n####E####`),
    room(25,'Floodgate Chamber','Hard','None',3,['water','gates','mechanism','traversal'],`####X####\n#~~+~~~~#\n#~~.~~~~#\nX...G...X\n#~~.~~~~#\n#~~+~~~~#\n#.......#\n#.......#\n####E####`),
    room(26,'Cage Aisle','Hard','Fixtures',3,['cells','gates','containment'],`####X####\n#CC#.#CC#\n#CC#.#CC#\nXCC+.+CCX\n#CC#.#CC#\n#CC#.#CC#\n#...+...#\n#.......#\n####E####`),
    room(27,'Furnace Lanes','Hard','Inherent',3,['furnace','heat','divided'],`####X####\n#F..#..F#\n#...#...#\nX.G...G.X\n#...#...#\n#F..#..F#\n#.......#\n#.......#\n####E####`),
    room(28,'Split Stair Hall','Hard','None',3,['raised','sunken','divided'],`####X####\n#^^...^^#\n#^^...^^#\nX...#...X\n#...#...#\n#vv...vv#\n#vv...vv#\n#.......#\n####E####`),
    room(29,'Shifting Cross','Hard','None',3,['mechanism','moving walls'],`   ##X##\n   #...#\n####...####\n#...G.G...#\nX....G....X\n#...G.G...#\n####...####\n   #...#\n   ##E##`),
    room(30,'Shaft Rim','Hard','None',4,['pit','ring','descent','traversal'],`  ###X###\n ##.....##\n##.PPPPP.##\n#..P...P..#\nX..P.D.P..X\n#..P...P..#\n##.PPPPP.##\n ##.....##\n  ###E###`),
    room(31,'Twin Dais Hall','Hard','Fixtures',3,['raised','opposed','cover'],`####X####\n#^^...^^#\n#^O...O^#\nX.......X\n#...#...#\n#.......#\n#^O...O^#\n#^^...^^#\n####E####`),
    room(32,'Rubble Labyrinth','Hard','None',3,['rubble','walls','unstable','traversal'],`####X####\n#R..#...#\n#.R.#.R.#\nX...R...X\n###.R.###\n#...R...#\n#.R.#.R.#\n#...#...#\n####E####`),
    room(33,'Triple Chasm','Extreme','None',3,['pit','bridges','traversal'],`####X####\n#P=P=P=P#\n#P=P=P=P#\nX.......X\n#P=P=P=P#\n#P=P=P=P#\n#.......#\n#P=P=P=P#\n####E####`),
    room(34,'Suspended Causeways','Extreme','None',3,['pit','causeways','traversal'],`####X####\n#PP=PPPP#\n#PP=PPPP#\nX==.===.X\n#PP=PPPP#\n#PP=PPPP#\n#PP=PPPP#\n#===.===#\n####E####`),
    room(35,'Flooded Amphitheater','Extreme','None',3,['water','terraces','traversal'],`  ###X###\n ##^^^^^##\n##^~~~~~^##\nX^~.....~^X\n#^~..O..~^#\n#^~.....~^#\n##^~~~~~^##\n ##^^^^^##\n  ###E###`),
    room(36,'Pillar Maze','Extreme','None',3,['pillars','walls','maze'],`####X####\n#.O#O#O.#\n#..#.#..#\nX#O...O#X\n#..#.#..#\n#.O#O#O.#\n#.......#\n#.......#\n####E####`),
    room(37,'Collapsing Terraces','Extreme','None',3,['raised','sunken','rubble','traversal'],`####X####\n#^^^^^^^#\n#^RRRRR^#\nX^R...R^X\n#^RvvvR^#\n#^RvvvR^#\n#^RRRRR^#\n#.......#\n####E####`),
    room(38,'Mirror Gallery','Extreme','Fixtures',3,['mirrors','deception'],`####X####\n#M.M.M.M#\n#.......#\nX.M...M.X\n#.......#\n#M.M.M.M#\n#.......#\n#M.....M#\n####E####`),
    room(39,'Gear Floor','Extreme','None',3,['mechanism','moving','dense'],`####X####\n#G.G.G.G#\n#.G.G.G.#\nXG.G.G.GX\n#.G...G.#\n#G.G.G.G#\n#.......#\n#..G.G..#\n####E####`),
    room(40,'Execution Pit','Extreme','Fixtures',3,['balcony','pit','objective'],`####X####\n#BBBBBBB#\n#B.....B#\nXB.PPP.BX\n#B.PSP.B#\n#B.PPP.B#\n#B..^..B#\n#.......#\n####E####`),
    room(41,'Lava Channels','Extreme','Inherent',3,['lava','bridges','lethal','traversal'],`####X####\n#LL=LLL.#\n#LL=LLL.#\nX..=....X\n#LL=LLLL#\n#LL=LLLL#\n#..=....#\n#.......#\n####E####`),
    room(42,'Nested Balconies','Extreme','Fixtures',5,['balconies','elevation'],`####X####\n#BBBBBBB#\nXB.....BX\n#B.BBB.B#\n#B.B^B.B#\n#B.BBB.B#\nXB.....BX\n#BBBBBBB#\n####E####`),
    room(43,'Prison Wheel','Extreme','Fixtures',3,['cells','mechanism','gates'],`####X####\n#CC#.#CC#\n#CC#G#CC#\nX..+G+..X\n#CC#G#CC#\n#CC#.#CC#\n#...+...#\n#.......#\n####E####`),
    room(44,'Ossuary Spiral','Extreme','None',4,['bones','ring','descent'],`  ###X###\n ##OOOOO##\n##O.....O##\nXO..###..OX\n#O..#D#..O#\n#O..#....O#\n##O.....O##\n ##OOOOO##\n  ###E###`),
    room(45,'Broken Aqueduct','Extreme','None',3,['water','causeway','rubble','traversal'],`####X####\n#~~~.~~~#\n#~~~.~~~#\nX===.===X\n#~~~.~~~#\n#~~~.~~~#\n#...R...#\n#..RRR..#\n####E####`),
    room(46,'Giant Mechanism','Extreme','None',4,['mechanism','pillars','descent'],`  ###X###\n ##GG.GG##\n##G.....G##\nXG..O.O..GX\n#G...D...G#\n#G..O.O..G#\n##G.....G##\n ##GG.GG##\n  ###E###`),
    room(47,'Void Lattice','Extreme','None',5,['void','bridges','traversal'],`####X####\n#PP=PPPP#\n#PP=PPPP#\nX==.===.X\n#PP=PPPP#\n#PP=PPPP#\nX==.===.X\n#PP=PPPP#\n####E####`),
    room(48,'Throne Labyrinth','Extreme','Fixtures',3,['walls','gates','objective'],`####X####\n#..#T#..#\n#..#.#..#\nX..+.+..X\n###...###\n#..+.+..#\n#..#.#..#\n#..#.#..#\n####E####`),
    room(49,'Shattered Nexus','Extreme','None',5,['pit','vertical','mechanism','traversal'],`  ###X###\n ##R.D.R##\n##..PPP..##\nX..P.O.P..X\n#...PPP...#\n#R...U...R#\n#...G.....#\n ##.......#\n  ###E####`),
    room(50,'Heart Chamber','Extreme','Fixtures',6,['heart','raised','pillars','objective'],`  ###X###\n ##^^^^^##\nX^O.....O^X\n#^.......^#\n#^...T...^#\n#^.......^#\nX^O..D..O^X\n ##^^^^^##\n  ###E###`)
  ];

  const roomSightlines = [
    'The entrance opens into a square chamber. One doorway stands directly opposite you and another breaks the right-hand wall.',
    'A narrow chamber stretches straight ahead, scarcely wide enough for two people abreast. One opening waits at the far end and another halfway along the right wall.',
    'The walls bend around a blind left-hand corner before the chamber widens. Openings are visible ahead and to the right.',
    'Four thick pillars divide a broad rectangular floor. You can see one exit beyond them and another in the right-hand wall.',
    'Short interior walls divide the room into paired alcoves, leaving a crossing through the center toward openings ahead and left.',
    'The chamber narrows toward a raised stone platform at its far end. There is no visible doorway beyond the entrance.',
    'A jagged bank of fallen masonry splits the center of the room. Doorways remain visible beyond the rubble and through the left wall.',
    'A broad gallery opens around a central intersection, with clear doorways ahead, left, and right.',
    'Most of the chamber floor has fallen away. A single narrow bridge leads toward the far doorway while a second exit waits on the right-hand ledge.',
    'A raised gallery wraps around the far and side walls above a lower open floor. Exits stand ahead and at the right edge of the balcony.',
    'Two channels of black water run lengthwise through the chamber, leaving one narrow dry path between them. Openings are visible ahead and left.',
    'A barred divider splits the chamber into two long cells. Openings stand ahead and left, while an unbroken patch of wall at the lower right looks different from the stone around it.',
    'Four large funeral statues stand in a square around the middle of the court. Doorways open ahead and to the right.',
    'A broad pit cuts across the room. One isolated stone remnant interrupts the gap, but no complete crossing remains between you and the openings ahead and right.',
    'The center of the court drops into a shallow square depression surrounded by a higher walkway. Exits stand ahead and left.',
    'A passage spirals around a solid central core toward a stair descending inside it. Another doorway remains visible at the far end.',
    'Pairs of raised stone obstacles create a straight gauntlet through the chamber. Openings lie ahead and through the left wall.',
    'A balcony clings to the walls around a deep central pit. A single narrow bridge crosses part of the void toward exits ahead and right.',
    'The remains of a great hall spread beyond the entrance. Rubble lies in several separate banks, and doorways survive ahead, left, and right.',
    'A raised perimeter surrounds three pillars and a central descending stair. A doorway continues straight ahead beyond the higher floor.',
    'Rows of pillars form several long lanes through an immense hall. Openings break the far, left, and right walls.',
    'A circular pit encloses an isolated stone platform at the room’s center. The outer walkway reaches doorways ahead, left, and right.',
    'Two separate narrow bridges cross different sections of a broken floor, forcing the route to shift from one side of the chamber to the other.',
    'A raised balcony surrounds a long central break in the floor. Openings stand ahead and at both sides of the gallery.',
    'Water fills most of the chamber behind two visible gates. A large wheel-and-lever assembly occupies the dry central crossing.',
    'Barred cages line both sides of a narrow central aisle. Gates interrupt the bars, and doorways remain visible ahead, left, and right.',
    'Four furnace mouths glow in paired lanes divided by stone walls. Two large mechanisms stand near the center between exits ahead, left, and right.',
    'Raised platforms occupy the far corners while sunken floors fill the near corners. A dividing wall splits the middle around three visible exits.',
    'The chamber forms a narrow cross. Five large stone mechanisms crowd its center, and openings lie at the end of three arms.',
    'A ring-shaped walkway surrounds a broad shaft. At the shaft’s center, a separate stair descends into darkness; three other doorways leave the outer ring.',
    'Two raised platforms face one another across an open central floor, each marked by a pair of pillars. Openings stand ahead, left, and right.',
    'Broken interior walls and long banks of rubble turn the chamber into several crooked lanes. Three doorways are visible through the debris.',
    'Three repeated chasms divide the floor into narrow strips connected by thin crossings. Openings remain ahead, left, and right.',
    'Narrow causeways hang over a broad pit in a broken geometric pattern. Three openings can be seen beyond the exposed crossings.',
    'Concentric stone terraces descend toward a flooded central stage and a lone pillar. Openings stand ahead and on both sides.',
    'Pillars and short walls alternate in a dense maze, repeatedly blocking sight across the room. Three exits are visible only in fragments between them.',
    'Raised terraces step down through bands of loose rubble into a sunken center. Openings break the far, left, and right walls.',
    'Tall mirrors stand in alternating rows along the walls and through the middle of the gallery. Three real openings repeat many times in their reflections.',
    'Interlocking gears cover nearly the entire floor, leaving only a few narrow strips of bare stone between three exits.',
    'A balcony encloses a square execution pit around a fixed stone block. Steps descend from the near side, and openings stand ahead, left, and right.',
    'Channels of glowing lava divide the room into narrow stone lanes and bridges. Three exits wait beyond the heat.',
    'One balcony surrounds another in a series of raised rectangles. Five openings pierce the nested galleries at different sides.',
    'Barred cells surround a column of interlocked gears and gates. The central aisle connects three visible openings.',
    'Columns of carefully stacked human bones form a spiral path around a central descending stair. Openings interrupt the spiral ahead, left, and right.',
    'Two water channels flank a broken raised causeway. A mound of fallen stone blocks the near end, while three exits remain visible beyond it.',
    'An enormous mechanism fills the room from wall to wall around two pairs of pillars. A shaft descends at its center beneath three outward routes.',
    'A lattice of narrow bridges crosses a floorless void in two exposed bands. Five openings meet the lattice from different sides.',
    'Short stone walls and gates form a compact maze around a throne at the far end. Openings stand ahead, left, and right.',
    'A broken ring of pits surrounds one central pillar. Stairs rise and descend on opposite sides while a large mechanism faces three horizontal exits.',
    'A raised ring surrounds four pillars and a central stone fixture. Openings pierce every side, and a stair descends from the far half of the chamber.'
  ];

  const roomUses = [
    ['Receiving antechamber','the formal room where a funeral party assembled before entering the tomb'],
    ['Bier corridor','a narrow passage built to carry a coffin or burial platform deeper into the tomb'],
    ['Mourner’s annex','a side chamber where family members waited apart from the main procession'],
    ['Ancestor gallery','a pillared hall displaying the names and images of earlier generations'],
    ['Family offering alcoves','divided spaces where different households left gifts for their dead'],
    ['Private memorial shrine','a small sacred room for offerings to one particular dead person'],
    ['Collapsed service passage','a working route once used by attendants moving behind the public chambers'],
    ['Processional gallery','a broad junction where funeral groups formed, turned, and separated'],
    ['Coffin bridge','a narrow crossing built to carry the dead over a deliberately opened burial pit'],
    ['Witness gallery','a raised viewing chamber where mourners observed rites below'],
    ['Purification channel','a chamber where water washed bodies, tools, and attendants before burial'],
    ['Sealed burial cells','paired chambers used to isolate bodies or grave goods behind gates'],
    ['Guardian court','a statue-lined chamber displaying the protectors of the buried dead'],
    ['Broken bier crossing','a ruined route once used to move coffins across an open shaft'],
    ['Mourning court','a lowered gathering place for communal grief and funeral speech'],
    ['Lower crypt stair','a turning passage built around the descent to deeper burials'],
    ['Ritual trial passage','a narrow hall where entrants proved their right to approach the dead'],
    ['Elevated vigil gallery','a balcony where attendants watched over a burial pit through the night'],
    ['Great funeral hall','the tomb’s largest public chamber for royal or communal ceremonies'],
    ['Descending sanctuary','a sacred chamber surrounding the stair to restricted graves below'],
    ['Royal ancestor hall','a monumental colonnade honoring generations of a ruling family'],
    ['Isolation ring','a circular ritual boundary separating one grave or relic from every approach'],
    ['Twin coffin bridges','parallel routes built to move separate funeral parties across the same pit'],
    ['Nobles’ viewing balcony','a raised gallery reserved for high-ranking witnesses to burial rites'],
    ['Embalming floodgate','a water-control chamber serving the tomb’s preparation rooms'],
    ['Guardian confinement aisle','barred cells built to hold living, dead, or constructed tomb guardians'],
    ['Cremation furnace','a divided chamber where bodies, offerings, and contaminated materials were burned'],
    ['Split mourning stair','paired raised and lowered routes separating different ranks of mourner'],
    ['Rotating processional junction','a mechanical crossing that redirected funeral traffic through the tomb'],
    ['Burial shaft rim','a ring-shaped chamber used to lower bodies into graves beneath the floor'],
    ['Twin offering daises','opposed platforms where rival families or heirs presented funeral gifts'],
    ['Collapsed catacomb','a dense burial passage broken by failed walls and fallen stone'],
    ['Threefold ordeal','a sequence of chasm crossings used as a final test before the deeper tomb'],
    ['Suspended funeral way','exposed causeways built for a ceremonial crossing above an open void'],
    ['Drowned memorial theater','terraced seating around a central stage now covered by dark water'],
    ['Ancestor pillar maze','a dense field of memorial columns arranged to obscure the route inward'],
    ['Terraced burial court','stepped platforms surrounding a lower place for graves and offerings'],
    ['Mirror memorial gallery','a reflective hall intended to multiply mourners and images of the dead'],
    ['Funerary clock floor','a chamber-sized mechanism that timed and moved parts of the burial rite'],
    ['Execution memorial','a viewing chamber preserving the place where condemned bodies entered the tomb'],
    ['Fire river crossing','a lethal ceremonial route above channels of molten stone'],
    ['Hierarchical viewing galleries','nested balconies separating witnesses by status and ritual role'],
    ['Rotating prison crypt','a mechanical cell block used to confine oath-breakers beside the dead'],
    ['Spiral bone repository','a descending chamber built from carefully stored human bones'],
    ['Funeral aqueduct','a raised water route carrying purification water through the lower tomb'],
    ['Monumental burial engine','an enormous machine used to lower, seal, or reposition royal graves'],
    ['Void procession lattice','intersecting bridges used for a final exposed passage over darkness'],
    ['Royal audience tomb','a gated approach arranged around the dead ruler’s throne'],
    ['Vertical burial nexus','a ruined junction connecting graves above, below, and across the complex'],
    ['Royal heart sanctuary','the tomb’s central ceremonial chamber and final place of authority']
  ];

  const roomLightingProse = {
    Fixtures:'Blackened wall lamps and sconces surround the chamber, but none are burning.',
    Inherent:'The chamber’s own fire throws restless orange light across the stone.',
    None:'There are no fixed lamps or sconces; beyond the reach of your light, the recesses remain completely black.'
  };

  rooms.forEach((template, index) => {
    const [originalUse, originalUseDefinition] = roomUses[index];
    template.originalUse = originalUse;
    template.originalUseDefinition = originalUseDefinition;
    template.readAloud = `${roomSightlines[index]} ${roomLightingProse[template.lighting]}`;
  });

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
      { title:'The Plundered Family Niche', presence:'A burial niche stands open. Its stone cover lies on the floor inside the chamber, and grave goods have been spread in a careful semicircle around it.', clues:'One family token has been placed beneath the wrong name plaque.', rule:'No check is required to inspect the scene. Correcting the token may establish goodwill with the family dead.', consequence:'Taking the token marks its bearer as the thief in the eyes of that family’s spirits.', resolutions:['Return the token to its proper plaque','Take the token and accept the attention','Compare the disturbed names with the Quest'] }
    ],
    2: [
      { title:'The Processional Slab', presence:'A single black stone slab seals the onward route. Worn grooves show that funeral parties once moved it without brute force.', clues:'Four finger-sized sockets surround a counterweight release hidden in the wall.', rule:'Open it with a successful room-target Mind check, a suitable tool, or combined leverage. Forcing it with Strength has disadvantage without a crowbar or assistance.', consequence:'Failure drops the slab’s counterweight: the acting adventurer takes 1 damage and the dungeon acts.', resolutions:['Restore the counterweight linkage','Lever the slab with tools','Find the attendants’ release gesture'] },
      { title:'The Bone-Choked Gate', presence:'Sorted bones have avalanched through an iron gate, wedging it half open above a crawlspace.', clues:'The pile shifts whenever anyone speaks a name aloud.', rule:'Clearing the gate costs 1 exploration turn. A successful room-target Agility check clears it quietly; no check is needed if noise and a possible wandering response are accepted.', consequence:'On failure, the pile collapses for 1 damage and leaves the adventurer pinned until helped.', resolutions:['Clear and sort the bones carefully','Crawl through the narrow gap','Break the gate and accept the noise'] },
      { title:'The Door of the Misnamed Dead', presence:'The stone door has no handle—only six name plaques. Five are worn smooth at the edges; the sixth has sharp new chisel marks.', clues:'Cold breath fogs the newly cut plaque while the other five remain dry.', rule:'Speaking or restoring the correct name opens the door. Discover it with a room-target Mind check or concrete evidence from another room.', consequence:'A wrong declaration deals 1 damage to the speaker as the door steals their breath; the dungeon then acts.', resolutions:['Identify the false inscription','Use a discovered name or record','Remove every plaque and endure the backlash'] }
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
      { title:'The Six Turned Effigies', presence:'Six stone mourners face six different walls. Their hands hold fragments of one continuous funeral scene.', clues:'Circular scratches show that every plinth can rotate; one figure faces the opposite direction from the other five.', rule:'Arrange the effigies from death through burial. A room-target Mind check reveals two correct adjacencies; physical experimentation needs no check but each wrong full arrangement costs 1 exploration turn.', consequence:'A wrong arrangement makes the statues wail, immediately extinguishing portable flame.', resolutions:['Reconstruct the funeral sequence','Use historical or Quest evidence','Break the backward effigy and accept what it releases'] },
      { title:'The Weighing of Offerings', presence:'Two bronze bowls balance before a sealed arch: one holds funeral coins, the other a human tooth.', clues:'An inscription reads, “Memory must equal what the dead surrendered.”', rule:'Place a personally meaningful object in the empty third bowl. An adequate offering opens the arch without a roll; judging a lesser substitute is a room-target Mind check.', consequence:'An unworthy offering ages and crumbles while the giver takes 1 damage.', resolutions:['Give up a meaningful possession','Identify the dead person’s own missing object','Jam or dismantle the balance'] },
      { title:'The Borrowed Skeleton', presence:'A complete skeleton has been assembled on a stone table from bones belonging to at least four people.', clues:'Each bone carries a different family mark; the skull silently mouths “not mine.”', rule:'Sort the remains correctly with a room-target Mind check. Relevant records or close inspection reduce the target one step.', consequence:'Failure assembles hostile Bone Scuttlers from the rejected pieces and gives them the first dungeon action. Use + Encounter and choose Bone Scuttlers.', resolutions:['Separate the remains by family marks','Ask the skull where each bone belongs','Burn the mixed remains and forfeit reconciliation'] }
    ],
    6: [
      { title:'Lady Vey, the Last Mourner', presence:'A translucent noblewoman kneels beside an unmarked bier, blocking the route with the train of her funeral dress.', clues:'She asks every visitor the same exact question: “Which of my sons did they bury as king?”', rule:'She permits passage in exchange for a truthful answer, credible evidence, or a room-target Mind check that addresses her grief rather than merely deceiving her.', consequence:'An obvious lie turns her hostile and she summons a Mourning Shade with the first dungeon action.', resolutions:['Present evidence of the substituted burial','Promise to recover the erased name','Offer restitution for the family’s dead'] },
      { title:'Orren, Cornered Grave Robber', presence:'A living robber holds a pry bar like a spear from behind an overturned bier. A muffled cough comes from somewhere behind him.', clues:'Orren watches the exits, not the treasure, and lowers the weapon whenever the hidden person coughs.', rule:'He wants safe passage and treatment for his wounded partner. Threatening or deceiving him is a room-target check; providing a medkit or credible escape route succeeds automatically.', consequence:'Failure makes him topple the bier for cover, attack for 1 damage, and flee toward a known room.', resolutions:['Treat the hidden partner','Trade a safe route for information','Disarm or drive him away'] },
      { title:'The Oathbound Embalmer', presence:'A ghost in a stained apron continues preparing an invisible body across the only doorway.', clues:'It repeats, “No sovereign passes unfinished,” and reaches for a missing ceremonial needle.', rule:'Complete the protocol, produce the missing tool, or persuade it that the burial was fraudulent. Unsupported persuasion is a room-target Mind check.', consequence:'Interruption makes its spectral tools attack the responsible adventurer for 1 damage.', resolutions:['Supply an equivalent needle and thread','Follow the visible embalming sequence','Prove the corpse was never the sovereign'] }
    ],
    7: [
      { title:'A Watchful Occupant', presence:'The creatures turn toward you but do not attack. They hold their position, following every movement with their eyes.', clues:'Their attention repeatedly returns to one anchor, nest, threshold, or funerary object.', rule:'The group uses the creature card’s Defense, HP, Instinct, and Wound. A concrete offer or respectful retreat can prevent combat; unsupported influence uses the room target.', consequence:'The first threatening failure makes them hostile and grants them an immediate dungeon action.', resolutions:['Identify and respect what they guard','Offer food, remains, recognition, or release','Attack before they choose a target'] }
    ],
    8: [
      { title:'Ambush Among the Dead', presence:'The listed creatures attack as soon as the party’s light reveals them.', clues:'Their approach is visible in disturbed dust, moving shadows, or bones displaced from nearby niches.', rule:'Use the exact creature cards in the Encounter panel. Each failed adventurer action gives one listed enemy a dungeon action governed by its Instinct.', consequence:'An ordinary attack automatically deals 1 damage; striking an exposed adventurer causes the printed Wound.', resolutions:['Defeat or drive off the group','Escape through a viable route','Exploit the room or satisfy the creatures’ underlying drive'] }
    ],
    9: [
      { title:'Guardian of the Funeral Works', presence:'The listed creatures stand among the room’s levers, chains, and counterweights. One gestures, and a stone platform grinds sideways across the floor.', clues:'Counterweights, gates, biers, or burial platforms move in answer to their gestures.', rule:'Until the Domain mechanism is disabled, the first dungeon action each fight may reposition one adventurer instead of dealing damage. Disabling it is a room-target action.', consequence:'A failed disabling attempt activates the mechanism and the acting creature still receives its normal dungeon action.', resolutions:['Disable the funerary mechanism','Turn the machinery against its guardian','Separate the creatures from their control position'] }
    ],
    10: [
      { title:'Creatures Inside the Memory', presence:'The listed creatures flicker between their present forms and unfamiliar human figures dressed for an old funeral.', clues:'Each repeats one motion from the room’s violent past immediately before it attacks.', rule:'At the start of combat, choose: endure the haunting, or spend an action exposing its anchor with a room-target Mind check. While anchored, the first enemy to be defeated returns with 1 HP once.', consequence:'Failure to expose the anchor gives the returning creature an immediate dungeon action.', resolutions:['Destroy or reconcile the haunting anchor','Force the creatures outside the reenacted area','Defeat them twice'] }
    ],
    11: [
      { title:'The Possessed Funeral Engine', presence:'The listed creatures move around a burial mechanism of chains and stone arms. A lever pulls itself, and one empty platform begins to rise.', clues:'The mechanism moves even when no creature touches it, and the creatures flinch whenever its central nameplate is struck.', rule:'On each dungeon turn choose one: a creature follows its Instinct, or the engine shifts terrain and deals 1 damage to someone in its path. The engine is disabled by a successful room-target action at its control point.', consequence:'Failure at the controls triggers both the engine and one creature, producing two distinct dungeon effects.', resolutions:['Reach and disable the control point','Break the shared spiritual anchor','Draw the creatures into the engine’s path'] }
    ],
    12: [
      { title:'Named Master of the Chamber', presence:'A major listed creature stands at the room’s central place of honor. Its title has been cut repeatedly into the surrounding stone, and smaller dead figures bow toward it.', clues:'Among the carved titles is one repeated prohibition describing an act the creature may not perform.', rule:'Use the major creature card. It acts after every failed roll and may use room terrain as part of that action. Discovering its prohibition with evidence or a room-target Mind check removes 1 HP from its protection without dealing damage.', consequence:'Its attack deals 1 damage normally; its printed Wound applies to an exposed victim. Retreat does not end pursuit unless its Instinct or prohibition prevents it.', resolutions:['Defeat the major creature directly','Invoke its prohibition or obsolete law','Resolve the duty or anchor sustaining it'] }
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
    ['Arming sword','Strength','Parry: +1 maximum HP while readied.',1,'Lunge','Attack a target at Near range.',1],
    ['Greatsword','Strength','Brutal: 2 damage, but attack with disadvantage.',2,'Whirlwind','Make one attack against the highest Defense among adjacent enemies; on success, deal 1 damage to every adjacent enemy.',2],
    ['Maul','Strength','Shattering: 2 damage to Brittle creatures.',2,'Concuss','After a successful hit, the next attack against that target has advantage.',1],
    ['Spear','Strength','Reach: attack across an ally or obstacle.',2,'Brace','Deal 1 damage to an enemy that closes with you before it completes its action.',1],
    ['Longbow','Agility','Ranged; cannot fire while closely engaged.',2,'Pinning Shot','After a hit, the target cannot reposition during its next dungeon action.',1],
    ['Dual daggers','Agility','The first attack each fight has advantage.',2,'Twin Strike','Make one check against the higher Defense of two adjacent targets; deal 1 damage to each on success.',1],
    ['Crossbow','Agility','A loaded hit deals 2 damage; firing discharges it and pressured reload is an Agility check.',2,'Deadeye','Ignore cover and attack at Extreme range.',1],
    ['Throwing knives','Agility','Attack adjacent or Near; easily concealed.',1,'Fan of Steel','Make one check against the higher Defense of two Fragile targets; deal 1 damage to each on success.',1],
    ['Wand','Mind','Make a ranged 1-damage Arcane Bolt attack.',1,'Cure Wounds','Remove one active Wound without creating a Scar and restore the target to full HP.',3],
    ['Hexing focus','Mind','Make a Near 1-damage attack expressed as a curse.',1,'Ill Omen','After a hit, give the target disadvantage on its next check or reduce its next automatic effect.',1],
    ['Sacred relic','Mind','Make a Near attack; deal 2 damage to Profane spirits and undead.',1,'Banish','Force an eligible supernatural creature to flee or become unable to approach.',2],
    ['Spirit bell','Mind','Make a Near sonic attack that affects incorporeal creatures.',1,'Discord','After a hit, reduce the target’s Defense by one step until it acts.',1]
  ];
  const armor = [
    { primary:'Strength', weak:'Agility', burden:'Ironbound', name:'Black-iron plate', rule:'Reinforced: +1 maximum HP while worn. Loud, conspicuous, and slow to remove.', reinforced:true },
    { primary:'Strength', weak:'Agility', burden:'Chain-laden', name:'Mail, coif, and heavy boots', rule:'Guard: once per fight, prevent the first Physical damage. Noisy during stealth and dangerous in deep water.' },
    { primary:'Strength', weak:'Mind', burden:'Haunted', name:'Charm-stitched leather', rule:'Insulated Profane: a Profane Wound keeps its disadvantage but loses its additional acute effect. The charms whisper near spirits.' },
    { primary:'Strength', weak:'Mind', burden:'Glory-bound', name:'Bright half-plate', rule:'Reinforced: +1 maximum HP while worn. Intelligent enemies readily identify and challenge you.', reinforced:true },
    { primary:'Agility', weak:'Strength', burden:'Slight', name:'Quilted coat', rule:'Guard Projectile: once per fight, prevent 1 damage from a projectile. It offers little protection from heavy close blows.' },
    { primary:'Agility', weak:'Strength', burden:'Sickly', name:'Waxed plague coat and mask', rule:'Resist Poison or Disease: ignore the first qualifying hit each fight. The mask muffles speech and alarms strangers.' },
    { primary:'Agility', weak:'Mind', burden:'Impulsive', name:'Light brigandine', rule:'After a successful attack, you may reposition nearby. You habitually overextend and pursue.' },
    { primary:'Agility', weak:'Mind', burden:'Haunted', name:'Funerary wraps beneath leather', rule:'Resist Profane: ignore the first Profane hit each fight. The dead sometimes recognize the wrapping.' },
    { primary:'Mind', weak:'Strength', burden:'Frail', name:'Warded robes', rule:'Guard Arcane: once per fight, prevent 1 Arcane damage. The cloth provides little mundane protection.' },
    { primary:'Mind', weak:'Strength', burden:'Withered', name:'Gravecloth mantle', rule:'Insulated Profane: a Profane Wound loses its additional acute effect. The mantle carries the chill and scent of a tomb.' },
    { primary:'Mind', weak:'Agility', burden:'Ritually encumbered', name:'Ceremonial mail', rule:'Reinforced: +1 maximum HP while worn. Bells, seals, and layered vestments make stealth difficult.', reinforced:true },
    { primary:'Mind', weak:'Agility', burden:'Nearsighted', name:'Rune-carved plate', rule:'Reinforced: +1 maximum HP while worn. Fine work and distant mundane details are difficult to perceive.', reinforced:true }
  ];
  const pasts = ['Former grave robber','Caravan guard from the salt road','Assistant to a plague surgeon','Condemned mine laborer','Runaway monastery novice','Poacher in the royal forest','Scavenger from a broken siege','Escapee from a hidden cult','Village undertaker','Smuggler through forgotten tunnels','Retainer to a witch hunter','Disgraced duelist','Guide to the city sewers','Standard-bearer from a lost battle','Apprentice to an apothecary','Thief from a temple reliquary','Ferryman on a haunted river','Keeper of dangerous beasts','Assistant to an obsessive mapmaker','Sole survivor of a failed expedition'];
  const knacks = [
    { name:'Never Lost Below', cost:2, effect:'Learn the direction of the nearest known exit or previously visited room without rolling.' },
    { name:'Trap Whisperer', cost:2, effect:'Learn the trigger and one safe method of bypassing a detected mundane trap.' },
    { name:'Appraiser’s Eye', cost:2, effect:'Ask two questions about an object: its purpose, value, maker, age, danger, or whether it is cursed. Receive truthful answers.' },
    { name:'Field Surgeon', cost:2, effect:'Treat one active Wound without a check or treatment supply. It becomes its normal Scar.' },
    { name:'Second Wind', cost:2, effect:'During a fight, restore yourself to full HP. This does not remove a Wound.' },
    { name:'Scrounger', cost:2, effect:'In a plausible location, find one ordinary consumable such as a ration, bandage, flask of oil, torch, or ammunition.' },
    { name:'Lie Reader', cost:2, effect:'Learn whether a speaker believes one statement they just made. This does not reveal objective truth.' },
    { name:'Parley Under Steel', cost:2, effect:'Halt immediate violence from intelligent creatures long enough to exchange one short offer, demand, or warning.' },
    { name:'Slip the Noose', cost:2, effect:'Escape one mundane grapple, restraint, or enclosed hold and reposition nearby.' },
    { name:'Gone in a Blink', cost:2, effect:'If plausible concealment or an exit is nearby, break line of sight and become hidden from ordinary senses.' },
    { name:'Weak-Point Eye', cost:2, effect:'After observing a creature or barrier, the next successful damaging attack against it deals +1 damage.' },
    { name:'Improvised Calamity', cost:2, effect:'Use a suitable room feature to deal 1 damage to every creature in a small affected area.' },
    { name:'Read the Omen', cost:2, effect:'Ask the oracle one yes/no question twice and choose which result becomes true.' },
    { name:'Echoes of the Place', cost:2, effect:'Learn what significant event most recently happened in the current room through a truthful sensory impression.' },
    { name:'Threshold Premonition', cost:2, effect:'Before entering a new room, learn the category of its primary challenge. Entering still costs its normal turn.' },
    { name:'Name the Weakness', cost:2, effect:'Learn one actionable vulnerability, prohibition, appetite, or fear belonging to a creature you can observe.' }
  ];
  const items = ['Medkit','Rope','Fresh torch','Crowbar','Climbing tools','Flask of oil','Lantern','Bandages','Chalk and spikes','Small mirror'];
  const names = ['Mara','Corvin','Iona','Bram','Sable','Orin','Vey','Hester','Tarn','Elian','Nera','Garrick'];

  return {
    rooms, challenges, opportunities, sceneChallenges, sceneOpportunities,
    hauntedAtmospheres, quests, questBands, monsters,
    gear, armor, pasts, knacks, items, names
  };
})();