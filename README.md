# DairyFed — Website

A static, responsive marketing/investor website for DairyFed, built from the provided pitch deck using only HTML5, CSS3, and vanilla JavaScript (no frameworks).

## Structure

```
/
├── index.html        Focused homepage
├── problem/
├── platform/
├── experiences/
├── modules/
├── roadmap/
├── impact/
├── business/
├── growth/
├── investment/
├── contact/           Dedicated page routes (each contains index.html)
├── style.css          Shared design tokens, layout, components, responsive rules
├── script.js          Shared navigation, interactions, charts and forms
├── assets/            Reserved for future images/icons
└── README.md
```

The site is a multi-page static website. The navbar and footer are rendered from
`script.js` on every page, while each route owns only its relevant content. Use a
static server that serves directory index files so routes such as `/platform/`
and `/contact/` continue to work when refreshed.

## Notes on content

- All copy, figures, stakeholders, modules, and roadmap phases are drawn directly from the pitch deck. Nothing (team names, customers, testimonials, certifications, real dashboard data) has been invented.
- Financial figures are labeled **Illustrative Projection** and are not presented as achieved results.
- Dashboard previews are explicitly marked "Platform Preview" and use static sample data — no backend is implied.
- Forms are architected for a "validate → pre-filled external form → manual submit" flow. JavaScript performs client-side validation only; nothing is auto-submitted anywhere. To connect to Google Forms, replace the `openModal()` call in `js/script.js`'s form submit handler with a redirect to your pre-filled Google Form URL (mapping each field to its corresponding `entry.<id>` parameter).

## Design system

- **Colors:** Deep navy (#0B2545), ivory (#FBF8F1), fresh green (#3A7D44), muted blue (#4A7A96), warm ochre accent (#C17D3D), plus stakeholder accent colors (farmer green, cooperative blue, federation navy, government gold, veterinary teal).
- **Type:** Space Grotesk (headings), Plus Jakarta Sans (body).
- **Signature element:** an animated "information conduit" — a dashed flow line in the hero and a radial ecosystem diagram — visualizing the site's core thesis that the physical dairy network is connected while the information layer is not (yet).

## Browser support

Modern evergreen browsers. Respects `prefers-reduced-motion: reduce`.
