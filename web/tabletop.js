(() => {
  'use strict';

  const data = window.GAME_DATA;
  const saveKey = 'delvekeeper.cardTable.v1';
  const scenes = new Map(data.scenes.map(scene => [scene.id, scene]));
  const entrance = data.scenes[0];
  const $ = selector => document.querySelector(selector);
  const felt = $('#felt');
  const world = $('#world');
  const deck = $('#deck');
  const cards = $('#cards');
  const width = deck.offsetWidth;
  const height = deck.offsetHeight;
  const deckPosition = { x:32, y:34 };
  const nodes = new Map();
  const undoStack = [];
  const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));
  const copy = value => JSON.parse(JSON.stringify(value));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));

  function shuffled(ids) {
    const result = [...ids];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function freshTable() {
    return {
      deck:shuffled(data.scenes.slice(1).map(scene => scene.id)),
      cards:[{ id:entrance.id, x:deckPosition.x+width+48, y:52, angle:0, side:'front' }]
    };
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(saveKey));
      if (Array.isArray(saved?.deck) && Array.isArray(saved.cards) &&
          saved.deck.every(id => scenes.has(id)) && saved.cards.every(card => scenes.has(card.id) &&
            [card.x,card.y,card.angle].every(Number.isFinite) && ['back','front','response'].includes(card.side))) return saved;
    } catch { /* Storage is optional. */ }
    return freshTable();
  }

  let table = load();
  let selected = null;
  let camera = { x:0, y:0, zoom:1 };
  let gesture = null;
  let lastTap = null;

  function save() {
    try { localStorage.setItem(saveKey, JSON.stringify(table)); }
    catch { /* Keep playing without persistence. */ }
  }

  function snapshot() { return { table:copy(table), selected }; }

  function remember(before = snapshot()) {
    undoStack.push(before);
    if (undoStack.length > 24) undoStack.shift();
  }

  const selectedCard = () => table.cards.find(card => card.id === selected);
  const message = text => { $('#status').textContent = text; };

  const back = `<div class="face back" aria-hidden="true"><svg viewBox="0 0 200 287" fill="none">
    <rect x="4" y="4" width="192" height="279" rx="10" stroke="currentColor"/>
    <rect x="10" y="10" width="180" height="267" rx="7" stroke="currentColor" opacity=".55"/>
    <path d="M16 40V18h22m124 0h22v22M16 247v22h22m124 0h22v-22M72 47h56M72 240h56M100 37v20m0 173v20" stroke="currentColor" opacity=".8"/>
    <path d="M100 65l65 79-65 79-65-79zM100 75l56 69-56 69-56-69z" stroke="currentColor"/>
    <path d="M70 171v-41a30 30 0 0 1 60 0v41m-68 0h76m-56 0v-41a18 18 0 0 1 36 0v41m-33 8h30m-26 7h22" stroke="currentColor" stroke-width="2"/>
    <path d="M68 143h14m36 0h14m-62 13h12m36 0h12m-55-44 10 6m30 0 10-6" stroke="currentColor" opacity=".7"/>
    <g fill="currentColor" font-family="Georgia,serif" text-anchor="middle"><text x="100" y="29" font-size="11" letter-spacing="3">DELVEKEEPER</text><text x="100" y="263" font-size="10" letter-spacing="3">CLASSICS · SCENE</text></g>
  </svg></div>`;

  const terrain = { '#':'#6c5c46', '~':'#8eb3aa', P:'#443d38', L:'#b3673e', B:'#c4b394', '^':'#cfb88b', C:'#c8b48e' };
  const marks = { E:'↓', X:'·', '?':'?', O:'■', R:'◆', '=':'≡', '^':'⌃', B:'═', C:'▥', F:'▲', G:'⚙', M:'◇', T:'♜', '+':'+', '-':'—' };
  const mapSize = { x:Math.max(...data.scenes.flatMap(scene => scene.map.split('\n').map(row => row.length))), y:Math.max(...data.scenes.map(scene => scene.map.split('\n').length)) };

  function floorplan(scene) {
    const rows = scene.map.split('\n');
    const cols = Math.max(...rows.map(row => row.length));
    const grid = rows.flatMap((row,y) => [...row].flatMap((glyph,x) => {
      if (glyph === ' ') return [];
      const fill = terrain[glyph] || ((x+y)%2 ? '#e4cca0' : '#f0dcb6');
      const symbol = marks[glyph];
      return `<g transform="translate(${x*14} ${y*14})"><rect width="14" height="14" fill="${fill}" stroke="#493c30" stroke-opacity=".45" stroke-width=".65"/>${symbol ? `<text x="7" y="10.8" text-anchor="middle" font-size="10" font-weight="700" fill="#503923">${symbol}</text>` : ''}</g>`;
    })).join('');
    return `<div class="card-map"><svg viewBox="0 0 ${mapSize.x*14+8} ${mapSize.y*14+8}" role="img" aria-label="Scene floorplan"><g transform="translate(${(mapSize.x-cols)*7+4} ${(mapSize.y-rows.length)*7+4})">${grid}</g></svg></div>`;
  }

  function encounterNote(scene) {
    const encounter = scene.encounter;
    if (encounter.mode === 'random') return `Draw ${encounter.count} random Monster ${encounter.count === 1 ? 'card' : 'cards'}.`;
    if (encounter.mode === 'printed') return encounter.monsterIds.map(id => data.monsters.find(monster => monster.id === id)?.name).filter(Boolean).join(', ');
    return '';
  }

  function face(card) {
    if (card.side === 'back') return back;
    const scene = scenes.get(card.id);
    const heading = `<h2 class="card-title">${esc(scene.name)}</h2>`;
    const footer = `<footer class="card-footer"><span>Classics · ${String(scene.index).padStart(2,'0')}</span><span>${esc(scene.lighting)}</span></footer>`;
    const note = encounterNote(scene);
    if (card.side === 'response') {
      const entries = [['Revelation',scene.revelation],['Rule',scene.rule],['Failure',scene.failure],['Terrain',scene.feature?.text],['Monsters',note],['Reward',scene.reward === 'loot' ? 'Loot card' : scene.reward === 'quest' ? 'Quest card' : '']].filter(([,text]) => text);
      return `<div class="face paper response-face"><span class="card-meta">Scene · Response</span>${heading}<dl class="response-copy">${entries.map(([label,text]) => `<dt>${label}</dt><dd>${esc(text)}</dd>`).join('')}</dl>${footer}</div>`;
    }
    const visibleNote = !scene.revelation ? note : '';
    const dense = scene.readAloud.length+scene.front.length+visibleNote.length > 245;
    return `<div class="face paper${dense ? ' dense' : ''}"><span class="card-meta">Scene · ${esc(scene.builtAs)}</span>${heading}${floorplan(scene)}<div class="card-copy"><p>${esc(scene.readAloud)}</p><p>${esc(scene.front)}</p>${visibleNote ? `<p class="encounter-note">${esc(visibleNote)}</p>` : ''}</div>${footer}</div>`;
  }

  function position(node, card, index) {
    node.style.left = `${card.x}px`;
    node.style.top = `${card.y}px`;
    node.style.transform = `rotate(${card.angle}deg)`;
    node.style.zIndex = String(index+1);
  }

  function render() {
    const present = new Set(table.cards.map(card => card.id));
    for (const [id,node] of nodes) {
      if (present.has(id)) continue;
      node.remove();
      nodes.delete(id);
    }
    const count = table.deck.length;
    const layers = count > 3 ? 'many' : count > 1 ? 'few' : count === 1 ? 'one' : 'empty';
    if (deck.dataset.layers !== layers) {
      deck.dataset.layers = layers;
      deck.innerHTML = count ? back : '<span class="deck-empty"><span aria-hidden="true">◇</span>Empty deck</span>';
    }
    deck.setAttribute('aria-disabled', String(count === 0));
    deck.setAttribute('aria-label', count ? `Scene deck, ${count} cards. Draw the top card` : 'Scene deck is empty');
    table.cards.forEach((card,index) => {
      let node = nodes.get(card.id);
      if (!node) {
        node = document.createElement('div');
        node.className = 'card';
        node.dataset.card = card.id;
        node.tabIndex = 0;
        node.setAttribute('role','button');
        cards.append(node);
        nodes.set(card.id,node);
      }
      if (node.dataset.side !== card.side) {
        node.dataset.side = card.side;
        node.innerHTML = face(card);
        node.setAttribute('aria-label', card.side === 'back' ? 'Face-down Scene card' : `${scenes.get(card.id).name}, ${card.side === 'response' ? 'Response' : 'front'}`);
      }
      node.setAttribute('aria-pressed', String(card.id === selected));
      node.classList.toggle('dragging', gesture?.card === card && gesture.moved);
      position(node,card,index);
    });
    $('#count').textContent = `${count} in deck · ${table.cards.length} on felt`;
    for (const action of ['flip','rotate','rotate-back','response','draw','shuffle','undo']) {
      const button = $(`[data-action="${action}"]`);
      if (action === 'undo') button.disabled = !undoStack.length;
      else if (action === 'draw' || action === 'shuffle') button.disabled = count < (action === 'shuffle' ? 2 : 1);
      else button.disabled = !selectedCard() || (action === 'response' && selectedCard().side === 'back');
    }
    $('[data-action="response"]').textContent = selectedCard()?.side === 'response' ? 'Front' : 'Response';
  }

  function updateCamera() {
    world.style.transform = `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`;
  }

  function zoomAt(factor, x = felt.clientWidth/2, y = felt.clientHeight/2) {
    const zoom = clamp(camera.zoom*factor,.26,2.8);
    const ratio = zoom/camera.zoom;
    camera.x = x-(x-camera.x)*ratio;
    camera.y = y-(y-camera.y)*ratio;
    camera.zoom = zoom;
    updateCamera();
  }

  function fit() {
    const bounds = [{ ...deckPosition, angle:0 }, ...table.cards].map(({x,y,angle}) => {
      const radians = angle*Math.PI/180;
      const w = Math.abs(Math.cos(radians))*width + Math.abs(Math.sin(radians))*height;
      const h = Math.abs(Math.sin(radians))*width + Math.abs(Math.cos(radians))*height;
      return [x+(width-w)/2, y+(height-h)/2, x+(width+w)/2, y+(height+h)/2];
    });
    const x0 = Math.min(...bounds.map(rect => rect[0]));
    const y0 = Math.min(...bounds.map(rect => rect[1]));
    const w = Math.max(...bounds.map(rect => rect[2]))-x0;
    const h = Math.max(...bounds.map(rect => rect[3]))-y0;
    const zoom = clamp(Math.min((felt.clientWidth-40)/w,(felt.clientHeight-34)/h,1),.26,1);
    camera = { x:Math.max(12,(felt.clientWidth-w*zoom)*.32)-x0*zoom, y:Math.max(12,(felt.clientHeight-h*zoom)*.25)-y0*zoom, zoom };
    updateCamera();
  }

  function lift(card) {
    table.cards = table.cards.filter(piece => piece !== card).concat(card);
    selected = card.id;
  }

  function pull(x,y) {
    const id = table.deck.shift();
    if (!id) return null;
    const card = { id,x,y,angle:0,side:'back' };
    table.cards.push(card);
    selected = id;
    return card;
  }

  function flip(card) {
    card.side = card.side === 'back' ? 'front' : 'back';
    message(card.side === 'back' ? 'Card turned face down.' : `${scenes.get(card.id).name} turned face up.`);
  }

  function action(name) {
    if (gesture) return;
    const card = selectedCard();
    if (name === 'fit') return fit();
    if (name === 'zoom-in' || name === 'zoom-out') return zoomAt(name === 'zoom-in' ? 1.2 : 1/1.2);
    if (name === 'draw' && table.deck.length) {
      remember();
      const shift = (table.cards.length-1)%6;
      const x = deckPosition.x+width+28+shift*17;
      const y = deckPosition.y+12+shift*22;
      pull(x,y);
      if (camera.x+(x+width)*camera.zoom > felt.clientWidth || camera.x+x*camera.zoom < 0 || camera.y+(y+height)*camera.zoom > felt.clientHeight || camera.y+y*camera.zoom < 0) fit();
      message('Drew one face-down Scene.');
    } else if (name === 'shuffle' && table.deck.length > 1) {
      remember();
      table.deck = shuffled(table.deck);
      message('Shuffled the face-down deck.');
    } else if (name === 'reset') {
      remember();
      table = freshTable();
      selected = null;
      fit();
      message('Started a fresh table. Undo to restore the previous one.');
    } else if (name === 'undo' && undoStack.length) {
      ({ table,selected } = undoStack.pop());
      message('Undid the last card action.');
    } else if (card && ['flip','rotate','rotate-back','response'].includes(name)) {
      if (name === 'response' && card.side === 'back') return;
      remember();
      if (name === 'flip') flip(card);
      else if (name === 'response') card.side = card.side === 'front' ? 'response' : 'front';
      else card.angle = (card.angle + (name === 'rotate' ? 15 : 345))%360;
    } else return;
    lastTap = null;
    render();
    save();
  }

  function cardPointer(event) {
    if (gesture || !event.isPrimary || (event.button !== 0 && event.button !== 1)) return;
    const cardNode = event.target.closest('[data-card]');
    const card = table.cards.find(piece => piece.id === cardNode?.dataset.card);
    const fromDeck = event.target.closest('#deck');
    if (event.button === 0 && fromDeck && !table.deck.length) return;
    const kind = event.button === 1 ? 'pan' : fromDeck ? 'deck' : card ? 'card' : 'pan';
    gesture = { kind, id:event.pointerId, x:event.clientX, y:event.clientY, moved:false, card:kind === 'card' ? card : null };
    if (kind === 'pan') Object.assign(gesture,{ originX:camera.x, originY:camera.y });
    else {
      const origin = kind === 'card' ? card : deckPosition;
      Object.assign(gesture,{ originX:origin.x, originY:origin.y, before:snapshot() });
    }
    felt.setPointerCapture(event.pointerId);
    if (event.button === 1) event.preventDefault();
  }

  function movePointer(event) {
    const g = gesture;
    if (g?.id !== event.pointerId) return;
    const dx = event.clientX-g.x;
    const dy = event.clientY-g.y;
    if (!g.moved) {
      if (Math.hypot(dx,dy) < 5) return;
      g.moved = true;
      lastTap = null;
      if (g.kind === 'pan') felt.classList.add('panning');
      else if (g.kind === 'deck') g.card = pull(g.originX,g.originY);
      else lift(g.card);
      render();
    }
    if (g.kind === 'pan') {
      camera.x = g.originX+dx;
      camera.y = g.originY+dy;
      updateCamera();
    } else if (g.card) {
      g.card.x = g.originX+dx/camera.zoom;
      g.card.y = g.originY+dy/camera.zoom;
      position(nodes.get(g.card.id),g.card,table.cards.length-1);
    }
  }

  function endPointer(event) {
    const g = gesture;
    if (g?.id !== event.pointerId) return;
    gesture = null;
    felt.classList.remove('panning');
    if (event.type !== 'pointerup') {
      if (g.moved && g.before) ({ table,selected } = g.before);
    } else if (g.kind === 'pan') {
      if (!g.moved) selected = null;
      lastTap = null;
    } else if (g.moved) {
      remember(g.before);
      if (g.kind === 'deck') message('Drew one face-down Scene.');
    } else if (g.kind === 'deck') {
      action('draw');
      return;
    } else if (g.card) {
      selected = g.card.id;
      const now = event.timeStamp;
      if (lastTap?.id === selected && now-lastTap.time < 400 && Math.hypot(event.clientX-lastTap.x,event.clientY-lastTap.y) < 18) {
        remember(g.before);
        flip(g.card);
        lastTap = null;
      } else lastTap = { id:selected,time:now,x:event.clientX,y:event.clientY };
    }
    render();
    save();
  }

  felt.addEventListener('pointerdown',cardPointer);
  felt.addEventListener('pointermove',movePointer);
  felt.addEventListener('pointerup',endPointer);
  felt.addEventListener('pointercancel',endPointer);
  felt.addEventListener('lostpointercapture',endPointer);

  felt.addEventListener('wheel', event => {
    event.preventDefault();
    if (gesture) return;
    const rect = felt.getBoundingClientRect();
    zoomAt(Math.exp(-event.deltaY*.0018),event.clientX-rect.left,event.clientY-rect.top);
  },{ passive:false });

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (button && !button.disabled) action(button.dataset.action);
    if (event.target.closest('#deck') && event.detail === 0) action('draw');
  });

  document.addEventListener('focusin', event => {
    if (gesture || !event.target.dataset.card) return;
    selected = event.target.dataset.card;
    render();
  });

  document.addEventListener('keydown', event => {
    if (event.altKey || gesture) return;
    const key = event.key.toLowerCase();
    const card = selectedCard();
    const onCard = event.target.dataset.card === selected;
    let command = null;
    if (key === 'z' && (event.ctrlKey || event.metaKey)) command = 'undo';
    else if (event.ctrlKey || event.metaKey) return;
    else if (key === 'f' || (onCard && (key === ' ' || key === 'enter'))) command = 'flip';
    else if (key === 'r') command = event.shiftKey ? 'rotate-back' : 'rotate';
    else if (onCard && card && ['arrowleft','arrowright','arrowup','arrowdown'].includes(key)) {
      event.preventDefault();
      if (!event.repeat) remember();
      const step = event.shiftKey ? 24 : 6;
      lift(card);
      card.x += key === 'arrowleft' ? -step : key === 'arrowright' ? step : 0;
      card.y += key === 'arrowup' ? -step : key === 'arrowdown' ? step : 0;
      render();
      save();
      return;
    }
    if (!command || event.repeat) return;
    event.preventDefault();
    action(command);
  });

  render();
  fit();
  save();
  window.addEventListener('resize',fit);
})();