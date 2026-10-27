# Design Notes

## Current brief

Create a new TTRPG system with:

- lethal play;
- first-class support for solo play;
- extensive procedural generation;
- a lightweight local web app for generators and possibly additional play aids.

The game will be designed incrementally, one scoped piece at a time.

## Working principles

These principles are provisional until tested or explicitly adopted:

- Player decisions should affect risk more than character optimization does.
- Lethality should be legible: players need enough information to make meaningful choices.
- Failed rolls should change the situation rather than merely stall play.
- Solo procedures should answer useful questions while still leaving room for interpretation.
- Tables should produce prompts that interact, not isolated flavor with no game effect.
- The app should accelerate procedures that remain usable with dice and printed tables.

## Open design questions

- What genre and setting assumptions are built into the rules?
- How are uncertain actions resolved?
- What makes combat lethal, and what warning or escape tools do characters receive?
- How does exploration consume time and resources?
- What is the intended campaign length and advancement curve?
- Which solo tools belong in the core rules?
- What should the first web generator produce?

## Current design focus: core play loop

### Proposed expedition loop

1. **Prepare:** choose objectives, equipment, companions, and any known route or intelligence.
2. **Enter:** commit to a dangerous site and establish its initial conditions.
3. **Reveal:** generate or interpret the next area, obstacle, encounter, clue, or opportunity.
4. **Choose:** decide how to engage, bypass, exploit, or retreat from what was revealed.
5. **Resolve:** apply the relevant procedure only when the choice has a dangerous or uncertain outcome.
6. **Pay the cost:** update harm, time, light, supplies, attention, position, or another pressure track.
7. **Press on or extract:** risk deeper exploration for greater reward, or try to return with what has been gained.
8. **Recover and change the world:** convert discoveries into advancement, replace losses, update factions or threats, and prepare another expedition.

This creates three nested rhythms:

- **Moment:** reveal → choose → resolve → cost.
- **Expedition:** enter → explore → extract or perish.
- **Campaign:** recover → change the world → prepare → return.

### Intended properties

- Generation presents a situation before it calls for a roll.
- Retreat is a real decision with its own risks, not automatic safety.
- Pressure accumulates even when characters avoid direct combat.
- Rewards and useful information tempt players to exceed their safe limits.
- The same loop works when a GM interprets results or a solo player uses oracles.

### Accepted room procedure

1. Enter the next room or area.
2. Spend one exploration turn and reduce the remaining duration of active light sources accordingly.
3. Generate its physical features and contents: monsters, traps, treasure, puzzles, clues, empty space, or combinations of these.
4. Describe intentions and take actions freely rather than selecting from a fixed action menu.
5. Use a GM or oracle to establish uncertain facts and judge how the world responds.
6. Invoke rules when an action is dangerous, uncertain, or meaningfully costly.
7. Update persistent pressures and consequences.
8. If the room has been conquered, give each active adventurer one **Skill Token**.
9. Move onward, retreat, or leave the site.

Rooms create situations rather than self-contained board-game encounters. A room can be revisited, changed, bypassed, negotiated with, or fled from.

### Exploration turns

Entering and generating a new room always consumes one exploration turn. Lengthy activities consume additional turns, including thorough searches, rests, involved trap work, and other actions whose fictional duration warrants it. Exact costs will be defined alongside those procedures.

### Travel through known rooms

Spend one exploration turn to move through up to three connected conquered rooms. Reduce the remaining duration of active light sources by one turn as normal.

Roll a d6 each time the party enters a conquered room during this movement. On a 1, that room has become dangerous again: stop movement there and introduce a context-appropriate creature, hazard, environmental change, or other immediate danger. The room remains conquered, and resolving this new danger does not award its conquest Skill Tokens again.

Movement also stops upon reaching an unconquered room or a room that is already actively dangerous. The same procedure applies while advancing, backtracking, or extracting from the site.

The exploration turn spent entering and generating a new room includes the first necessary traversal of its persistent physical features. Do not charge another turn merely because the newly entered room contains a pit, difficult climb, deep water, unstable rubble, narrow ledge, or comparable obstacle.

Conquest does not remove those features. On a later visit, a conquered room with a persistent traversal feature cannot be included in ordinary fast travel. Spend one full exploration turn to cross that room, reduce active light by one turn, and make its normal conquered-room danger roll. Make a traversal check only when the crossing remains uncertain and failure would matter.

A durable improvement such as securing a rope, lowering a bridge, draining water, clearing rubble, or opening a shortcut removes that feature's recurring traversal cost and allows the room to be included in ordinary fast travel when the fiction supports it.

