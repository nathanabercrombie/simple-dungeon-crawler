# Quest Generation Prototype

Every site has a Quest defining why the adventurers enter and what counts as completing its primary objective. Each newly generated room receives a separate escalating Quest roll that may add an omen, clue, quest element, complication, or Heart to its normal Challenge and Opportunity.

The structure is accepted; the exact tables and thresholds are proposed for playtesting.

## Quest type (d12)

Roll or choose when establishing the site.

| d12 | Quest | Quest elements | Heart |
| ---: | --- | --- | --- |
| 1 | Hunt the sovereign | spoor, wounded prey, trophies, hunting lore | lair and sovereign monster |
| 2 | Recover the relic | seals, maps, command phrases, vault keys | relic chamber and guardian |
| 3 | Rescue the captive | signs of passage, keys, allies, captor's weakness | prison, captive, and captor |
| 4 | Break the curse | anchor fragments, true names, counter-rites | curse source and its vessel |
| 5 | Seal the breach | ward pieces, ritual components, planar lore | breach and emerging entity |
| 6 | Expose the truth | testimony, records, physical evidence | culprit, witness, or proof that changes everything |
| 7 | Lay the dead to rest | remains, names, funeral objects, missing rites | grave, spirit, or event preventing rest |
| 8 | Sabotage the engine | tools, schematics, weak points, access controls | engine core or controlling intelligence |
| 9 | Steal the treasure | access tokens, routes, schedules, container keys | treasury, owner, and prize |
| 10 | Purge the infestation | nests, samples, vulnerabilities, survivor reports | brood chamber and queen or source |
| 11 | Find the lost expedition | journals, camps, survivors, route markers | final camp and what stopped them |
| 12 | Win the parley | leverage, gifts, grievances, faction support | ruler, council, or entity empowered to agree |

## Quest roll

For every newly generated room, after placing its template, roll:

`d20 + (E × N)`

Where:

- **E** is the site's Escalation value;
- **N** is the number of rooms already generated before this room.

Record and cross off the exact numerical result. If that exact result was previously used for a Quest roll in this site, reroll the d20 with the same modifier. Results below the current minimum naturally retire as N rises.

The Quest roll does not replace Challenge or Opportunity. It adds a quest-facing element to the room and should be integrated with them.

## Quest-result bands

| Quest index | Result | Function |
| ---: | --- | --- |
| 1–8 | Omen | Foreshadow the Quest's Heart, stakes, or opposition without providing concrete progress. |
| 9–14 | Trace | Reveal evidence that the objective or its agents passed through, altered, or used this room. |
| 15–20 | Lead | Provide actionable information about a route, weakness, identity, requirement, or likely location. |
| 21–24 | Quest element | Place one concrete item, person, fact, ritual act, or component that weakens or enables the Heart. |
| 25–28 | Guardian or setback | Add a lieutenant, rival, damaged element, false lead, pursuit, or other Quest-specific complication to the room. |
| 29–30 | Major quest element | Place a quest element and reveal exactly how it changes the Heart. |
| 31+ | Heart | Place the Quest's final objective in this room. If the Heart is already placed, generate a major quest element or Heart-specific advantage instead. |

Because the first room has N 0, its Quest result is always 1–20: the Heart and concrete quest elements cannot appear immediately.

## Quest elements and the Heart

The default prototype assumes two quest elements enable the intended resolution.

- **No elements:** the Heart is accessible but has its complete threat, all defensive layers, and no known intended solution.
- **One element:** remove or neutralize one specific Heart layer.
- **Two elements:** enable the intended fight, rite, negotiation, rescue, theft, sabotage, or other resolution.
- **Three or more elements:** grant a superior reward, safer extraction, important truth, faction benefit, or another Quest-specific boon.

Quest elements are not abstract points. Each should be a concrete fictional thing or accomplishment whose effect on the Heart is stated when found.

## Early and late Heart rules

- If the Heart appears before two elements are found, place it normally. The adventurers may confront it, withdraw, or explore branches for advantages.
- Continue making Quest rolls after finding the Heart until it is conquered. Further Heart results become major quest elements or advantages.
- If only one reachable ungenerated sector remains and the Heart has not appeared, that sector automatically contains it.
- Once the Heart is conquered, stop making Quest rolls. Optional rooms can still be explored through ordinary generation.

## Example: Break the curse in a Haunted Tomb

- Quest index 6, Omen: every funerary portrait has had the same face scratched away.
- Quest index 17, Lead: an embalmer's record identifies a substituted corpse.
- Quest index 23, Quest element: recover the murder weapon anchoring the reenacted betrayal.
- Quest index 27, Guardian: a risen guard protects the false royal name despite knowing it is a lie.
- Quest index 30, Major element: learn the release clause hidden in the guard's oath.
- Quest index 34, Heart: the false Royal Sepulcher and the revenant sustained by the curse.

## Questions for testing

- Do the 21–24 element band and 31+ Heart threshold reliably appear within all three site sizes?
- How many duplicate rerolls occur in practice?
- Does using the same E for templates and Quest create the desired synchronized escalation?
- Should different Quest types require one, two, or three elements?
- Does a Quest addition make rooms too busy when Challenge and Opportunity are already complex?
