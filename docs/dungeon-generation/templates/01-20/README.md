# Room Templates 01–20: Shallow Pool

These are the first twenty exact-grid footprint prototypes. They are available for the first room through a plain d20 roll. Later rolls use the accepted sliding escalation formula.

Individual layouts are proposed material for testing and cutting. Their Danger Rank, geometry, terrain, and Lighting are fixed by the template; contents are generated separately.

Lighting uses `Fixtures`, `Inherent`, or `None`. Fixtures can be lit with a flame; Inherent sources begin illuminated unless the generated state suppresses them.

## Placement rules

- Rotate a template by 0°, 90°, 180°, or 270° so its `E` entry aligns with the connector used to reach it.
- Mirror an asymmetric template only when its metadata permits mirroring.
- Spaces outside the drawn walls are not part of the footprint.
- If placement collides with existing geometry, the GM adjusts orientation, mirroring, connector length, placement, shared walls, or the result as needed. In solo play, the player makes the least disruptive good-faith adjustment or rerolls.
- `E` only marks the connector through which this room was first generated. After placement, `E` and every `X` are ordinary two-way entrances and exits.
- One character represents one square. The real-world scale of a square remains open.

## Legend

| Mark | Meaning |
| --- | --- |
| `#` | Wall or solid boundary |
| `.` | Ordinary traversable floor |
| `E` | Entry doorway used to place the template |
| `X` | Visible unexplored exit |
| `?` | Hidden exit socket; activate only when another procedure reveals it |
| `O` | Pillar |
| `S` | Statue or large fixed monument |
| `P` | Pit or chasm cell |
| `=` | Narrow bridge or causeway |
| `B` | Balcony or raised gallery floor |
| `^` | Steps, dais, or upward slope |
| `v` | Sunken floor |
| `D` | Visible downward stair, shaft, or descent |
| `~` | Water or another shallow liquid |
| `R` | Rubble or difficult ground |
| `+` | Interior door, gate, or movable partition |

## Catalog summary

| d20 | Name | Danger | Visible exits | Key terrain | Lighting | Mirror? |
| ---: | --- | ---: | ---: | --- | --- | --- |
| 1 | Square antechamber | Easy 9 | 2 | Open floor | None | No effect |
| 2 | Narrow chamber | Easy 9 | 2 | Long sight line | None | No effect |
| 3 | Crooked annex | Easy 9 | 2 | Blind corner | None | Yes |
| 4 | Lesser pillared hall | Easy 9 | 2 | Four pillars | Fixtures | No effect |
| 5 | Divided alcoves | Easy 9 | 2 | Partial walls | None | Yes |
| 6 | Dead-end shrine | Easy 9 | 0 | Dais and pillar | Fixtures | No effect |
| 7 | Rubble breach | Standard 12 | 2 | Central rubble | None | Yes |
| 8 | Branching gallery | Standard 12 | 3 | Open intersection | Fixtures | Yes |
| 9 | Pit bridge | Standard 12 | 2 | Pit and bridge | None | No effect |
| 10 | Balcony chamber | Standard 12 | 2 | Raised gallery | Fixtures | Yes |
| 11 | Flooded channel | Standard 12 | 2 | Water and dry path | None | No effect |
| 12 | Twin cells | Standard 12 | 2 plus hidden | Divider and gate | None | Yes |
| 13 | Statue court | Standard 12 | 2 | Four statues | Fixtures | No effect |
| 14 | Broken crossing | Standard 12 | 2 | Interrupted pit crossing | None | Yes |
| 15 | Sunken court | Standard 12 | 2 | Lower central floor | None | Yes |
| 16 | Spiral descent | Standard 12 | 1 plus downward | Ring path and stair | None | Yes |
| 17 | Gauntlet hall | Hard 15 | 2 | Repeated raised obstacles | None | No effect |
| 18 | Hanging gallery | Hard 15 | 2 | Balcony around deep pit | None | No effect |
| 19 | Collapsed great hall | Hard 15 | 3 | Rubble fields | None | Yes |
| 20 | Descending sanctum | Hard 15 | 1 plus downward | Raised perimeter and central stair | Fixtures | No effect |

## 01 — Square antechamber

Danger Rank: Easy 9. Tags: `small`, `open`, `threshold`.

```text
##X##
#...#
#...X
#...#
##E##
```

## 02 — Narrow chamber

Danger Rank: Easy 9. Tags: `narrow`, `long`, `sight-line`.

```text
#X#
#.#
#.X
#.#
#.#
#.#
#E#
```

## 03 — Crooked annex

Danger Rank: Easy 9. Tags: `irregular`, `corner`, `two-exit`.

```text
####X#
#....#
#....X
###..#
  #..#
  #E##
```

## 04 — Lesser pillared hall

