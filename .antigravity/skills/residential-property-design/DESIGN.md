# DESIGN.md

# Residential Property — Design System

> This file is the visual source of truth for the residential property website.
> Every UI decision must follow this document unless the user explicitly overrides it.

---

## 1. Design Intent

### Product

A premium residential property / housing development landing page.

### Primary Goal

Convert visitors into qualified property prospects.

The website should communicate:

1. The quality of the homes.
2. The quality of the surrounding environment.
3. The lifestyle offered by the development.
4. The credibility of the developer.
5. The location and accessibility.
6. The available house types.
7. A clear path to inquiry / site visit / WhatsApp contact.

### Emotional Response

The visitor should feel:

* Calm
* Safe
* Aspirational
* Established
* Natural
* Sophisticated
* Trustworthy
* Family-oriented
* Worth investing in

The website should NOT feel:

* Like a SaaS dashboard
* Like a fintech website
* Like a generic startup
* Like a template marketplace
* Like an AI-generated landing page
* Cheap
* Overly luxurious or ostentatious
* Visually noisy

---

# 2. Aesthetic Direction

## Core Aesthetic

### "Contemporary Nature × Premium Property Editorial"

The visual language combines:

* Contemporary architecture
* Natural materials
* Editorial typography
* Large architectural photography
* Warm neutral surfaces
* Deep emerald accents
* Generous whitespace
* Restrained interaction design

The site should feel closer to a premium property brochure or architecture studio website than a conventional marketing template.

---

# 3. Design Dials

Use these values when making design decisions.

```text
ENERGY  = 2 / 5
RHYTHM  = 4 / 5
MOTION  = 2 / 5
```

### ENERGY — 2

Calm and premium.

Avoid visual shouting.

Do not use:

* loud gradients
* excessive saturated colors
* decorative blobs
* oversized badges
* excessive animation

### RHYTHM — 4

The page should have strong editorial composition.

Alternate:

* large image sections
* text-led sections
* asymmetric layouts
* architectural details
* full-width visual moments
* compact information sections

Avoid repeating the same section structure.

### MOTION — 2

Motion should communicate quality, not entertainment.

Prefer:

* subtle image reveals
* opacity transitions
* slight translate transitions
* hover transitions
* navigation state transitions

Avoid:

* excessive parallax
* bouncing elements
* constant scroll animation
* dramatic 3D effects

---

# 4. Brand Personality

The brand voice is:

```text
Quiet confidence.
Warm.
Human.
Architectural.
Precise.
Modern.
Grounded.
```

Avoid:

```text
Aggressive sales language.
Startup jargon.
Corporate buzzwords.
Generic luxury language.
AI-generated marketing phrases.
```

Avoid phrases such as:

* "Discover your dream home"
* "The ultimate living experience"
* "Where luxury meets modern living"
* "Elevate your lifestyle"
* "Unparalleled luxury"
* "Your dream home awaits"

Prefer specific language based on actual project characteristics.

Example:

```text
A quieter address, surrounded by trees.

Homes designed around light, air, and everyday family life.
```

---

# 5. Color System

## Primary Brand Color

### Emerald

```text
Primary Emerald
HEX: #047857
RGB: 4 120 87

Deep Emerald
HEX: #064E3B

Emerald Dark
HEX: #065F46

Emerald Soft
HEX: #D1FAE5

Emerald Pale
HEX: #ECFDF5
```

Emerald is the brand accent, NOT the dominant background color.

---

## Neutral Palette

```text
Ink
#17201C

Ink Soft
#34413B

Warm Black
#1C211E

Stone
#6B746E

Warm Gray
#8A908B

Border
#D9DED9

Border Soft
#E8EBE7

Warm White
#FAF9F6

Paper
#F5F3EE

Sand
#EEEAE0

Pure White
#FFFFFF
```

---

## Color Distribution

Recommended approximate distribution:

