# 5. SPACING — THE MOST IMPORTANT VISUAL UPGRADE

Implement a deliberate spacing system.

The website must feel spacious, precise, and calm.

Do not compress content into dense grids. Do not scatter elements randomly. Use whitespace to establish relationships between elements.

## Base spacing system

Use an 8px-based spacing scale:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;
  --space-11: 160px;
}
```

Use these values as a coherent system rather than applying them mechanically.

## Page margins

**Desktop:**
- Main content width: approximately 1120–1320px.
- Horizontal page padding: 48–72px on spacious desktop layouts.
- Section spacing: approximately 96–144px where the content warrants it.

**Tablet:**
- Horizontal padding: 28–40px.
- Section spacing: approximately 72–96px.

**Mobile:**
- Horizontal padding: 20–24px.
- Section spacing: approximately 56–80px.

Avoid excessively wide text columns.

Use a maximum-width container for long-form text and a separate wider container for imagery, maps, and visual compositions.

## Internal spacing

- Keep headings and their supporting paragraphs closely associated.
- Leave sufficient space between different content groups.
- Separate sections with whitespace, subtle rules, changes in image composition, or changes in background tone.
- Keep button padding proportional to its label.
- Do not give every component identical padding.
- Avoid repetitive vertical spacing that makes the page feel mechanically generated.

## The whitespace test

Every section should have a clear focal point.

If a section contains a heading, paragraph, image, and CTA, arrange them according to their importance.

Do not place all four inside a white rounded rectangle merely to make them look organised.

Use layout, alignment, and spacing instead.