The three-room allowance and the 1-in-6 danger chance are initial playtest values.

### Skill Tokens

After conquering a room, every active adventurer gains one personal **Skill Token**. Skill Tokens are consumable: adventurers spend them to invoke free-form skills or activate special abilities and remove them from their pools when spent. Merely entering, generating, leaving, or re-entering a room grants nothing.

Unspent Skill Tokens disappear when the expedition ends. They represent capability earned within the current delve, not a persistent campaign currency.

At the beginning of every expedition, each active adventurer starts with one fresh Skill Token. This occurs after clearing any Skill Tokens from the previous expedition.

An adventurer can hold at most three Skill Tokens. Any Skill Token gained while already at three is lost; it cannot be transferred to another adventurer or saved elsewhere.

Special abilities require Skill Tokens; Skill Tokens do not merely enhance otherwise free versions of those abilities. An adventurer with no Skill Tokens can still attempt ordinary free-form actions but cannot invoke a free-form skill or activate a token-gated special ability.

Each special ability has a cost from one to three Skill Tokens. Stronger abilities cost more:

- **1 token:** a routine special technique;
- **2 tokens:** a powerful ability with substantial impact;
- **3 tokens:** a signature, encounter-changing, or emergency ability that empties a full pool.

These are initial design bands rather than complete balance rules. Individual abilities must state when their cost is paid, whether they require a check, and what happens on failure.

A room is **conquered** when its main challenge receives a durable resolution. Defeating enemies, negotiating a settlement or passage, solving a puzzle, neutralizing a trap, or executing a clever bypass can all qualify. Fleeing or postponing an unresolved challenge does not. Violence is never required solely to earn the reward.

Still unresolved:

- concrete ability-effect benchmarks within each cost band.
- whether and how an otherwise safe or empty room can present a challenge worth a token.

Each room can grant its Skill Tokens only once. Token ownership follows adventurers, not human players, so a party works the same way whether controlled by one person or several.

### Character scale

The game must equally support one adventurer and a small player-controlled party. Procedures should scale by the number of adventurers without making either mode an afterthought.

Likely design consequences:

- Threat and resource costs may need explicit scaling rules.
- A lone adventurer needs options besides absorbing attacks, while a party gains resilience at the cost of supplies, noise, and exposure.
- Generation should key off adventurer count where action economy would otherwise distort difficulty.
- Character procedures must stay compact enough for one person to operate several adventurers.

### Proposed pressure model

Two related pressures are under consideration:

- **Light clock:** a visible countdown measured in exploration turns and attached to a torch or other light source. Certain costly roll results can consume additional light time. This makes darkness an approaching state rather than a forgotten inventory detail.
- **Dungeon alert:** noise, greed, delays, and disruptive actions make the site increasingly hostile. At intervals or on specific triggers, the dungeon answers with encounters, complications, or worsening conditions.

These pressures should interact but do different jobs: light limits safe exploration time, while alert records how strongly the dungeon is reacting to the intruders.

An adapted *Clank!*-style bag is one possible implementation for alert: risky actions add adventurer-linked tokens, threat checks draw tokens, and deeper intrusion increases the number drawn. This is not yet accepted; dice, cards, or a simple track may provide the same behavior with less overhead.

**Current status:** Dungeon Alert is deliberately deferred. No active rule should assume an Alert track, bag, modifier, or trigger until this component is reopened.

### Proposed momentum turn rule

Roll one d20 when an action is both uncertain and consequential:

- If a relevant skill applies, add the total skill bonus printed on the character sheet. That number already includes its linked attribute.
- If no skill applies, add the relevant attribute bonus.
- Meet or exceed the target number to succeed.
- With **advantage**, roll 2d20 and keep the higher natural die before adding the bonus.
- With **disadvantage**, roll 2d20 and keep the lower natural die before adding the bonus.
- Advantage and disadvantage are binary and do not stack. If both apply, they cancel completely and the roll uses 1d20, regardless of how many sources of either are present.

Critical results use the natural face of the kept d20:

- **Natural 20 — Critical success:** the action succeeds regardless of the total and gains an additional beneficial effect appropriate to the action.
- **Natural 1 — Critical failure:** the action fails regardless of the total, one additional exploration turn immediately passes, and control passes to the dungeon as normal for failure.

When rolling with advantage or disadvantage, only the retained die can produce a critical result. A discarded natural 1 or natural 20 has no effect. Skill Tokens spent before a critical roll remain spent unless a specific ability says otherwise.

Use this initial target-number ladder:

| Difficulty | Target number |
| --- | ---: |
| Easy | 9 |
| Standard | 12 |
| Hard | 15 |
| Extreme | 18 |

