# 28. PRODUCT ENQUIRY EXPERIENCE

The website must support the company's actual business model.

This is a B2B enquiry website, not an online retail store.

## User journey

A visitor should be able to:
1. Arrive on the homepage.
2. Understand what SIWI Global Ventures does.
3. Browse the product catalogue.
4. Open a specific product page.
5. Review the available information.
6. Start an enquiry.
7. Submit their requirements or contact the company directly.

The journey should feel natural and uncomplicated.

## Contextual enquiries

When a visitor clicks "Enquire About This Product", pass the selected product to the enquiry form.

For example:
```
/trade-enquiries?product=onion-powder
```

Prefill the product selector appropriately.

Use safe URL handling and do not trust arbitrary query-string values without validation.

## Contact shortcuts

Make the following interactions functional:
- Phone links.
- Email links.
- Product links.
- Breadcrumbs.
- Navigation menus.
- Theme toggle.
- Enquiry CTAs.
- Form validation.
- Form submission feedback.

Do not include buttons that merely look functional.

If an interaction requires a backend, implement it where the environment supports it or clearly identify the missing integration.
