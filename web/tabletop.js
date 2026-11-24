(() => {
  'use strict';

  const data = window.GAME_DATA;
  const cell = 24;
  const saveKey = 'delvekeeper.tabletop.v1';
  const directions = [[0,-1], [1,0], [0,1], [-1,0]];
  const directionNames = ['North', 'East', 'South', 'West'];
  const seedCards = ['guardroom','store-cellar','crooked-junction','rubble-breach','branching-hall','pit-bridge','flooded-channel','armory'];
  const scenes = new Map(data.scenes.map(scene => [scene.id, scene]));
  const entranceId = data.scenes[0].id;
  const $ = selector => document.querySelector(selector);
  const board = $('#board');
  const pieces = $('#pieces');
  const deck = $('#deck');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const esc = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key = ({ x, y }) => `${x},${y}`;

  function floorplan(scene) {
    const rows = scene.map.split('\n');
    const width = Math.max(...rows.map(row => row.length));
    const cells = rows.flatMap((row,y) => [...row].flatMap((glyph,x) => glyph === ' ' ? [] : [{ x,y,glyph }]));
    const occupied = new Map(cells.map(square => [key(square), square.glyph]));
    const doors = cells.flatMap((square, index) => {
      const { x,y,glyph } = square;
      if (!'EX?'.includes(glyph)) return [];
      // Prefer an outward edge opposite a walkable square; some maps have ragged margins.
      const edgeDistance = [y,width-1-x,rows.length-1-y,x];
      const scores = directions.map(([dx,dy], dir) => {
        const behind = occupied.get(key({ x:x-dx, y:y-dy }));
        const ahead = occupied.get(key({ x:x+dx, y:y+dy }));
        return edgeDistance[dir] + (behind && behind !== '#' ? 0 : 20) + (ahead ? 10 : 0);
      });
      const dir = scores.indexOf(Math.min(...scores));
      return [{ ...square, dir, index }];
    });
    return { cells, occupied, doors, width, height:rows.length };
  }

  const plans = new Map([...scenes].map(([id, scene]) => [id, floorplan(scene)]));

  function shuffledStack() {
    const ids = seedCards.map(id => `classics:scene:${id}`);
    for (let i = ids.length-1; i > 0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids;
  }

  const newTable = () => ({
    stack:shuffledStack(), rooms:[{ id:1, scene:entranceId, x:0, y:0, turn:0 }],
    hand:null, selected:1, target:null, revealed:[]
  });

  function load() {
    try {
      const save = JSON.parse(localStorage.getItem(saveKey));
      if (save?.table?.rooms?.length && Array.isArray(save.table.stack)) return save;
    } catch { /* An unavailable save must not prevent play. */ }
    return { table:newTable(), history:[] };
  }

  let { table, history } = load();
  let camera = { x:60, y:60, zoom:1 };
  let pan = null;
  let drag = null;
  let dragHint = false;

  function save() {
    try { localStorage.setItem(saveKey, JSON.stringify({ table, history })); }
    catch { /* The current table still works without storage. */ }
  }

  function checkpoint() {
    history = [...history.slice(-14), JSON.parse(JSON.stringify(table))];
  }

  function rotate({ x,y }, turn) {
    if (turn === 1) return { x:-y, y:x };
    if (turn === 2) return { x:-x, y:-y };
    if (turn === 3) return { x:y, y:-x };
    return { x,y };
  }

  function world(room, square) {
    const p = rotate(square, room.turn);
    return { x:room.x+p.x, y:room.y+p.y };
  }

  function openDoors() {
    const linked = new Set(table.rooms.map(room => room.link).filter(Boolean));
    return table.rooms.flatMap(room => plans.get(room.scene).doors.flatMap(door => {
      const id = `${room.id}:${door.index}`;
      if (door.glyph === 'E' || linked.has(id)) return [];
      const dir = (door.dir+room.turn)%4;
      return [{ ...world(room, door), dir, id, room:room.id, label:`${directionNames[dir]} ${door.glyph === '?' ? 'passage' : 'door'} · Room ${room.id}` }];
    }));
  }

  function proposal(door, hand) {
    if (!door || !hand) return null;
    const plan = plans.get(hand.scene);
    const entrance = plan.doors.find(port => port.glyph === 'E');
    const [dx,dy] = directions[door.dir];
    const entry = rotate(entrance, hand.turn);
    const length = hand.length;
    const hall = Array.from({ length }, (_,i) => ({ x:door.x+dx*(i+1), y:door.y+dy*(i+1), dir:door.dir }));
    const room = {
      id:table.rooms.length+1, scene:hand.scene, turn:hand.turn, link:door.id, hall,
      x:door.x+dx*(length+1)-entry.x, y:door.y+dy*(length+1)-entry.y
    };
    const occupied = new Set(table.rooms.flatMap(placed => [...(placed.hall || []), ...plans.get(placed.scene).cells.map(square => world(placed,square))].map(key)));
    const aligned = (entrance.dir+hand.turn+2)%4 === door.dir;
    const overlaps = [...hall, ...plan.cells.map(square => world(room,square))].some(square => occupied.has(key(square)));
    return { room, aligned, overlaps, valid:aligned && !overlaps };
  }

  const targetDoor = () => openDoors().find(door => door.id === table.target);
  const heldDoor = () => drag?.active ? drag.door : targetDoor();
  const preview = () => proposal(heldDoor(), table.hand);

  const baseFill = {
    '#':'#574f40', '~':'#7c9e98', P:'#544b45', L:'#ad603b',
    B:'#baad89', '^':'#cfbb92', C:'#cbba94', '=':'#c3a578'
  };
  const fills = square => baseFill[square.glyph] || (square.glyph === '.' && (square.x+square.y)%2 ? '#dfcba3' : '#e6d4ad');
  const etched = 'fill="none" stroke="#5d4e39" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"';
  const symbols = {
    O:`<rect x="7" y="7" width="10" height="10" rx="2" fill="#9f8054" stroke="#5d4e39"/><path d="M8 15l7-7" stroke="#cdba91"/>`,
    R:`<path d="m4 16 3-6 5 2 2 6zM12 10l3-5 5 4-2 5z" fill="#ae9a76" stroke="#68563f"/>`,
    P:`<rect width="24" height="24" fill="url(#pit-hatch)"/>`,
    '~':`<path d="M4 10q4-4 8 0t8 0M4 15q4-4 8 0t8 0" fill="none" stroke="#425e5a" opacity=".65"/>`,
    L:`<path d="m3 15 4-4 5 1 4-5 5 1" fill="none" stroke="#e7a56a"/>`,
    '=':`<path d="M4 4h16M4 9h16M4 15h16M4 20h16" ${etched}/>`,
    '^':`<path d="m5 14 7-6 7 6M5 18l7-6 7 6" ${etched}/>`,
    B:`<path d="M4 5h16m-16 3h16" ${etched}/>`,
    C:`<rect x="5" y="5" width="14" height="14" rx="2" ${etched}/><path d="M9 5v14m6-14v14" ${etched}/>`,
    '-':`<path d="M0 12h24M5 8v8m7-8v8m7-8v8" ${etched}/>`,
    '+':`<path d="M2 12h20M6 7v10m6-10v10m6-10v10" ${etched}/>`,
    T:`<path d="M6 17V7h12v10M6 13h12M8 17v3m8-3v3" ${etched}/>`,
    F:`<path d="M6 18V8h12v10z" fill="#a57143" stroke="#5d4e39"/><path d="M10 15q-2-3 3-6 0 3 2 4 1 4-3 4Z" fill="#e1a467"/>`,
    G:`<circle cx="12" cy="12" r="6" ${etched}/><path d="M12 4v16M4 12h16" ${etched}/>`,
    M:`<path d="m12 4 6 8-6 8-6-8z" fill="#a394ad" stroke="#5d4e39"/>`,
    '#':`<path d="M2 12h20M9 2v10m7 0v10" stroke="#ae9c7b" opacity=".25"/>`
  };

  function tile(plan) {
    const ports = new Map(plan.doors.map(door => [key(door), door.dir]));
    return plan.cells.map(square => {
      const { x,y,glyph } = square;
      const border = [
        [x,y-1,'M0 0h24'], [x+1,y,'M24 0v24'], [x,y+1,'M0 24h24'], [x-1,y,'M0 0v24']
      ].filter(([a,b]) => !plan.occupied.has(key({ x:a,y:b }))).map(([, ,path]) => path).join(' ');
      return `<g transform="translate(${x*cell} ${y*cell})">
        <rect width="24" height="24" fill="${fills(square)}"/>
        <path d="M0 24V0H24" fill="none" stroke="#544932" stroke-opacity=".22"/>
        ${symbols[glyph] || ''}${glyph === 'E' ? `<g transform="rotate(${ports.get(key(square))*90} 12 12)"><path d="M3 3h18" stroke="#9d6237" stroke-width="2"/><path d="M12 7v10m-4-4 4 4 4-4" ${etched}/></g>` : ''}${border ? `<path class="room-outline" d="${border}" fill="none" stroke="#ad9167" stroke-width="1.25"/>` : ''}
      </g>`;
    }).join('');
  }

  const tiles = new Map(seedCards.map(id => `classics:scene:${id}`).concat(entranceId).map(id => [id, tile(plans.get(id))]));

  function mapTile(room) {
    return `<g transform="translate(${(room.x+.5)*cell} ${(room.y+.5)*cell}) rotate(${room.turn*90}) translate(-12 -12)">${tiles.get(room.scene)}</g>`;
  }

  function corridor(room) {
    return (room.hall || []).map(({ x,y,dir }) => `<g transform="translate(${x*cell} ${y*cell})"><rect width="24" height="24" fill="#cfba92" stroke="#a88e63"/><path d="M12 0v24" transform="rotate(${(dir || 0)*90} 12 12)" stroke="#83704f" stroke-dasharray="2 4"/></g>`).join('');
  }

  function label(room) {
    const plan = plans.get(room.scene);
    const square = plan.cells.find(p => p.x === 1 && p.y === 1 && p.glyph === '.') || plan.cells.find(p => p.glyph === '.');
    if (!square) return '';
    const pos = world(room,square);
    return `<g pointer-events="none" transform="translate(${(pos.x+.5)*cell} ${(pos.y+.5)*cell})"><circle r="8.5" fill="#3b493a" stroke="#efe0b9" stroke-width="1.3"/><text y=".5" dominant-baseline="central" text-anchor="middle" font-family="ui-monospace,monospace" font-size="10" fill="#fff0d0">${room.id}</text></g>`;
  }

  function entranceMarker() {
    const start = table.rooms[0];
    const entrance = plans.get(start.scene).doors.find(port => port.glyph === 'E');
    const x = (entrance.x+.5)*cell;
    const y = (entrance.y+1)*cell;
    return `<g pointer-events="none" transform="translate(${x} ${y})"><path d="M0 4v13m-4-5 4 5 4-5" fill="none" stroke="#ecc58a"/><text y="34" fill="#c4baa0" font-size="10" font-family="ui-monospace,monospace" text-anchor="middle" letter-spacing="2">ENTRANCE</text></g>`;
  }

  function renderBoard() {
    pieces.innerHTML = `${table.rooms.map(corridor).join('')}${table.rooms.map(room => `
      <g class="room" role="button" tabindex="0" data-room="${room.id}" aria-label="Room ${room.id}: ${esc(scenes.get(room.scene).name)}" aria-pressed="${!table.hand && table.selected === room.id}">${mapTile(room)}${label(room)}</g>`).join('')}${entranceMarker()}`;
    $('#doorways').innerHTML = openDoors().map(door => `<g class="door" role="button" tabindex="0" data-door="${door.id}" aria-label="${esc(door.label)}" transform="translate(${(door.x+.5)*cell} ${(door.y+.5)*cell})">
        <circle r="16" fill="transparent"/><circle class="door-disc" r="8" fill="#303b31" stroke="#e7b674" stroke-width="1.6"/>
        <path class="door-arrow" d="M0 4v-8m-3 3 3-3 3 3" transform="rotate(${door.dir*90})" fill="none" stroke="#f4ca8f" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>
      </g>`).join('');
    renderPreview();
  }

  function renderPreview() {
    const candidate = preview();
    const target = heldDoor();
    const floating = !candidate && drag?.active && drag.over ? mapTile({ ...table.hand, x:drag.px+1, y:drag.py+1 }) : '';
    $('#preview').innerHTML = candidate ? `<g class="preview ${candidate.valid ? 'fits' : 'blocked'}" opacity=".65">${corridor(candidate.room)}${mapTile(candidate.room)}</g>` : `<g opacity=".5">${floating}</g>`;
    for (const port of $('#doorways').children) {
      const chosen = target?.id === port.dataset.door;
      port.classList.toggle('chosen', chosen);
      port.setAttribute('aria-pressed', String(chosen));
    }
  }

  const backArt = `<svg viewBox="0 0 53 76" aria-hidden="true"><rect x="2" y="2" width="49" height="72" rx="3" fill="none" stroke="currentColor" opacity=".7"/><path d="m26.5 14 17 24-17 24-17-24Z" fill="none" stroke="currentColor"/><path d="M18 47V36a8.5 8.5 0 0 1 17 0v11m-17 0h17m-13 0V36a4.5 4.5 0 0 1 9 0v11" fill="none" stroke="currentColor"/><path d="M26.5 6v5m-2.5-2.5h5m-2.5 57v5m-2.5-2.5h5" stroke="currentColor"/></svg>`;

  function renderDeck() {
    const hand = table.hand;
    if (hand) {
      const plan = plans.get(hand.scene);
      const span = Math.max(plan.width,plan.height)*cell;
      deck.innerHTML = `<button type="button" class="hand-tile" data-action="rotate" aria-label="Rotate held Scene clockwise; drag to an open doorway to place" title="Drag to a doorway or click to rotate"><svg viewBox="${-span/2-4} ${-span/2-4} ${span+8} ${span+8}" aria-hidden="true"><g transform="rotate(${hand.turn*90}) translate(${-plan.width*cell/2} ${-plan.height*cell/2})">${tiles.get(hand.scene)}</g></svg></button>
        <div class="deck-copy"><strong>Scene in hand</strong><p>${esc(scenes.get(hand.scene).name)}</p><p>${table.stack.length} face down in the deck</p></div>`;
    } else {
      deck.innerHTML = `<div class="card-back" aria-hidden="true">${backArt}</div><div class="deck-copy"><strong>Classics · Map sampler</strong><p>${table.stack.length} ${table.stack.length === 1 ? 'card' : 'cards'} face down</p><button type="button" class="primary" data-action="draw" ${!table.target || !table.stack.length ? 'disabled' : ''}>Draw Scene</button></div>`;
    }
  }

  function renderPlacement() {
    const el = $('#placement');
    const hand = table.hand;
    const door = heldDoor();
    const candidate = preview();
    el.hidden = !hand;
    if (!hand) return;
    const message = !door ? 'Pick an open doorway.' : !candidate.aligned ? 'Turn the tile so its entrance faces the doorway.' : candidate.overlaps ? 'Pieces overlap. Extend the corridor or try another doorway.' : 'The tile fits. Place it when you’re ready.';
    el.innerHTML = `<p><strong>${esc(door?.label || 'Held tile')}</strong><br>${message}</p>
      <div class="placement-controls"><button type="button" class="quiet-button" data-action="rotate">↻ Rotate</button><button type="button" class="quiet-button" data-action="shorter" aria-label="Shorten corridor" ${hand.length <= 1 ? 'disabled' : ''}>−</button><button type="button" class="quiet-button" data-action="longer" aria-label="Extend corridor" ${hand.length >= 8 ? 'disabled' : ''}>+</button><span>Corridor: ${hand.length}</span></div>
      <button type="button" class="primary" data-action="place" ${!candidate?.valid ? 'disabled' : ''}>Place Scene</button>`;
  }

  function renderScript() {
    const room = table.rooms.find(item => item.id === table.selected) || table.rooms[0];
    const scene = scenes.get(table.hand?.scene || room.scene);
    const roomId = table.hand ? 'hand' : room.id;
    const revealed = scene.kind === 'opportunity' || table.revealed.includes(roomId);
    const encounter = scene.encounter;
    const encounterNote = encounter.mode === 'random' ? `Draw ${encounter.count} random Monster ${encounter.count === 1 ? 'card' : 'cards'}.` : encounter.mode === 'printed' && !scene.revelation ? encounter.monsterIds.map(id => data.monsters.find(monster => monster.id === id)?.name).filter(Boolean).join(', ') : '';
    $('#script').innerHTML = `<p class="eyebrow">${table.hand ? 'In hand' : `Room ${String(room.id).padStart(2,'0')}`} / Scene script</p><h3>${esc(scene.name)}</h3><p>${esc(scene.readAloud)}</p><p>${esc(scene.front)}</p>
      ${encounterNote ? `<dl><dt>Monsters</dt><dd>${esc(encounterNote)}</dd></dl>` : ''}
      <div class="response">${revealed ? `<dl>${[['Revelation',scene.revelation],['Terrain',scene.feature?.text],['Rule',scene.rule],['Failure',scene.failure]].filter(([, value]) => value).map(([name,value]) => `<dt>${name}</dt><dd>${esc(value)}</dd>`).join('')}</dl>` : '<button type="button" class="quiet-button" data-action="reveal">Reveal Response</button>'}</div>`;
  }

  function render() {
    const active = document.activeElement;
    const attr = ['room','door','action'].find(name => active?.dataset?.[name]);
    const value = active?.dataset?.[attr];
    const region = active?.closest('#deck, #placement, #script, #board')?.id;
    renderBoard();
    renderDeck();
    renderPlacement();
    renderScript();
    const door = targetDoor();
    $('#table-help').textContent = table.hand ? 'Rotate the tile, then place it. You can also drag it from the tray to a doorway.' : !table.stack.length ? 'The Scene deck is empty. Click a room to look back through your dungeon.' : !openDoors().length ? 'No open doorways remain. Undo a placement or start a new table.' : door ? `${door.label} selected. Draw the top Scene from the tray.` : 'Pick an open doorway to draw the next Scene.';
    $('#table-count').textContent = `${table.rooms.length} ${table.rooms.length === 1 ? 'room' : 'rooms'} on the table`;
    $('[data-action="undo"]').disabled = !history.length;
    if (region && attr) {
      const match = $(`#${region}`).querySelectorAll(`[data-${attr}]`);
      [...match].find(node => node.dataset[attr] === value && !node.disabled)?.focus({ preventScroll:true });
    }
    save();
  }

  function cameraView() {
    const w = board.clientWidth || 800;
    const h = board.clientHeight || 600;
    const { x,y,zoom } = camera;
    return { x:x-w/(2*zoom), y:y-h/(2*zoom), w:w/zoom, h:h/zoom };
  }

  function updateCamera() {
    const { x,y,w,h } = cameraView();
    board.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
  }

  function fitMap() {
    const rooms = [...table.rooms];
    const candidate = preview();
    if (candidate) rooms.push(candidate.room);
    const cells = rooms.flatMap(room => [...(room.hall || []), ...plans.get(room.scene).cells.map(p => world(room,p))]);
    const loX = Math.min(...cells.map(p => p.x))*cell;
    const hiX = (Math.max(...cells.map(p => p.x))+1)*cell;
    const loY = Math.min(...cells.map(p => p.y))*cell;
    const hiY = (Math.max(...cells.map(p => p.y))+1)*cell;
    const w = board.clientWidth || 800;
    const h = board.clientHeight || 600;
    const heading = $('.table-heading');
    const top = heading.offsetTop + heading.offsetHeight + 12 || 105;
    const bottom = 88;
    const zoom = clamp(Math.min((w-52)/(hiX-loX), (h-top-bottom)/(hiY-loY), 1.3), .18, 2.6);
    camera = { x:(loX+hiX)/2, y:(loY+hiY)/2+(bottom-top)/(2*zoom), zoom };
    updateCamera();
  }

  function zoomAt(ratio, x, y) {
    const bounds = board.getBoundingClientRect();
    const offsetX = x === undefined ? 0 : x-bounds.left-bounds.width/2;
    const offsetY = y === undefined ? 0 : y-bounds.top-bounds.height/2;
    const zoom = clamp(camera.zoom*ratio, .18, 2.6);
    camera.x += offsetX*(1/camera.zoom-1/zoom);
    camera.y += offsetY*(1/camera.zoom-1/zoom);
    camera.zoom = zoom;
    updateCamera();
  }

  function ensureVisible() {
    const candidate = preview();
    if (!candidate) return;
    const { x,y,w,h } = cameraView();
    const margin = 16/camera.zoom;
    const cells = plans.get(candidate.room.scene).cells.map(square => world(candidate.room,square));
    if (cells.some(p => p.x*cell < x+margin || (p.x+1)*cell > x+w-margin || p.y*cell < y+margin+90/camera.zoom || (p.y+1)*cell > y+h-margin-56/camera.zoom)) fitMap();
  }

  function place(candidate) {
    if (!candidate?.valid) return false;
    checkpoint();
    const room = candidate.room;
    table.rooms.push(room);
    if (table.revealed.includes('hand')) table.revealed = [...table.revealed.filter(id => id !== 'hand'), room.id];
    table.hand = null;
    table.target = null;
    table.selected = room.id;
    return true;
  }

  function act(action) {
    const hand = table.hand;
    const door = targetDoor();
    if (action === 'fit') return fitMap();
    if (action === 'zoom-in' || action === 'zoom-out') return zoomAt(action === 'zoom-in' ? 1.25 : .8);
    if (action === 'draw' && !hand && door && table.stack.length) {
      checkpoint();
      table.hand = { scene:table.stack.shift(), turn:0, length:2 };
    } else if (action === 'rotate' && hand) hand.turn = (hand.turn+1)%4;
    else if (action === 'shorter' && hand) hand.length = Math.max(1,hand.length-1);
    else if (action === 'longer' && hand) hand.length = Math.min(8,hand.length+1);
    else if (action === 'place') { if (!place(preview())) return; }
    else if (action === 'reveal') {
      checkpoint();
      table.revealed.push(hand ? 'hand' : table.selected);
    } else if (action === 'undo' && history.length) table = history.pop();
    else if (action === 'reset') { checkpoint(); table = newTable(); }
    else return;
    render();
    if (action === 'undo' || action === 'reset') fitMap();
    else if (['draw','rotate','shorter','longer'].includes(action)) ensureVisible();
    if (action === 'draw') $('#placement [data-action="rotate"]').focus({ preventScroll:true });
    if (action === 'place') $(`[data-room="${table.selected}"]`).focus({ preventScroll:true });
  }

  function pick(target) {
    if (target.dataset.door) {
      table.target = target.dataset.door;
      table.selected = targetDoor().room;
      render();
      ensureVisible();
    } else if (target.dataset.room && !table.hand) {
      table.selected = Number(target.dataset.room);
      render();
    }
  }

  document.addEventListener('click', event => {
    const action = event.target.closest('[data-action]');
    if (action) {
      if (dragHint && action.classList.contains('hand-tile')) return;
      if (!action.disabled) act(action.dataset.action);
      return;
    }
    const target = event.target.closest('[data-door], [data-room]');
    if (target) pick(target);
  });

  document.addEventListener('keydown', event => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target.closest('[data-room], [data-door]');
    if (target && ['Enter',' '].includes(event.key)) {
      event.preventDefault();
      pick(target);
    } else if (event.key.toLowerCase() === 'r' && table.hand) act('rotate');
  });

  board.addEventListener('wheel', event => {
    event.preventDefault();
    zoomAt(Math.exp(-event.deltaY*.0018), event.clientX,event.clientY);
  }, { passive:false });

  board.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.target.closest('[data-room], [data-door]')) return;
    pan = { id:event.pointerId, x:event.clientX, y:event.clientY, camera:{ ...camera } };
    board.setPointerCapture(event.pointerId);
    board.classList.add('panning');
  });
  board.addEventListener('pointermove', event => {
    if (pan?.id !== event.pointerId) return;
    camera.x = pan.camera.x-(event.clientX-pan.x)/camera.zoom;
    camera.y = pan.camera.y-(event.clientY-pan.y)/camera.zoom;
    updateCamera();
  });
  board.addEventListener('lostpointercapture', () => { pan = null; board.classList.remove('panning'); });

  deck.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.target.closest('.hand-tile') || !table.hand) return;
    dragHint = false;
    drag = { id:event.pointerId, x:event.clientX, y:event.clientY, active:false, door:null };
  });
  document.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    if (!drag.active && Math.hypot(event.clientX-drag.x,event.clientY-drag.y) < 7) return;
    if (!drag.active) {
      deck.setPointerCapture(event.pointerId);
      drag.active = true;
    }
    const b = board.getBoundingClientRect();
    const v = cameraView();
    const px = ((event.clientX-b.left)/camera.zoom+v.x)/cell-.5;
    const py = ((event.clientY-b.top)/camera.zoom+v.y)/cell-.5;
    const over = event.clientX >= b.left && event.clientX <= b.right && event.clientY >= b.top && event.clientY <= b.bottom;
    const options = over ? openDoors().map(door => ({ door, distance:Math.hypot(px-door.x,py-door.y) }))
      .filter(option => option.distance*cell*camera.zoom < Math.max(28,cell*camera.zoom*1.25))
      .sort((a,b) => a.distance-b.distance) : [];
    const next = options[0]?.door || null;
    const changed = next?.id !== drag.door?.id;
    if (!changed && next && drag.over === over) return;
    Object.assign(drag, { door:next, px, py, over });
    renderPreview();
    if (changed) renderPlacement();
  });

  function finishDrag(event) {
    if (drag?.id !== event.pointerId) return;
    const held = drag;
    const candidate = held.active ? preview() : null;
    drag = null;
    if (!held.active) return;
    dragHint = true;
    if (held.door && event.type === 'pointerup') {
      table.target = held.door.id;
      table.selected = held.door.room;
      place(candidate);
    }
    render();
    ensureVisible();
  }
  document.addEventListener('pointerup', finishDrag);
  document.addEventListener('pointercancel', finishDrag);

  render();
  fitMap();
  window.addEventListener('resize', updateCamera);
})();