The GM chooses the target from the fiction. In solo play, the relevant procedure, room element, or oracle supplies it; **Standard 12** is the default when no specific difficulty is indicated.

- **Success:** resolve the action; it remains the adventurers' turn.
- **Failure:** the intended action does not succeed and any inherent fictional result occurs; it becomes the dungeon's turn.
- **Dungeon turn:** the GM or solo procedure takes one meaningful action with a monster, monster group, hazard, or the environment. Control then returns to the adventurers.

This makes every risky roll an initiative decision. Adventurers can maintain momentum through successful actions, while failure gives the dungeon an opening.

The handoff is the default systemic cost of failure. Do not automatically add an unrelated penalty before the dungeon acts. Some actions still have inherent stakes—a failed leap may cause a fall—but a failed attempt should not be punished twice merely because a roll occurred.

A natural 1 is the explicit exception: its additional exploration turn is part of the critical-failure rule and depletes light like any other exploration turn.

The attribute and skill ranges remain to be defined. The target ladder is an initial playtest value and may be recalibrated after those ranges are known.

## Current design focus: procedural character creation

Character creation will use a few linked random tables. The current proposal rolls signature gear to determine the +3 attribute, then rolls a burden and defensive package keyed to that result to determine the −2 attribute; the remaining attribute becomes +0. See the [procedural character creation notes](../character-creation/README.md).

## Hit Protection, Wounds, and Scars

### Proposed HP model

**HP means Hit Protection**, not a literal measure of blood or bodily integrity. It represents the adventurer's ability to turn a dangerous hit into a near miss, glancing blow, last-second guard, or expenditure of stamina.

- Damage reduces HP, to a minimum of 0.
- HP replenishes fully when a fight or immediate danger is genuinely over.
- Reaching safety between hostile waves is not the same as ending the fight; the fiction determines when HP returns.
- An adventurer at 0 HP is **exposed**.
- Damage never spills through HP. A hit that reduces HP to 0 causes no lasting harm by itself.
- A later hit received while already exposed causes a **Wound** determined by the attacker or hazard.

### Wounds

A Wound records the specific acute harm caused by its source. A sword might cause a **Bleeding Wound**; a venomous snake might cause a **Poisoned Wound**.

- While an adventurer has one active Wound, every check they make has disadvantage.
- Each Wound also has a source-specific effect in addition to universal disadvantage.
- Receiving a second active Wound causes immediate death.
- Damage dealt to an exposed adventurer causes one Wound regardless of its numerical amount unless a specific attack says otherwise.

### Treatment and Scars

Treating or bandaging a Wound converts it into a **Scar**:

- remove the active Wound and its disadvantage and source-specific acute effect;
- reduce the attribute named by that Wound by 1;
- record a Scar describing the lasting injury.

For example, treating a Bleeding Wound from a sword might leave a Strength −1 Scar, while treating a disorienting Poisoned Wound might leave a Mind −1 Scar. “Treatment” includes whatever the fiction requires—bandaging a cut, administering an antidote, splinting a break, or another appropriate intervention.

Scars are not active Wounds, so a scarred adventurer does not die merely from receiving one later Wound.

A **medkit** is a single-use treatment item. Spend one exploration turn and consume the medkit to convert one Wound into its Scar. No check is required when the adventurer has enough safety and time to work.

Attempting treatment during immediate danger requires an appropriate check and still consumes one exploration turn. On success, consume the medkit and convert the Wound. On failure, the Wound remains and control passes to the dungeon; the medkit is not consumed unless the fiction specifically causes it to be lost or ruined. A lone adventurer may treat their own Wound.

### Inventory

Each adventurer begins with one additional useful item beyond the gear supplied by the rest of character creation. Choose it or roll it from a short expedition-item table. Examples include a medkit, rope, lantern, crowbar, climbing tools, flask of oil, or other similarly practical gear.

There are no inventory slots, weight totals, or carrying-capacity statistics. Adventurers may take and retain useful items found during an expedition. Track consumables and remove them after use; durable items remain until they are lost, broken, spent, or abandoned.

The fiction still limits what an adventurer can carry or use. An enormous object cannot be carried casually, and a bulky or awkward object may require both hands, assistance, or impose a situational disadvantage. These judgments do not create a general encumbrance subsystem.

### Why use renewable HP

- Each fight can begin with a known defensive buffer, simplifying encounter balance.
- Lasting attrition appears as visible Scars and attribute loss rather than a large pool of slowly recovering HP.
- Reaching 0 HP creates an urgent change of state without immediately removing the character from play.
- A lone adventurer and a party use the same harm procedure; party members differ mainly in their ability to protect an exposed ally.

