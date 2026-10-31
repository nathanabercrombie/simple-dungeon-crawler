# Card language and lifecycle

This is the authoring standard for cards that must work both in a shuffled physical game and in the web app.

## Scene lifecycle

1. Choose an unexplored exit and draw one Scene card.
2. Rotate and copy or place its complete floorplan.
3. Read its visible prose and follow its Monster instruction.
4. Players ask ordinary clarifying questions, then commit to an approach.
5. Reveal the hidden **Response** before resolving an uncertain check.
6. Apply Revelation, Rule, and Failure.
7. Conquer the Scene when its active problem durably stops controlling passage or use of the place.
8. Each active adventurer gains one Skill Token and reveals the Scene’s one reward, if any.

A temporary distraction or stealthy passage is not conquest if the same problem will apply on return.

An **opportunity Scene** begins conquered, has its Response visible, and grants no conquest Skill Token. Follow its printed benefit and optional reward.

## Scene card schema

Front:

- title, source set, danger, and default target;
- complete floorplan, entrance, and exits;
- lighting and visible persistent terrain;
- read-aloud prose containing every immediately perceptible fact;
- one Monster instruction: Printed, Random, Boss, or None;
- compact ordinary Monster stat lines when identity defines the Scene;
- one facedown reward icon, if any.

Response:

- optional **Revelation** genuinely learned after commitment;
- the exact **Rule** governing the situation;
- **Failure** consequence;
- exceptional persistent trigger only when necessary.

Do not print Examine menus, preferred solution lists, compatibility tags, generation tables, or a bespoke conquest clause.

## Monster placement rules

- **Printed on Scene:** use when identity, count, position, or behavior defines the authored situation.
- **Random Monster card:** use when the Scene’s premise works with every card in that deck.
- **Set-aside Boss card:** use for named or text-heavy Quest defenders.
- Never tell players to search a shuffled deck for a specific ordinary Monster.

A compact Monster stat line contains number, HP, Defense, Instinct, and Wound. Signs or one short special rule may be added when needed.

## Other cards

### Quest

A Quest pack states the mission, supplies concrete findings or advantages, modifies setup when appropriate, and owns one finale Scene. Its setup can add cards to the random Monster deck and set Bosses aside.

Completing the objective does not remove active monsters or automatically conquer the finale Scene.

### Loot

Loot is either **Supply** or **Treasure** and always uses **Take**. Supply is practical equipment or consumables. Treasure adds printed Gold or grants one exact exceptional item.

### Gear and armor

Gear uses Attack, Passive, and Technique. Armor uses Protection and Burden. A Torch is a full Light reference card.

## Defined terms

- **Scene:** one card containing both place and present situation.
- **Commit:** state an intended action and accept the Response and check that follow.
- **Check:** roll only when outcome is uncertain and failure matters.
- **Scene target:** the Scene card’s default check number.
- **Response:** hidden rules and consequences revealed after commitment.
- **Conquer:** durably stop the Scene’s active problem from controlling the place.
- **Dungeon action:** one hostile action chosen through a creature’s Instinct and current fiction.
- **Reveal:** turn a card face up; this does not claim it unless stated.
- **Permanently Lit:** Scene actions do not spend portable Light there, darkness disadvantage is removed, and wandering monsters are suppressed.

## Writing rules

- Put visible facts in read-aloud prose and hidden consequences in the Response.
- Establish every object or sequence required by the Response unless discovering it is the Revelation.
- Use exact nouns, verbs, triggers, quantities, and card destinations.
- A random-monster premise must remain coherent with every random Monster card.
- Print ordinary monsters on the Scene whenever drawing them separately adds no meaningful uncertainty.
- Give each Scene zero or one reward: Quest, Loot, or the Quest objective itself.
- Keep optional searching separate from Scene rewards.
- Give every card a stable namespaced ID and explicit source set.

See [Physical card sets](../content-packs/README.md) for deck construction and mapping.