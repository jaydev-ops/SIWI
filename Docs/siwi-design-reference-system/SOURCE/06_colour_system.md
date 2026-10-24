# 6. COLOUR SYSTEM — BLACK, IVORY, GOLD, AND RESTRAINED NEUTRALS

Do not make the website predominantly green.

Green is not the defining colour of this brand.

The existing black-and-gold identity is more distinctive and should remain the foundation.

Create a restrained palette that feels professional, contemporary, and appropriate for international B2B trade.

## Primary colours

```css
:root {
  --brand-ink: #111318;
  --brand-charcoal: #191C21;
  --brand-gold: #C69A45;
  --brand-gold-light: #D9B66C;
  --brand-ivory: #F5F2EB;
  --brand-white: #FFFFFF;
  --brand-grey-100: #F2F2F0;
  --brand-grey-300: #D8D7D2;
  --brand-grey-500: #858585;
  --brand-grey-700: #45474B;
  --brand-grey-900: #24262A;
}
```

## Dark mode

Dark mode should be a complete visual experience, not simply a black background applied to a light website.

Use:
- Near-black backgrounds.
- Slightly lighter charcoal surfaces when separation is necessary.
- Ivory typography for comfortable reading.
- Restrained gold for brand recognition and important actions.
- Muted neutral grey for secondary information.
- Fine, low-contrast borders.

Gold should never dominate every component. Use it to guide attention.

## Light mode

Light mode should feel like an editorial trade publication.

Use:
- Warm ivory or off-white backgrounds.
- Near-black text.
- Gold accents.
- Light grey separators.
- Carefully selected charcoal sections for contrast.

Avoid the sterile appearance of a generic white SaaS dashboard.

## Colour allocation

As a rough guide:
- 65–75% neutral backgrounds.
- 15–25% secondary neutral tones.
- 5–10% gold and other brand accents.

This is a visual guideline, not a fixed formula.

## Gold usage rules

**Use gold for:**
- Selected navigation indicators.
- Small decorative rules.
- The brand wordmark.
- Important CTA details.
- Fine-line illustrations.
- Subtle hover states.
- Occasional product metadata.

**Avoid:**
- Gold backgrounds on every button.
- Gold borders around every component.
- Gold icons beside every heading.
- Excessive metallic gradients.
- Large glowing gold elements.
- Fake chrome or glossy effects.

The gold should feel like a deliberate brand material, not a decorative effect applied everywhere.

## Dark and light mode requirements

Provide a visible theme toggle in the main navigation.

Requirements:
- Persist the selected theme across visits.
- Respect the visitor's operating-system preference on the first visit.
- Prevent an incorrect theme flash during initial loading.
- Ensure both themes have carefully designed contrast.
- Update logos, illustrations, borders, and image treatments appropriately.
- Ensure all pages work properly in both modes.

Do not create a dark mode that simply inverts the light mode.