### Open harm questions

- How much HP do adventurers have, and how much damage do ordinary attacks deal?
- What acute effects and resulting attribute penalties belong to each Wound type?
- At what attribute value does accumulated Scar loss cause incapacity or death?
- How can attribute loss and Scars recover, if at all?
- What precise fictional boundary restores HP?

### Adventurer HP scale

Adventurers have **2 HP** and ordinary monster attacks deal **1 damage**:

1. The first ordinary hit reduces 2 HP to 1 HP.
2. The second reduces 1 HP to 0 HP, leaving the adventurer exposed.
3. The third causes a source-specific Wound.

HP replenishes after the fight genuinely ends. Exceptional monster attacks may later receive rules that deal more damage, but ordinary damage is fixed and requires no damage roll.

### Damage against monsters

Monsters use simple HP rather than the adventurer Wound-and-Scar procedure.

- Make an attack check against the monster's Defense target number.
- On success, deal **1 damage** and retain the adventurers' turn.
- On failure, deal no damage and hand control to the dungeon.
- At 0 HP, the monster is defeated according to the adventurers' stated intent and the fiction: killed, incapacitated, routed, or otherwise overcome.

Initial monster HP bands:

| Monster durability | HP | Meaning |
| --- | ---: | --- |
| Fragile | 1 | One successful attack defeats it |
| Standard | 2 | Requires two ordinary successful attacks |
| Tough | 3 | Sustains a short exchange |
| Boss-tier | 5 | Major threat; phases may be preferable to still more HP |

A natural 20 can use its added critical benefit to deal +1 damage instead of taking another suitable benefit. Weapons, monster traits, and special abilities may alter damage, but fixed 1 damage is the default.

Potential default Defenses use the existing difficulty ladder: 9 for easy-to-hit, 12 for standard, 15 for hard-to-hit, and 18 for extreme defenses.

This monster-damage model is accepted for initial playtesting. Armor, groups, and boss phases remain open.

### Weapon benefits

Every weapon should have a distinct benefit while retaining the default 1 damage. Benefits can provide range, defense, conditional advantage, control, concealment, group utility, or extra damage against a narrow vulnerability.

Initial weapon concepts:

| Weapon | Hands | Benefit |
| --- | ---: | --- |
| Sword | 1 | **Parry:** +1 maximum HP while the sword is readied. Drawing or swapping weapons cannot restore lost HP. |
| Dual daggers | 2 | **Flurry:** the first attack made with them in each fight has advantage. They are also easy to conceal. |
| Bow | 2 | **Range:** attack targets at range before they can be reached with an ordinary melee weapon; cannot be fired while closely engaged. |
| Spear | 2 | **Reach:** attack across an ally or obstacle and engage enemies before shorter weapons can reach. |
| Axe | 1 | **Cleave:** when the attack defeats a target, deal 1 damage to a second adjacent Fragile enemy. |
| Maul | 2 | **Concussive:** after a successful hit, the next attack against that target has advantage. **Shattering:** deal 2 damage to Brittle creatures such as skeletons. |
| Mace | 1 | **Crushing:** reduce an Armored target's Defense by one difficulty step for this attack. |
| Great weapon | 2 | **Brutal:** deal 2 damage, but make the attack with disadvantage. |
| Whip | 1 | **Entangle:** on success, forgo damage to pull, trip, or disarm a suitable target. |

These are playtest concepts, not a final equipment list. Weapon tags depend on a later range and positioning procedure.

The current character-creation proposal would separate a weapon's free benefit from token-powered techniques. Under that model, a whip can still forgo damage for simple positioning, while **Disarm** becomes a 1-Skill-Token technique that preserves the attack's damage. A greatsword may grant a 2-token **Whirlwind** attack against every adjacent enemy.

Spellbooks are not weapons and provide no basic attack. Wands are Mind-based ranged weapons or foci that deal the normal 1 damage and can also carry token-powered magical abilities.

#### Weapon design guardrails

- A broad fictional capability such as range is a complete benefit; it does not also need a numerical bonus.
- Extra damage should be conditional, costly, or paired with risk because monster HP is very low.
- Unconditional advantage is especially powerful because it both improves accuracy and delays the next dungeon turn.
- Control effects must not repeatedly erase the dungeon's only action with no cost or resistance.
- A weapon benefit should create a choice rather than strictly dominate another weapon.

### Attributes

Use three attributes:

- **Strength:** physical power, endurance, force, and resilience.
- **Agility:** speed, coordination, balance, precision, and reflexes.
- **Mind** *(working name)*: perception, reasoning, knowledge, resolve, presence, and supernatural discipline.

