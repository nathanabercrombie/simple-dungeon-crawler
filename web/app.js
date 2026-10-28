(() => {
  'use strict';

  const DATA = window.GAME_DATA;
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
    let result = room.opportunity[0];
    if (room.opportunityRoll === 3) {
      const item = pick(DATA.items);
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
    const darkness = state.light.remaining <= 0 && !room.securedLight;
    return `<main class="pane pane-room">
      <div class="section-head"><h2>Active room</h2><span>Template ${template.index} · roll ${room.templateIndex}</span></div>
      <article class="room-card">
        <header class="room-header"><div class="eyebrow">Room ${room.number} · ${room.status}</div><h2>${esc(template.name)}</h2><div class="room-meta">
          <span class="tag danger-${template.danger.toLowerCase()}">${template.danger} ${template.target}</span>
          <span class="tag ${room.securedLight ? 'lit' : ''}">${room.securedLight ? '✦ Secured light' : template.lighting}</span>
          ${darkness ? '<span class="tag danger-hard">Darkness: disadvantage</span>' : ''}
          ${template.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}
        </div></header>
        <div class="room-body"><pre class="floorplan" aria-label="Room floor plan">${esc(template.map)}</pre><div class="room-copy">
          <h3>Challenge · d12 ${room.challengeRoll}</h3><p><strong>${esc(room.challenge[0])}.</strong> ${esc(room.challenge[1])}</p>
          <h3>Opportunity · d8 ${room.opportunityRoll}</h3><p><strong>${esc(room.opportunity[0])}.</strong> ${esc(room.opportunity[1])}</p>
          <div class="fallback"><strong>Mechanical fallback:</strong> use ${template.danger} ${template.target} for uncertain room actions. On failure, apply the inherent consequence and give the dungeon one meaningful action.</div>
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
      <section><div class="subhead">Quest thread</div><div class="quest-list"><article class="quest-card"><div class="eyebrow">Quest roll ${room.quest.value}</div><h3>${esc(room.quest.name)}</h3><p>${esc(room.quest.description)}</p></article>${state.quest.heartFound ? `<article class="quest-card"><div class="eyebrow">Heart</div><h3>${esc(state.quest.heart)}</h3><p>${state.quest.elementsFound} element${state.quest.elementsFound === 1 ? '' : 's'} found. ${state.quest.completed ? 'The Heart is conquered.' : 'It remains unresolved.'}</p></article>` : ''}</div></section></aside>`;
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
    const room = activeRoom();
    const template = templateFor(room);
    app.innerHTML = `<div class="app-shell">
      <header class="topbar"><div class="brand"><div class="brand-mark"><span>D</span></div><div><h1>${esc(state.title)}</h1><p>${esc(state.domain)} · ${esc(state.theme)} · seed ${esc(state.seed)}</p></div></div>
      <div class="resource-strip"><div class="resource"><small>Turn</small><strong>${state.turn}</strong></div><div class="resource torch"><small>Active torch</small><strong>${state.light.remaining || 'Dark'}</strong></div><div class="resource"><small>Spare torches</small><strong>${state.light.reserve}</strong></div><div class="resource"><small>Room</small><strong>${room.number}/${state.size*state.size}</strong></div></div>
      <div class="top-actions"><button class="btn icon-btn" data-action="toggle-log" title="Expedition log">☷</button><button class="btn icon-btn" data-action="settings" title="Save and expedition settings">···</button></div></header>
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
      root.innerHTML = modalShell('Expedition data','Progress saves automatically in this browser. Export a backup before clearing browser data.', `<div class="button-row"><button class="btn" data-action="export">Export save</button><button class="btn" data-action="import">Import save</button><button class="btn btn-danger" data-action="end-expedition">End and erase expedition</button></div><div class="subhead">Manual controls</div><div class="button-row"><button class="btn btn-small" data-action="add-turn">+1 turn</button><button class="btn btn-small" data-action="add-torch">+1 spare torch</button><button class="btn btn-small" data-action="toggle-secured">Toggle secured light</button></div>`);
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