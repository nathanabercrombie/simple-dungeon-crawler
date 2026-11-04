# Balance Follow-up 008

This pass tested the equation-based Monster system, individual creature HP, revised equipment, and continuation at 0 Light. The final comparison contains 3.76 million modeled expeditions across party sizes 1–4, all eight Quests, major equipment families, Light supplies, fixture policies, combat approaches, and search policies.

The simulator is deliberately conservative. It models the shuffled Scene path, rising Scene target, darkness disadvantage, Wounds, rest, treatment, wandering Monsters, separately tracked creatures, and Quest finales. It cannot fully value terrain, negotiation, Quest-element advantages, target selection, cover, techniques, or clever fictional positioning. Its percentages are comparative signals, not promised table win rates.

## Changes accepted before the final run

- Every Monster uses a physical-card equation with `P` as the active party size when placed.
- Every creature has separate HP; excess damage does not spill into the next creature.
- Ordinary hostile setups meet a 2 HP-per-adventurer floor.
- Named bosses accompanied by a fully scaled group use gentler personal scaling: Gristlemaw `4 + P×1`, Redcap Rusk `2 + P×1`, and the Bone-Speaker `3 + P×1`.
- At 0 Light, new-Scene movement, known-Scene travel, and searching remain possible in darkness. Checks have disadvantage. Rest, treatment, and permanent illumination still require Light.
- Missing HP does not itself cause disadvantage; an active Wound does.
- Maximum-HP bonuses from an Arming sword and Reinforced armor do not stack.

## Strategy findings

Across the broad default matrix, modeled objective completion/extraction were:

| Policy | Complete | Extract |
| --- | ---: | ---: |
| Fight every encountered Monster | 9.2% | 7.6% |
| Bypass whenever possible | 65.2% | 42.3% |
| Hybrid: bypass poor fights, fight favorable ones | 57.8% | 44.0% |

There is no single solved policy in this model. Fighting everything is an intentionally bad attrition strategy. Pure bypassing reaches objectives most often, but unresolved threats and the return journey reduce extraction. The hybrid policy extracts most reliably.

Searching also remained a genuine wager:

| Search policy | Complete | Extract | Searches attempted |
| --- | ---: | ---: | ---: |
| Never | 53.3% | 38.7% | 0.0 |
| Every conquered Scene | 49.9% | 34.6% | 5.6 |
| Selectively while resources permit | 52.1% | 37.1% | 2.7 |

The model does not spend gained treasure tactically, so it understates search benefits. Even so, universal searching is not dominant and selective searching costs only a small amount of survival for additional Loot.

## Light findings

A spare Torch improved extraction, but was no longer required to keep playing: broad-matrix extraction rose from 30.0% without one to 32.5% with one. In a fixed non-boss Quest comparison, always using viable permanent fixtures improved extraction by roughly 8–11 percentage points. That is an intentional route-building reward, not a hard lock: a party can continue through darkness at disadvantage.

## Equipment findings

- Arming sword and Reinforced armor were the strongest passive survival choices. Their shared non-stacking cap prevents the former 4 HP combination.
- Greatsword was competitive overall after correctly modeling its 2-damage hits and 2-damage failed-attack risk. It remains weaker into many separate 1 HP creatures and stronger into bosses, which is the intended niche.
- Sacred relic was ordinary in most Quests and substantially stronger against the Bone-Speaker, as intended.
- Crossbow performed poorly in face-to-face attrition because repeated pressured reload checks compound risk. This is a warning, not yet grounds to remove the chosen reload rule: the model cannot use cover, another adventurer's protection, preloaded opening shots, withdrawal, or automatic safe reloads. It needs focused table testing.
- Active techniques and once-per-Scene Guard are undervalued by the simulation, so numerical comparisons involving them are lower bounds.

## Remaining balance risks

Solo play remains the hardest mode and four-adventurer play the most forgiving. The equation floor narrows that gap but does not erase the party's larger pool of HP, Wounds, supplies, and narrative options. Mandatory combat finales also remain much harder than retrieval or rescue finales. Before increasing all Monster equations again, the next useful test is a real two-player and solo table run that records use of terrain, Quest advantages, Guard, techniques, and pressured reloads.