```text
Warm White / White / Photography
70%

Ink / Deep Emerald / Dark surfaces
20%

Emerald accent
10%
```

Do not turn the entire website green.

Emerald should behave like a premium brand accent.

---

## Dark Sections

Dark sections may use:

```text
Background:
#064E3B

Primary text:
#FAF9F6

Secondary text:
#D1FAE5

Accent:
#A7F3D0
```

Dark emerald sections should be used intentionally for:

* project statement
* masterplan highlight
* CTA
* developer statement
* location highlight

Do not make every section dark.

---

# 6. Typography

## Primary Recommendation

Use:

```text
Display:
Cormorant Garamond

Body:
Manrope
```

Alternative:

```text
Display:
DM Serif Display

Body:
Inter
```

Alternative for a more contemporary architectural direction:

```text
Display:
Instrument Serif

Body:
Geist
```

Prefer the first combination unless the project brand specifies otherwise.

---

# 7. Typography Hierarchy

## Display / Hero

Desktop:

```text
font-size: clamp(3.5rem, 7vw, 7rem)
line-height: 0.95–1.05
letter-spacing: -0.025em
font-weight: 400
```

The display font should feel editorial, not bold and corporate.

Use line breaks intentionally.

Example:

```text
A quieter
place to live.
```

---

## Section Heading

```text
font-size: clamp(2.5rem, 5vw, 4.5rem)
line-height: 1.0–1.1
font-weight: 400
```

---

## Large Statement

```text
font-size: clamp(2rem, 4vw, 3.5rem)
line-height: 1.1
font-weight: 400
```

---

## Body Large

```text
font-size: 1.125rem
line-height: 1.7
```

---

## Body

```text
font-size: 1rem
line-height: 1.65
```

---

## Small / Metadata

```text
font-size: 0.75rem–0.875rem
line-height: 1.4
letter-spacing: 0.04em
```

Use uppercase sparingly.

---

# 8. Typography Rules

DO:

* Use serif typography for major emotional statements.
* Use sans-serif typography for information.
* Create obvious hierarchy.
* Use short headlines.
* Allow whitespace around typography.
* Use intentional line breaks for major headings.

DO NOT:

* Make every heading uppercase.
* Use bold sans-serif for every heading.
* Use giant text everywhere.
* Use gradient text.
* Use 3–4 font families.
* Use excessive letter spacing.
* Center every piece of content.

---

# 9. Spacing System

Base unit:

```text
4px
```

Preferred spacing scale:

```text
4
8
12
16
20
24
32
40
48
64
80
96
120
160
200
```

Use spacing to establish hierarchy.

---

## Section Spacing

Desktop:

```text
Small section:
64–96px

Normal section:
96–140px

Major editorial section:
140–200px
```

Mobile:

```text
Small section:
48–64px

Normal section:
64–96px

Major section:
96–120px
```

Do not give every section the exact same padding.

---

# 10. Container

Desktop:

```text
max-width: 1440px
padding-inline: 32px–64px
```

Large desktop:

```text
max-width: 1600px
```

Mobile:

```text
padding-inline: 20px
```

Content should breathe.

Do not force every section into the exact same width.

---

# 11. Grid

Primary desktop grid:

```text
12 columns
gap: 24px
```

Common compositions:

```text
7 / 5
5 / 7
8 / 4
4 / 8
6 / 6
```

Avoid:

```text
3 identical cards
3 equal columns
3 feature icons
```

unless the content genuinely requires it.

---

# 12. Border Radius

Use restrained radius.

```text
Buttons:
6px

Inputs:
6px

Small cards:
8px

Large media containers:
10–12px

Dialog:
12px
```

Avoid:

```text
rounded-full everywhere
rounded-3xl everywhere
rounded-[32px] everywhere
```

Pills are reserved for:

* tags
* filters
* compact status indicators
* small metadata

---

# 13. Shadows

Prefer borders and tonal contrast over heavy shadows.

Default:

