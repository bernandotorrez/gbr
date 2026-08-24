# ANTISLOP.md

# Anti-Slop UI Rules

> This file is a quality filter for AI-generated UI.
> It works together with DESIGN.md.
>
> DESIGN.md defines the visual direction.
> ANTISLOP.md prevents generic AI output.

---

# 1. Activation

These rules apply whenever the agent:

* creates a page
* creates a component
* redesigns a section
* changes visual styling
* creates responsive layouts
* adds animations
* writes marketing UI copy
* selects imagery
* modifies the design system

Before implementation:

1. Read `DESIGN.md`.
2. Understand the page's purpose.
3. Identify the content that is actually available.
4. Apply the design direction.
5. Run the anti-slop checks before delivery.

Never start from a generic landing-page template.

---

# 2. Core Principle

Every visual decision must have a reason.

Ask:

> Why does this element exist?

If the answer is:

```text
"It looks modern."
"It looks cool."
"AI usually does this."
"There was empty space."
```

the element should probably be removed.

Prefer:

```text
purpose → design decision
```

over:

```text
trend → design decision
```

---

# 3. Hard Gate — Never Ship These Patterns

## R-01 — No Generic Purple/Blue SaaS Gradient

Never introduce:

```text
purple → blue
blue → indigo
pink → purple
```

gradients as a default visual solution.

The project uses an emerald/warm-neutral property palette.

---

## R-02 — No Decorative Gradient Text

Do not use:

```css
background-clip: text
```

for decorative gradients.

Headlines should rely on typography and composition.

---

## R-03 — No Glassmorphism by Default

Do not create:

```text
backdrop blur
glass cards
transparent floating panels
```

unless there is a documented functional reason.

Residential property pages should prioritize architecture and photography.

---

## R-04 — No "Three Feature Cards" Reflex

Do not automatically create:

```text
[Icon] Feature 1
[Icon] Feature 2
[Icon] Feature 3
```

This is one of the most common AI-generated landing page patterns.

If three items genuinely exist, find a more editorial composition.

---

## R-05 — No Decorative Icon Explosion

Do not put icons:

* beside every heading
* inside every card
* before every bullet
* into empty spaces

Icons should communicate meaning.

---

## R-06 — No Emoji as UI

Never use emoji as:

* navigation icons
* feature icons
* amenity icons
* CTA decorations
* section decoration

Use Lucide or appropriate SVG assets.

---

## R-07 — No Fake Metrics

Never invent:

```text
10,000+ families
98% satisfaction
15 years of experience
#1 developer
500+ homes sold
4.9/5 rating
```

unless the project data explicitly provides them.

---

## R-08 — No Fake Testimonials

Never invent:

* names
* customer quotes
* occupations
* ratings
* profile photos

If there are no real testimonials, remove the section.

---

## R-09 — No Fake Property Information

Never invent:

* prices
* land size
* building size
* number of bedrooms
* completion date
* distance
* travel time
* facilities
* certifications

Use placeholders or omit the information.

---

## R-10 — No Fake Maps

Do not construct fake maps from:

```text
random boxes
random circles
CSS roads
fake location markers
```

Use actual map/project assets.

---

# 4. Layout Anti-Slop

## R-11 — Do Not Repeat Identical Sections

Avoid:

```text
Section
3 cards

Section
3 cards

Section
3 cards

Section
3 cards
```

Each section should have a reason to exist and a visual identity.

---

## R-12 — Do Not Make Everything a Card

Not every content block needs:

```text
background
border
radius
shadow
padding
```

Use:

* whitespace
* typography
* imagery
* alignment
* section boundaries

as alternatives.

---

## R-13 — Avoid Excessive Rounded Corners

Do not automatically apply:

```text
rounded-2xl
rounded-3xl
rounded-full
```

to everything.

Use the radius system in `DESIGN.md`.

---

## R-14 — Avoid Excessive Shadows

If every card has a shadow, the page becomes visually noisy.

Prefer:

```text
contrast
spacing
borders
photography
```

over elevation.

---

## R-15 — Avoid Centering Everything

Do not center:

* every headline
* every paragraph
* every CTA
* every card
* every section

Editorial layouts often benefit from asymmetric alignment.

---

## R-16 — Avoid Symmetry for Its Own Sake

Do not make every section:

```text
50 / 50
50 / 50
50 / 50
```