Danger Rank: Easy 9. Tags: `pillars`, `cover`, `two-exit`.

```text
###X###
#.....#
#.O.O.#
#.....X
#.O.O.#
#.....#
###E###
```

## 05 — Divided alcoves

Danger Rank: Easy 9. Tags: `alcoves`, `partial-cover`, `divided`.

```text
###X###
#..#..#
#..#..#
X.....#
#..#..#
#..#..#
###E###
```

## 06 — Dead-end shrine

Danger Rank: Easy 9. Tags: `dead-end`, `dais`, `ritual`, `pillar`.

```text
  ###  
 ##^## 
#..^..#
#.....#
#..O..#
 ##E## 
  ###  
```

## 07 — Rubble breach

Danger Rank: Standard 12. Tags: `rubble`, `difficult-ground`, `unstable`.

```text
###X###
#..R..#
#.RRR.#
X..R..#
#.....#
###E###
```

## 08 — Branching gallery

Danger Rank: Standard 12. Tags: `intersection`, `two-exit`, `open`.

```text
###X###
#.....#
X.....X
#.....#
#.....#
#.....#
###E###
```

## 09 — Pit bridge

Danger Rank: Standard 12. Tags: `pit`, `bridge`, `choke-point`.

```text
###X###
#PP.PP#
#PP=PP#
#PP=PP#
#PP=PP#
#.....X
###E###
```

## 10 — Balcony chamber

Danger Rank: Standard 12. Tags: `balcony`, `high-ground`, `two-exit`.

```text
###X###
#BBBBB#
#B...B#
#B.^.BX
#.....#
#.....#
###E###
```

## 11 — Flooded channel

Danger Rank: Standard 12. Tags: `water`, `channel`, `divided-ground`.

```text
###X###
#~~.~~#
#~~.~~#
X~~.~~#
#.....#
###E###
```

## 12 — Twin cells

Danger Rank: Standard 12. Tags: `cells`, `interior-gate`, `hidden-exit`.

```text
###X###
#..#..#
X..#..#
#..+..#
#..#..#
#..#..?
###E###
```

## 13 — Statue court

Danger Rank: Standard 12. Tags: `statues`, `cover`, `two-exit`, `ritual`.

```text
###X###
#.S.S.#
#.....#
#.S.S.X
#.....#
###E###
```

## 14 — Broken crossing

Danger Rank: Standard 12. Tags: `pit`, `jump`, `broken-route`.

```text
###X###
#.....#
#PPPPP#
#PP.PP#
#PPPPP#
#.....X
###E###
```

The lone floor cell in the pit marks the remains of a broken crossing, not safe ordinary ground; reaching it requires the fiction to support the attempt.

## 15 — Sunken court

Danger Rank: Standard 12. Tags: `sunken`, `elevation`, `two-exit`.

```text
###X###
#.....#
#.vvv.#
X.v.v.#
#.vvv.#
#.....#
###E###
```

## 16 — Spiral descent

Danger Rank: Standard 12. Tags: `vertical`, `descent`, `ring-path`.

```text
###X###
#.....#
#.###.#
#.#D#.#
#.#...#
#.....#
###E###
```

The `D` is the room's unexplored exit and leads to a lower level.

## 17 — Gauntlet hall

Danger Rank: Hard 15. Tags: `narrow`, `raised-obstacles`, `sight-line`, `gauntlet`.

```text
##X##
#...#
#^.^#
X...#
#^.^#
#...#
##E##
```

## 18 — Hanging gallery

Danger Rank: Hard 15. Tags: `balcony`, `pit`, `bridge`, `choke-point`.

```text
####X####
#BBBBBBBX
#BPPPPPB#
#BPP=PPB#
#BPP=PPB#
#B.....B#
####E####
```

## 19 — Collapsed great hall

Danger Rank: Hard 15. Tags: `large`, `rubble`, `unstable`, `two-exit`.

```text
####X####
#...R...#
#.RRRRR.#
#...R...X
#.......#
X.R...R.#
#.......#
####E####
```

## 20 — Descending sanctum

Danger Rank: Hard 15. Tags: `large`, `raised`, `pillars`, `vertical`, `descent`.

```text
####X####
#^^^^^^^#
#^.....^#
#^.OOO.^#
#^..D..^#
#^.....^#
#.......#
####E####
```

The visible `X` continues on the current level; `D` begins a second unexplored route downward.

## Immediate playtest questions

- Is the 6 Easy / 10 Standard / 4 Hard opening distribution too punishing?
- Does the average number of exits create too much branching before a room budget is defined?
- Are internal features clear enough to draw and adjudicate without extra prose?
- Should rotations always be allowed when text orientation matters, such as balconies or descending stairs?
- Which templates are too similar to justify separate master-list entries?
- Does an average of roughly two onward exits create more frontier branches than the site-size procedure can manage?
