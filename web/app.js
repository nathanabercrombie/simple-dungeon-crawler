(() => {
  'use strict';

  const DATA = window.GAME_DATA;
  const BUILD = window.DELVEKEEPER_BUILD || 'development';
  const SAVE_KEY = 'delvekeeper.save.v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const app = $('#app');
  let state = null;
  let modal = null;
  let toastTimer = null;

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[char]));
  const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random()*1e6).toString(36)}`;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const roomById = id => state.rooms.find(room => room.id === id);
  const activeRoom = () => roomById(state.activeRoomId);
  const templateFor = room => DATA.rooms[room.templateIndex - 1];

  function hashSeed(seed) {
    let h = 2166136261 >>> 0;
    for (const char of String(seed)) {
      h ^= char.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function random() {
    state.rngState = (state.rngState + 0x6D2B79F5) >>> 0;
    let t = state.rngState;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  const die = sides => Math.floor(random() * sides) + 1;
  const pick = list => list[Math.floor(random() * list.length)];

  function stableIndex(room, salt, length) {
    const text = `${state.seed}:${room.number}:${room.templateIndex}:${salt}`;
    let hash = 2166136261 >>> 0;
    for (const char of text) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % length;
  }

  function stablePick(room, salt, list) {
    return list[stableIndex(room, salt, list.length)];
  }

  function terrainProse(template) {
    const descriptions = [
      ['lava', 'Open channels of orange-white lava divide the usable floor; narrow stone crossings are the only obvious route between them.'],
      ['water', 'Black water fills the lower ground, swallowing floor markings and making depth impossible to judge from the edge.'],
      ['void', 'The masonry ends at a lightless drop, leaving only an exposed lattice of narrow crossings.'],
      ['pit', 'A deep cut through the chamber breaks ordinary movement and turns the remaining crossings into choke points.'],
      ['rubble', 'Fresh and ancient rubble forms unstable banks, half-burying the original paths through the room.'],
      ['balconies', 'Nested stone galleries overlook one another, creating several defensible heights and blind spaces below.'],
      ['balcony', 'A raised gallery commands the lower floor and offers cover along its carved parapet.'],
      ['pillars', 'Heavy pillars interrupt sight lines and carry old soot, impact scars, and half-erased memorial carving.'],
      ['mechanism', 'A room-sized funerary mechanism occupies the architecture; its gears and counterweights can still move.'],
      ['cells', 'Barred enclosures line the route, each built to confine a body, spirit, or unwilling witness.'],
      ['mirrors', 'Tall black mirrors multiply every doorway and make several solid walls appear passable.'],
      ['raised', 'Steps divide the room into deliberate levels, placing the central ritual space above the approaches.'],
      ['sunken', 'The center lies below the perimeter, collecting dust, cold air, and anything spilled into the chamber.'],
      ['narrow', 'The architecture compresses movement into a long, exposed lane with little room to pass.'],
      ['statues', 'Funerary statues stand where mourners once gathered, their faces angled toward the room’s point of honor.'],
      ['open', 'The open floor provides clear sight from entrance to exit, with nowhere to hide an approach.']
    ];
    const chosen = descriptions.find(([tag]) => template.tags.includes(tag));
    return chosen ? chosen[1] : `The ${template.tags.slice(0,2).join(' and ')} architecture gives the chamber a deliberate, functional shape.`;
  }

  function visibleFunctionProse(name) {
    return {
      'Processional threshold':'A broad strip of worn stone runs from the entrance toward the far side. Parallel grooves score the floor, and the walls are carved with lines of hooded mourners.',
      'Preparation chamber':'Stone tables stand above dark floor drains. Hooks, shallow basins, and brown preservative stains cover the nearest work surface.',
      'Common crypt':'Rows of rectangular burial niches fill the walls. Some are sealed by name plaques; others gape open around scraps of cloth and small personal objects.',
      'Ossuary':'Human skulls and long bones are stacked in shelves and columns along the walls. Small family marks have been painted or cut into many of them.',
      'Memorial shrine':'Low offering bowls, smoke-blackened lamps, and damaged inscriptions surround a central memorial stone.',
      'Royal sepulcher':'Raised stonework, worn heraldic carvings, and larger-than-life funeral figures draw every sight line toward a place of honor.'
    }[name] || 'Old funerary stonework fills the chamber.';
  }

  function visibleTerrainProse(template) {
    const descriptions = [
      ['lava','Orange-white liquid moves through open channels in the floor. Heat presses against your faces, and narrow stone crossings span the glow.'],
      ['water','Black water covers the lower floor and hides the stone beneath it. Slow ripples touch the dry edges without any visible source.'],
      ['void','The masonry ends at a lightless drop. Only narrow crossings continue over the darkness.'],
      ['pit','A deep break cuts through the chamber. The bottom is lost in darkness, and only the remaining crossings connect the floor on either side.'],
      ['rubble','Broken stone lies in uneven banks across the chamber, half-burying the original paths. Dust sifts down whenever the pile settles.'],
      ['balconies','Stone galleries rise at several heights around the room. Their carved rails throw long shadows across the floor below.'],
      ['balcony','A raised stone gallery overlooks the lower floor behind a waist-high carved rail.'],
      ['pillars','Heavy stone pillars break up the chamber. Their surfaces carry old soot, chipped carvings, and pale impact scars.'],
      ['mechanism','Interlocking gears, chains, and counterweights fill much of the room. Several parts continue to move with a slow iron scrape.'],
      ['cells','Barred enclosures line the route. Several doors hang open, while others remain shut around darkness and old bedding.'],
      ['mirrors','Tall black mirrors repeat the doorways and your torchlight. Several reflections show depth where the wall beside them is solid.'],
      ['raised','Broad steps divide the chamber into several stone levels around a raised central space.'],
      ['sunken','The center of the floor lies below the surrounding walkway. Dust and cold mist have gathered in the depression.'],
      ['narrow','The walls press close around a long, straight strip of floor. There is barely room for two people to pass.'],
      ['statues','Funerary statues stand around the chamber with their stone faces turned toward its center.'],
      ['open','The floor lies open from entrance to exit, with no large object interrupting the view.']
    ];
    const chosen = descriptions.find(([tag]) => template.tags.includes(tag));
    return chosen ? chosen[1] : 'Carved stone walls surround an irregular floor broken by old funerary structures.';
  }

  function functionDefinition(name) {
    return {
      'Processional threshold':'a formal entrance designed to control how funeral parties approached the dead',
      'Preparation chamber':'a room where bodies were washed, preserved, dressed, and made ready for burial',
      'Common crypt':'a burial chamber shared by a family or community',
      'Ossuary':'a chamber where human bones were stored and arranged, often after earlier burial',
      'Memorial shrine':'a place where living mourners left offerings and remembered the dead',
      'Royal sepulcher':'an elaborate burial chamber built for a ruler or other person of exceptional rank'
    }[name] || 'the room’s original funerary purpose';
  }

  function roomTermDefinition(name) {
    const terms = [
      ['Ossuary','a chamber where human bones were stored and arranged, often after earlier burial'],
      ['Sepulcher','an elaborate tomb or burial chamber'],
      ['Colonnade','a row of columns supporting or bordering a passage'],
      ['Antechamber','a smaller room serving as the entrance to a larger chamber'],
      ['Sanctum','a private sacred chamber'],
      ['Aqueduct','a structure built to carry water'],
      ['Amphitheater','a circular or semicircular space with rising rows around a central floor']
    ];
    return terms.find(([term]) => name.includes(term)) || null;
  }

  function readableCount(value) {
    return ['zero','one','two','three','four','five','six','seven','eight','nine','ten'][value] || String(value);
  }

  function occupantProse(enemies) {
    if (!enemies.length) return '';
    const groups = enemies.map(enemy => `${readableCount(enemy.units)} ${enemy.name}`);
    const joined = groups.length === 1 ? groups[0] : `${groups.slice(0,-1).join(', ')}, and ${groups.at(-1)}`;
    return `You can make out ${joined} in the chamber.`;
  }

  function playerFacingPresence(presence, hasOccupants) {
    if (!hasOccupants) return presence;
    return presence
      .replace(/^The listed creatures\b/, 'They')
      .replace(/^The creatures\b/, 'They')
      .replace(/^A major listed creature\b/, 'One of them');
  }

  function questElementFor(room) {
    const catalog = {
      1: [['The Barbed Antler','A broken antler bears the sovereign beast’s blood and reveals which material pierces its hide.'],['The Last Hunter’s Journal','A dead hunter’s field notes identify the sovereign’s feeding route and blind side.'],['The Scent Chain','A blood-marked chain can draw the sovereign from its lair on chosen ground.']],
      2: [['The Brass Vault Key','A toothed ceremonial key opens the relic’s inner housing without waking its final seal.'],['The Command Phrase','A complete inscription records the words that make the guardian stand down.'],['The Reliquary Map','A vellum cross-section exposes the false wall behind the relic chamber.']],
      3: [['The Gaoler’s Key','A black iron key opens the captive’s restraint rather than merely the outer cell.'],['The Captor’s Ledger','A schedule reveals when the captive is moved and which guard acts alone.'],['The Smuggled Message','The captive names a safe signal and warns exactly which rescue attempt will get them killed.']],
      4: [['The Murder Weapon','The ceremonial embalming knife is the physical anchor of the repeated royal murder. Returning or destroying it ends that reenactment.'],['The Broken Oath','The guard’s original oath contains a release clause: it ends when the buried sovereign’s true identity is spoken.'],['The Stolen Name','A sealed genealogy proves the corpse in the royal tomb was buried under another person’s name. Speaking the true name silences the mass haunting.']],
      5: [['The North Ward','An intact ward plate can seal one quarter of the breach.'],['Salt of the Threshold','A lead urn contains enough consecrated salt to define the final ritual boundary.'],['The Exile Formula','A damaged tablet preserves the missing final line needed to force the emerging entity back.']],
      6: [['The Witness Tablet','A first-person account identifies who ordered the false burial and why.'],['The Unaltered Register','An original burial record contradicts every public version of the event.'],['The Signet Impression','A wax impression proves which official authorized the crime.']],
      7: [['The Unattended Remains','Named remains can be returned to the correct grave, ending one layer of unrest.'],['The Funeral Bell','The bell’s missing clapper can call the wandering dead back to their proper rites.'],['The Last Name','A family record restores the identity deliberately erased from the tomb.']],
      8: [['The Governor Key','This toothed rod locks the engine at the top of its cycle.'],['The Cooling Diagram','A slate plan identifies the line whose failure will disable the core safely.'],['The Blind Control','A hidden manual lever bypasses the controlling intelligence for one operation.']],
      9: [['The Assayer’s Token','This marked coin passes the treasury’s first identity test.'],['The Shift Record','A duty slate reveals the one interval when no watcher observes the prize.'],['The Inner Casket Key','A tiny key opens the treasure’s container without damaging its contents.']],
      10: [['The Sterile Egg','An intact sample reveals the exact heat that kills the brood without spreading spores.'],['The Survivor’s Map','A blood-marked sketch identifies the queen’s feeding tunnel.'],['The Bitter Smoke','A sealed censer contains enough repellent to divide the final swarm.']],
      11: [['The Cartographer’s Reel','A route reel records the lost party’s final three chambers.'],['The Captain’s Whistle','Its coded signal will receive an answer from any surviving expedition member.'],['The Abandoned Pack','The contents prove what threat forced the expedition to leave supplies behind.']],
      12: [['The Funeral Gift','A culturally exact offering removes one declared insult from the negotiation.'],['The Grievance Record','Signed testimony proves one of the ruler’s complaints was caused by a third party.'],['The Faction Seal','A recognized seal demonstrates that the adventurers can make a binding promise.']]
    };
    return stablePick(room, 'quest-element', catalog[state.quest.index] || catalog[4]);
  }

  function buildQuestScene(room) {
    const type = room.quest.name;
    if (type === 'Quest element' || type === 'Major quest element' || type === 'Heart advantage') {
      const [title, prose] = questElementFor(room);
      return { title, prose, effect: type === 'Major quest element' ? 'This major element states exactly how one defensive layer of the Heart is removed.' : 'This is a concrete Quest element; record it and apply its stated effect at the Heart.' };
    }
    if (type === 'Heart') return { title: state.quest.heart, prose:`The objective of “${state.quest.name}” is physically present in this room. It is accessible now, with ${state.quest.elementsFound} concrete element${state.quest.elementsFound === 1 ? '' : 's'} already discovered.`, effect:'Conquering this Heart completes the site’s primary objective; extraction is still required.' };
    const options = {
      Omen: [
        ['The Empty Face','Every portrait in the room has the same face scratched away with a narrow blade. The damage is old, deliberate, and limited to one identity.'],
        ['The Repeated Last Words','The room’s faint voices all stop their separate prayers to say, “It was buried under a borrowed name.”'],
        ['The Unopened Funeral','Dusty mourners’ tracks circle an untouched bier, but no tracks approach or leave it.']
      ],
      Trace: [
        ['Resin on the Wrong Door','Fresh-looking embalming resin marks a door never intended for bodies, proving the Quest’s agents used this route.'],
        ['The Dragged Regalia','A line through the dust shows a heavy royal object was dragged toward one specific exit.'],
        ['A Second Set of Footprints','One set of spectral prints repeats the official procession; another cuts across it toward a hidden destination.']
      ],
      Lead: [
        ['The Embalmer’s Index','A preparation number matches a lower-level chamber mark and identifies the route used for the substituted corpse.'],
        ['The Guard Rotation','A wall slate names the one threshold where the ancient oath changes wording and becomes vulnerable.'],
        ['The Split Epitaph','Two halves of an epitaph name different people as the same royal dead, pointing toward the record that can settle the identity.']
      ],
      'Guardian or setback': [
        ['The Loyal Lie','A risen lieutenant has destroyed part of the evidence and moved the surviving piece behind the room’s active challenge.'],
        ['The False Confession','A plausible record accuses the wrong person; physical details in this room expose one contradiction.'],
        ['The Pursuing Witness','A frightened spirit takes the needed fact and flees toward a connected room when approached openly.']
      ]
    };
    const [title, prose] = stablePick(room, 'quest-detail', options[type] || options.Omen);
    return { title, prose, effect: `${type}: this information advances “${state.quest.name}” but is not itself an abstract point.` };
  }

  function buildRoomScene(room, template) {
    const challenge = stablePick(room, 'challenge', DATA.sceneChallenges[room.challengeRoll]);
    const opportunity = stablePick(room, 'opportunity', DATA.sceneOpportunities[room.opportunityRoll]);
    const [functionName, functionProse] = stablePick(room, 'function', DATA.tombFunctions);
    const [atmosphereName, atmosphereProse] = stablePick(room, 'atmosphere', DATA.hauntedAtmospheres);
    const lighting = template.lighting === 'Fixtures'
      ? 'Blackened sconces and lamps are built into the walls; a living flame can establish secured light here.'
      : template.lighting === 'Inherent'
        ? 'The room’s own heat and fire throw moving light across every surface.'
        : 'No permanent lighting fixture survives, so every deep recess depends on portable light.';
    const readAloudLighting = template.lighting === 'Fixtures'
      ? 'Rows of blackened sconces and lamps line the walls, but none are burning.'
      : template.lighting === 'Inherent'
        ? 'The chamber’s own fire throws restless orange light across the stone.'
        : 'There are no lamps or sconces here; beyond the reach of your light, the recesses remain completely black.';
    const liveEnemies = room.enemies.filter(enemy => enemy.hp > 0);
    const occupants = liveEnemies.map(enemy => `${enemy.units} ${enemy.name} (${enemy.hp} current HP, Defense ${enemy.defense})`);
    const occupantIntroduction = occupantProse(liveEnemies);
    const visiblePresence = room.status === 'conquered'
      ? 'The chamber is quiet now. The marks left by your earlier actions remain, but its main danger is no longer active.'
      : playerFacingPresence(challenge.presence, liveEnemies.length > 0);
    const readAloud = [
      visibleFunctionProse(functionName),
      DATA.roomSightlines[template.index - 1],
      visibleTerrainProse(template),
      atmosphereProse,
      readAloudLighting,
      occupantIntroduction,
      visiblePresence
    ].filter(Boolean).join(' ');
    return {
      version: 4, functionName, functionDefinition: functionDefinition(functionName), atmosphereName, readAloud,
      description: `${functionProse} ${terrainProse(template)} ${atmosphereProse} ${lighting}`,
      challenge: { ...challenge, occupants },
      opportunity: { ...opportunity },
      quest: buildQuestScene(room)
    };
  }

  function ensureStateShape() {
    if (!state) return;
    if (!state.light.holderId) state.light.holderId = state.party.find(hero => !hero.dead)?.id || null;
    for (const room of state.rooms) {
      if (room.scene?.version !== 4) room.scene = buildRoomScene(room, templateFor(room));
    }
  }

  function loadSave() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
      return parsed && parsed.version === 1 ? parsed : null;
    } catch (_) { return null; }
  }

  function persist() {
    if (!state) return;
    state.savedAt = new Date().toISOString();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    const indicator = $('#save-state');
    if (indicator) indicator.textContent = 'Saved locally · just now';
  }

  function log(message, type = 'event') {
    state.log.unshift({ id: uid('log'), turn: state.turn, message, type, at: new Date().toISOString() });
    state.log = state.log.slice(0, 200);
  }

  function showToast(message) {
    const node = $('#toast');
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('show'), 2200);
  }

  function createCharacter(name) {
    const [gear, primary, gearRule] = pick(DATA.gear);
    const attrs = ['Strength','Agility','Mind'];
    const weak = pick(attrs.filter(attr => attr !== primary));
    const values = { Strength: 0, Agility: 0, Mind: 0 };
    values[primary] = 3;
    values[weak] = -2;
    const maxHp = gear === 'Arming sword' ? 3 : 2;
    const item = pick(DATA.items);
    return {
      id: uid('hero'), name, attributes: values, hp: maxHp, maxHp,
      tokens: 1, gear, gearRule, past: pick(DATA.pasts), pastAttribute: pick(attrs),
      knack: pick(DATA.knacks), items: [item], wound: '', scar: '', dead: false
    };
  }

  function newExpedition(form) {
    const seed = form.seed || String(new Date().toISOString().slice(0,10).replaceAll('-',''));
    const size = Number(form.size || 3);
    state = {
      version: 1, title: form.title || 'The King Who Was Buried Twice', seed,
      rngState: hashSeed(seed), size, escalation: Number(form.escalation || 3),
      domain: 'Tomb', theme: 'Haunted', quest: null,
      turn: 0, light: { remaining: 6, reserve: 0, holderId: null }, usedTemplates: [], usedQuestRolls: [],
      rooms: [], activeRoomId: null, party: [], log: [], savedAt: null
    };
    const quest = form.quest === 'random' ? pick(DATA.quests) : DATA.quests.find(q => q.index === Number(form.quest));
    state.quest = { ...quest, elementsFound: 0, heartFound: false, completed: false };
    const names = form.names.filter(Boolean);
    for (let i = 0; i < Number(form.partySize); i++) {
      const character = createCharacter(names[i] || DATA.names[i]);
      state.party.push(character);
      if (character.items.includes('Fresh torch')) state.light.reserve += 1;
    }
    state.light.holderId = state.party[0]?.id || null;
    log(`Expedition begun with seed ${seed}. Quest: ${state.quest.name}.`);
    generateRoom(Math.floor(size / 2), size - 1, null);
    render();
  }

  function templateRoll() {
    const n = state.rooms.length;
    let index, attempts = 0;
    do {
      index = die(20) + state.escalation * n;
      attempts++;
    } while (state.usedTemplates.includes(index) && attempts < 100);
    index = clamp(index, 1, DATA.rooms.length);
    state.usedTemplates.push(index);
    return index;
  }

  function questRoll() {
    const n = state.rooms.length;
    let value, attempts = 0;
    do {
      value = die(20) + state.escalation * n;
      attempts++;
    } while (state.usedQuestRolls.includes(value) && attempts < 100);
    state.usedQuestRolls.push(value);
    const band = DATA.questBands.find(([max]) => value <= max);
    return { value, name: band[1], description: band[2] };
  }

  function makeEnemy(template, major = false, wandering = false) {
    let source;
    if (major) source = template.danger === 'Extreme' ? DATA.monsters[5] : DATA.monsters[4];
    else source = pick(DATA.monsters.slice(0, wandering ? 9 : 6));
    const minimum = Math.max(2, state.party.filter(hero => !hero.dead).length);
    let total = source.unitHp * source.baseUnits;
    const units = Math.max(source.baseUnits, Math.ceil(minimum / source.unitHp));
    total = source.unitHp * units;
    return {
      id: uid('enemy'), name: source.name, hp: total, maxHp: total, units,
      defense: template.target, behavior: source.behavior, instinct: source.instinct,
      wound: source.wound, wandering
    };
  }

  function generateRoom(x, y, fromId) {
    const index = templateRoll();
    const template = DATA.rooms[index - 1];
    const challengeRoll = die(12);
    const opportunityRoll = die(8);
    const quest = questRoll();
    const room = {
      id: uid('room'), number: state.rooms.length + 1, templateIndex: index, x, y,
      challengeRoll, challenge: DATA.challenges[challengeRoll - 1],
      opportunityRoll, opportunity: DATA.opportunities[opportunityRoll - 1],
      quest, status: challengeRoll === 1 ? 'quiet' : 'dangerous', securedLight: template.lighting === 'Inherent',
      notes: '', connections: fromId ? [fromId] : [], remainingExits: template.exits,
      enemies: [], opportunityClaimed: false
    };
    if (challengeRoll >= 7) room.enemies.push(makeEnemy(template, challengeRoll === 12));
    if (quest.name === 'Heart') {
      if (state.quest.heartFound) {
        room.quest.name = 'Heart advantage';
        room.quest.description = 'The Heart is already known; this supplies a major Heart-specific advantage.';
      } else state.quest.heartFound = true;
    }
    if (quest.name.includes('quest element') || quest.name === 'Quest element') state.quest.elementsFound += 1;
    room.scene = buildRoomScene(room, template);
    state.rooms.push(room);
    if (fromId) {
      const from = roomById(fromId);
      from.connections.push(room.id);
      from.remainingExits = Math.max(0, from.remainingExits - 1);
    }
    state.activeRoomId = room.id;
    advanceTurns(1, false);
    log(`Entered Room ${room.number}: ${template.name}. Rolled Challenge ${challengeRoll}, Opportunity ${opportunityRoll}, Quest ${quest.value}.`);
    if (room.securedLight) log(`${template.name} begins with inherent secured light.`);
    persist();
    return room;
  }

  function advanceTurns(count, announce = true) {
    for (let i = 0; i < count; i++) {
      state.turn += 1;
      if (state.light.remaining > 0) {
        state.light.remaining -= 1;
        if (state.light.remaining === 0) log('The active torch burned out. The party is in darkness until another light is lit.', 'warning');
      }
    }
    if (announce && count) log(`${count} exploration turn${count === 1 ? '' : 's'} passed.`);
  }

  function availableDirections(room) {
    const vectors = [
      ['North',0,-1,'↑'],['East',1,0,'→'],['South',0,1,'↓'],['West',-1,0,'←']
    ];
    return vectors.filter(([,dx,dy]) => {
      const x = room.x + dx, y = room.y + dy;
      return x >= 0 && x < state.size && y >= 0 && y < state.size && !state.rooms.some(r => r.x === x && r.y === y);
    });
  }

  function findPath(startId, targetId) {
    const queue = [[startId]];
    const visited = new Set([startId]);
    while (queue.length) {
      const path = queue.shift();
      const last = path[path.length - 1];
      if (last === targetId) return path;
      for (const next of roomById(last).connections) {
        if (!visited.has(next)) { visited.add(next); queue.push([...path, next]); }
      }
    }
    return null;
  }

  function travelTo(targetId) {
    if (targetId === state.activeRoomId) return;
    const path = findPath(state.activeRoomId, targetId);
    if (!path) return showToast('No known route connects those rooms.');
    let normalInTurn = 0;
    let turns = 0;
    let destination = activeRoom();
    const dangerResults = [];
    for (const id of path.slice(1)) {
      const room = roomById(id);
      const template = templateFor(room);
      if (template.tags.includes('traversal')) {
        normalInTurn = 0;
        turns += 1;
      } else {
        if (normalInTurn === 0) turns += 1;
        normalInTurn = (normalInTurn + 1) % 3;
      }
      destination = room;
      if (room.status !== 'conquered' || room.enemies.some(enemy => enemy.hp > 0)) break;
      if (!room.securedLight && room.status === 'conquered') {
        const roll = die(6);
        dangerResults.push(`${room.number}:${roll}`);
        if (roll === 1) {
          room.enemies.push(makeEnemy(template, false, true));
          room.status = 'dangerous';
          log(`Wandering enemies entered Room ${room.number}; travel stopped.`, 'warning');
          break;
        }
      }
    }
    advanceTurns(turns, false);
    state.activeRoomId = destination.id;
    log(`Travelled to Room ${destination.number} in ${turns} turn${turns === 1 ? '' : 's'}${dangerResults.length ? `; danger rolls ${dangerResults.join(', ')}` : ''}.`);
    render();
  }

  function conquerRoom() {
    const room = activeRoom();
    if (!room || room.status === 'conquered') return;
    room.status = 'conquered';
    room.enemies.forEach(enemy => enemy.hp = 0);
    state.party.forEach(hero => {
      if (!hero.dead) {
        hero.tokens = Math.min(3, hero.tokens + 1);
        hero.hp = hero.maxHp;
      }
    });
    if (room.quest.name === 'Heart' && state.quest.heartFound) state.quest.completed = true;
    log(`Room ${room.number} was conquered. Each active adventurer gained a Skill Token and recovered HP.`);
    render();
  }

  function lightFixtures() {
    const room = activeRoom();
    const template = templateFor(room);
    if (template.lighting !== 'Fixtures' || room.securedLight) return;
    if (state.light.remaining <= 0) return showToast('A living flame is needed to light these fixtures.');
    room.securedLight = true;
    log(`The fixtures in Room ${room.number} were lit. This secured light suppresses wandering enemies.`);
    render();
  }

  function lightTorch() {
    if (state.light.remaining > 0) return showToast('A torch is already burning.');
    if (state.light.reserve <= 0) return showToast('No fresh torch remains.');
    state.light.reserve -= 1;
    state.light.remaining = 6;
    const torchOwner = state.party.find(hero => hero.items.some(item => item.toLowerCase().includes('torch')));
    if (torchOwner) torchOwner.items.splice(torchOwner.items.findIndex(item => item.toLowerCase().includes('torch')), 1);
    if (!state.party.some(hero => hero.id === state.light.holderId && !hero.dead)) state.light.holderId = state.party.find(hero => !hero.dead)?.id || null;
    log('A fresh six-turn torch was lit. One hand must hold it.');
    render();
  }

  function passTorch() {
    const living = state.party.filter(hero => !hero.dead);
    if (living.length < 2) return;
    const current = living.findIndex(hero => hero.id === state.light.holderId);
    const next = living[(current + 1 + living.length) % living.length];
    state.light.holderId = next.id;
    log(`${next.name} took the torch; one of their hands is occupied.`);
    render();
  }

  function claimOpportunity() {
    const room = activeRoom();
    if (room.opportunityClaimed || room.opportunityRoll === 1) return;
    ensureStateShape();
    let result = room.scene.opportunity.title;
    const item = room.scene.opportunity.item;
    if (item) {
      state.party[0].items.push(item);
      if (item === 'Fresh torch') state.light.reserve += 1;
      result = `${item} added to ${state.party[0].name}`;
    }
    room.opportunityClaimed = true;
    log(`Claimed the Room ${room.number} opportunity: ${result}.`);
    render();
  }

  function applyDungeonAction(enemyId, heroId) {
    const room = activeRoom();
    const enemy = room.enemies.find(item => item.id === enemyId);
    const hero = state.party.find(item => item.id === heroId);
    if (!enemy || !hero || hero.dead) return;
    if (hero.hp > 0) {
      hero.hp -= 1;
      log(`${enemy.name} followed its Instinct and dealt 1 damage to ${hero.name}.`);
    } else if (hero.wound) {
      hero.dead = true;
      log(`${hero.name} received a second Wound and died.`, 'warning');
    } else {
      hero.wound = enemy.wound;
      log(`${enemy.name} wounded exposed ${hero.name}: ${enemy.wound}`, 'warning');
    }
    closeModal();
    render();
  }

  function resolveRoll(form) {
    const hero = state.party.find(item => item.id === form.heroId);
    const bonus = Number(form.bonus);
    const target = Number(form.target);
    let mode = form.mode;
    const forcedDisadvantage = Boolean(hero.wound) || (state.light.remaining <= 0 && !activeRoom().securedLight);
    if (forcedDisadvantage && mode === 'advantage') mode = 'normal';
    else if (forcedDisadvantage) mode = 'disadvantage';
    const dice = mode === 'normal' ? [die(20)] : [die(20), die(20)];
    const kept = mode === 'advantage' ? Math.max(...dice) : mode === 'disadvantage' ? Math.min(...dice) : dice[0];
    const total = kept + bonus;
    const success = kept === 20 || (kept !== 1 && total >= target);
    let detail = `${hero.name} rolled ${dice.join(' and ')}`;
    if (dice.length > 1) detail += `, keeping ${kept}`;
    detail += ` + ${bonus} = ${total} vs ${target}: ${success ? 'success' : 'failure'}.`;
    if (kept === 20) detail += ' Critical success.';
    if (kept === 1) {
      advanceTurns(1, false);
      detail += ' Critical failure; one exploration turn passed.';
    }
    if (!success) detail += ' The dungeon has one meaningful action.';
    log(detail, success ? 'success' : 'warning');
    modal = { type:'rollResult', result:{ hero, dice, kept, bonus, total, target, success, mode } };
    renderModal();
    persist();
  }

  function renderWelcome() {
    const saved = loadSave();
    app.innerHTML = `
      <main class="welcome">
        <section class="welcome-card">
          <div class="welcome-hero">
            <div class="eyebrow">A guided tabletop for dangerous places</div>
            <h1>Delvekeeper</h1>
            <p>Generate the dungeon, keep the cards visible, and track the expedition without surrendering narrative judgment.</p>
          </div>
          <div class="welcome-body">
            ${saved ? `<div class="resume-box"><strong>${esc(saved.title)}</strong><p>Turn ${saved.turn} · ${saved.rooms.length} rooms · last saved ${new Date(saved.savedAt).toLocaleString()}</p><button class="btn btn-primary" data-action="resume">Resume expedition</button></div>` : ''}
            <button class="btn ${saved ? '' : 'btn-primary'}" data-action="setup">Begin a new expedition</button>
            <div class="build-badge">Delvekeeper build ${esc(BUILD)}</div>
          </div>
        </section>
      </main>`;
  }

  function statusIcon(room) {
    const icons = [];
    if (room.securedLight) icons.push('✦');
    if (room.enemies.some(enemy => enemy.hp > 0)) icons.push('⚔');
    if (room.quest.name === 'Heart') icons.push('♥');
    return icons.join('');
  }

  const TILE_INFO = {
    '#':['wall','Wall',''], '.':['floor','Floor',''], 'E':['entry','Entry','↥'], 'X':['exit','Visible exit','◆'],
    '?':['secret','Hidden exit','?'], 'O':['pillar','Pillar',''], 'S':['statue','Statue','♜'], 'P':['pit','Pit or chasm',''],
    '=':['bridge','Bridge',''], 'B':['balcony','Balcony',''], '^':['steps','Raised floor',''], 'v':['sunken','Sunken floor',''],
    'D':['descent','Descent','↓'], 'U':['ascent','Ascent','↑'], '~':['water','Water','≈'], 'R':['rubble','Rubble',''],
    '+':['gate','Gate',''], 'C':['cage','Cage',''], 'F':['furnace','Furnace','♨'], 'G':['gear','Mechanism','⚙'],
    'L':['lava','Lava',''], 'M':['mirror','Mirror','◫'], 'T':['objective','Objective fixture','✦'], ' ':['void','Outside footprint','']
  };

  function renderFloorplan(template) {
    const rows = template.map.split('\n');
    const width = Math.max(...rows.map(row => row.length));
    const cells = [];
    const used = new Map();
    for (const row of rows) {
      for (let x = 0; x < width; x++) {
        const glyph = row[x] || ' ';
        const [kind,label,icon] = TILE_INFO[glyph] || TILE_INFO['.'];
        if (!['wall','floor','void'].includes(kind)) used.set(kind, label);
        cells.push(`<span class="map-tile tile-${kind}" title="${esc(label)}" aria-label="${esc(label)}">${icon}</span>`);
      }
    }
    return `<div class="visual-map-wrap"><div class="visual-map" style="--map-cols:${width}" role="img" aria-label="Graphical floorplan for ${esc(template.name)}">${cells.join('')}</div><div class="terrain-legend">${[...used].map(([kind,label]) => `<span><i class="legend-tile tile-${kind}"></i>${esc(label)}</span>`).join('')}</div></div>`;
  }

  function renderMap() {
    const cells = [];
    for (let y = 0; y < state.size; y++) {
      for (let x = 0; x < state.size; x++) {
        const room = state.rooms.find(item => item.x === x && item.y === y);
        if (!room) cells.push('<div class="map-cell"></div>');
        else {
          const template = templateFor(room);
          cells.push(`<button class="map-cell room ${room.id === state.activeRoomId ? 'active' : ''} ${room.status}" data-action="travel" data-id="${room.id}" title="Travel to ${esc(template.name)}"><span class="number">${room.number}</span><span class="name">${esc(template.name)}</span><span class="icons">${statusIcon(room)}</span></button>`);
        }
      }
    }
    return `<aside class="pane pane-map"><div class="map-wrap">
      <div class="section-head"><h2>Dungeon map</h2><span>${state.rooms.length}/${state.size*state.size} sectors</span></div>
      <div class="map-grid" style="grid-template-columns:repeat(${state.size},1fr)">${cells.join('')}</div>
      <div class="map-legend"><div class="legend-line"><i class="legend-swatch active"></i> Current room</div><div class="legend-line"><i class="legend-swatch danger"></i> Active danger</div><div class="legend-line">✦ Secured light &nbsp; ⚔ Enemies &nbsp; ♥ Heart</div></div>
      <div class="site-card"><div class="eyebrow">${esc(state.domain)} · ${esc(state.theme)}</div><h3>${esc(state.quest.name)}</h3><p>${esc(state.quest.elements)}</p><p><strong>${state.quest.elementsFound}</strong> quest elements · Heart ${state.quest.heartFound ? 'revealed' : 'unrevealed'}</p></div>
    </div></aside>`;
  }

  function renderRoom() {
    const room = activeRoom();
    const template = templateFor(room);
    // Rebuild from the active room every time. This prevents an imported or
    // older local save from leaving player-facing prose attached to another room.
    room.scene = buildRoomScene(room, template);
    const scene = room.scene;
    const termDefinition = roomTermDefinition(template.name);
    const darkness = state.light.remaining <= 0 && !room.securedLight;
    return `<main class="pane pane-room">
      <div class="section-head"><h2>Active room</h2><span>Template ${template.index} · roll ${room.templateIndex}</span></div>
      <article class="room-card">
        <header class="room-header"><div class="eyebrow">Room ${room.number} · ${room.status}</div><h2>${esc(template.name)}</h2></header>
        <section class="read-aloud" data-room-number="${room.number}"><div class="eyebrow">Read aloud · Room ${room.number}</div><p><em>${esc(scene.readAloud)}</em></p></section>
        <div class="room-meta room-meta-strip">
          <span class="tag danger-${template.danger.toLowerCase()}">${template.danger} ${template.target}</span>
          <span class="tag ${room.securedLight ? 'lit' : ''}">${room.securedLight ? '✦ Secured light' : template.lighting}</span>
          ${darkness ? '<span class="tag danger-hard">Darkness: disadvantage</span>' : ''}
          ${template.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}
        </div>
        <div class="room-body">${renderFloorplan(template)}<div class="room-copy">
          <div class="facilitator-heading"><div class="eyebrow">Facilitator information</div>${termDefinition ? `<p><strong>${esc(termDefinition[0])}:</strong> ${esc(termDefinition[1])}.</p>` : ''}<p><strong>Former use:</strong> ${esc(scene.functionName)} — ${esc(scene.functionDefinition)}.</p><p><strong>Haunting:</strong> ${esc(scene.atmosphereName)}.</p></div>
          <div class="scene-block"><div class="eyebrow">Challenge · d12 ${room.challengeRoll}</div><h3 class="scene-title">${esc(scene.challenge.title)}</h3><p>${esc(scene.challenge.presence)}</p>
          ${scene.challenge.occupants.length ? `<div class="occupant-line"><strong>Present:</strong> ${scene.challenge.occupants.map(esc).join('; ')}</div>` : ''}
          <ul class="facilitator-rules"><li><strong>If they stop and examine the situation:</strong> ${esc(scene.challenge.clues)}</li><li><strong>If they interact with or challenge it:</strong> ${esc(scene.challenge.rule)}</li><li><strong>If they trigger it or fail:</strong> ${esc(scene.challenge.consequence)}</li></ul>
          <h4>Possible resolutions</h4><ul>${scene.challenge.resolutions.map(item => `<li>${esc(item)}</li>`).join('')}</ul><small>These approaches are not exhaustive; a credible free-form solution can work.</small></div>
          <div class="scene-block opportunity-block"><div class="eyebrow">Opportunity · d8 ${room.opportunityRoll}</div><h3 class="scene-title">${esc(scene.opportunity.title)}</h3><p>${esc(scene.opportunity.prose)}</p><div class="effect-line"><strong>Effect:</strong> ${esc(scene.opportunity.effect)}</div></div>
          <div class="fallback"><strong>Default target:</strong> ${template.danger} ${template.target}. Use it only when the concrete rule or fiction calls for a check.</div>
        </div></div>
        <footer class="room-footer"><div class="button-row">
          ${template.lighting === 'Fixtures' && !room.securedLight ? '<button class="btn btn-small" data-action="light-fixtures">Light fixtures</button>' : ''}
          ${room.opportunityRoll > 1 && !room.opportunityClaimed ? '<button class="btn btn-small" data-action="claim">Claim opportunity</button>' : ''}
          <button class="btn btn-small" data-action="pass-turn">Pass one exploration turn</button>
        </div><textarea class="room-notes" data-action="notes" placeholder="Room rulings, changed terrain, secured ropes, creatures left behind…">${esc(room.notes)}</textarea></footer>
      </article>
    </main>`;
  }

  function renderEnemy(enemy) {
    const pips = Array.from({length:enemy.maxHp}, (_, index) => `<button class="pip ${index >= enemy.hp ? 'empty' : ''}" data-action="enemy-hp" data-id="${enemy.id}" data-hp="${index+1}" title="Set HP to ${index+1}"></button>`).join('');
    return `<article class="enemy-card"><div class="enemy-top"><div><div class="eyebrow">${enemy.wandering ? 'Wandering enemy' : `${enemy.units} creature${enemy.units === 1 ? '' : 's'}`}</div><h3>${esc(enemy.name)}</h3></div><div class="hp-pips">${pips}</div></div><div class="enemy-stats"><span>Defense ${enemy.defense}</span><span>${enemy.hp}/${enemy.maxHp} HP</span></div><p>${esc(enemy.behavior)}</p><p><strong>Instinct:</strong> ${esc(enemy.instinct)}</p><p><strong>Wound:</strong> ${esc(enemy.wound)}</p><div class="card-actions"><button class="btn btn-small" data-action="damage-enemy" data-id="${enemy.id}">Deal 1</button><button class="btn btn-small" data-action="dungeon-action" data-id="${enemy.id}">Dungeon action</button><button class="btn btn-small btn-quiet" data-action="remove-enemy" data-id="${enemy.id}">Remove</button></div></article>`;
  }

  function renderEncounter() {
    const room = activeRoom();
    const live = room.enemies.filter(enemy => enemy.hp > 0);
    return `<aside class="pane pane-encounter"><section><div class="section-head"><h2>Encounter</h2><button class="btn btn-small btn-quiet" data-action="add-enemy">+ Enemy</button></div><div class="enemy-list">${live.length ? live.map(renderEnemy).join('') : '<div class="empty-state">No active creature cards in this room.</div>'}</div></section>
      <section><div class="subhead">Quest thread</div><div class="quest-list"><article class="quest-card"><div class="eyebrow">${esc(room.quest.name)} · roll ${room.quest.value}</div><h3>${esc(room.scene.quest.title)}</h3><p>${esc(room.scene.quest.prose)}</p><p><strong>Effect:</strong> ${esc(room.scene.quest.effect)}</p></article>${state.quest.heartFound ? `<article class="quest-card"><div class="eyebrow">Heart</div><h3>${esc(state.quest.heart)}</h3><p>${state.quest.elementsFound} element${state.quest.elementsFound === 1 ? '' : 's'} found. ${state.quest.completed ? 'The Heart is conquered.' : 'It remains unresolved.'}</p></article>` : ''}</div></section></aside>`;
  }

  function signed(value) { return value >= 0 ? `+${value}` : String(value); }
  function renderHero(hero) {
    const bearingTorch = state.light.remaining > 0 && state.light.holderId === hero.id;
    return `<article class="adventurer-card ${hero.dead ? 'dead' : ''}"><div class="adventurer-head"><div><h3>${esc(hero.name)}${hero.dead ? ' — dead' : ''}</h3><p>${esc(hero.past)} · ${esc(hero.knack)}${bearingTorch ? ' · 🔥 Torch bearer' : ''}</p></div><div class="tracker"><button data-action="hero-hp" data-id="${hero.id}" data-delta="-1">−</button><strong>♥ ${hero.hp}/${hero.maxHp}</strong><button data-action="hero-hp" data-id="${hero.id}" data-delta="1">+</button></div></div>
      <div class="character-row">${Object.entries(hero.attributes).map(([name,value]) => `<div class="stat"><small>${name}</small><strong>${signed(value)}</strong></div>`).join('')}</div>
      <div class="gear-line"><strong>${esc(hero.gear)}:</strong> ${esc(hero.gearRule)}</div>${bearingTorch ? '<div class="gear-line"><strong>Torch:</strong> occupies one hand; bows and two-handed equipment are unavailable.</div>' : ''}<div class="gear-line"><strong>Past:</strong> ${esc(hero.past)} (${esc(hero.pastAttribute)}; +2 when invoked for 1 token)</div>
      ${hero.wound ? `<div class="gear-line"><strong>Wound:</strong> ${esc(hero.wound)}</div>` : ''}${hero.scar ? `<div class="gear-line"><strong>Scar:</strong> ${esc(hero.scar)}</div>` : ''}
      <div class="inventory">${hero.items.map((item,index) => `<button class="item-chip" data-action="remove-item" data-id="${hero.id}" data-index="${index}" title="Click to consume or remove">${esc(item)}</button>`).join('')}<button class="item-chip" data-action="add-item" data-id="${hero.id}">+ item</button></div>
      <div class="card-actions"><div class="tracker"><button data-action="hero-token" data-id="${hero.id}" data-delta="-1">−</button><strong>◆ ${hero.tokens}/3</strong><button data-action="hero-token" data-id="${hero.id}" data-delta="1">+</button></div>${hero.wound ? `<button class="btn btn-small" data-action="treat" data-id="${hero.id}">Treat Wound</button>` : ''}</div></article>`;
  }

  function renderParty() {
    return `<section class="pane pane-party"><div class="section-head"><h2>Party</h2><span>No carrying capacity · fiction still applies</span></div><div class="party-list">${state.party.map(renderHero).join('')}</div></section>`;
  }

  function renderDrawer() {
    return `<aside id="log-drawer" class="drawer hidden"><div class="drawer-head"><h2>Expedition log</h2><button class="btn icon-btn" data-action="toggle-log">×</button></div><div class="log-list">${state.log.map(entry => `<article class="log-entry"><time>Turn ${entry.turn}</time><p>${esc(entry.message)}</p></article>`).join('')}</div></aside>`;
  }

  function render() {
    if (!state) return renderWelcome();
    ensureStateShape();
    const room = activeRoom();
    const template = templateFor(room);
    app.innerHTML = `<div class="app-shell">
      <header class="topbar"><div class="brand"><div class="brand-mark"><span>D</span></div><div><h1>${esc(state.title)}</h1><p>${esc(state.domain)} · ${esc(state.theme)} · seed ${esc(state.seed)} · build ${esc(BUILD)}</p></div></div>
      <div class="resource-strip"><div class="resource"><small>Turn</small><strong>${state.turn}</strong></div><div class="resource torch"><small>Active torch</small><strong>${state.light.remaining || 'Dark'}</strong></div><div class="resource"><small>Spare torches</small><strong>${state.light.reserve}</strong></div><div class="resource"><small>Room</small><strong>${room.number}/${state.size*state.size}</strong></div></div>
      <div class="top-actions"><span class="build-pill" title="Deployed application build">Build ${esc(BUILD)}</span><button class="btn icon-btn" data-action="toggle-log" title="Expedition log">☷</button><button class="btn icon-btn" data-action="settings" title="Save and expedition settings">···</button></div></header>
      <div class="workspace">${renderMap()}${renderRoom()}${renderEncounter()}${renderParty()}</div>
      <footer class="action-dock"><div class="primary-actions"><button class="btn btn-primary" data-action="explore" ${room.remainingExits <= 0 || state.rooms.length >= state.size*state.size ? 'disabled' : ''}>Explore new room</button><button class="btn" data-action="roll">Make a check</button><button class="btn" data-action="conquer" ${room.status === 'conquered' ? 'disabled' : ''}>Conquer room</button>${state.light.remaining <= 0 ? '<button class="btn" data-action="light-torch">Light torch</button>' : state.party.filter(hero=>!hero.dead).length > 1 ? '<button class="btn" data-action="pass-torch">Pass torch</button>' : ''}</div><div id="save-state" class="save-state">Saved locally</div></footer>
      ${renderDrawer()}<div id="modal" class="modal-backdrop hidden"></div>
    </div>`;
    persist();
  }

  function openSetup() {
    const today = new Date().toISOString().slice(0,10).replaceAll('-','');
    modal = { type:'setup' };
    document.body.insertAdjacentHTML('beforeend', `<div id="standalone-modal" class="modal-backdrop"></div>`);
    const root = $('#standalone-modal');
    root.innerHTML = `<form class="modal" id="setup-form"><div class="modal-head"><div class="eyebrow">New expedition</div><h2>Enter the haunted tomb</h2><p>The first room is generated immediately and consumes one turn of the shared six-turn torch.</p></div><div class="modal-body"><div class="form-grid">
      <div class="field full"><label>Expedition title</label><input name="title" value="The King Who Was Buried Twice"></div>
      <div class="field"><label>Seed</label><input name="seed" value="${today}"></div><div class="field"><label>Quest</label><select name="quest"><option value="random">Random quest</option>${DATA.quests.map(q => `<option value="${q.index}" ${q.index === 4 ? 'selected' : ''}>${q.name}</option>`).join('')}</select></div>
      <div class="field"><label>Site size</label><select name="size"><option value="3">Compact · 3×3</option><option value="4">Standard · 4×4</option><option value="5">Sprawling · 5×5</option></select></div><div class="field"><label>Escalation</label><select name="escalation"><option value="3">Fast · E3</option><option value="2">Standard · E2</option><option value="1">Slow · E1</option></select></div>
      <div class="field"><label>Adventurers</label><select name="partySize" id="party-size"><option value="1">1 adventurer</option><option value="2" selected>2 adventurers</option><option value="3">3 adventurers</option><option value="4">4 adventurers</option></select></div><div class="field"><label>Names (comma separated)</label><input name="names" value="Mara, Corvin"></div>
      </div></div><div class="modal-foot"><button type="button" class="btn btn-quiet" data-action="close-setup">Cancel</button><button class="btn btn-primary" type="submit">Generate expedition</button></div></form>`;
  }

  function modalShell(title, subtitle, body, foot = '') {
    return `<section class="modal"><div class="modal-head"><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div><div class="modal-body">${body}</div><div class="modal-foot"><button class="btn btn-quiet" data-action="close-modal">Close</button>${foot}</div></section>`;
  }

  function renderModal() {
    const root = $('#modal');
    if (!root || !modal) return;
    root.classList.remove('hidden');
    if (modal.type === 'explore') {
      const room = activeRoom();
      const dirs = availableDirections(room);
      root.innerHTML = modalShell('Choose the next sector', `${room.remainingExits} unexplored exit${room.remainingExits === 1 ? '' : 's'} remain in this room. Entering consumes one exploration turn.`, dirs.length ? `<div class="direction-grid">${dirs.map(([name,dx,dy,arrow]) => `<button class="btn direction-card" data-action="choose-direction" data-x="${room.x+dx}" data-y="${room.y+dy}"><strong>${arrow} ${name}</strong></button>`).join('')}</div>` : '<div class="empty-state">No empty adjacent sector remains. Use another room or record a vertical/secret route in the notes.</div>');
    } else if (modal.type === 'roll') {
      const room = activeRoom(), template = templateFor(room);
      root.innerHTML = `<form class="modal" id="roll-form"><div class="modal-head"><h2>Make a check</h2><p>Darkness and an active Wound each impose disadvantage; advantage and disadvantage cancel.</p></div><div class="modal-body"><div class="form-grid">
        <div class="field full"><label>Adventurer</label><select name="heroId" id="roll-hero">${state.party.filter(h=>!h.dead).map(h=>`<option value="${h.id}">${esc(h.name)}</option>`).join('')}</select></div>
        <div class="field"><label>Total bonus</label><input name="bonus" id="roll-bonus" type="number" min="-9" max="12" value="0"><small style="color:var(--muted)">Use the attribute, or the complete printed skill bonus.</small></div>
        <div class="field"><label>Target</label><select name="target"><option value="9">Easy 9</option><option value="12">Standard 12</option><option value="15" ${template.target===15?'selected':''}>Hard 15</option><option value="18" ${template.target===18?'selected':''}>Extreme 18</option></select></div>
        <div class="field full"><label>Roll mode</label><select name="mode"><option value="normal">Normal${state.light.remaining<=0&&!room.securedLight?' (app will apply darkness disadvantage)':''}</option><option value="advantage">Advantage</option><option value="disadvantage">Disadvantage</option></select></div>
        </div></div><div class="modal-foot"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Roll d20</button></div></form>`;
    } else if (modal.type === 'rollResult') {
      const r = modal.result;
      root.innerHTML = modalShell(r.success ? 'Success' : 'Failure', r.success ? 'The adventurers retain momentum.' : 'The dungeon receives one meaningful action.', `<div class="roll-result"><strong>${r.total}</strong><span>${r.dice.join(' / ')} · kept ${r.kept} · ${signed(r.bonus)} bonus · target ${r.target}</span></div>`, !r.success ? '<button class="btn btn-danger" data-action="open-dungeon-action">Take dungeon action</button>' : '');
    } else if (modal.type === 'dungeon') {
      const live = activeRoom().enemies.filter(e=>e.hp>0);
      root.innerHTML = `<form class="modal" id="dungeon-form"><div class="modal-head"><h2>Dungeon action</h2><p>Use the creature’s Instinct and current fiction to choose a target. Ordinary attacks automatically deal 1 damage.</p></div><div class="modal-body"><div class="form-grid"><div class="field full"><label>Creature</label><select name="enemyId">${live.map(e=>`<option value="${e.id}" ${e.id===modal.enemyId?'selected':''}>${esc(e.name)} — ${esc(e.instinct)}</option>`).join('')}</select></div><div class="field full"><label>Target</label><select name="heroId">${state.party.filter(h=>!h.dead).map(h=>`<option value="${h.id}">${esc(h.name)} · ${h.hp}/${h.maxHp} HP${h.wound?' · Wounded':''}</option>`).join('')}</select></div></div></div><div class="modal-foot"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancel</button><button class="btn btn-danger" type="submit" ${live.length?'':'disabled'}>Deal 1 damage</button></div></form>`;
    } else if (modal.type === 'settings') {
      root.innerHTML = modalShell('Expedition data',`Delvekeeper build ${esc(BUILD)}. Progress saves automatically in this browser. Export a backup before clearing browser data.`, `<div class="button-row"><button class="btn" data-action="export">Export save</button><button class="btn" data-action="import">Import save</button><button class="btn btn-danger" data-action="end-expedition">End and erase expedition</button></div><div class="subhead">Manual controls</div><div class="button-row"><button class="btn btn-small" data-action="add-turn">+1 turn</button><button class="btn btn-small" data-action="add-torch">+1 spare torch</button><button class="btn btn-small" data-action="toggle-secured">Toggle secured light</button></div>`);
    }
  }

  function openModal(type, extra = {}) { modal = { type, ...extra }; renderModal(); }
  function closeModal() { modal = null; const root = $('#modal'); if (root) { root.classList.add('hidden'); root.innerHTML = ''; } }

  function exportSave() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${state.title.toLowerCase().replace(/[^a-z0-9]+/g,'-') || 'expedition'}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function importSave() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json,application/json';
    input.onchange = () => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (parsed.version !== 1 || !Array.isArray(parsed.rooms)) throw new Error('Invalid save');
          state = parsed; closeModal(); render(); showToast('Expedition imported.');
        } catch (_) { showToast('That file is not a valid Delvekeeper save.'); }
      };
      reader.readAsText(input.files[0]);
    };
    input.click();
  }

  function handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'setup') openSetup();
    else if (action === 'resume') { state = loadSave(); render(); }
    else if (action === 'close-setup') $('#standalone-modal')?.remove();
    else if (action === 'toggle-log') $('#log-drawer')?.classList.toggle('hidden');
    else if (action === 'settings') openModal('settings');
    else if (action === 'close-modal') closeModal();
    else if (action === 'explore') openModal('explore');
    else if (action === 'choose-direction') { generateRoom(Number(target.dataset.x),Number(target.dataset.y),state.activeRoomId); closeModal(); render(); }
    else if (action === 'travel') travelTo(target.dataset.id);
    else if (action === 'conquer') conquerRoom();
    else if (action === 'light-fixtures') lightFixtures();
    else if (action === 'light-torch') lightTorch();
    else if (action === 'pass-torch') passTorch();
    else if (action === 'claim') claimOpportunity();
    else if (action === 'pass-turn' || action === 'add-turn') { advanceTurns(1); closeModal(); render(); }
    else if (action === 'roll') openModal('roll');
    else if (action === 'dungeon-action') openModal('dungeon',{enemyId:target.dataset.id});
    else if (action === 'open-dungeon-action') openModal('dungeon');
    else if (action === 'damage-enemy') { const e=activeRoom().enemies.find(e=>e.id===target.dataset.id); e.hp=Math.max(0,e.hp-1); log(`${e.name} took 1 damage${e.hp===0?' and was defeated':''}.`); render(); }
    else if (action === 'enemy-hp') { const e=activeRoom().enemies.find(e=>e.id===target.dataset.id); e.hp = e.hp===Number(target.dataset.hp) ? Number(target.dataset.hp)-1 : Number(target.dataset.hp); render(); }
    else if (action === 'remove-enemy') { activeRoom().enemies=activeRoom().enemies.filter(e=>e.id!==target.dataset.id); render(); }
    else if (action === 'add-enemy') { activeRoom().enemies.push(makeEnemy(templateFor(activeRoom()),false,true)); activeRoom().status='dangerous'; log(`A ${activeRoom().enemies.at(-1).name} card was added manually.`); render(); }
    else if (action === 'hero-hp') { const h=state.party.find(h=>h.id===target.dataset.id); h.hp=clamp(h.hp+Number(target.dataset.delta),0,h.maxHp); render(); }
    else if (action === 'hero-token') { const h=state.party.find(h=>h.id===target.dataset.id); h.tokens=clamp(h.tokens+Number(target.dataset.delta),0,3); render(); }
    else if (action === 'add-item') { const h=state.party.find(h=>h.id===target.dataset.id); const item=prompt('Item name'); if(item){h.items.push(item); if(item.toLowerCase().includes('torch')) state.light.reserve++; render();} }
    else if (action === 'remove-item') { const h=state.party.find(h=>h.id===target.dataset.id); const item=h.items[Number(target.dataset.index)]; if(confirm(`Consume or remove ${item}?`)){h.items.splice(Number(target.dataset.index),1); if(item==='Fresh torch') state.light.reserve=Math.max(0,state.light.reserve-1); render();} }
    else if (action === 'treat') {
      const h=state.party.find(h=>h.id===target.dataset.id);
      const kitHolder=state.party.find(p=>p.items.includes('Medkit'));
      if(!kitHolder) return showToast('No medkit is available.');
      if(activeRoom().status==='dangerous' && !confirm('Treatment during immediate danger requires a successful appropriate check. Continue because that check has succeeded?')) return;
      advanceTurns(1,false);
      kitHolder.items.splice(kitHolder.items.indexOf('Medkit'),1);
      const wound=h.wound;
      const reduced=['Strength','Agility','Mind'].find(attr=>wound.includes(attr));
      if(reduced) h.attributes[reduced]-=1;
      h.scar=wound;
      h.wound='';
      log(`${h.name}’s Wound became a Scar${reduced?`; ${reduced} fell by 1`:''}. Treatment consumed one turn and a medkit.`);
      render();
    }
    else if (action === 'add-torch') { state.light.reserve++; closeModal(); render(); }
    else if (action === 'toggle-secured') { activeRoom().securedLight=!activeRoom().securedLight; closeModal(); render(); }
    else if (action === 'export') exportSave();
    else if (action === 'import') importSave();
    else if (action === 'end-expedition') { if(confirm('Erase this local expedition? Export first if you may want it later.')){localStorage.removeItem(SAVE_KEY);state=null;closeModal();renderWelcome();} }
  }

  function handleSubmit(event) {
    if (event.target.id === 'setup-form') {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target));
      data.names = data.names.split(',').map(name => name.trim());
      $('#standalone-modal')?.remove();
      newExpedition(data);
    } else if (event.target.id === 'roll-form') {
      event.preventDefault(); resolveRoll(Object.fromEntries(new FormData(event.target)));
    } else if (event.target.id === 'dungeon-form') {
      event.preventDefault(); const data=Object.fromEntries(new FormData(event.target)); applyDungeonAction(data.enemyId,data.heroId);
    }
  }

  function handleInput(event) {
    if (event.target.dataset.action === 'notes') {
      activeRoom().notes = event.target.value;
      persist();
    }
  }

  document.addEventListener('click', handleClick);
  document.addEventListener('submit', handleSubmit);
  document.addEventListener('input', handleInput);
  renderWelcome();
})();