```text
box-shadow: none
```

Subtle elevation:

```text
0 8px 30px rgba(20, 35, 28, 0.06)
```

Use shadows only when an element needs to visually float.

Do not put shadows on every card.

---

# 14. Photography Direction

Photography is a primary design element.

Prefer:

* real architectural photography
* real house exteriors
* natural daylight
* golden-hour photography
* gardens
* family lifestyle
* neighborhood context
* material details
* doors
* windows
* landscaping
* streetscape
* aerial masterplan photography

Avoid generic stock photography whenever actual project imagery exists.

---

## Image Treatment

Images should feel:

```text
Natural
Warm
Architectural
Quiet
High quality
```

Do not:

* apply heavy filters
* add excessive overlays
* use fake gradients over every image
* use generic AI-generated houses when real photography is available

---

# 15. Hero

The hero should be image-led.

Preferred composition:

```text
┌───────────────────────────────────────┐
│ NAV                                   │
│                                       │
│                    architectural      │
│                    photography        │
│                                       │
│  A quieter                            │
│  place to live.                       │
│                                       │
│  [Explore Homes]                      │
└───────────────────────────────────────┘
```

Hero should contain:

1. Strong project image.
2. Project name or location.
3. Short, specific headline.
4. Short supporting statement.
5. One primary CTA.
6. Optional secondary text CTA.

Do not place:

* 5 buttons
* fake statistics
* decorative blobs
* giant gradient text
* floating glass cards
* unnecessary badges

---

# 16. Navigation

Navigation should be minimal.

Recommended:

```text
Logo

About
The Homes
Location
Gallery

[Schedule a Visit]
```

Desktop navigation may use:

```text
transparent over hero
```

and transition to:

```text
warm white / solid background
```

after scrolling.

Navigation should not consume excessive vertical space.

---

# 17. Buttons

## Primary

```text
Background:
#047857

Text:
#FFFFFF

Radius:
6px

Height:
44–52px

Horizontal padding:
20–28px
```

Hover:

```text
Background:
#065F46
```

Transition:

```text
150–220ms ease
```

---

## Secondary

Prefer:

```text
text button
```

or:

```text
transparent button
with subtle border
```

Do not create five competing button styles.

---

# 18. Property Cards

Property cards should be image-first.

Structure:

```text
Image
House Type
Short descriptor
Land / Building information
Starting price, only if real
CTA
```

Example:

```text
Type Aster

3 Bedrooms
72 m² Building
90 m² Land

View Residence →
```

Do not turn every property card into a floating rounded container.

Prefer:

```text
large image
minimal metadata
strong typography
```

---

# 19. Information Cards

Cards should only exist when grouping information improves comprehension.

Good use:

* house specifications
* location information
* amenities
* contact information

Bad use:

* every paragraph
* every feature
* every section
* decorative empty containers

---

# 20. Masterplan

The masterplan is a major trust element.

Preferred composition:

```text
Large masterplan image
+
Small explanatory text
+
Location markers
+
Key access information
```

Do not recreate a fake map using random CSS shapes.

Use real map imagery, project masterplan assets, or an actual map integration.

---

# 21. Location Section

Show actual useful information:

```text
Project Location

5 min — [actual destination]
10 min — [actual destination]
15 min — [actual destination]
```

Only use verified information.

Never invent travel times.

Use:

* map
* road network
* nearby facilities
* transportation
* landmarks

---

# 22. Amenities

Do not use a generic 3×3 icon grid.

Instead create an editorial composition.

Example:

```text
Large image                    Small detail
Swimming pool                  Garden

                           "Spaces designed
                            for everyday life."

Community area                 Playground
```

Amenities should be shown visually wherever possible.

---

# 23. Gallery

Use an editorial gallery.

Recommended:

```text
Large image
Small image
Vertical image
Wide image
```

Vary image aspect ratios.

Do not use a uniform 3-column grid for every image.

---

