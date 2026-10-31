# Physical card sets

The web app follows the same deck operations as the physical game. It does not assemble Rooms and Challenges through hidden compatibility rules.

## Decks

### Scene deck

Set the Entrance Scene on top, then shuffle the remaining Scene cards. Every Scene supplies the complete place and situation:

- its floorplan, entrance, exits, scale, and orientation;
- visible architecture, lighting, and persistent terrain;
- read-aloud prose;
- its immediate obstacle, encounter, puzzle, opportunity, or quiet discovery;
- one exact Monster instruction;
- its hidden Response and consequence;
- at most one Quest or Loot reward.

A Scene can begin conquered. An armory, medicinal grotto, abandoned camp, or similarly useful place can provide an opportunity without inventing an obstacle merely to award conquest.

### Random Monster deck

Random Monster cards are creatures that can function in essentially any Scene. A monster-agnostic Scene can say “draw one random Monster,” then modify that result: sleeping, trapped, feeding, guarding treasure, hidden, or arriving through an exit.

No compatibility tags are used. Every random-monster Scene must make sense with every card permitted in the random Monster deck.

### Monsters printed on Scenes

If creature identity defines the situation, its compact stat block is printed directly on the Scene. Goblin Tollhouse, Goblin Crossfire Gallery, Skeleton Watch Crypt, and The Ogre’s Larder do not ask players to search another deck for ordinary occupants.

The app creates HP trackers for these creatures, but labels them **Printed on Scene**. That tracker is not another physical draw.

### Boss pile

Named or mechanically important Quest defenders can be set aside during setup. A Quest finale Scene names the Boss cards to place. Securing the objective does not automatically remove surviving Bosses or conquer the Scene.

### Quest packs

A selected Quest pack can contain:

- the mission and concrete Quest cards;
- one authored finale Scene inserted into the Scene deck;
- set-aside Boss cards;
- additional copies of ordinary creatures shuffled into the random Monster deck.

For example, **Break the Goblin Warband** adds extra goblin patrols to the random Monster deck and inserts Redcap Rusk’s Command Den as its finale Scene.

### Loot deck

Loot is always Supply or Treasure. Scene rewards and successful searches draw from the same Loot deck. A Scene reward is automatic after conquest; searching remains a separate Light-cost gamble.

## Three Monster instructions

Every Scene uses exactly one primary Monster instruction:

1. **Printed:** use the compact stat blocks on this Scene.
2. **Random:** draw from the shuffled random Monster deck.
3. **Boss:** place named cards from the set-aside Boss pile.
4. **None:** the Scene begins without a monster.

Ordinary Scenes never instruct players to locate a specific card inside the shuffled random Monster deck.

## Mapping

Scene floorplans are irregular, card-sized map fragments rather than cells in a room grid. To explore:

1. Choose an unexplored exit.
2. Draw the next Scene.
3. Rotate it so its entrance faces the connection.
4. Copy or place its printed floorplan.
5. Add a short same-scale corridor when needed to avoid overlap.
6. Follow its Monster instruction and resolve the Scene.

The web app automates rotation and placement while preserving the printed shape.

## Validation

Run:

```console
node scripts/validate-content.js
```

The validator confirms stable IDs, complete Scene fields, mapped exits, Monster references, Quest setup additions, Boss finales, and Loot effects. It also fails if any active Scene or Monster publishes compatibility tags.

## Active Classics inventory

- 30 shuffled Scene cards.
- 8 Quest finale Scenes.
- 12 cards in the base random Monster deck.
- 3 dedicated named Boss cards plus ordinary defenders that some finales print or set aside.
- 8 complete Quest packs.
- 20 Loot cards.

The former Haunted Tomb slice remains archived and inactive.