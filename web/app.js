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
  const CARDINALS = [
    { name:'North', dx:0, dy:-1, arrow:'↑' }, { name:'East', dx:1, dy:0, arrow:'→' },
    { name:'South', dx:0, dy:1, arrow:'↓' }, { name:'West', dx:-1, dy:0, arrow:'←' }
  ];

  function templateRoutes(template) {
    const rows = template.map.split('\n');
    const width = Math.max(...rows.map(row => row.length));
    const routes = [];
    rows.forEach((row, y) => [...row].forEach((glyph, x) => {
      if (!['E','X','D','U'].includes(glyph)) return;
      let direction = null;
      if (glyph === 'E' || glyph === 'X') {
        const distances = [
          { dx:0, dy:-1, distance:y }, { dx:1, dy:0, distance:width - 1 - x },
          { dx:0, dy:1, distance:rows.length - 1 - y }, { dx:-1, dy:0, distance:x }
        ];
        direction = distances.sort((a,b) => a.distance - b.distance)[0];
      }
      routes.push({ x, y, glyph, key:`${glyph}:${x}:${y}`, direction });
    }));
    return routes;
  }

  function rotateDirection(direction, rotation) {
    if (!direction) return null;
    let { dx, dy } = direction;
    for (let turns = 0; turns < ((rotation || 0) / 90) % 4; turns++) [dx,dy] = [-dy,dx];
    return { dx, dy };
  }

  function cardinalForVector(dx, dy) {
    return CARDINALS.find(direction => direction.dx === dx && direction.dy === dy);
  }

  function rotationToward(dx, dy) {
    return dy === 1 ? 0 : dx === -1 ? 90 : dy === -1 ? 180 : dx === 1 ? 270 : 0;
  }

  function availableExitRoutes(room) {
    const assigned = new Set(Object.values(room.routeAssignments || {}));
    return templateRoutes(templateFor(room)).filter(route => route.glyph !== 'E' && !assigned.has(route.key));
  }

  function emptyAdjacentSectors(room) {
    return CARDINALS.filter(({dx,dy}) => {
      const x = room.x + dx, y = room.y + dy;
      return !state.rooms.some(candidate => candidate.x === x && candidate.y === y);
    });
  }

  function directRouteTarget(room, route) {
    const direction = rotateDirection(route.direction, room.rotation);
    return direction ? { ...direction, x:room.x + direction.dx, y:room.y + direction.dy } : null;
  }

  function routeLabel(room, route) {
    if (route.glyph === 'D') return 'Descending stair';
    if (route.glyph === 'U') return 'Ascending stair';
    const direction = rotateDirection(route.direction, room.rotation);
    const cardinal = direction && cardinalForVector(direction.dx, direction.dy);
    return `${cardinal?.name || 'Outer'} doorway`;
  }

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

  function isQuestElement(room) {
    return ['Quest element','Major quest element','Heart advantage'].includes(room.quest.name);
  }

  function questElementPlacement(room) {
    const liveEnemies = room.enemies.filter(enemy => enemy.hp > 0);
    if (liveEnemies.length) {
      const names = liveEnemies.map(enemy => enemy.name).join(' and ');
      return `The ${names} visibly carry, guard, or surround it. The party can claim it after defeating them, bargaining for it, drawing them away, or otherwise gaining access.`;
    }
    return {
      1:'It is visible among the room’s aftermath. Reaching and taking it requires no check unless the party creates a new danger.',
      2:'It is visible beyond or inside the Domain obstacle. The party must cross, open, move, or bypass that obstacle to claim it.',
      3:'It lies at the physical anchor of the active hazard. The party must neutralize the hazard or reach the anchor despite it.',
      4:'It is visibly incorporated into or placed beyond the trap mechanism. Disarming, triggering safely, or bypassing the trap grants access.',
      5:'It is revealed as part of the puzzle’s physical arrangement. Solving or credibly bypassing the puzzle grants access.',
      6:'The social obstacle has it or controls access to it. Agreement, leverage, deception, theft, or force can secure it.',
      7:'The watchful occupants keep it within their guarded space. The party must win permission, distract them, or take it by force.'
    }[room.challengeRoll] || 'It occupies the challenge’s central position. Durably resolving or bypassing that challenge grants access.';
  }

  function buildQuestScene(room) {
    const type = room.quest.name;
    if (type === 'Quest element' || type === 'Major quest element' || type === 'Heart advantage') {
      const [title, prose] = questElementFor(room);
      return {
        title, prose,
        effect: type === 'Major quest element' ? 'This major element states exactly how one defensive layer of the Heart is removed.' : 'This is a concrete Quest element; record it and apply its stated effect at the Heart.',
        placement: questElementPlacement(room)
      };
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

  function buildSceneRef(room) {
    return {
      version: 2,
      challengeVariant: stableIndex(room, 'challenge', DATA.sceneChallenges[room.challengeRoll].length),
      opportunityVariant: stableIndex(room, 'opportunity', DATA.sceneOpportunities[room.opportunityRoll].length),
      atmosphereVariant: stableIndex(room, 'atmosphere', DATA.hauntedAtmospheres.length)
    };
  }

  function canonicalVariant(room, key, collection) {
    if (!room.sceneRef) room.sceneRef = buildSceneRef(room);
    const index = Number(room.sceneRef[key]) || 0;
    return collection[index % collection.length];
  }

  function buildRoomScene(room, template) {
    const challenge = canonicalVariant(room, 'challengeVariant', DATA.sceneChallenges[room.challengeRoll]);
    const opportunity = canonicalVariant(room, 'opportunityVariant', DATA.sceneOpportunities[room.opportunityRoll]);
    const [atmosphereName, atmosphereProse] = canonicalVariant(room, 'atmosphereVariant', DATA.hauntedAtmospheres);
    const liveEnemies = room.enemies.filter(enemy => enemy.hp > 0);
    const occupants = liveEnemies.map(enemy => `${enemy.units} ${enemy.name} (${enemy.hp} current HP, Defense ${enemy.defense})`);
    const occupantIntroduction = occupantProse(liveEnemies);
    const visiblePresence = room.status === 'conquered'
      ? 'The chamber is quiet now. The marks left by your earlier actions remain, but its main danger is no longer active.'
      : playerFacingPresence(challenge.presence, liveEnemies.length > 0);
    const readAloudParts = [
      { source:`Room roll ${String(template.index).padStart(2,'0')} · ${template.name} · ${template.originalUse}`, text:template.readAloud },
      { source:`Rolled haunting · ${atmosphereName}`, text:atmosphereProse },
      occupantIntroduction ? { source:'Generated occupants', text:occupantIntroduction } : null,
      { source:`Visible challenge · ${challenge.title}`, text:visiblePresence }
    ].filter(part => part?.text);
    const readAloud = readAloudParts.map(part => part.text).join(' ');
    return {
      functionName:template.originalUse, functionDefinition:template.originalUseDefinition, atmosphereName, readAloud, readAloudParts,
      description: `${template.readAloud} ${atmosphereProse}`,
      challenge: { ...challenge, occupants },
      opportunity: { ...opportunity },
      quest: buildQuestScene(room)
    };
  }

  function ensureRouteGeometry() {
    const ordered = [...state.rooms].sort((a,b) => a.number - b.number);
    for (const room of ordered) {
      room.routeAssignments ||= {};
      const parent = room.connections.map(roomById).filter(candidate => candidate.number < room.number).sort((a,b) => b.number - a.number)[0];
      if (!Number.isInteger(room.rotation)) room.rotation = parent ? rotationToward(parent.x-room.x, parent.y-room.y) : 0;
      if (!parent) continue;
      const entry = templateRoutes(templateFor(room)).find(route => route.glyph === 'E');
      if (!room.routeAssignments[parent.id] && entry) room.routeAssignments[parent.id] = entry.key;
      parent.routeAssignments ||= {};
      if (!parent.routeAssignments[room.id]) {
        const assigned = new Set(Object.values(parent.routeAssignments));
        const route = templateRoutes(templateFor(parent)).find(candidate => candidate.glyph !== 'E' && !assigned.has(candidate.key));
        if (route) parent.routeAssignments[room.id] = route.key;
      }
    }
    for (const room of ordered) room.remainingExits = availableExitRoutes(room).length;
  }

  function ensureStateShape() {
    if (!state) return;
    if (!state.light.holderId) state.light.holderId = state.party.find(hero => !hero.dead)?.id || null;
    for (const hero of state.party) {
      const gear = DATA.gear.find(entry => entry[0] === hero.gear);
      if (!hero.gearHands) hero.gearHands = gear?.[3] || null;
      if (!hero.gearTechnique && gear) {
        hero.gearTechnique = gear[4];
        hero.gearTechniqueRule = gear[5];
        hero.gearTechniqueCost = gear[6];
      }
      if (!hero.armorName) {
        const armor = stableArmorFor(hero);
        hero.burden = armor.burden;
        hero.armorName = armor.name;
        hero.armorRule = armor.rule;
        const expectedMaxHp = 2 + (hero.gear === 'Arming sword' ? 1 : 0) + (armor.reinforced ? 1 : 0);
        if (hero.maxHp < expectedMaxHp) {
          const gainedHp = expectedMaxHp - hero.maxHp;
          hero.maxHp = expectedMaxHp;
          if (hero.hp > 0) hero.hp += gainedHp;
        }
      }
      if (!hero.knackRule) {
        const knack = DATA.knacks.find(entry => entry.name === hero.knack);
        if (knack) {
          hero.knackCost = knack.cost;
          hero.knackRule = knack.effect;
        }
      }
    }
    const legacyFound = Math.max(0, Number(state.quest.elementsFound) || 0);
    const alreadyClaimed = state.rooms.filter(room => isQuestElement(room) && room.quest.claimed === true).length;
    let legacyClaimsRemaining = Math.max(0, legacyFound - alreadyClaimed);
    for (const room of state.rooms) {
      // Prose and mechanics are canonical application data, never save data.
      // Remove copies made by builds before the normalized sceneRef format.
      delete room.scene;
      if (room.sceneRef?.version !== 2) room.sceneRef = buildSceneRef(room);
      if (isQuestElement(room) && typeof room.quest.claimed !== 'boolean') {
        room.quest.claimed = legacyClaimsRemaining > 0;
        if (room.quest.claimed) legacyClaimsRemaining -= 1;
      }
    }
    ensureRouteGeometry();
    state.quest.elementsFound = state.rooms.filter(room => isQuestElement(room) && room.quest.claimed).length;
  }

  function loadSave() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
      return parsed && parsed.version === 1 ? parsed : null;
    } catch (_) { return null; }
  }

  function persist() {
    if (!state) return;
    state.rooms?.forEach(room => delete room.scene);
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

  function armorPool(primary, weak) {
    return DATA.armor.filter(entry => entry.primary === primary && entry.weak === weak);
  }

  function stableArmorFor(hero) {
    const primary = Object.entries(hero.attributes).find(([,value]) => value === 3)?.[0] || 'Strength';
    const weak = Object.entries(hero.attributes).sort((a,b) => a[1] - b[1])[0]?.[0] || 'Agility';
    const choices = armorPool(primary, weak);
    let hash = 2166136261 >>> 0;
    for (const char of `${state.seed}:${hero.id}:armor`) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return choices[(hash >>> 0) % choices.length];
  }

  function createCharacter(name, { mustCarryTorch = false } = {}) {
    const gearPool = mustCarryTorch ? DATA.gear.filter(entry => entry[3] === 1) : DATA.gear;
    const [gear, primary, gearRule, gearHands, gearTechnique, gearTechniqueRule, gearTechniqueCost] = pick(gearPool);
    const attrs = ['Strength','Agility','Mind'];
    const weak = pick(attrs.filter(attr => attr !== primary));
    const values = { Strength: 0, Agility: 0, Mind: 0 };
    values[primary] = 3;
    values[weak] = -2;
    const armor = pick(armorPool(primary, weak));
    const knack = pick(DATA.knacks);
    const maxHp = 2 + (gear === 'Arming sword' ? 1 : 0) + (armor.reinforced ? 1 : 0);
    const item = pick(DATA.items);
    return {
      id: uid('hero'), name, attributes: values, hp: maxHp, maxHp,
      tokens: 1, gear, gearRule, gearHands, gearTechnique, gearTechniqueRule, gearTechniqueCost,
      burden: armor.burden, armorName: armor.name, armorRule: armor.rule,
      past: pick(DATA.pasts), pastAttribute: pick(attrs),
      knack: knack.name, knackCost: knack.cost, knackRule: knack.effect,
      items: [item], wound: '', scar: '', dead: false
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
      const character = createCharacter(names[i] || DATA.names[i], { mustCarryTorch: i === 0 });
      state.party.push(character);
      if (character.items.includes('Fresh torch')) state.light.reserve += 1;
    }
    state.light.holderId = state.party[0]?.id || null;
    log(`Expedition begun with seed ${seed}. Quest: ${state.quest.name}.`);
    generateRoom(0, 0, null);
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

  function enemyScale(source) {
    const minimum = Math.max(2, state.party.filter(hero => !hero.dead).length);
    const units = Math.max(source.baseUnits, Math.ceil(minimum / source.unitHp));
    return { units, total: source.unitHp * units };
  }

  function makeEnemy(template, major = false, wandering = false, monsterIndex = null) {
    let source;
    if (Number.isInteger(monsterIndex)) source = DATA.monsters[monsterIndex];
    else if (major) source = template.danger === 'Extreme' ? DATA.monsters[5] : DATA.monsters[4];
    else source = pick(DATA.monsters.slice(0, wandering ? 9 : 6));
    const { units, total } = enemyScale(source);
    return {
      id: uid('enemy'), name: source.name, hp: total, maxHp: total, units,
      defense: template.target, behavior: source.behavior, instinct: source.instinct,
      wound: source.wound, wandering, manuallyAdded: Number.isInteger(monsterIndex)
    };
  }

  function addEncounter(monsterIndex = null) {
    const room = activeRoom();
    const random = !Number.isInteger(monsterIndex);
    const enemy = makeEnemy(templateFor(room), false, random, monsterIndex);
    room.enemies.push(enemy);
    room.status = 'dangerous';
    log(`${enemy.name} ${random ? 'were rolled as a random encounter' : 'were added to the encounter'} in Room ${room.number}.`);
    closeModal();
    render();
  }

  function generateRoom(x, y, fromId, fromRouteKey = null) {
    const index = templateRoll();
    const template = DATA.rooms[index - 1];
    const parent = fromId ? roomById(fromId) : null;
    const rotation = parent ? rotationToward(parent.x-x, parent.y-y) : 0;
    const challengeRoll = die(12);
    const opportunityRoll = die(8);
    const quest = questRoll();
    quest.claimed = false;
    const room = {
      id: uid('room'), number: state.rooms.length + 1, templateIndex: index, x, y,
      challengeRoll, challenge: DATA.challenges[challengeRoll - 1],
      opportunityRoll, opportunity: DATA.opportunities[opportunityRoll - 1],
      quest, status: challengeRoll === 1 ? 'quiet' : 'dangerous', securedLight: template.lighting === 'Inherent',
      notes: '', connections: fromId ? [fromId] : [], remainingExits: template.exits,
      rotation, routeAssignments: {}, enemies: [], opportunityClaimed: false
    };
    if (parent) {
      const entry = templateRoutes(template).find(route => route.glyph === 'E');
      if (entry) room.routeAssignments[parent.id] = entry.key;
    }
    if (challengeRoll >= 7) room.enemies.push(makeEnemy(template, challengeRoll === 12));
    if (quest.name === 'Heart') {
      if (state.quest.heartFound) {
        room.quest.name = 'Heart advantage';
        room.quest.description = 'The Heart is already known; this supplies a major Heart-specific advantage.';
      } else state.quest.heartFound = true;
    }
    room.sceneRef = buildSceneRef(room);
    state.rooms.push(room);
    if (parent) {
      const route = fromRouteKey || availableExitRoutes(parent)[0]?.key;
      parent.connections.push(room.id);
      if (route) parent.routeAssignments[room.id] = route;
      parent.remainingExits = availableExitRoutes(parent).length;
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
    const scene = buildRoomScene(room, templateFor(room));
    let result = scene.opportunity.title;
    const item = scene.opportunity.item;
    if (item) {
      state.party[0].items.push(item);
      if (item === 'Fresh torch') state.light.reserve += 1;
      result = `${item} added to ${state.party[0].name}`;
    }
    room.opportunityClaimed = true;
    log(`Claimed the Room ${room.number} opportunity: ${result}.`);
    render();
  }

  function claimQuestElement() {
    const room = activeRoom();
    if (!isQuestElement(room) || room.quest.claimed) return;
    const scene = buildQuestScene(room);
    room.quest.claimed = true;
    state.quest.elementsFound += 1;
    log(`${scene.title} was claimed in Room ${room.number}. The party now has ${state.quest.elementsFound} Quest element${state.quest.elementsFound === 1 ? '' : 's'}.`);
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
    '.':['floor','Floor',''], 'E':['entry','Entry','↥'], 'X':['exit','Visible exit','◇'], '?':['secret','Hidden exit','?'],
    'O':['pillar','Pillar','○'], 'S':['statue','Statue','♙'], 'P':['pit','Pit or chasm','╱'], '=':['bridge','Bridge','═'],
    'B':['balcony','Balcony','┄'], '^':['steps','Raised floor','⌃'], 'v':['sunken','Sunken floor','⌄'],
    'D':['descent','Descent','↓'], 'U':['ascent','Ascent','↑'], '~':['water','Water','≈'], 'R':['rubble','Rubble','◇'],
    '+':['gate','Gate','ǂ'], 'C':['cage','Cage','╫'], 'F':['furnace','Furnace','♨'], 'G':['gear','Mechanism','⚙'],
    'L':['lava','Lava','≋'], 'M':['mirror','Mirror','◫'], 'T':['objective','Objective fixture','✦']
  };

  function mapSymbol(glyph, x, y, size, orientation = 'horizontal') {
    const cx = x + size / 2, cy = y + size / 2, q = size / 4;
    if (glyph === 'O') return `<circle class="map-feature feature-heavy" cx="${cx}" cy="${cy}" r="${q * .72}"/><circle class="map-feature" cx="${cx}" cy="${cy}" r="${q * .35}"/>`;
    if (glyph === 'S') return `<path class="map-feature" d="M${cx-q},${cy+q}h${q*2} M${cx-q*.7},${cy+q}v${-q*.55}h${q*1.4}v${q*.55} M${cx},${cy-q*.9}v${q*1.35} M${cx-q*.45},${cy-q*.35}h${q*.9}"/><circle class="map-feature" cx="${cx}" cy="${cy-q*1.15}" r="${q*.22}"/>`;
    if (glyph === 'P') return '';
    if (glyph === '=') {
      if (orientation === 'vertical') return `<g class="map-bridge bridge-vertical"><path class="map-feature feature-heavy" d="M${x+7},${y+2}V${y+size-2} M${x+size-7},${y+2}V${y+size-2}"/><path class="map-feature bridge-planks" d="M${x+5},${y+5}H${x+size-5} M${x+5},${y+11}H${x+size-5} M${x+5},${y+17}H${x+size-5} M${x+5},${y+23}H${x+size-5} M${x+5},${y+29}H${x+size-5}"/></g>`;
      return `<g class="map-bridge bridge-horizontal"><path class="map-feature feature-heavy" d="M${x+2},${y+7}H${x+size-2} M${x+2},${y+size-7}H${x+size-2}"/><path class="map-feature bridge-planks" d="M${x+5},${y+5}V${y+size-5} M${x+11},${y+5}V${y+size-5} M${x+17},${y+5}V${y+size-5} M${x+23},${y+5}V${y+size-5} M${x+29},${y+5}V${y+size-5}"/></g>`;
    }
    if (glyph === 'B') return '';
    if (glyph === '^' || glyph === 'v') {
      const flip = glyph === '^' ? 1 : -1;
      return `<path class="map-feature" d="M${x+6},${cy+flip*7}H${x+size-6} M${x+9},${cy+flip*2}H${x+size-9} M${x+12},${cy-flip*3}H${x+size-12}"/>`;
    }
    if (glyph === 'D' || glyph === 'U') return `<path class="map-feature" d="M${x+6},${y+7}H${x+size-6} M${x+8},${y+12}H${x+size-8} M${x+10},${y+17}H${x+size-10} M${x+12},${y+22}H${x+size-12}"/><text class="map-symbol-text" x="${cx}" y="${cy+10}">${glyph === 'D' ? '↓' : '↑'}</text>`;
    if (glyph === '~' || glyph === 'L') return `<path class="map-feature ${glyph === 'L' ? 'feature-heavy' : ''}" d="M${x+3},${y+9}q4,-4 8,0t8,0t8,0 M${x+3},${y+17}q4,-4 8,0t8,0t8,0 M${x+3},${y+25}q4,-4 8,0t8,0t8,0"/>`;
    if (glyph === 'R') return `<path class="map-feature" d="M${x+5},${y+20}l5,-8 7,5 -3,8z M${x+15},${y+12}l5,-6 7,5 -2,7z M${x+19},${y+25}l4,-6 5,3 -2,5z"/>`;
    if (glyph === '+' || glyph === 'C') return `<path class="map-feature feature-heavy" d="M${x+5},${y+7}H${x+size-5} M${x+5},${y+size-7}H${x+size-5}"/><path class="map-feature" d="M${x+9},${y+5}v${size-10} M${x+16},${y+5}v${size-10} M${x+23},${y+5}v${size-10}"/>`;
    if (glyph === 'F') return `<path class="map-feature feature-heavy" d="M${x+5},${y+24}h${size-10}v4H${x+5}z M${cx},${y+23}c-8,-5 2,-8 -2,-16 9,6 3,10 8,14 3,3 0,6 -6,6"/>`;
    if (glyph === 'G') return `<circle class="map-feature feature-heavy" cx="${cx}" cy="${cy}" r="${q*.78}"/><circle class="map-feature" cx="${cx}" cy="${cy}" r="${q*.28}"/><path class="map-feature" d="M${cx},${y+4}v6 M${cx},${y+size-10}v6 M${x+4},${cy}h6 M${x+size-10},${cy}h6 M${x+7},${y+7}l4,4 M${x+size-11},${y+size-11}l4,4 M${x+size-7},${y+7}l-4,4 M${x+11},${y+size-11}l-4,4"/>`;
    if (glyph === 'M') return `<rect class="map-feature feature-heavy" x="${x+8}" y="${y+4}" width="${size-16}" height="${size-8}" rx="6"/><path class="map-feature feature-fine" d="M${x+11},${y+20}l8,-12 M${x+15},${y+25}l6,-9"/>`;
    if (glyph === 'T') return `<path class="map-feature feature-heavy" d="M${cx},${y+4}l3,8 8,-3 -5,7 7,5 -9,-1 -1,9 -4,-8 -8,4 5,-8 -7,-5 9,1z"/>`;
    if (glyph === 'E' || glyph === 'X' || glyph === '?') return `<text class="map-symbol-text map-door-label" x="${cx}" y="${cy+5}">${TILE_INFO[glyph][2]}</text>`;
    return '';
  }

  function renderLegendSymbol(glyph, instanceId, orientation = 'horizontal') {
    const size = 32;
    const safeId = `legend-${instanceId}-${glyph.charCodeAt(0)}`.replace(/[^a-zA-Z0-9_-]/g, '-');
    const pitId = `${safeId}-pit`;
    const balconyId = `${safeId}-balcony`;
    const defs = `<defs><pattern id="${pitId}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" class="map-pit-ground"/><line x1="0" y1="0" x2="0" y2="9" class="map-pit-hatch-line"/></pattern><pattern id="${balconyId}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" class="map-balcony-ground"/><path d="M0,2H10 M0,8H10" class="map-balcony-hatch-line"/></pattern></defs>`;
    let ground = `<rect class="map-floor-square" x="0" y="0" width="${size}" height="${size}"/>`;
    let outline = '';
    if (glyph === 'P' || glyph === '=') {
      ground = `<rect class="map-pit-fill" x="0" y="0" width="${size}" height="${size}" fill="url(#${pitId})"/>`;
      outline = `<rect class="map-pit-outline legend-terrain-outline" x="1.5" y="1.5" width="29" height="29"/>`;
    } else if (glyph === 'B') {
      ground = `<rect class="map-balcony-fill" x="0" y="0" width="${size}" height="${size}" fill="url(#${balconyId})"/>`;
      outline = `<rect class="map-balcony-outline legend-terrain-outline" x="1.5" y="1.5" width="29" height="29"/>`;
    } else if (['E','X','?'].includes(glyph)) {
      outline = `<line class="map-wall map-doorway${glyph === '?' ? ' map-secret-wall' : ''}" x1="0" y1="1.5" x2="32" y2="1.5"/>`;
    }
    return `<svg class="legend-symbol" viewBox="0 0 32 32" aria-hidden="true">${defs}${ground}${outline}${mapSymbol(glyph,0,0,size,orientation)}</svg>`;
  }

  function renderFloorplanSvg(template, instanceId, options = {}) {
    const { overview = false, rotation = 0, corridorAssignments = [], embeddedX = null, embeddedY = null } = options;
    const rows = template.map.split('\n');
    const width = Math.max(...rows.map(row => row.length));
    const height = rows.length;
    const size = 32;
    const glyphAt = (x, y) => y >= 0 && y < height && x >= 0 && x < width ? (rows[y][x] || ' ') : ' ';
    const isRawFloor = glyph => glyph !== '#' && glyph !== ' ';
    const doorConnectors = new Set();
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (!['E','X','?'].includes(glyphAt(col, row))) continue;
        let best = null;
        for (const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]) {
          for (let distance = 1; distance <= 3; distance++) {
            const glyph = glyphAt(col + dx * distance, row + dy * distance);
            if (glyph === ' ') break;
            if (isRawFloor(glyph) && !['E','X','?'].includes(glyph)) {
              if (!best || distance < best.distance) best = { dx, dy, distance };
              break;
            }
          }
        }
        if (best) {
          for (let distance = 1; distance < best.distance; distance++) doorConnectors.add(`${col + best.dx * distance},${row + best.dy * distance}`);
        }
      }
    }
    const isFloorAt = (x, y) => isRawFloor(glyphAt(x, y)) || doorConnectors.has(`${x},${y}`);
    const floors = [], pits = [], pitOutlines = [], balconies = [], balconyOutlines = [], walls = [], features = [];
    const used = new Map();
    const isPitAt = (x, y) => ['P','='].includes(glyphAt(x, y));
    const isBalconyAt = (x, y) => glyphAt(x, y) === 'B';
    const directions = [
      {dx:0,dy:-1,line:(x,y)=>[x,y,x+size,y]}, {dx:1,dy:0,line:(x,y)=>[x+size,y,x+size,y+size]},
      {dx:0,dy:1,line:(x,y)=>[x,y+size,x+size,y+size]}, {dx:-1,dy:0,line:(x,y)=>[x,y,x,y+size]}
    ];
    const safeId = `${instanceId}-${template.index}`.replace(/[^a-zA-Z0-9_-]/g, '-');
    const rockHatchId = `rock-hatch-${safeId}`;
    const pitHatchId = `pit-hatch-${safeId}`;
    const balconyHatchId = `balcony-hatch-${safeId}`;
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const glyph = glyphAt(col, row);
        if (!isFloorAt(col, row)) continue;
        const x = col * size, y = row * size;
        if (isPitAt(col, row)) {
          pits.push(`<rect class="map-pit-fill" x="${x}" y="${y}" width="${size}" height="${size}" fill="url(#${pitHatchId})"/>`);
          for (const direction of directions) {
            if (isPitAt(col + direction.dx, row + direction.dy)) continue;
            const [x1,y1,x2,y2] = direction.line(x,y);
            pitOutlines.push(`<line class="map-pit-outline" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
          }
        } else if (isBalconyAt(col, row)) {
          balconies.push(`<rect class="map-balcony-fill" x="${x}" y="${y}" width="${size}" height="${size}" fill="url(#${balconyHatchId})"/>`);
          for (const direction of directions) {
            if (isBalconyAt(col + direction.dx, row + direction.dy)) continue;
            const [x1,y1,x2,y2] = direction.line(x,y);
            balconyOutlines.push(`<line class="map-balcony-outline" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
          }
        } else floors.push(`<rect class="map-floor-square" x="${x}" y="${y}" width="${size}" height="${size}"/>`);
        for (const direction of directions) {
          if (isFloorAt(col + direction.dx, row + direction.dy)) continue;
          const [x1,y1,x2,y2] = direction.line(x,y);
          const door = ['E','X','?'].includes(glyph);
          walls.push(`<line class="map-wall${door ? ' map-doorway' : ''}${glyph === '?' ? ' map-secret-wall' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
        }
        if (TILE_INFO[glyph] && glyph !== '.') {
          const [kind,label,icon] = TILE_INFO[glyph];
          used.set(kind, { label, icon });
          let orientation = 'horizontal';
          if (glyph === '=') {
            const vertical = glyphAt(col, row - 1) === '=' || glyphAt(col, row + 1) === '=';
            const horizontal = glyphAt(col - 1, row) === '=' || glyphAt(col + 1, row) === '=';
            orientation = vertical && !horizontal ? 'vertical' : 'horizontal';
          }
          features.push(mapSymbol(glyph, x, y, size, orientation));
        }
      }
    }
    const contentWidth = width * size, contentHeight = height * size;
    const quarterTurn = overview ? ((rotation % 360) + 360) % 360 : 0;
    const viewWidth = quarterTurn === 90 || quarterTurn === 270 ? contentHeight : contentWidth;
    const viewHeight = quarterTurn === 90 || quarterTurn === 270 ? contentWidth : contentHeight;
    const transform = quarterTurn === 90 ? `translate(${contentHeight} 0) rotate(90)`
      : quarterTurn === 180 ? `translate(${contentWidth} ${contentHeight}) rotate(180)`
      : quarterTurn === 270 ? `translate(0 ${contentWidth}) rotate(270)` : '';
    const rotateRoute = route => {
      const rawX = (route.x + .5) * size, rawY = (route.y + .5) * size;
      if (quarterTurn === 90) return { x:contentHeight-rawY, y:rawX };
      if (quarterTurn === 180) return { x:contentWidth-rawX, y:contentHeight-rawY };
      if (quarterTurn === 270) return { x:rawY, y:contentWidth-rawX };
      return { x:rawX, y:rawY };
    };
    const overviewCorridors = overview ? corridorAssignments.map(({ route, dx, dy }) => {
      const start = rotateRoute(route);
      const end = { x: dx < 0 ? 0 : dx > 0 ? viewWidth : viewWidth / 2, y: dy < 0 ? 0 : dy > 0 ? viewHeight : viewHeight / 2 };
      const middle = dx ? (start.x + end.x) / 2 : (start.y + end.y) / 2;
      const path = dx
        ? `M${start.x},${start.y} H${middle} V${end.y} H${end.x}`
        : `M${start.x},${start.y} V${middle} H${end.x} V${end.y}`;
      return `<path class="overview-corridor corridor-shadow" d="${path}"/><path class="overview-corridor corridor-floor" d="${path}"/>`;
    }).join('') : '';
    const embedded = embeddedX !== null && embeddedY !== null ? ` x="${embeddedX}" y="${embeddedY}" width="${viewWidth}" height="${viewHeight}"` : '';
    return `<svg class="visual-map${overview ? ' overview-floorplan' : ''}"${embedded} viewBox="0 0 ${viewWidth} ${viewHeight}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Black and white floorplan for ${esc(template.name)}"><defs><pattern id="${rockHatchId}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" class="map-hatch-line"/></pattern><pattern id="${pitHatchId}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" class="map-pit-ground"/><line x1="0" y1="0" x2="0" y2="9" class="map-pit-hatch-line"/></pattern><pattern id="${balconyHatchId}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" class="map-balcony-ground"/><path d="M0,2H10 M0,8H10" class="map-balcony-hatch-line"/></pattern></defs><rect class="map-paper" width="100%" height="100%"/><rect class="map-hatching" width="100%" height="100%" fill="url(#${rockHatchId})"/>${overviewCorridors}<g${transform ? ` transform="${transform}"` : ''}>${floors.join('')}${pits.join('')}${balconies.join('')}${pitOutlines.join('')}${balconyOutlines.join('')}${walls.join('')}${features.join('')}</g></svg>`;
  }

  function renderFloorplan(template, roomId) {
    const used = new Map();
    const rows = template.map.split('\n');
    rows.forEach((row, y) => [...row].forEach((glyph, x) => {
      if (!TILE_INFO[glyph] || glyph === '.') return;
      const [kind,baseLabel] = TILE_INFO[glyph];
      let orientation = 'horizontal';
      if (glyph === '=') {
        const vertical = rows[y-1]?.[x] === '=' || rows[y+1]?.[x] === '=';
        const horizontal = row[x-1] === '=' || row[x+1] === '=';
        orientation = vertical && !horizontal ? 'vertical' : 'horizontal';
      }
      const key = glyph === '=' ? `${kind}-${orientation}` : kind;
      const label = glyph === '=' ? `${baseLabel} · ${orientation}` : baseLabel;
      used.set(key, { label, glyph, orientation });
    }));
    return `<div class="visual-map-wrap">${renderFloorplanSvg(template, `detail-${roomId}`)}<div class="terrain-legend">${[...used.values()].map(({label,glyph,orientation}, index) => `<span data-legend-glyph="${esc(glyph)}" data-orientation="${orientation}"><i class="legend-mark">${renderLegendSymbol(glyph, `${roomId}-${index}`, orientation)}</i>${esc(label)}</span>`).join('')}</div><p class="map-scale">One square ≈ one pace · copy directly to grid paper</p></div>`;
  }

  function templateGridSize(template, rotation = 0) {
    const rows = template.map.split('\n');
    const width = Math.max(...rows.map(row => row.length));
    const height = rows.length;
    return rotation === 90 || rotation === 270 ? { width:height, height:width } : { width, height };
  }

  function rotateRouteCell(route, template, rotation = 0) {
    const rows = template.map.split('\n');
    const width = Math.max(...rows.map(row => row.length));
    const height = rows.length;
    if (rotation === 90) return { x:height - 1 - route.y, y:route.x };
    if (rotation === 180) return { x:width - 1 - route.x, y:height - 1 - route.y };
    if (rotation === 270) return { x:route.y, y:width - 1 - route.x };
    return { x:route.x, y:route.y };
  }

  function addGridSegment(cells, from, to) {
    let x = from.x, y = from.y;
    cells.add(`${x},${y}`);
    while (x !== to.x) { x += Math.sign(to.x - x); cells.add(`${x},${y}`); }
    while (y !== to.y) { y += Math.sign(to.y - y); cells.add(`${x},${y}`); }
  }

  function renderMap() {
    const unit = 32;
    const maxTemplateSpan = Math.max(...DATA.rooms.flatMap(template => {
      const rows = template.map.split('\n');
      return [rows.length, Math.max(...rows.map(row => row.length))];
    }));
    const pitch = maxTemplateSpan + 4;
    const minX = Math.min(...state.rooms.map(room => room.x));
    const maxX = Math.max(...state.rooms.map(room => room.x));
    const minY = Math.min(...state.rooms.map(room => room.y));
    const maxY = Math.max(...state.rooms.map(room => room.y));
    const padding = 2;
    const layouts = new Map();
    for (const room of state.rooms) {
      const template = templateFor(room);
      const dimensions = templateGridSize(template, room.rotation || 0);
      layouts.set(room.id, {
        ...dimensions,
        x:padding + (room.x-minX)*pitch + Math.floor((pitch-dimensions.width)/2),
        y:padding + (room.y-minY)*pitch + Math.floor((pitch-dimensions.height)/2)
      });
    }
    const totalWidth = padding*2 + (maxX-minX+1)*pitch;
    const totalHeight = padding*2 + (maxY-minY+1)*pitch;
    const corridorCells = new Set();
    const connectionDoorCells = new Set();
    for (const room of state.rooms) {
      for (const neighborId of room.connections) {
        const neighbor = roomById(neighborId);
        if (room.number > neighbor.number) continue;
        const route = templateRoutes(templateFor(room)).find(candidate => candidate.key === room.routeAssignments?.[neighbor.id]);
        const neighborRoute = templateRoutes(templateFor(neighbor)).find(candidate => candidate.key === neighbor.routeAssignments?.[room.id]);
        if (!route || !neighborRoute) continue;
        const roomLayout = layouts.get(room.id), neighborLayout = layouts.get(neighbor.id);
        const routeCell = rotateRouteCell(route, templateFor(room), room.rotation || 0);
        const neighborCell = rotateRouteCell(neighborRoute, templateFor(neighbor), neighbor.rotation || 0);
        const doorA = { x:roomLayout.x+routeCell.x, y:roomLayout.y+routeCell.y };
        const doorB = { x:neighborLayout.x+neighborCell.x, y:neighborLayout.y+neighborCell.y };
        connectionDoorCells.add(`${doorA.x},${doorA.y}`);
        connectionDoorCells.add(`${doorB.x},${doorB.y}`);
        const directionA = rotateDirection(route.direction, room.rotation) || { dx:Math.sign(neighbor.x-room.x), dy:Math.sign(neighbor.y-room.y) };
        const directionB = rotateDirection(neighborRoute.direction, neighbor.rotation) || { dx:Math.sign(room.x-neighbor.x), dy:Math.sign(room.y-neighbor.y) };
        const start = { x:doorA.x+directionA.dx, y:doorA.y+directionA.dy };
        const end = { x:doorB.x+directionB.dx, y:doorB.y+directionB.dy };
        if (room.x !== neighbor.x) {
          const middleX = Math.floor((start.x+end.x)/2);
          addGridSegment(corridorCells,start,{x:middleX,y:start.y});
          addGridSegment(corridorCells,{x:middleX,y:start.y},{x:middleX,y:end.y});
          addGridSegment(corridorCells,{x:middleX,y:end.y},end);
        } else {
          const middleY = Math.floor((start.y+end.y)/2);
          addGridSegment(corridorCells,start,{x:start.x,y:middleY});
          addGridSegment(corridorCells,{x:start.x,y:middleY},{x:end.x,y:middleY});
          addGridSegment(corridorCells,{x:end.x,y:middleY},end);
        }
      }
    }
    const corridorTiles = [...corridorCells].map(key => {
      const [x,y] = key.split(',').map(Number);
      return `<rect class="overview-corridor-tile map-floor-square" x="${x*unit}" y="${y*unit}" width="${unit}" height="${unit}"/>`;
    }).join('');
    const corridorWalls = [...corridorCells].flatMap(key => {
      const [x,y] = key.split(',').map(Number);
      return [[0,-1,x*unit,y*unit,(x+1)*unit,y*unit],[1,0,(x+1)*unit,y*unit,(x+1)*unit,(y+1)*unit],[0,1,x*unit,(y+1)*unit,(x+1)*unit,(y+1)*unit],[-1,0,x*unit,y*unit,x*unit,(y+1)*unit]]
        .filter(([dx,dy]) => !corridorCells.has(`${x+dx},${y+dy}`) && !connectionDoorCells.has(`${x+dx},${y+dy}`))
        .map(([, ,x1,y1,x2,y2]) => `<line class="map-wall overview-corridor-wall" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
    }).join('');
    const roomPlans = state.rooms.map(room => {
      const layout = layouts.get(room.id);
      const plan = renderFloorplanSvg(templateFor(room), `overview-${room.id}`, { overview:true, rotation:room.rotation || 0, embeddedX:layout.x*unit, embeddedY:layout.y*unit });
      const stateClass = `${room.id === state.activeRoomId ? ' active' : ''} ${room.status}`;
      return `<g class="overview-room-node${stateClass}" data-action="travel" data-id="${room.id}" tabindex="0"><title>Room ${room.number}: ${esc(templateFor(room).name)}</title>${plan}<circle class="overview-room-number-bg" cx="${layout.x*unit+14}" cy="${layout.y*unit+14}" r="11"/><text class="overview-room-number" x="${layout.x*unit+14}" y="${layout.y*unit+18}">${room.number}</text><text class="overview-room-icons" x="${(layout.x+layout.width)*unit-6}" y="${layout.y*unit+15}">${statusIcon(room)}</text></g>`;
    }).join('');
    const displayWidth = totalWidth * 12, displayHeight = totalHeight * 12;
    return `<aside class="pane pane-map"><div class="map-wrap">
      <div class="section-head"><h2>Dungeon map</h2><span>${state.rooms.length} rooms · unbounded</span></div>
      <div class="dungeon-overview-wrap"><svg class="dungeon-overview" width="${displayWidth}" height="${displayHeight}" viewBox="0 0 ${totalWidth*unit} ${totalHeight*unit}" role="img" aria-label="Connected dungeon overview at one shared grid scale"><defs><pattern id="overview-rock" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" class="map-hatch-line"/></pattern></defs><rect class="map-paper" width="100%" height="100%"/><rect class="map-hatching" width="100%" height="100%" fill="url(#overview-rock)"/>${roomPlans}${corridorTiles}${corridorWalls}</svg></div>
      <div class="map-legend"><div class="legend-line"><i class="legend-swatch active"></i> Current room</div><div class="legend-line"><i class="legend-swatch danger"></i> Active danger</div><div class="legend-line">✦ Secured light &nbsp; ⚔ Enemies &nbsp; ♥ Heart</div></div>
      <div class="site-card"><div class="eyebrow">${esc(state.domain)} · ${esc(state.theme)}</div><h3>${esc(state.quest.name)}</h3><p>${esc(state.quest.elements)}</p><p><strong>${state.quest.elementsFound}</strong> quest elements · Heart ${state.quest.heartFound ? 'revealed' : 'unrevealed'}</p></div>
    </div></aside>`;
  }

  function renderRoom() {
    const room = activeRoom();
    const template = templateFor(room);
    const scene = buildRoomScene(room, template);
    const termDefinition = roomTermDefinition(template.name);
    const darkness = state.light.remaining <= 0 && !room.securedLight;
    return `<main class="pane pane-room">
      <div class="section-head"><h2>Active room</h2><span>Template ${template.index} · roll ${room.templateIndex}</span></div>
      <article class="room-card">
        <header class="room-header"><div class="eyebrow">Room ${room.number} · ${room.status}</div><h2>${esc(template.name)}</h2></header>
        <section class="read-aloud" data-room-number="${room.number}"><div class="eyebrow">Read aloud · Room ${room.number}</div><div class="read-aloud-parts">${scene.readAloudParts.map(part => `<div class="read-aloud-part"><span class="prose-source">${esc(part.source)}</span><p><em>${esc(part.text)}</em></p></div>`).join('')}</div></section>
        <div class="room-meta room-meta-strip">
          <span class="tag danger-${template.danger.toLowerCase()}">${template.danger} ${template.target}</span>
          <span class="tag ${room.securedLight ? 'lit' : ''}">${room.securedLight ? '✦ Secured light' : template.lighting}</span>
          ${darkness ? '<span class="tag danger-hard">Darkness: disadvantage</span>' : ''}
          ${template.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}
        </div>
        <div class="room-body">${renderFloorplan(template, room.id)}<div class="room-copy">
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
    const encounterType = enemy.manuallyAdded ? 'Added encounter' : enemy.wandering ? 'Wandering enemy' : `${enemy.units} creature${enemy.units === 1 ? '' : 's'}`;
    return `<article class="enemy-card"><div class="enemy-top"><div><div class="eyebrow">${encounterType}</div><h3>${esc(enemy.name)}</h3></div><div class="hp-pips">${pips}</div></div><div class="enemy-stats"><span>${enemy.units} × ${Math.ceil(enemy.maxHp / enemy.units)} HP</span><span>Defense ${enemy.defense}</span><span>${enemy.hp}/${enemy.maxHp} HP</span></div><p>${esc(enemy.behavior)}</p><p><strong>Instinct:</strong> ${esc(enemy.instinct)}</p><p><strong>Wound:</strong> ${esc(enemy.wound)}</p><div class="card-actions"><button class="btn btn-small" data-action="damage-enemy" data-id="${enemy.id}">Deal 1</button><button class="btn btn-small" data-action="dungeon-action" data-id="${enemy.id}">Dungeon action</button><button class="btn btn-small btn-quiet" data-action="remove-enemy" data-id="${enemy.id}">Remove</button></div></article>`;
  }

  function renderEncounter() {
    const room = activeRoom();
    const scene = buildRoomScene(room, templateFor(room));
    const live = room.enemies.filter(enemy => enemy.hp > 0);
    return `<aside class="pane pane-encounter"><section><div class="section-head"><h2>Encounter</h2><button class="btn btn-small btn-quiet" data-action="add-enemy">+ Encounter</button></div><div class="enemy-list">${live.length ? live.map(renderEnemy).join('') : '<div class="empty-state">No active creature cards in this room.</div>'}</div></section>
      <section><div class="subhead">Quest thread</div><div class="quest-list"><article class="quest-card"><div class="eyebrow">Quest generation result ${room.quest.value} → ${esc(room.quest.name)}</div><h3>${esc(scene.quest.title)}</h3><p>${esc(scene.quest.prose)}</p>${scene.quest.placement ? `<p><strong>Where it is:</strong> ${esc(scene.quest.placement)}</p><p><strong>Roll clarification:</strong> ${room.quest.value} generated this element; it is not a target number. Use the room target only when an uncertain action requires a check.</p><div class="card-actions">${room.quest.claimed ? '<span class="tag lit">✓ Quest element claimed</span>' : '<button class="btn btn-small btn-primary" data-action="claim-quest-element">Claim Quest Element</button>'}</div>` : ''}<p><strong>Effect:</strong> ${esc(scene.quest.effect)}</p></article>${state.quest.heartFound ? `<article class="quest-card"><div class="eyebrow">Heart</div><h3>${esc(state.quest.heart)}</h3><p>${state.quest.elementsFound} element${state.quest.elementsFound === 1 ? '' : 's'} claimed. ${state.quest.completed ? 'The Heart is conquered.' : 'It remains unresolved.'}</p></article>` : ''}</div></section></aside>`;
  }

  function signed(value) { return value >= 0 ? `+${value}` : String(value); }
  function renderHero(hero) {
    const bearingTorch = state.light.remaining > 0 && state.light.holderId === hero.id;
    return `<article class="adventurer-card ${hero.dead ? 'dead' : ''}"><div class="adventurer-head"><div><h3>${esc(hero.name)}${hero.dead ? ' — dead' : ''}</h3><p>${esc(hero.past)} · ${esc(hero.knack)}${bearingTorch ? ' · 🔥 Torch bearer' : ''}</p></div><div class="tracker"><button data-action="hero-hp" data-id="${hero.id}" data-delta="-1">−</button><strong>♥ ${hero.hp}/${hero.maxHp}</strong><button data-action="hero-hp" data-id="${hero.id}" data-delta="1">+</button></div></div>
      <div class="character-row">${Object.entries(hero.attributes).map(([name,value]) => `<div class="stat"><small>${name}</small><strong>${signed(value)}</strong></div>`).join('')}</div>
      <div class="gear-line"><strong>${esc(hero.gear)} · ${hero.gearHands || '?'} hand${hero.gearHands === 1 ? '' : 's'}:</strong> ${esc(hero.gearRule)}</div>
      <div class="gear-line"><strong>${esc(hero.gearTechnique)} · ${hero.gearTechniqueCost} token${hero.gearTechniqueCost === 1 ? '' : 's'}:</strong> ${esc(hero.gearTechniqueRule)}</div>
      <div class="gear-line"><strong>${esc(hero.armorName)} · ${esc(hero.burden)}:</strong> ${esc(hero.armorRule)}</div>
      ${bearingTorch ? '<div class="gear-line"><strong>Torch:</strong> occupies one hand; bows and two-handed equipment are unavailable.</div>' : ''}
      <div class="gear-line"><strong>Past · 1 token:</strong> ${esc(hero.past)} (${esc(hero.pastAttribute)}; invoke for +2 when its fictional scope applies)</div>
      <div class="gear-line"><strong>${esc(hero.knack)} · ${hero.knackCost} tokens:</strong> ${esc(hero.knackRule)}</div>
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
      <div class="resource-strip"><div class="resource"><small>Turn</small><strong>${state.turn}</strong></div><div class="resource torch"><small>Active torch</small><strong>${state.light.remaining || 'Dark'}</strong></div><div class="resource"><small>Spare torches</small><strong>${state.light.reserve}</strong></div><div class="resource"><small>Rooms found</small><strong>${state.rooms.length}</strong></div></div>
      <div class="top-actions"><span class="build-pill" title="Deployed application build">Build ${esc(BUILD)}</span><button class="btn icon-btn" data-action="toggle-log" title="Expedition log">☷</button><button class="btn icon-btn" data-action="settings" title="Save and expedition settings">···</button></div></header>
      <div class="workspace">${renderMap()}${renderRoom()}${renderEncounter()}${renderParty()}</div>
      <footer class="action-dock"><div class="primary-actions"><button class="btn btn-primary" data-action="explore" ${availableExitRoutes(room).length <= 0 ? 'disabled' : ''}>Explore new room</button><button class="btn" data-action="roll">Make a check</button><button class="btn" data-action="conquer" ${room.status === 'conquered' ? 'disabled' : ''}>Conquer room</button>${state.light.remaining <= 0 ? '<button class="btn" data-action="light-torch">Light torch</button>' : state.party.filter(hero=>!hero.dead).length > 1 ? '<button class="btn" data-action="pass-torch">Pass torch</button>' : ''}</div><div id="save-state" class="save-state">Saved locally</div></footer>
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
      <div class="field"><label>Map</label><div class="static-field">Unbounded · expands as exits are explored</div></div><div class="field"><label>Escalation</label><select name="escalation"><option value="3">Fast · E3</option><option value="2">Standard · E2</option><option value="1">Slow · E1</option></select></div>
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
      const exits = availableExitRoutes(room);
      const sectors = emptyAdjacentSectors(room);
      if (!modal.routeKey) {
        const body = !sectors.length
          ? '<div class="empty-state">No empty adjacent sector remains. Use another room or record a vertical or secret route in the notes.</div>'
          : exits.length ? `<div class="direction-grid">${exits.map(route => {
              const direction = rotateDirection(route.direction, room.rotation);
              const cardinal = direction && cardinalForVector(direction.dx, direction.dy);
              const target = directRouteTarget(room, route);
              const occupied = target && state.rooms.some(candidate => candidate.x === target.x && candidate.y === target.y);
              if (target) return `<button class="btn direction-card" data-action="choose-direction" data-route="${esc(route.key)}" data-x="${target.x}" data-y="${target.y}" ${occupied ? 'disabled' : ''}><strong>${cardinal.arrow} ${esc(routeLabel(room, route))}</strong><small>${occupied ? 'That map position is already occupied' : `Explore directly ${cardinal.name.toLowerCase()}`}</small></button>`;
              return `<button class="btn direction-card" data-action="choose-exit" data-route="${esc(route.key)}"><strong>${route.glyph === 'D' ? '↓' : '↑'} ${esc(routeLabel(room, route))}</strong><small>${route.glyph === 'D' ? 'Choose where the lower level is diagrammed' : 'Choose where the upper level is diagrammed'}</small></button>`;
            }).join('')}</div>` : '<div class="empty-state">Every generated exit from this room has already been assigned.</div>';
        root.innerHTML = modalShell('Choose an exit', `${exits.length} uncharted exit${exits.length === 1 ? '' : 's'} remain. A cardinal doorway always places the next room in that direction.`, body);
      } else {
        const route = exits.find(candidate => candidate.key === modal.routeKey);
        if (!route) { delete modal.routeKey; return renderModal(); }
        const preferred = rotateDirection(route.direction, room.rotation);
        const ordered = [...sectors].sort((a,b) => Number(b.dx === preferred?.dx && b.dy === preferred?.dy) - Number(a.dx === preferred?.dx && a.dy === preferred?.dy));
        const body = ordered.length ? `<div class="direction-grid">${ordered.map(direction => {
          const straight = direction.dx === preferred?.dx && direction.dy === preferred?.dy;
          return `<button class="btn direction-card" data-action="choose-direction" data-route="${esc(route.key)}" data-x="${room.x+direction.dx}" data-y="${room.y+direction.dy}"><strong>${direction.arrow} ${direction.name} sector</strong><small>${straight ? 'Straight through this exit' : 'Corridor bends through the rock'}</small></button>`;
        }).join('')}</div>` : '<div class="empty-state">No empty adjacent sector remains.</div>';
        root.innerHTML = `<section class="modal"><div class="modal-head"><h2>Place the next room</h2><p>${esc(routeLabel(room, route))} is fixed by the rotated floorplan. Choose where its corridor reaches the site grid.</p></div><div class="modal-body">${body}</div><div class="modal-foot"><button class="btn btn-quiet" data-action="back-to-exits">Back</button><button class="btn btn-quiet" data-action="close-modal">Cancel</button></div></section>`;
      }
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
    } else if (modal.type === 'encounter') {
      const template = templateFor(activeRoom());
      const options = DATA.monsters.map((monster, index) => {
        const { units, total } = enemyScale(monster);
        const search = `${monster.name} ${monster.behavior} ${monster.instinct}`.toLowerCase();
        return `<article class="monster-option" data-monster-option data-search="${esc(search)}"><div><h3>${esc(monster.name)}</h3><p>${units} creature${units === 1 ? '' : 's'} · ${monster.unitHp} HP each · ${total} total HP · Defense ${template.target}</p><small>${esc(monster.behavior)}</small></div><button class="btn btn-small" data-action="add-specific-enemy" data-index="${index}">Add</button></article>`;
      }).join('');
      root.innerHTML = `<section class="modal encounter-picker"><div class="modal-head"><h2>Add encounter</h2><p>Choose the creature named by the room, search the roster, or roll a random roaming encounter.</p></div><div class="modal-body"><div class="field"><label for="enemy-search">Search creatures</label><input id="enemy-search" data-action="enemy-search" type="search" placeholder="Skeleton, spirit, wounded prey…" autocomplete="off"></div><button class="random-encounter" data-action="add-random-enemy"><strong>Roll random encounter</strong><span>Uses the full roaming-creature table and scales it to the living party.</span></button><div class="monster-options">${options}</div><div class="empty-state monster-search-empty hidden">No creatures match that search.</div></div><div class="modal-foot"><button class="btn btn-quiet" data-action="close-modal">Cancel</button></div></section>`;
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
    else if (action === 'choose-exit') { modal.routeKey = target.dataset.route; renderModal(); }
    else if (action === 'back-to-exits') { delete modal.routeKey; renderModal(); }
    else if (action === 'choose-direction') { generateRoom(Number(target.dataset.x),Number(target.dataset.y),state.activeRoomId,target.dataset.route); closeModal(); render(); }
    else if (action === 'travel') travelTo(target.dataset.id);
    else if (action === 'conquer') conquerRoom();
    else if (action === 'light-fixtures') lightFixtures();
    else if (action === 'light-torch') lightTorch();
    else if (action === 'pass-torch') passTorch();
    else if (action === 'claim') claimOpportunity();
    else if (action === 'claim-quest-element') claimQuestElement();
    else if (action === 'pass-turn' || action === 'add-turn') { advanceTurns(1); closeModal(); render(); }
    else if (action === 'roll') openModal('roll');
    else if (action === 'dungeon-action') openModal('dungeon',{enemyId:target.dataset.id});
    else if (action === 'open-dungeon-action') openModal('dungeon');
    else if (action === 'damage-enemy') { const e=activeRoom().enemies.find(e=>e.id===target.dataset.id); e.hp=Math.max(0,e.hp-1); log(`${e.name} took 1 damage${e.hp===0?' and was defeated':''}.`); render(); }
    else if (action === 'enemy-hp') { const e=activeRoom().enemies.find(e=>e.id===target.dataset.id); e.hp = e.hp===Number(target.dataset.hp) ? Number(target.dataset.hp)-1 : Number(target.dataset.hp); render(); }
    else if (action === 'remove-enemy') { activeRoom().enemies=activeRoom().enemies.filter(e=>e.id!==target.dataset.id); render(); }
    else if (action === 'add-enemy') openModal('encounter');
    else if (action === 'add-random-enemy') addEncounter();
    else if (action === 'add-specific-enemy') addEncounter(Number(target.dataset.index));
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
    } else if (event.target.dataset.action === 'enemy-search') {
      const query = event.target.value.trim().toLowerCase();
      const picker = event.target.closest('.encounter-picker');
      let matches = 0;
      picker.querySelectorAll('[data-monster-option]').forEach(option => {
        const visible = !query || option.dataset.search.includes(query);
        option.classList.toggle('hidden', !visible);
        if (visible) matches += 1;
      });
      picker.querySelector('.monster-search-empty').classList.toggle('hidden', matches > 0);
    }
  }

  document.addEventListener('click', handleClick);
  document.addEventListener('submit', handleSubmit);
  document.addEventListener('input', handleInput);
  renderWelcome();
})();