# 24. Social Proof

If testimonials are available, use real people and real statements.

Show:

```text
Name
Relationship to property
Actual quote
```

Never fabricate:

* customer names
* reviews
* ratings
* occupancy statistics
* sales numbers

If no real testimonials exist, omit the section.

---

# 25. Trust / Developer Section

The developer section should establish credibility.

Possible content:

```text
Developer
Years of experience
Completed projects
Certifications
Project history
Actual company information
```

Only show verified facts.

No fake "trusted by thousands" claims.

---

# 26. CTA Strategy

Primary conversion:

```text
Schedule a Visit
```

Secondary:

```text
Chat via WhatsApp
Download Brochure
View House Types
Get Price List
```

Do not create more than one dominant CTA per section.

---

# 27. WhatsApp CTA

For Indonesian residential projects, WhatsApp can be the primary conversion channel.

Use a clear action:

```text
Chat with Sales
```

or:

```text
Schedule a Site Visit
```

Do not use generic:

```text
Click Here
Learn More
Submit
```

---

# 28. Forms

Keep forms short.

Preferred:

```text
Name
WhatsApp Number
Interested House Type
Preferred Visit Date
[Send Request]
```

Do not ask unnecessary information.

Form labels must be explicit.

Inputs must have:

* visible label
* focus state
* error state
* success state
* disabled state

---

# 29. Responsive Design

Design mobile intentionally.

Do not simply shrink desktop.

Desktop:

```text
12-column editorial grid
large imagery
asymmetric compositions
```

Tablet:

```text
8-column grid
reduced spacing
```

Mobile:

```text
4-column conceptual grid
single-column content
large photography
horizontal overflow only when intentional
```

---

# 30. Mobile Navigation

Use a clean menu.

Avoid:

* oversized full-screen menus
* excessive animation
* nested navigation complexity

Primary CTA should remain easily accessible.

---

# 31. Motion System

Motion should be subtle.

Durations:

```text
Micro interaction:
120–180ms

UI transition:
180–250ms

Image reveal:
400–700ms
```

Easing:

```text
ease-out
```

Use motion for:

* image reveal
* hover
* navigation transition
* menu opening
* gallery interaction
* section entrance

Do not animate every element on scroll.

---

# 32. Scroll Reveal

Use reveal selectively.

Good:

```text
Large image:
opacity + translateY 16px

Headline:
opacity + translateY 12px
```

Bad:

```text
Every paragraph
Every card
Every icon
Every button
```

The page should still feel good with animations disabled.

---

# 33. Interaction States

Every interactive element must define:

```text
Default
Hover
Focus
Active
Disabled
Loading
Error
Success
```

Keyboard focus must remain visible.

Never remove focus outlines without providing an equivalent accessible state.

---

# 34. Accessibility

Minimum expectations:

* semantic HTML
* keyboard navigation
* visible focus states
* sufficient contrast
* meaningful alt text
* proper heading hierarchy
* accessible form labels
* buttons must have clear names
* images must not contain essential information without text alternatives

Never sacrifice accessibility for aesthetics.

---

# 35. Content Rules

Use actual project information.

When information is unavailable:

```text
Do not invent it.
```

Instead use:

```text
[PROJECT NAME]
[LOCATION]
[PRICE]
[HOUSE TYPE]
[DEVELOPER]
```

or omit the content until real data exists.

---

# 36. Copy Style

Copy should be:

```text
Specific
Short
Warm
Human
Confident
Grounded
```

Prefer:

```text
Designed for mornings with more light
and evenings that feel a little slower.
```

Over:

```text
Experience the ultimate luxury lifestyle
in an unparalleled residential destination.
```

---

# 37. Component Philosophy

Components should be reusable but not visually repetitive.

Recommended component system:

```text
Button
Container
Section
Heading
Navigation
Hero
PropertyCard
PropertyGrid
ImageBlock
Gallery
Masterplan
LocationBlock
AmenityBlock
DeveloperBlock
Testimonial
ContactForm
CTA
Footer
```

