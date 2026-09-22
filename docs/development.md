# Development

Use strict TypeScript and keep provider-specific code outside UI and domain packages. New external payloads require a runtime schema. Visible records must come from installed addon metadata services, never from seeded UI data.

Before review run typecheck, lint, tests, and a production build. Check 320, 390, 768, 1024, 1440, and 1920 pixel layouts; keyboard focus; reduced motion; overflow; long copy; and missing data states.
