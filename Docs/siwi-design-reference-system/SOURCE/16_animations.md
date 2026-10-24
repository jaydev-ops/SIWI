# 25. ANIMATIONS — PREMIUM, NOT FLASHY

Animation should communicate state, direction, and hierarchy.

It should not be used simply to make the website appear technologically advanced.

## Allowed animations

**Navigation**
A subtle background or border transition on scroll.

**Buttons**
A small colour or opacity transition.

**Product images**
A restrained hover scale, limited to approximately 1.01–1.03 when appropriate.

**Page transitions**
A short, subtle opacity transition if supported by the routing framework.

**Scroll reveals**
Use restrained opacity and small vertical movement for selected elements. Do not animate every paragraph.

**Compass motif**
A subtle line-drawing or directional reveal may be used once in the hero. Keep it understated.

## Timing

Use approximate durations of:
- 120–180ms for simple interface feedback.
- 180–280ms for larger transitions.
- Longer transitions only when the effect genuinely benefits the experience.

Use appropriate easing, such as:
```css
cubic-bezier(0.22, 1, 0.36, 1)
```

## Avoid

- Parallax on every section.
- Endless rotating globes.
- Floating objects.
- Animated background particles.
- Large text that follows the cursor.
- Scroll hijacking.
- Excessive page-loading animations.
- Bouncing buttons.
- Constantly moving decorative elements.

## Accessibility

Respect `prefers-reduced-motion`.

The website must remain fully usable when animations are disabled.
