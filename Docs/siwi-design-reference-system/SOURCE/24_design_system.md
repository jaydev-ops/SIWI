# 33. DESIGN SYSTEM IMPLEMENTATION

Create a consistent design system before building individual pages.

## Design tokens

Define:
- Brand colours.
- Typography.
- Font weights.
- Heading scales.
- Body text scales.
- Spacing.
- Page widths.
- Grid dimensions.
- Borders.
- Corner radii.
- Shadows.
- Animation timing.
- Focus styles.
- Light-mode surfaces.
- Dark-mode surfaces.

## Corner radii

Use a restrained system.

```css
:root {
  --radius-small: 4px;
  --radius-medium: 8px;
  --radius-large: 12px;
}
```

Use larger radii only where justified by the component.

Do not automatically give every image, button, section, and container a rounded appearance.

## Borders

Prefer thin, subtle separators.

```css
border: 1px solid rgba(128, 128, 128, 0.18);
```

Adjust the value for each theme and test the resulting contrast.

## Shadows

Use shadows sparingly.

Avoid large, soft shadows around ordinary content sections.

The website should derive its visual depth primarily from contrast, image composition, and spacing.
