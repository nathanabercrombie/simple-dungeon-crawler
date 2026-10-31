/* Validate the physical-card-first Scene, random Monster, Boss, Quest, and Loot decks. */
'use strict';

global.window = {};
require('../web/data.js');

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const unique = (items, label) => {
  const seen = new Set();
  for (const item of items) {
    assert(item.id, `${label} has an entry without a stable id`);
    assert(!seen.has(item.id), `${label} repeats id ${item.id}`);
    seen.add(item.id);
  }
};

for (const module of Object.values(window.GAME_MODULES)) {
  unique(module.scenes, `${module.id} Scene deck`);
  unique(module.heartScenes, `${module.id} Quest Scenes`);
  unique(module.monsters, `${module.id} Monsters`);
  unique(module.quests, `${module.id} Quests`);

  const loot = [...new Map(Object.values(module.sceneOpportunities).flat().map(card => [card.id,card])).values()];
  unique(loot, `${module.id} Loot`);
  const monsterIds = new Set(module.monsters.map(monster => monster.id));

  for (const scene of module.allScenes) {
    assert(scene.pack && scene.name && scene.readAloud && scene.front, `${scene.id} is missing authored Scene fields`);
    assert(scene.map?.includes('E'), `${scene.id} has no entrance glyph`);
    const mappedExits = [...scene.map].filter(glyph => 'X?DU'.includes(glyph)).length;
    assert(mappedExits === scene.exits, `${scene.id} declares ${scene.exits} exits but maps ${mappedExits}`);
    assert(['none','printed','random','boss'].includes(scene.encounter?.mode), `${scene.id} has an invalid monster instruction`);
    assert(!('tags' in scene) && !('requiresAny' in scene) && !('forbidsAny' in scene), `${scene.id} still uses compatibility tags`);
    if (scene.encounter?.mode === 'printed' || scene.encounter?.mode === 'boss') {
      assert(scene.encounter.monsterIds?.length, `${scene.id} names no printed or Boss monster`);
      for (const id of scene.encounter.monsterIds || []) assert(monsterIds.has(id), `${scene.id} references missing Monster ${id}`);
      for (const id of scene.encounter.printedMonsterIds || []) assert(monsterIds.has(id), `${scene.id} references missing printed defender ${id}`);
      if (scene.encounter.mode === 'boss') {
        for (const id of scene.encounter.monsterIds) assert(module.bosses.some(monster => monster.id === id), `${scene.id} sets aside ordinary Monster ${id} as a Boss`);
        for (const id of scene.encounter.printedMonsterIds || []) assert(!module.bosses.some(monster => monster.id === id), `${scene.id} prints Boss ${id} inline`);
      }
    }
    if (scene.encounter?.mode === 'random') assert(scene.encounter.count > 0, `${scene.id} draws no random Monster`);
    assert(scene.reward === null || ['quest','loot','heart'].includes(scene.reward), `${scene.id} has invalid reward ${scene.reward}`);
  }

  assert(module.randomMonsters.length >= 8, `${module.id} needs a useful random Monster deck`);
  for (const monster of module.monsters) {
    assert(monster.pack && monster.name && monster.unitHp && monster.baseUnits && monster.instinct && monster.wound, `${monster.id} has an incomplete stat block`);
    assert(!('tags' in monster) && !('requiresAny' in monster), `${monster.id} still uses placement tags`);
  }

  for (const quest of module.quests) {
    assert(quest.objective && quest.heartAction && quest.heartSceneId, `${quest.id} is missing Quest setup fields`);
    assert(quest.elementCards?.length >= 3, `${quest.id} needs at least three Quest cards`);
    assert(module.heartScenes.some(scene => scene.id === quest.heartSceneId), `${quest.id} has no Heart Scene`);
    for (const id of quest.wanderingAdds || []) assert(module.randomMonsters.some(monster => monster.id === id), `${quest.id} adds ${id}, which is not in the random Monster deck`);
    for (const id of quest.defenderIds || []) assert(monsterIds.has(id), `${quest.id} references missing Boss or defender ${id}`);
  }

  for (const card of loot) {
    assert(card.pack && ['Supply','Treasure'].includes(card.kind), `${card.id} has invalid Loot ownership or kind`);
    assert(card.effect && (card.item || card.gold), `${card.id} has no concrete Take effect`);
  }

  const modes = Object.fromEntries(['none','printed','random','boss'].map(mode => [mode,module.allScenes.filter(scene => scene.encounter.mode === mode).length]));
  console.log(`${module.name}: ${module.scenes.length} shuffled Scenes + ${module.heartScenes.length} Quest Scenes; ${module.randomMonsters.length} random Monsters; ${module.bosses.length} Bosses; ${module.quests.length} Quests; ${loot.length} Loot cards`);
  console.log(`Monster instructions: ${modes.printed} printed, ${modes.random} random, ${modes.boss} Boss, ${modes.none} none.`);
}

if (failures.length) {
  console.error(failures.map(message => `- ${message}`).join('\n'));
  process.exit(1);
}
console.log('Every Scene is a self-contained physical card; no compatibility tags remain.');