Do not create a component solely to wrap a single `<div>` unless it provides real semantic or behavioral value.

---

# 38. Iconography

Preferred:

```text
Lucide Icons
```

Use icons sparingly.

Icons should communicate meaning.

Do not use icons as decoration simply because an empty space exists.

Never use emoji as UI icons.

---

# 39. Backgrounds

Preferred:

```text
Warm White
White
Paper
Deep Emerald
Photography
```

Use texture only when it supports the brand.

Avoid:

* noisy grain everywhere
* abstract blobs
* random geometric decorations
* generic gradient backgrounds

---

# 40. Decorative Elements

Decorative elements must have a reason.

Good:

```text
architectural line
subtle grid
project coordinate
section number
small typographic marker
```

Bad:

```text
random circle
random blob
random gradient
random floating shape
```

The visual language should feel architectural.

---

# 41. Editorial Details

Use small details to create sophistication:

```text
01 — THE RESIDENCE

A QUIETER ADDRESS

West Jakarta
04° 12' ...
```

These should support the architecture/property narrative.

Do not add fake coordinates or fake technical information.

---

# 42. Section Numbering

Optional.

Use:

```text
01
02
03
```

with small metadata.

Example:

```text
01 — THE HOMES
02 — THE NEIGHBORHOOD
03 — THE MASTERPLAN
04 — THE LOCATION
```

This reinforces the editorial/architectural feel.

---

# 43. Page Architecture

Recommended landing page:

```text
01  NAVIGATION

02  HERO

03  PROJECT STATEMENT

04  THE RESIDENCE

05  LIFESTYLE / LIVING

06  HOUSE TYPES

07  MASTERPLAN

08  AMENITIES

09  LOCATION

10  GALLERY

11  DEVELOPER / TRUST

12  CONTACT CTA

13  FOOTER
```

Sections may be removed if the real content does not support them.

Do not add sections merely to make the page longer.

---

# 44. Performance

Visual quality must not destroy performance.

Prioritize:

* responsive images
* WebP / AVIF where appropriate
* lazy loading below the fold
* optimized hero image
* minimal JavaScript
* CSS transitions over JS animation when possible
* avoid unnecessary animation libraries

The hero image is the highest visual priority and must also be optimized carefully.

---

# 45. Implementation Defaults

Recommended stack:

```text
Framework:
Existing project framework

Styling:
Tailwind CSS

UI primitives:
Radix / shadcn where appropriate

Icons:
Lucide

Animation:
CSS first
Motion library only when necessary
```

Do not introduce a UI framework solely to make the page look attractive.

The design system should remain understandable in the codebase.

---

# 46. Design Decision Rule

When uncertain between two visual solutions, choose the option that:

1. Communicates the property better.
2. Uses real content.
3. Creates stronger hierarchy.
4. Uses fewer decorative elements.
5. Feels more editorial.
6. Preserves whitespace.
7. Looks intentional at both desktop and mobile.

---

# 47. Anti-Generic Rule

Never produce a page that could be described as:

> "A modern SaaS landing page with a green theme."

The output must unmistakably look like:

> "A premium residential property website."

---

# 48. Final Visual Test

Before considering the UI complete, ask:

### At first glance

* Is this obviously a property website?
* Is the architecture/house the visual hero?
* Does emerald feel like a brand rather than a background color?
* Does the typography feel premium?
* Does the page feel calm?

### After scrolling

* Does each section have a distinct visual rhythm?
* Are real project details visible?
* Is photography doing meaningful work?
* Is there enough whitespace?
* Are sections avoiding repetitive card layouts?

### Before delivery

* Does anything look like an AI-generated template?
* Is any decoration unnecessary?
* Are any claims invented?
* Are any buttons unclear?
* Does mobile feel intentionally designed?

If any answer is "yes", revise before delivery.
