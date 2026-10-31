/* Structural compatibility checks for every active content module. */
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
const hasAny = (tags, wanted = []) => wanted.some(tag => tags.includes(tag));
const fits = (content, room) =>
  (!content.requiresAny?.length || hasAny(room.tags, content.requiresAny)) &&
  !content.forbidsAny?.some(tag => room.tags.includes(tag));

for (const module of Object.values(window.GAME_MODULES)) {
  unique(module.rooms, `${module.id} Rooms`);
  unique(module.challenges, `${module.id} Challenges`);
  unique(module.monsters, `${module.id} Monsters`);
  unique(module.quests, `${module.id} Quests`);

  const loot = [...new Map(Object.values(module.sceneOpportunities).flat().map(card => [card.id,card])).values()];
  unique(loot, `${module.id} Loot`);

  for (const room of module.rooms) {
    assert(room.pack && room.name && room.builtAs && room.definition && room.readAloud, `${room.id} is missing authored Room fields`);
    assert(room.tags?.length, `${room.id} publishes no compatibility tags`);
    assert(room.map?.includes('E'), `${room.id} has no entrance glyph`);
    const mappedExits = [...room.map].filter(glyph => 'X?DU'.includes(glyph)).length;
    assert(mappedExits === room.exits, `${room.id} declares ${room.exits} exits but maps ${mappedExits}`);
  }

  for (const card of module.challenges) {
    assert(card.pack && card.kind && ['quest','loot'].includes(card.reward), `${card.id} has invalid ownership, kind, or reward`);
    assert(card.front && card.rule !== undefined && card.failure !== undefined, `${card.id} is missing Challenge text`);
    const rooms = module.rooms.filter(room => fits(card,room));
    assert(rooms.length, `${card.id} has no compatible Room`);
    for (const monsterId of card.monsterIds || []) {
      const monster = module.monsters.find(candidate => candidate.id === monsterId);
      assert(monster, `${card.id} references missing Monster ${monsterId}`);
      if (monster) for (const room of rooms) assert(fits(monster,room), `${card.id} can enter ${room.id}, but ${monsterId} cannot`);
    }
    if (card.monsterCount && !card.monsterIds?.length) {
      for (const room of rooms) {
        const candidates = module.monsters.filter(monster => !monster.questOnly && fits(monster,room) && (!card.monsterTagsAny?.length || hasAny(monster.tags,card.monsterTagsAny)));
        assert(candidates.length, `${card.id} has no Monster candidate in ${room.id}`);
      }
    }
  }

  for (const quest of module.quests) {
    assert(quest.pack && quest.objective && quest.profile && quest.heartAction, `${quest.id} is missing Quest contract fields`);
    assert(quest.elementCards?.length >= 3, `${quest.id} needs at least three concrete Quest elements`);
    for (const card of quest.elementCards || []) assert(card.title && card.prose && card.effect, `${quest.id} has an incomplete Quest element`);
    const heartRooms = module.rooms.filter(room => hasAny(room.tags,quest.heartRoomTagsAny));
    assert(heartRooms.length, `${quest.id} has no compatible Heart Room`);
    for (const monsterId of quest.defenderIds) {
      assert(module.monsters.some(monster => monster.id === monsterId), `${quest.id} references missing defender ${monsterId}`);
    }
    assert(heartRooms.some(room => quest.defenderIds.every(id => fits(module.monsters.find(monster => monster.id === id) || {},room))), `${quest.id} has no Heart Room compatible with all defenders`);
  }

  for (const card of loot) {
    assert(card.pack && ['Supply','Treasure'].includes(card.kind), `${card.id} has invalid Loot ownership or kind`);
    assert(card.effect && (card.item || card.gold), `${card.id} has no concrete Take effect`);
  }

  console.log(`${module.name}: ${module.rooms.length} Rooms, ${module.challenges.length} Challenges, ${module.monsters.length} Monsters, ${module.quests.length} Quests, ${loot.length} Loot cards`);
}

if (failures.length) {
  console.error(failures.map(message => `- ${message}`).join('\n'));
  process.exit(1);
}
console.log('All module contracts are satisfiable.');