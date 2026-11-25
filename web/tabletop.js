(() => {
  'use strict';

  const data = window.GAME_DATA;
  const saveKey = 'delvekeeper.cardTable.v2';
  const oldSaveKey = 'delvekeeper.cardTable.v1';
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
  const mini = { width:94, height:130, gap:12, x:deckPosition.x+2*width+88, y:34 };
  const characterDecks = new Map();
  const characterCards = new Map();
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

  function characterDeck(id,name,label,color,icon,entries) {
    const ids = entries.map(([key,title,lines]) => {
      const cardId = `core:character:${id}:${key}`;
      characterCards.set(cardId,{ title,lines,deck:id });
      return cardId;
    });
    characterDecks.set(id,{ name,label,color,icon,ids });
  }

  const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  characterDeck('weapon','Weapons',['Weapons'],'#663733','⚔',data.gear.map(([name,attribute,passive,hands,technique,rule,cost]) => [slug(name),name,[
    ['Primary',`${attribute} +3 · ${hands} ${hands === 1 ? 'hand' : 'hands'}`],['Weapon',passive],[`${technique} · ${cost} Skill ${cost === 1 ? 'Token' : 'Tokens'}`,rule]
  ]]));
  for (const attribute of ['Strength','Agility','Mind']) {
    characterDeck(`armor-${attribute.toLowerCase()}`,`Armor · ${attribute}`,['Armor',attribute],'#455567','⬟',data.armor.filter(armor => armor.primary === attribute).map(armor => [slug(armor.name),armor.name,[
      ['Primary',`${armor.primary} +3`],['Burden',`${armor.burden} · ${armor.weak} −2`],['Protection',armor.rule]
    ]]));
  }
  characterDeck('past','Pasts',['Pasts'],'#655236','✦',data.pasts.map(past => [slug(past),past,[
    ['Background',data.pastProse[past]],['Invoke','Spend 1 Skill Token to gain +2 on a check when this Past applies.']
  ]]));
  characterDeck('knack','Knacks',['Knacks'],'#523e58','✧',data.knacks.map(knack => [slug(knack.name),knack.name,[
    [`${knack.cost} Skill Tokens`,knack.effect]
  ]]));
  // The supply list includes physical copies of repeat items, with distinct card IDs.
  const supplies = [...new Map(Object.values(data.sceneOpportunities).flat().filter(card => card.kind === 'Supply').map(card => [card.id,card])).values()];
  characterDeck('supply','Supplies',['Supplies'],'#405c45','✚',supplies.map(supply => [supply.id,supply.title,[
    ['Supply',supply.prose],['Take',supply.effect],['Use',data.itemRules[supply.item]]
  ]]));

  const deckNodes = new Map([['scene',deck]]);
  const deckPositions = new Map([['scene',{ ...deckPosition,width,height }]]);
  for (const [id,def] of characterDecks) {
    const index = deckNodes.size-1;
    const pos = { x:mini.x+(index%4)*(mini.width+mini.gap), y:mini.y+Math.floor(index/4)*(mini.height+mini.gap), width:mini.width,height:mini.height };
    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'deck mini-deck';
    node.dataset.deck = id;
    node.title = `Drag or click to draw from ${def.name}`;
    node.style.cssText = `left:${pos.x}px;top:${pos.y}px;width:${pos.width}px;height:${pos.height}px`;
    $('#character-decks').append(node);
    deckNodes.set(id,node);
    deckPositions.set(id,pos);
  }
  const deckPicker = $('#draw-deck');
  deckPicker.append(new Option('Scenes','scene'));
  for (const [id,def] of characterDecks) deckPicker.append(new Option(def.name,id));

  const faces = { sleeve:['teaser'], map:['teaser','map'], script:['prose','reveal'], character:['back','front'] };
  const piece = (scene,kind,x,y,angle = 0,side = faces[kind][0]) => ({ id:`${scene}:${kind}`, scene,kind,x,y,angle,side });
  const characterPiece = (id,x,y) => ({ id,kind:'character',x,y,angle:0,side:'back' });
  const freshCharacterDecks = () => Object.fromEntries([...characterDecks].map(([id,def]) => [id,shuffled(def.ids)]));

  function pair(scene,x,y,angle,showMap = false,showReveal = false) {
    const radians = angle*Math.PI/180;
    return [piece(scene,'map',x,y,angle,showMap ? 'map' : 'teaser'),
      piece(scene,'script',x+Math.cos(radians)*(width+20),y+Math.sin(radians)*(width+20),angle,showReveal ? 'reveal' : 'prose')];
  }

  function freshTable() {
    return {
      deck:shuffled(data.scenes.slice(1).map(scene => scene.id)),
      characterDecks:freshCharacterDecks(),
      cards:[piece(entrance.id,'sleeve',deckPosition.x+width+48,52)]
    };
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(saveKey));
      if (Array.isArray(saved?.deck) && Array.isArray(saved.cards) &&
          saved.deck.every(id => scenes.has(id)) && saved.cards.every(card => card && [card.x,card.y,card.angle].every(Number.isFinite) &&
            faces[card.kind]?.includes(card.side) && (card.kind === 'character' ? characterCards.has(card.id) : scenes.has(card.scene) && card.id === `${card.scene}:${card.kind}`))) {
        const onFelt = new Set(saved.cards.map(card => card.id));
        saved.characterDecks = Object.fromEntries([...characterDecks].map(([id,def]) => {
          const available = def.ids.filter(cardId => !onFelt.has(cardId));
          const pile = saved.characterDecks?.[id];
          return [id,Array.isArray(pile) && new Set(pile).size === available.length && pile.length === available.length && pile.every(cardId => available.includes(cardId)) ? pile : shuffled(available)];
        }));
        return saved;
      }
      const old = JSON.parse(localStorage.getItem(oldSaveKey));
      if (Array.isArray(old?.deck) && Array.isArray(old.cards) && old.deck.every(id => scenes.has(id)) &&
          old.cards.every(card => scenes.has(card.id) && [card.x,card.y,card.angle].every(Number.isFinite) && ['back','front','response'].includes(card.side))) {
        return { deck:old.deck, characterDecks:freshCharacterDecks(), cards:old.cards.flatMap(card => card.side === 'back' ? [piece(card.id,'sleeve',card.x,card.y,card.angle)] : pair(card.id,card.x,card.y,card.angle,true,card.side === 'response')) };
      }
    } catch { /* Storage is optional. */ }
    return freshTable();
  }

  let table = load();
  let selected = null;
  let camera = { x:0, y:0, zoom:1 };
  let gesture = null;
  const touches = new Map();
  let pinching = false;
  let pinch = null;
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
  const pileFor = id => id === 'scene' ? table.deck : table.characterDecks[id];
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

  function characterBack(def,count) {
    return `<div class="face character-back" style="--deck-ink:${def.color}" aria-hidden="true"><span class="deck-kicker">Core set</span><span class="deck-icon">${def.icon}</span><span class="deck-label">${def.label.map(label => `<span>${label}</span>`).join('')}</span>${count === undefined ? '' : `<span class="deck-remaining">${count || 'Empty'}</span>`}</div>`;
  }

  function characterFace(card) {
    const item = characterCards.get(card.id);
    const def = characterDecks.get(item.deck);
    if (card.side === 'back') return characterBack(def);
    const dense = item.lines.reduce((length,[label,text]) => length+label.length+text.length,0) > 330;
    return `<div class="face paper character-face${dense ? ' dense' : ''}" style="--deck-ink:${def.color}"><span class="card-meta">${esc(def.name)}</span><h2 class="card-title">${esc(item.title)}</h2><dl class="character-rules">${item.lines.map(([label,text]) => `<dt>${esc(label)}</dt><dd>${esc(text)}</dd>`).join('')}</dl><footer class="card-footer"><span>Core set</span><span aria-hidden="true">${def.icon}</span></footer></div>`;
  }

  const terrain = { '#':'#6c5c46', '~':'#8eb3aa', P:'#443d38', L:'#b3673e', B:'#c4b394', '^':'#cfb88b', C:'#c8b48e' };
  const marks = { E:'↓', X:'·', '?':'?', O:'■', R:'◆', '=':'≡', '^':'⌃', B:'═', C:'▥', F:'▲', G:'⚙', M:'◇', T:'♜', '+':'+', '-':'—' };
  function exitEdge(rows,x,y) {
    const row = rows[y];
    if (y === 0) return 'north';
    if (y === rows.length-1) return 'south';
    return row.slice(0,x).trim() ? 'east' : 'west';
  }

  function mapTunnel(edge,glyph,x,y,square) {
    const horizontal = edge === 'west' || edge === 'east';
    const toStart = edge === 'west' || edge === 'north';
    const along = horizontal ? x : y;
    const cross = horizontal ? y : x;
    const start = toStart ? 0 : along+square-.5;
    const end = toStart ? along+.5 : horizontal ? width : height;
    const rect = horizontal ? [start,cross,end-start,square] : [cross,start,square,end-start];
    const sides = horizontal ? `M${start} ${cross}H${end}M${start} ${cross+square}H${end}` : `M${cross} ${start}V${end}M${cross+square} ${start}V${end}`;
    return `<rect class="${glyph === 'E' ? 'entrance' : 'exit'}-tunnel" data-edge="${edge}" x="${rect[0]}" y="${rect[1]}" width="${rect[2]}" height="${rect[3]}" fill="#e4cca0"/><path d="${sides}" fill="none" stroke="#6c5c46"/>`;
  }

  function floorplan(scene) {
    const rows = scene.map.split('\n');
    const cols = Math.max(...rows.map(row => row.length));
    const square = 19;
    const left = (width-cols*square)/2;
    const top = (height-rows.length*square)/2;
    const tunnels = [];
    const grid = rows.flatMap((row,y) => [...row].flatMap((glyph,x) => {
      if (glyph === ' ') return [];
      if ('EX?'.includes(glyph)) {
        // Entrance glyphs face south, including the recessed entrance of the shrine.
        const edge = glyph === 'E' ? 'south' : exitEdge(rows,x,y);
        tunnels.push(mapTunnel(edge,glyph,left+x*square,top+y*square,square));
      }
      const fill = terrain[glyph] || ((x+y)%2 ? '#e4cca0' : '#f0dcb6');
      const symbol = marks[glyph];
      return `<g transform="translate(${x*square} ${y*square})"><rect width="${square}" height="${square}" fill="${fill}" stroke="#493c30" stroke-opacity=".45" stroke-width=".65"/>${symbol ? `<text x="${square/2}" y="${square/2+3.5}" text-anchor="middle" font-size="12" font-weight="700" fill="#503923">${symbol}</text>` : ''}</g>`;
    })).join('');
    return `<svg class="card-map" viewBox="0 0 ${width} ${height}" role="img" aria-label="Scene floorplan"><g transform="translate(${left} ${top})">${grid}</g>${tunnels.join('')}</svg>`;
  }

  function encounterNote(scene) {
    const encounter = scene.encounter;
    if (encounter.mode === 'random') return `Draw ${encounter.count} random Monster ${encounter.count === 1 ? 'card' : 'cards'}.`;
    if (encounter.mode === 'printed') return encounter.monsterIds.map(id => data.monsters.find(monster => monster.id === id)?.name).filter(Boolean).join(', ');
    return '';
  }

  function face(card) {
    if (card.kind === 'character') return characterFace(card);
    const scene = scenes.get(card.scene);
    if (card.side === 'teaser') {
      return `<div class="face teaser-face"><span class="teaser-kicker">Classics · Scene</span><svg viewBox="0 0 80 100" width="72" height="90" aria-hidden="true"><path d="M40 2 77 50 40 98 3 50Z" fill="none" stroke="currentColor" opacity=".65"/><path d="M26 70V43a14 14 0 0 1 28 0v27M20 70h40m-27 0V43a7 7 0 0 1 14 0v27" fill="none" stroke="currentColor" stroke-width="2"/></svg><div class="teaser-copy"><p>${esc(scene.teaser)}</p><p class="teaser-cost">use 1 torch token to explore</p></div><span class="teaser-footer">${card.kind === 'sleeve' ? 'Sleeved pair' : 'Map on reverse'}</span></div>${card.kind === 'sleeve' ? '<button type="button" class="pull-tab" data-pull aria-label="Pull the cards out of the sleeve" title="Drag to pull out the prose card, or click to open">Pull cards <span aria-hidden="true">↗</span></button>' : ''}`;
    }
    const heading = `<h2 class="card-title">${esc(scene.name)}</h2>`;
    const footer = `<footer class="card-footer"><span>Classics · ${String(scene.index).padStart(2,'0')}</span><span>${esc(scene.lighting)}</span></footer>`;
    if (card.side === 'map') {
      return `<div class="face paper map-face"><span class="card-meta">Scene · Battlemap</span>${heading}${floorplan(scene)}${footer}</div>`;
    }
    const note = encounterNote(scene);
    if (card.side === 'reveal') {
      const entries = [['Revelation',scene.revelation],['Rule',scene.rule],['Failure',scene.failure],['Terrain',scene.feature?.text],['Monsters',note],['Reward',scene.reward === 'loot' ? 'Loot card' : scene.reward === 'quest' ? 'Quest card' : '']].filter(([,text]) => text);
      return `<div class="face paper response-face"><span class="card-meta">Scene · Reveal</span>${heading}<dl class="response-copy">${entries.map(([label,text]) => `<dt>${label}</dt><dd>${esc(text)}</dd>`).join('')}</dl>${footer}</div>`;
    }
    const visibleNote = !scene.revelation ? note : '';
    return `<div class="face paper prose-face"><span class="card-meta">Scene · Prose</span>${heading}<div class="card-copy"><p>${esc(scene.readAloud)}</p><p>${esc(scene.front)}</p>${visibleNote ? `<p class="encounter-note">${esc(visibleNote)}</p>` : ''}</div>${footer}</div>`;
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
    for (const [id,node] of deckNodes) {
      const count = pileFor(id).length;
      const def = characterDecks.get(id);
      if (node.dataset.count !== String(count)) {
        node.dataset.count = String(count);
        node.dataset.layers = count > 3 ? 'many' : count > 1 ? 'few' : count === 1 ? 'one' : 'empty';
        node.innerHTML = def ? characterBack(def,count) : count ? back : '<span class="deck-empty"><span aria-hidden="true">◇</span>Empty deck</span>';
      }
      node.setAttribute('aria-disabled',String(count === 0));
      node.setAttribute('aria-label',`${def?.name ?? 'Scene'} deck, ${count ? `${count} ${def ? 'cards' : 'sleeves'}. Draw the top ${def ? 'card' : 'sleeve'}` : 'empty'}`);
    }
    table.cards.forEach((card,index) => {
      let node = nodes.get(card.id);
      if (!node) {
        node = document.createElement('div');
        node.className = 'card';
        node.dataset.card = card.id;
        node.dataset.kind = card.kind;
        node.tabIndex = 0;
        node.setAttribute('role',card.kind === 'sleeve' ? 'group' : 'button');
        cards.append(node);
        nodes.set(card.id,node);
      }
      if (node.dataset.side !== card.side) {
        node.dataset.side = card.side;
        node.innerHTML = face(card);
        if (card.kind === 'character') {
          const item = characterCards.get(card.id);
          node.setAttribute('aria-label',card.side === 'back' ? `Face-down card from ${characterDecks.get(item.deck).name}` : item.title);
        } else {
          const scene = scenes.get(card.scene);
          node.setAttribute('aria-label', card.side === 'teaser' ? `${card.kind === 'sleeve' ? 'Scene sleeve' : 'Teaser'}: ${scene.teaser}. Use 1 torch token to explore.` : `${scene.name}, ${card.side === 'map' ? 'battlemap' : card.side}`);
        }
      }
      node.dataset.selected = String(card.id === selected);
      if (card.kind !== 'sleeve') node.setAttribute('aria-pressed', String(card.id === selected));
      node.classList.toggle('dragging', gesture?.card === card && gesture.moved);
      position(node,card,index);
    });
    const picked = selectedCard();
    $('#count').textContent = `${table.deck.length} Scene sleeves · ${table.cards.length} pieces on felt`;
    const count = pileFor(deckPicker.value).length;
    for (const action of ['flip','rotate','rotate-back','open','draw','shuffle','undo']) {
      const button = $(`[data-action="${action}"]`);
      if (action === 'undo') button.disabled = !undoStack.length;
      else if (action === 'draw' || action === 'shuffle') button.disabled = count < (action === 'shuffle' ? 2 : 1);
      else button.disabled = !picked || (action === 'open' && picked.kind !== 'sleeve') || (action === 'flip' && picked.kind === 'sleeve');
    }
  }

  function updateCamera() {
    world.style.transform = `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`;
  }

  function setZoom(zoom, x, y, anchorX = x, anchorY = y) {
    const ratio = zoom/camera.zoom;
    camera.x = x-(anchorX-camera.x)*ratio;
    camera.y = y-(anchorY-camera.y)*ratio;
    camera.zoom = zoom;
    updateCamera();
  }

  function zoomAt(factor, x = felt.clientWidth/2, y = felt.clientHeight/2) {
    setZoom(clamp(camera.zoom*factor,.26,2.8),x,y);
  }

  function fit() {
    const bounds = [...[...deckPositions.values()].map(({x,y,width:w,height:h}) => [x,y,x+w,y+h]), ...table.cards.map(({x,y,angle}) => {
      const radians = angle*Math.PI/180;
      const w = Math.abs(Math.cos(radians))*width + Math.abs(Math.sin(radians))*height;
      const h = Math.abs(Math.sin(radians))*width + Math.abs(Math.cos(radians))*height;
      return [x+(width-w)/2, y+(height-h)/2, x+(width+w)/2, y+(height+h)/2];
    })];
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

  function pull(pile,x,y) {
    const id = pileFor(pile).shift();
    if (!id) return null;
    const card = pile === 'scene' ? piece(id,'sleeve',x,y) : characterPiece(id,x,y);
    table.cards.push(card);
    selected = card.id;
    return card;
  }

  function announceDraw(pile) {
    message(pile === 'scene' ? 'Drew one Scene sleeve. Only the teaser is showing.' : `Drew one face-down card from ${characterDecks.get(pile).name}. Flip it to read it.`);
  }

  function openSleeve(sleeve, dragging = false) {
    const [map,script] = pair(sleeve.scene,sleeve.x,sleeve.y,sleeve.angle);
    table.cards = table.cards.filter(card => card !== sleeve).concat(map,script);
    if (dragging) Object.assign(script,{ x:sleeve.x, y:sleeve.y });
    selected = script.id;
    message('Sleeve opened. Flip the teaser for the battlemap, or the prose for the reveal.');
    return script;
  }

  function flip(card) {
    const [front,reverse] = faces[card.kind];
    if (!reverse) return;
    card.side = card.side === front ? reverse : front;
    message(`Card turned to its ${card.side === 'map' ? 'battlemap' : card.side} side.`);
  }

  function keepVisible(card) {
    const padding = 12;
    if (camera.x+(card.x+width)*camera.zoom > felt.clientWidth-padding || camera.x+card.x*camera.zoom < padding ||
        camera.y+(card.y+height)*camera.zoom > felt.clientHeight-padding || camera.y+card.y*camera.zoom < padding) fit();
  }

  function action(name,pile = deckPicker.value) {
    if (gesture || pinching) return;
    const card = selectedCard();
    if (name === 'fit') return fit();
    if (name === 'zoom-in' || name === 'zoom-out') return zoomAt(name === 'zoom-in' ? 1.2 : 1/1.2);
    if (name === 'draw' && pileFor(pile).length) {
      remember();
      const shift = (table.cards.length-1)%6;
      const x = (pile === 'scene' ? mini.x : mini.x+4*(mini.width+mini.gap)+20)+shift*17;
      const y = (pile === 'scene' ? mini.y+2*(mini.height+mini.gap)+24 : mini.y+6)+shift*22;
      keepVisible(pull(pile,x,y));
      announceDraw(pile);
    } else if (name === 'shuffle' && pileFor(pile).length > 1) {
      remember();
      const shuffledPile = shuffled(pileFor(pile));
      if (pile === 'scene') table.deck = shuffledPile;
      else table.characterDecks[pile] = shuffledPile;
      message(pile === 'scene' ? 'Shuffled the Scene sleeves.' : `Shuffled ${characterDecks.get(pile).name}.`);
    } else if (name === 'reset') {
      remember();
      table = freshTable();
      selected = null;
      fit();
      message('Started a fresh table. Undo to restore the previous one.');
    } else if (name === 'undo' && undoStack.length) {
      ({ table,selected } = undoStack.pop());
      message('Undid the last card action.');
    } else if (card?.kind === 'sleeve' && name === 'open') {
      remember();
      keepVisible(openSleeve(card));
    } else if (card && ['flip','rotate','rotate-back'].includes(name)) {
      if (name === 'flip' && card.kind === 'sleeve') return;
      remember();
      if (name === 'flip') flip(card);
      else card.angle = (card.angle + (name === 'rotate' ? 90 : 270))%360;
    } else return;
    lastTap = null;
    render();
    if (name === 'open') nodes.get(selected)?.focus({ preventScroll:true });
    save();
  }

  function pinchPoints() {
    const [a,b] = touches.values();
    if (!b) return null;
    const rect = felt.getBoundingClientRect();
    return { x:(a.x+b.x)/2-rect.left, y:(a.y+b.y)/2-rect.top, distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)) };
  }

  function startTouch(event) {
    touches.set(event.pointerId,{ x:event.clientX, y:event.clientY });
    felt.setPointerCapture(event.pointerId);
    if (touches.size < 2) return;
    if (!pinching) {
      pinching = true;
      // Roll back any card move, draw, or sleeve pull that began before the second finger landed.
      if (gesture?.moved && gesture.before) ({ table,selected } = gesture.before);
      gesture = null;
      lastTap = null;
      felt.classList.remove('panning');
      render();
    }
    pinch = pinchPoints();
  }

  function cardPointer(event) {
    if (event.pointerType === 'touch') {
      startTouch(event);
      if (pinching) return;
    }
    if (gesture || !event.isPrimary || (event.button !== 0 && event.button !== 1)) return;
    const cardNode = event.target.closest('[data-card]');
    const card = table.cards.find(piece => piece.id === cardNode?.dataset.card);
    const fromDeck = event.target.closest('[data-deck]');
    const fromTab = card?.kind === 'sleeve' && event.target.closest('[data-pull]');
    const pile = fromDeck?.dataset.deck;
    const kind = event.button === 1 ? 'pan' : pile && pileFor(pile).length ? 'deck' : fromTab ? 'tab' : card && card.id === selected ? 'card' : 'pan';
    gesture = { kind, pile, id:event.pointerId, x:event.clientX, y:event.clientY, moved:false, card, tap: event.button === 0 };
    if (kind === 'pan') Object.assign(gesture,{ originX:camera.x, originY:camera.y });
    else {
      let origin = card;
      if (kind === 'deck') {
        const pos = deckPositions.get(pile);
        const rect = fromDeck.getBoundingClientRect();
        origin = { x:pos.x+(event.clientX-rect.left)/camera.zoom*(1-width/pos.width), y:pos.y+(event.clientY-rect.top)/camera.zoom*(1-height/pos.height) };
      }
      Object.assign(gesture,{ originX:origin.x, originY:origin.y, before:snapshot() });
    }
    felt.setPointerCapture(event.pointerId);
    if (event.button === 1) event.preventDefault();
  }

  function movePointer(event) {
    if (touches.has(event.pointerId)) {
      touches.set(event.pointerId,{ x:event.clientX, y:event.clientY });
      if (pinching) {
        const next = pinchPoints();
        if (pinch && next) setZoom(clamp(camera.zoom*next.distance/pinch.distance,.26,2.8),next.x,next.y,pinch.x,pinch.y);
        pinch = next;
        return;
      }
    }
    const g = gesture;
    if (g?.id !== event.pointerId) return;
    const dx = event.clientX-g.x;
    const dy = event.clientY-g.y;
    if (!g.moved) {
      if (Math.hypot(dx,dy) < 5) return;
      g.moved = true;
      lastTap = null;
      if (g.kind === 'pan') felt.classList.add('panning');
      else if (g.kind === 'deck') {
        g.card = pull(g.pile,g.originX,g.originY);
        deckPicker.value = g.pile;
      }
      else if (g.kind === 'tab') g.card = openSleeve(g.card,true);
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
    if (touches.delete(event.pointerId) && pinching) {
      // A finger left on the table after a pinch must not turn into a new drag or tap.
      pinching = touches.size > 0;
      pinch = pinchPoints();
      return;
    }
    const g = gesture;
    if (g?.id !== event.pointerId) return;
    gesture = null;
    felt.classList.remove('panning');
    if (event.type !== 'pointerup') {
      if (g.moved && g.before) ({ table,selected } = g.before);
    } else if (g.kind === 'pan') {
      if (!g.moved && g.tap && g.card) tapCard(g.card,event);
      else {
        if (!g.moved && g.tap) selected = null;
        lastTap = null;
      }
    } else if (g.moved) {
      remember(g.before);
      if (g.kind === 'deck') announceDraw(g.pile);
    } else if (g.kind === 'deck') {
      deckPicker.value = g.pile;
      action('draw',g.pile);
      return;
    } else if (g.kind === 'tab') {
      selected = g.card.id;
      action('open');
      return;
    } else if (g.card) {
      tapCard(g.card,event);
    }
    render();
    save();
  }

  function tapCard(card,event) {
    selected = card.id;
    const now = event.timeStamp;
    if (lastTap?.id === selected && now-lastTap.time < 400 && Math.hypot(event.clientX-lastTap.x,event.clientY-lastTap.y) < 18) {
      action(card.kind === 'sleeve' ? 'open' : 'flip');
    } else lastTap = { id:selected,time:now,x:event.clientX,y:event.clientY };
  }

  felt.addEventListener('pointerdown',cardPointer);
  felt.addEventListener('pointermove',movePointer);
  felt.addEventListener('pointerup',endPointer);
  felt.addEventListener('pointercancel',endPointer);
  felt.addEventListener('lostpointercapture',endPointer);

  felt.addEventListener('wheel', event => {
    event.preventDefault();
    if (gesture || pinching) return;
    const rect = felt.getBoundingClientRect();
    zoomAt(Math.exp(-event.deltaY*.0018),event.clientX-rect.left,event.clientY-rect.top);
  },{ passive:false });

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (button && !button.disabled) action(button.dataset.action);
    const pile = event.target.closest('[data-deck]')?.dataset.deck;
    if (pile && event.detail === 0) {
      deckPicker.value = pile;
      action('draw',pile);
    }
    const tab = event.target.closest('[data-pull]');
    if (tab && event.detail === 0) {
      selected = tab.closest('[data-card]').dataset.card;
      action('open');
    }
  });

  deckPicker.addEventListener('change',render);

  document.addEventListener('focusin', event => {
    if (gesture || pinching || !event.target.dataset.card) return;
    selected = event.target.dataset.card;
    render();
  });

  document.addEventListener('keydown', event => {
    if (event.altKey || gesture || pinching || event.target === deckPicker) return;
    const key = event.key.toLowerCase();
    const card = selectedCard();
    const onCard = event.target.dataset.card === selected;
    let command = null;
    if (key === 'z' && (event.ctrlKey || event.metaKey)) command = 'undo';
    else if (event.ctrlKey || event.metaKey) return;
    else if (onCard && (key === ' ' || key === 'enter')) command = card.kind === 'sleeve' ? 'open' : 'flip';
    else if (key === 'f') command = 'flip';
    else if (key === 'e') command = 'open';
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