Wits and Will are intentionally folded into the same attribute. Skills provide narrower differentiation within this broad mental category: for example, two adventurers with equal Mind may have very different total bonuses for lore, investigation, persuasion, or magic.

The three attribute names are final. Their numerical ranges remain open.

Attributes are recorded directly as bonuses, such as **Strength +2**. There are no underlying scores and no score-to-modifier conversion. An attribute check adds that number directly to the d20; a listed skill total already incorporates it.

At character creation, assign this array among Strength, Agility, and Mind:

- **+3** — defining strength;
- **+0** — capable but unexceptional;
- **−2** — pronounced weakness.

Initial unmodified success chances are:

| Attribute | Easy 9 | Standard 12 | Hard 15 | Extreme 18 |
| ---: | ---: | ---: | ---: | ---: |
| +3 | 75% | 60% | 45% | 30% |
| +0 | 60% | 45% | 30% | 15% |
| −2 | 50% | 35% | 20% | 5% |

The five-point spread creates strong niches and meaningful weaknesses. Procedural challenges should usually permit multiple fictional approaches so a lone adventurer is not routinely forced through one specific weak attribute.

### Past

Each starting adventurer creates one free-form **Past**. A Past is a short player-authored phrase describing relevant training, history, or expertise rather than an entry selected from a universal skill list. Examples include **Tomb-Robber**, **Raised by Wolves**, or **Forbidden Anatomist**.

Each Past:

- is linked to Strength, Agility, or Mind when created;
- grants a +2 training bonus when its phrase is clearly relevant;
- is recorded with its linked attribute already included in the total;
- costs one personal Skill Token to invoke, spent before the roll;
- does not apply merely because its wording could be stretched to cover the action.

For example, an adventurer with Agility +3 could record **Tomb-Robber (Agility) +5**. When that Past applies, roll `d20 + 5`, not `d20 + 3 + 2`.

If the adventurer does not spend a Skill Token, roll with the underlying attribute even when the Past is relevant. Advantage or disadvantage can apply separately.

The GM judges relevance in group play. In solo play, the player uses the same good-faith reading, consulting an oracle only when applicability is genuinely uncertain.

Whether a Past can later improve remains open.

### Knack

Each starting adventurer has one concrete **Knack** costing 2 Skill Tokens. A Knack is a specific personal ability with a defined effect, not another +2 skill phrase. It should reliably do something an ordinary check cannot guarantee.

Examples include learning the direction of the nearest known exit, identifying a weak point that increases the next successful attack's damage, or perfectly reproducing a voice heard during the expedition.

Actions that need no roll do not hand over control, but time, positioning, and the fiction still prevent unlimited free activity. Rolls should occur only when both uncertainty and meaningful consequences are present.

The adventurers share turn ownership. After a successful action, any adventurer may act next, including the adventurer who just acted. After the dungeon completes its action, any adventurer may take the next action. There is no round-based requirement for every adventurer to act and no “already acted” marker.

This freedom does not let an adventurer act from an impossible position or solve every problem with one specialty. The established fiction determines which adventurers can intervene and what approaches are viable.

#### Open implementation questions

- Can adventurers voluntarily yield control for a tactical benefit?
- Do failed exploration rolls both trigger a dungeon turn and consume extra light time, or does the consequence choose one of those costs?

One meaningful action is a unit of fictional impact, not necessarily one creature moving once. A coordinated group or swarm may act together as one threat.

### Normal monster attacks

When the dungeon controls the turn, a monster that is fictionally able to attack may make a normal monster attack:

1. Choose an engaged, exposed, or otherwise plausible target.
2. Deal 1 damage without making an attack roll or calling for a defense check.
3. Apply any relevant Guard, resistance, or other protection.
4. Return control to the adventurers.

The dungeon already earned its meaningful action through an adventurer's failed check. A second routine roll would dilute that consequence and could create nested turn handoffs.

A monster cannot deal damage merely because the dungeon controls the turn. If it cannot currently reach or attack an adventurer, it must use its action to close distance, overcome cover, surround someone, block an exit, improve its position, or do something else supported by the fiction.

A coordinated group or swarm acting as one threat damages only one adventurer with a normal monster attack. Because the attack has no roll, it cannot critically succeed or fail. Position, terrain, shields, armor, defensive preparation, and monster traits may prevent, redirect, or modify damage when their rules apply.

Special monster attacks may break these defaults but should be clearly telegraphed. If a special dungeon action calls for an adventurer reaction check, that check resolves only the current action and never grants the dungeon another action. Control returns to the adventurers afterward regardless of the result.