Use:

```text
7 / 5
5 / 7
8 / 4
4 / 8
```

when the content benefits from it.

---

# 5. Property-Specific Rules

## R-17 — Photography Must Matter

The property itself should be the visual hero.

Do not allow decorative UI to overpower:

* houses
* architecture
* landscape
* masterplan
* neighborhood
* lifestyle

---

## R-18 — Do Not Hide the Product

Visitors should understand what is being sold quickly.

The page should reveal:

```text
Project
Location
Homes
House Types
Environment
Price / inquiry path
Contact
```

where actual data exists.

---

## R-19 — Do Not Replace Real Information With Buzzwords

Bad:

```text
Experience unparalleled luxury.
```

Better:

```text
Three-bedroom homes with private gardens
and natural light throughout the main living spaces.
```

Specificity beats adjectives.

---

## R-20 — No Generic Luxury Copy

Avoid phrases such as:

```text
Unparalleled luxury
Ultimate lifestyle
Elevated living
Exclusive sanctuary
World-class living
Dream home
Premium lifestyle
Unmatched elegance
```

unless they are part of approved brand copy.

---

# 6. Component Rules

## R-21 — Components Must Have Purpose

Create a component because it has:

* reusable behavior
* semantic meaning
* repeated visual structure
* state
* interaction

Not simply because a `<div>` exists.

---

## R-22 — Avoid Component Soup

Do not turn:

```text
Heading
Paragraph
Spacer
Wrapper
Container
Box
Card
Content
```

into dozens of meaningless abstractions.

Keep implementation understandable.

---

## R-23 — Reuse Visual Patterns

If two sections use the same component, they should look intentionally related.

Do not create slightly different versions of:

```text
Button
Card
Heading
Input
```

without a reason.

---

# 7. Typography Anti-Slop

## R-24 — No Typography Soup

Use the fonts defined in `DESIGN.md`.

Do not introduce another font because:

> "It looks nice."

---

## R-25 — No Oversized Everything

Not every heading should be:

```text
72px+
```

Reserve dramatic typography for meaningful statements.

---

## R-26 — No Excessive Uppercase

Uppercase should be reserved for:

* small metadata
* section labels
* navigation details

Do not turn paragraphs into uppercase text.

---

# 8. Decoration Rules

## R-27 — Every Decoration Needs a Reason

Before adding:

* circle
* line
* blob
* gradient
* pattern
* grain
* floating shape
* glow

explain its purpose.

If it has no purpose, remove it.

---

## R-28 — Architecture Over Decoration

When choosing between:

```text
decorative shape
```

and:

```text
real architectural image
```

prefer the real property image.

---

## R-29 — Do Not Add Noise to Empty Space

Whitespace is intentional.

Do not fill every empty region.

Premium design requires breathing room.

---

# 9. Animation Rules

## R-30 — No Animation Everywhere

Do not animate every:

* card
* paragraph
* icon
* button
* section

---

## R-31 — Motion Must Communicate Something

Allowed reasons:

```text
Reveal
Hierarchy
Feedback
Navigation
Continuity
State change
```

Not allowed:

```text
Because animation looks cool.
```

---

## R-32 — Respect Reduced Motion

Provide support for:

```css
@media (prefers-reduced-motion: reduce)
```

Animations should become minimal or disappear.

---

# 10. Content Quality

## R-33 — No Filler Copy

Do not generate filler such as:

```text
Lorem ipsum
Your journey begins here
Built for the future
Designed for modern living
Experience the difference
```

unless the phrase is intentionally part of the brand voice.

---

## R-34 — Do Not Invent Missing Content

When data is unavailable:

```text
[PROJECT NAME]
[LOCATION]
[PRICE]
```

is better than fabricated information.

---

## R-35 — CTA Must Describe the Action

Avoid:

```text
Learn More
Click Here
Get Started
Submit
Explore
```

when a more specific action is possible.

Prefer:

```text
Schedule a Visit
View House Types
Get Price List
Chat with Sales
Download Brochure
```

---

# 11. Responsive Anti-Slop

## R-36 — Mobile Is Not a Shrunk Desktop

On mobile:

* rethink composition
* reduce visual density
* preserve image impact
* preserve typography hierarchy
* keep CTA accessible
* prevent horizontal overflow

Do not simply stack every desktop element.

---

