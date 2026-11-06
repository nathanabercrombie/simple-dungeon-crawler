(() => {
  'use strict';

  const DATA = window.GAME_DATA;
  const STORAGE_KEY = 'delvekeeper.cardViewer.v1';
  const EXPECTED_CARD_COUNT = 219;
  const EDIT_FIELDS = ['title','kicker','frontText','rulesText','footer','notes'];
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[character]));
  const text = (...parts) => parts.flat().filter(Boolean).join('\n\n');
  const wordCount = value => (String(value || '').trim().match(/\S+/g) || []).length;
  const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved && typeof saved === 'object' ? { cards:saved.cards || {}, filters:saved.filters || {} } : { cards:{}, filters:{} };
    } catch (_error) {
      return { cards:{}, filters:{} };
    }
  }

  let state = loadState();
  let selectedId = null;
  let toastTimer = null;

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function monsterById(id) {
    return DATA.monsters.find(monster => monster.id === id);
  }

  function questForScene(scene) {
    return DATA.quests.find(quest => quest.heartSceneId === scene.id);
  }

  function encounterText(scene) {
    const encounter = scene.encounter || { mode:'none' };
    if (encounter.mode === 'random') return `Encounter\nFlip over ${encounter.count > 1 ? encounter.count : 'one'} Monster card${encounter.count > 1 ? 's' : ''}.`;
    const ids = [...(encounter.monsterIds || []), ...(encounter.printedMonsterIds || [])];
    if (!ids.length) return '';
    const entries = ids.map(id => monsterById(id)).filter(Boolean).map(monster => {
      const scale = monster.scale || {};
      return `${monster.name} — ${scale.count || monster.baseUnits || 1} creatures, ${scale.hpEach || monster.unitHp || 1} HP each. ${monster.behavior} ${monster.instinct}`;
    });
    return entries.length ? `Encounter\n${entries.join('\n')}` : '';
  }

  function rewardText(scene) {
    if (scene.reward === 'loot') return 'Reward\nOne Loot card.';
    if (scene.reward === 'quest') return 'Reward\nOne Quest card.';
    if (scene.reward === 'heart') return 'Objective\nComplete the Quest instruction on this card.';
    return '';
  }

  function sceneRules(scene) {
    return text(
      scene.feature && `${scene.feature.title}\n${scene.feature.text}`,
      scene.revelation && `Revelation\n${scene.revelation}`,
      scene.rule && `Resolution\n${scene.rule}`,
      scene.failure && `Failure\n${scene.failure}`,
      encounterText(scene),
      rewardText(scene)
    );
  }

  function monsterCard(monster, id, category, questName = '') {
    const scale = monster.scale || {};
    return {
      id, category, quest:questName, title:monster.name, kicker:questName ? `${questName} · Monster` : 'Monster',
      frontText:monster.behavior,
      rulesText:text(
        `Setup\n${scale.count || monster.baseUnits || 1} creatures · ${scale.hpEach || monster.unitHp || 1} HP each`,
        `Instinct\n${monster.instinct}`,
        `Wound\n${monster.wound}`
      ),
      footer:monster.pack || 'Classics Set', imageLabel:`Illustration — ${monster.name}`
    };
  }

  function buildManifest() {
    const cards = [];
    const allScenes = DATA.allScenes || [...DATA.scenes,...DATA.heartScenes];

    allScenes.forEach(scene => {
      const quest = questForScene(scene);
      const questName = quest?.name || '';
      cards.push({
        id:`scene-map:${scene.id}`, category:'Scene Map', quest:questName, title:scene.name,
        kicker:'Scene Map', frontText:'', rulesText:'',
        footer:scene.pack || 'Classics Set', imageType:'map', map:scene.map, lighting:scene.lighting
      });
      cards.push({
        id:`scene-script:${scene.id}`, category:'Scene Script', quest:questName, title:scene.name,
        kicker:questName ? `${questName} · Scene Script` : `Scene Script · ${scene.reward === 'quest' ? 'Quest reward' : 'Loot reward'}`,
        frontText:text(scene.readAloud, scene.front, scene.encounter?.mode === 'random' ? 'Flip over a Monster card.' : ''),
        rulesText:sceneRules(scene), footer:scene.pack || 'Classics Set', imageLabel:`Illustration — ${scene.name}`, script:true
      });
    });

    DATA.quests.forEach(quest => {
      const addedNames = quest.wanderingAdds.map(monsterById).filter(Boolean).map(monster => monster.name);
      const bossNames = quest.bossIds.map(monsterById).filter(Boolean).map(monster => monster.name);
      cards.push({
        id:`quest:${quest.id}`, category:'Quest', quest:quest.name, title:quest.name, kicker:'Quest · Mission',
        frontText:quest.objective,
        rulesText:text(
          addedNames.length && `Setup\nAdd ${addedNames.join(', ')} to the Monster deck.`,
          bossNames.length && `Set aside\n${bossNames.join(', ')}.`,
          `Heart\n${quest.heartAction}. Return to the entrance to complete the expedition.`
        ),
        footer:`${quest.name} Quest Pack`, imageLabel:`Illustration — ${quest.name}`
      });
      quest.elementCards.forEach((element, index) => cards.push({
        id:`quest-advantage:${quest.id}:${index + 1}`, category:'Quest Advantage', quest:quest.name,
        title:element.title, kicker:`${quest.name} · Advantage`, frontText:element.prose, rulesText:element.effect,
        footer:`${quest.name} Quest Pack`, imageLabel:`Illustration — ${element.title}`
      }));
    });

    DATA.randomMonsters.forEach(monster => cards.push(monsterCard(monster, `monster:base:${monster.id}`, 'Monster')));
    DATA.quests.forEach(quest => quest.wanderingAdds.forEach((monsterId, index) => {
      const monster = monsterById(monsterId);
      if (monster) cards.push(monsterCard(monster, `monster:quest:${quest.id}:${index + 1}:${monster.id}`, 'Quest Monster', quest.name));
    }));
    DATA.bosses.forEach(monster => {
      const quest = DATA.quests.find(candidate => candidate.bossIds.includes(monster.id));
      cards.push(monsterCard(monster, `boss:${monster.id}`, 'Boss Monster', quest?.name || ''));
    });

    DATA.gear.forEach((gear, index) => {
      const [name,attribute,passive,hands,techniqueName,techniqueRule,techniqueCost] = gear;
      cards.push({
        id:`gear:${slug(name)}:${index + 1}`, category:'Gear', quest:'', title:name, kicker:`${attribute} weapon · ${hands} hand${hands === 1 ? '' : 's'}`,
        frontText:passive, rulesText:`${techniqueName} · ${techniqueCost} Skill Token${techniqueCost === 1 ? '' : 's'}\n${techniqueRule}`,
        footer:'Core Set', imageLabel:`Illustration — ${name}`
      });
    });

    DATA.armor.forEach((armor, index) => cards.push({
      id:`armor:${slug(armor.name)}:${index + 1}`, category:'Armor', quest:'', title:armor.name,
      kicker:`${armor.primary} armor · ${armor.burden}`, frontText:armor.rule,
      rulesText:`Weak attribute\n${armor.weak}`, footer:'Core Set', imageLabel:`Illustration — ${armor.name}`
    }));

    DATA.pasts.forEach((past, index) => {
      const attributes = DATA.pastAttributes[past] || [];
      cards.push({
        id:`past:${slug(past)}:${index + 1}`, category:'Past', quest:'', title:past, kicker:'Adventurer Past',
        frontText:'Once per expedition, when this Past is directly relevant, spend 1 Skill Token to gain +2 on an appropriate check.',
        rulesText:attributes.length ? `Common attributes\n${attributes.join(' or ')}` : '', footer:'Core Set', imageLabel:`Illustration — ${past}`
      });
    });

    DATA.knacks.forEach((knack, index) => cards.push({
      id:`knack:${slug(knack.name)}:${index + 1}`, category:'Knack', quest:'', title:knack.name,
      kicker:`Knack · ${knack.cost} Skill Tokens`, frontText:knack.effect, rulesText:'', footer:'Core Set', imageLabel:`Illustration — ${knack.name}`
    }));

    const loot = [...new Map(Object.values(DATA.sceneOpportunities).flat().map(card => [card.id,card])).values()];
    loot.forEach((lootCard, index) => cards.push({
      id:`loot:${lootCard.id}:${index + 1}`, category:lootCard.kind, quest:'', title:lootCard.title,
      kicker:`Loot · ${lootCard.kind}`, frontText:lootCard.prose,
      rulesText:lootCard.item && DATA.itemRules[lootCard.item] ? DATA.itemRules[lootCard.item] : lootCard.effect,
      footer:lootCard.pack || 'Core Set', imageLabel:`Illustration — ${lootCard.title}`
    }));

    return cards.map((card, index) => ({ ...card, number:index + 1, notes:'' }));
  }

  const manifest = buildManifest();

  function overrideFor(card) {
    return state.cards[card.id] || {};
  }

  function currentCard(card) {
    const saved = overrideFor(card);
    return { ...card, ...(saved.edits || {}), trimmed:Boolean(saved.trimmed) };
  }

  function isEdited(card) {
    const edits = overrideFor(card).edits || {};
    return EDIT_FIELDS.some(field => Object.prototype.hasOwnProperty.call(edits,field) && edits[field] !== card[field]);
  }

  function cardWordCount(card) {
    return wordCount(`${card.frontText} ${card.rulesText}`);
  }

  function mapSvg(map, id) {
    const rows = String(map || '').split('\n');
    const width = Math.max(...rows.map(row => row.length));
    const size = 22;
    const safeId = `map-${slug(id)}`;
    let cells = '';
    rows.forEach((row,y) => {
      for (let x=0;x<width;x+=1) {
        const glyph = row[x] || ' ';
        const px = x * size, py = y * size;
        if (glyph === ' ' || glyph === '#') continue;
        const terrain = glyph === 'P' || glyph === '=' ? `url(#${safeId}-pit)` : glyph === 'B' ? `url(#${safeId}-balcony)` : glyph === '~' ? '#b9c2bd' : glyph === 'L' ? '#777' : '#eee9dc';
        cells += `<rect x="${px}" y="${py}" width="${size}" height="${size}" fill="${terrain}" stroke="#343128" stroke-width=".8"/>`;
        if (glyph === '=') cells += `<path d="M${px+3},${py+5}H${px+size-3} M${px+3},${py+11}H${px+size-3} M${px+3},${py+17}H${px+size-3}" stroke="#2c2921" stroke-width="1.4"/>`;
        else if (['E','X','?','D','U','+','C','F','G','M','T','O','R','^','v','|','-'].includes(glyph)) cells += `<text x="${px+size/2}" y="${py+size/2+4}" text-anchor="middle" font-family="system-ui" font-size="10" font-weight="800" fill="#242119">${esc(glyph)}</text>`;
      }
    });
    return `<svg viewBox="0 0 ${width*size} ${rows.length*size}" role="img" aria-label="Floorplan"><defs><pattern id="${safeId}-pit" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#ddd8ca"/><line x1="0" y1="0" x2="0" y2="7" stroke="#514c40"/></pattern><pattern id="${safeId}-balcony" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#d5cfbf"/><path d="M0 2H7 M0 5H7" stroke="#777063" stroke-width=".7"/></pattern></defs><rect width="100%" height="100%" fill="#171713"/>${cells}</svg>`;
  }

  function imageHtml(card) {
    if (card.imageType === 'map') return `<div class="card-image card-map-image">${mapSvg(card.map,card.id)}</div>`;
    return `<div class="card-image"><div class="card-image-placeholder">${esc(card.imageLabel || `Illustration — ${card.title}`)}</div></div>`;
  }

  function copyForFace(card) {
    const face = $('#face-filter').value;
    if (card.script && face === 'front') return { label:'Front', copy:card.frontText };
    if (card.script && face === 'response') return { label:'Response', copy:card.rulesText };
    return { label:'Rules', copy:text(card.frontText, card.rulesText) };
  }

  function renderCard(original) {
    const card = currentCard(original);
    const face = copyForFace(card);
    const words = wordCount(face.copy);
    const density = words > 115 ? 'is-very-long' : words > 78 ? 'is-long' : '';
    const wordClass = words > 115 ? 'too-long' : words > 78 ? 'long' : '';
    const mapOnly = card.imageType === 'map';
    return `<article class="card-wrap ${card.trimmed ? 'is-trimmed' : ''} ${isEdited(original) ? 'is-edited' : ''}" data-card-id="${esc(card.id)}">
      <div class="game-card ${card.imageType === 'map' ? 'card-map-layout' : ''}">
        <header class="card-topline"><h2>${esc(card.title)}</h2>${card.lighting ? `<span class="lighting-icon" title="${esc(card.lighting)}">${card.lighting === 'None' ? '○' : card.lighting === 'Inherent' ? '●' : '✦'}</span>` : ''}</header>
        ${imageHtml(card)}
        ${mapOnly ? '' : `<div class="type-line"><span>${esc(card.kicker)}</span><span>${esc(face.label)}</span></div><div class="card-copy ${density}">${esc(face.copy)}</div>`}
        <footer class="card-footer"><span>${esc(card.footer)}</span><span class="card-number">${card.number} / ${manifest.length}</span></footer>
      </div>
      <div class="card-tools"><span class="word-count ${wordClass}">${words} words${words > 115 ? ' · too long' : words > 78 ? ' · dense' : ''}</span><button type="button" data-action="edit">Edit</button><button type="button" data-action="trim">${card.trimmed ? 'Restore' : 'Trim'}</button></div>
    </article>`;
  }

  function filters() {
    return {
      search:$('#search-filter').value.trim().toLowerCase(), category:$('#category-filter').value,
      quest:$('#quest-filter').value, status:$('#status-filter').value, face:$('#face-filter').value
    };
  }

  function visibleCards() {
    const selected = filters();
    return manifest.filter(original => {
      const card = currentCard(original);
      const edited = isEdited(original);
      if (selected.category !== 'all' && card.category !== selected.category) return false;
      if (selected.quest === 'none' && card.quest) return false;
      if (selected.quest !== 'all' && selected.quest !== 'none' && card.quest !== selected.quest) return false;
      if (selected.status === 'included' && card.trimmed) return false;
      if (selected.status === 'trimmed' && !card.trimmed) return false;
      if (selected.status === 'edited' && !edited) return false;
      if (selected.search && !`${card.title} ${card.kicker} ${card.frontText} ${card.rulesText} ${card.notes}`.toLowerCase().includes(selected.search)) return false;
      return true;
    });
  }

  function renderSummary(visible) {
    const trimmed = manifest.filter(card => overrideFor(card).trimmed).length;
    const edited = manifest.filter(isEdited).length;
    $('#full-count').textContent = manifest.length;
    $('#included-count').textContent = manifest.length - trimmed;
    $('#trimmed-count').textContent = trimmed;
    $('#edited-count').textContent = edited;
    $('#visible-count').textContent = visible.length;
  }

  function renderGrid() {
    const visible = visibleCards();
    $('#card-grid').innerHTML = visible.map(renderCard).join('');
    $('#empty-state').classList.toggle('hidden',visible.length > 0);
    renderSummary(visible);
    state.filters = filters();
    persist();
  }

  function populateFilters() {
    const categories = [...new Set(manifest.map(card => card.category))];
    $('#category-filter').insertAdjacentHTML('beforeend',categories.map(category => `<option value="${esc(category)}">${esc(category)}</option>`).join(''));
    DATA.quests.forEach(quest => $('#quest-filter').insertAdjacentHTML('beforeend',`<option value="${esc(quest.name)}">${esc(quest.name)}</option>`));
    const saved = state.filters;
    ['search','category','quest','status','face'].forEach(name => {
      const element = $(`#${name}-filter`);
      if (element && saved[name] != null && [...(element.options || [])].some(option => option.value === saved[name]) || element?.tagName === 'INPUT') element.value = saved[name] ?? '';
    });
  }

  function toggleTrim(id) {
    const saved = state.cards[id] || {};
    state.cards[id] = { ...saved, trimmed:!saved.trimmed };
    persist();
    renderGrid();
    if (selectedId === id) renderEditor();
  }

  function renderEditor() {
    const original = manifest.find(card => card.id === selectedId);
    if (!original) return;
    const card = currentCard(original);
    $('#editor-category').textContent = `${card.category}${card.quest ? ` · ${card.quest}` : ''}`;
    $('#editor-heading').textContent = card.title;
    document.querySelectorAll('[data-edit-field]').forEach(input => { input.value = card[input.dataset.editField] || ''; });
    $('#editor-trim').textContent = card.trimmed ? 'Restore card' : 'Trim card';
    $('#editor-backdrop').classList.remove('hidden');
  }

  function openEditor(id) {
    selectedId = id;
    renderEditor();
  }

  function closeEditor() {
    selectedId = null;
    $('#editor-backdrop').classList.add('hidden');
  }

  function updateEdit(field,value) {
    const original = manifest.find(card => card.id === selectedId);
    if (!original) return;
    const saved = state.cards[selectedId] || {};
    const edits = { ...(saved.edits || {}) };
    if (value === String(original[field] || '')) delete edits[field]; else edits[field] = value;
    state.cards[selectedId] = { ...saved, edits };
    persist();
    renderGrid();
    $('#editor-heading').textContent = currentCard(original).title;
  }

  function resetSelected() {
    if (!selectedId) return;
    const saved = state.cards[selectedId] || {};
    delete saved.edits;
    state.cards[selectedId] = saved;
    persist();
    renderGrid();
    renderEditor();
    showToast('Card text reset to canonical copy.');
  }

  function csvCell(value) {
    return `"${String(value ?? '').replace(/"/g,'""')}"`;
  }

  function exportCsv() {
    const headers = ['id','included','trimmed','edited','category','quest','card_number','title','original_title','type_line','original_type_line','front_text','original_front_text','rules_text','original_rules_text','footer','original_footer','review_notes','original_word_count','current_word_count'];
    const rows = manifest.map(original => {
      const card = currentCard(original);
      return [card.id,!card.trimmed,card.trimmed,isEdited(original),card.category,card.quest,card.number,card.title,original.title,card.kicker,original.kicker,card.frontText,original.frontText,card.rulesText,original.rulesText,card.footer,original.footer,card.notes,cardWordCount(original),cardWordCount(card)];
    });
    const csv = [headers,...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob([`\ufeff${csv}`],{type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `delvekeeper-card-manifest-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url),1000);
    showToast(`Exported all ${manifest.length} cards.`);
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'),2200);
  }

  populateFilters();
  if (manifest.length !== EXPECTED_CARD_COUNT) {
    const warning = $('#manifest-warning');
    warning.textContent = `Manifest integrity warning: expected ${EXPECTED_CARD_COUNT} cards but generated ${manifest.length}. Export and print should wait until this is resolved.`;
    warning.classList.remove('hidden');
  }
  renderGrid();

  $('.filter-panel').addEventListener('input',renderGrid);
  $('.filter-panel').addEventListener('change',renderGrid);
  $('#card-grid').addEventListener('click',event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = button.closest('[data-card-id]').dataset.cardId;
    if (button.dataset.action === 'edit') openEditor(id);
    if (button.dataset.action === 'trim') toggleTrim(id);
  });
  $('#close-editor').addEventListener('click',closeEditor);
  $('#done-editor').addEventListener('click',closeEditor);
  $('#editor-backdrop').addEventListener('click',event => { if (event.target.id === 'editor-backdrop') closeEditor(); });
  $('#editor-trim').addEventListener('click',() => toggleTrim(selectedId));
  $('#reset-card').addEventListener('click',resetSelected);
  document.querySelectorAll('[data-edit-field]').forEach(input => input.addEventListener('input',event => updateEdit(event.target.dataset.editField,event.target.value)));
  $('#export-button').addEventListener('click',exportCsv);
  $('#print-button').addEventListener('click',() => window.print());
  document.addEventListener('keydown',event => { if (event.key === 'Escape' && selectedId) closeEditor(); });
})();