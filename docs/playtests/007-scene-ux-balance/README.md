# Scene UX balance study

## Question

Does a steadily increasing Scene target create useful pressure, and is searching for Loot a solved strategy?

## Difficulty curves tested

The rejected curve increased the target by 1 for every revealed Scene. It made the finale average roughly 17 and allowed darkness disadvantage to turn late checks into a practical wall.

The adopted curve is:

`9 + floor((Scene number - 1) / 2)`, capped at 15.

A Quest finale adds 1 within the same cap. Its opening sequence is 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14.

This leaves room for character attributes and situational advantage to matter. Later pressure comes from opposition, depleted resources, injury, wandering monsters, and the finale's defenders instead of target inflation alone.

## Search policies

Seeded simulations compared three policies while accounting for travel, fixture lighting, the Heart's variable depth, search checks, and extraction:

- never search;
- search selectively while the Scene target is 12 or lower;
- search every conquered Scene.

With one 12-Light Torch and no reserve, approximate extraction rates were 42% for never searching and 17% for either search policy. Selective searching succeeded on about 68% of its attempts, compared with about 66% for always searching, and spent fewer tokens on weak late checks.

Searching is therefore not automatically correct. A selective early search is the efficient gambling strategy, but it knowingly trades extraction safety for Loot. Searching in a permanently illuminated Scene remains free and is intentionally the obvious choice.

## Light sensitivity

A spare fresh Torch raised extraction to approximately 99-100% in this model. It is consequently premium expedition Loot rather than a minor refill. A randomly generated starting item supplies one inconsistently, preserving meaningful variation between expeditions.

## Combat pressure

A route that treats every hostile Scene as a direct damage race remains unsustainable. Full-combat estimates produced substantially more incoming actions than the party could absorb before the Heart. The intended play therefore depends on terrain, stealth, negotiation, Past abilities, and other fictional bypasses as well as attacks.

## Decision

Use the two-Scenes-per-point curve with a target cap of 15. Do not add a guaranteed reserve Torch or make search free in dark Scenes. Revisit Light supply after observed table play, where creative bypasses and deliberate fixture use can be measured more accurately than in an abstract combat model.