## R-37 — Protect Tap Targets

Interactive controls must be comfortably tappable.

Do not create tiny:

```text
icon-only buttons
```

without sufficient touch area.

---

## R-38 — Test Real Content

Never validate the design using only:

```text
Lorem ipsum
Short fake title
Fake one-line description
```

Real content changes layout.

Test with:

* long property names
* long addresses
* real images
* realistic prices
* long testimonials
* mobile viewport

---

# 12. Liveliness Toolkit

Anti-slop does NOT mean boring.

The page must feel alive.

Use these levers intentionally.

---

## ENERGY

Target:

```text
2 / 5
```

Create energy through:

* strong photography
* typography
* contrast
* scale
* composition

Not through:

* gradients
* glowing effects
* excessive animation

---

## RHYTHM

Target:

```text
4 / 5
```

Create rhythm through:

```text
large image
→
small information
→
large statement
→
asymmetric composition
→
masterplan
→
gallery
```

Do not repeat identical layouts.

---

## MOTION

Target:

```text
2 / 5
```

Motion should be:

```text
quiet
slow
intentional
```

---

# 13. Design Read Before Implementation

Before building a major section, identify:

```text
Purpose:
What does this section communicate?

Primary content:
What is the most important thing?

Visual anchor:
What should the eye see first?

Supporting content:
What does the visitor need next?

Action:
What should the visitor do?

Reason:
Why is this layout appropriate?
```

Example:

```text
Purpose:
Show the quality of the residences.

Primary content:
Architectural photography.

Visual anchor:
Large exterior image.

Supporting content:
House type and specifications.

Action:
View residence details.

Reason:
Property photography is more persuasive
than a generic feature-card layout.
```

---

# 14. Image Selection Test

Before using an image, ask:

1. Is it relevant to the actual property?
2. Does it communicate something?
3. Is it high enough quality?
4. Does the crop work on mobile?
5. Does it support the surrounding copy?
6. Is it better than leaving the space empty?

If not, do not use it.

---

# 15. AI Template Detection

Before delivery, inspect the page from a distance.

If the page can be described as:

```text
Navbar
Hero
Badge
Big heading
Two buttons
Three cards
Gradient section
Testimonials
Pricing
CTA
```

STOP.

Recompose the page.

The website must have a property-specific visual narrative.

---

# 16. Screenshot Review

Before considering the UI finished, inspect:

```text
Desktop 1440px
Desktop 1920px
Tablet 1024px
Mobile 390px
Mobile 430px
```

Check:

* typography
* image crops
* spacing
* navigation
* CTA visibility
* horizontal overflow
* section rhythm
* contrast
* alignment
* loading states
* interaction states

---

# 17. Delivery Gate

Before delivering UI, report:

## HARD GATE

```text
[PASS/FAIL] No fake information
[PASS/FAIL] No fake testimonials
[PASS/FAIL] No fake metrics
[PASS/FAIL] No fake maps
[PASS/FAIL] No generic SaaS visual language
[PASS/FAIL] No decorative AI patterns without purpose
```

## DESIGN

```text
[PASS/FAIL] Follows DESIGN.md
[PASS/FAIL] Emerald palette is consistent
[PASS/FAIL] Typography is consistent
[PASS/FAIL] Property photography is prioritized
[PASS/FAIL] Layout has editorial rhythm
```

## RESPONSIVE

```text
[PASS/FAIL] Desktop
[PASS/FAIL] Tablet
[PASS/FAIL] Mobile
[PASS/FAIL] No horizontal overflow
[PASS/FAIL] Touch targets are usable
```

## CRAFT

```text
[PASS/FAIL] Real content used where available
[PASS/FAIL] No filler copy
[PASS/FAIL] No unnecessary components
[PASS/FAIL] Motion is purposeful
[PASS/FAIL] Accessibility considered
[PASS/FAIL] Performance considered
```

---

# 18. Final Rule

Do not optimize for:

> "Does this look impressive in a screenshot?"

Optimize for:

> "Does this look like a real property brand with a deliberate visual identity?"

The final page should feel:

```text
Designed
Not generated.

Specific
Not generic.

Calm
Not empty.

Premium
Not flashy.

Human
Not synthetic.

Architectural
Not SaaS.
```

If a design decision makes the website look more like a generic AI landing page, reject it and return to `DESIGN.md`.
