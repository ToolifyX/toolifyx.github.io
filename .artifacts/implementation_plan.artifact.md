# Rebrand PhungX to PhungX

This plan covers the project-wide rebranding of the platform from **PhungX** to **PhungX**.

## User Review Required

> [!IMPORTANT]
> This is a project-wide search and replace operation. It will affect the website title, logo text, footer, about page, and all documentation.

- **Brand Change:** PhungX → PhungX
- **Slug Change (if applicable):** If "toolifyx" appears in URLs or internal identifiers, it will be updated to "phungx".

## Proposed Changes

### Configuration
#### [MODIFY] [package.json](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/package.json)
- Update the project name from `toolifyx.github.io` to `phungx.github.io`.

### Core Layout & UI
#### [MODIFY] [app/layout.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/app/layout.tsx)
- Update the site metadata title.

#### [MODIFY] [components/Navbar.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/components/Navbar.tsx)
- Update the logo text (PhungX → PhungX).
- Update alt text for the logo image.

#### [MODIFY] [app/(main)/layout.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/app/(main)/layout.tsx)
- Update the footer copyright and brand mention.

### Pages
#### [MODIFY] [app/(main)/about/page.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/app/(main)/about/page.tsx)
- Replace all occurrences of "PhungX" in the content.

#### [MODIFY] [app/(main)/page.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/app/(main)/page.tsx)
- Update any hero text or SEO descriptions.

#### [MODIFY] [app/lingosnap/page.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/app/lingosnap/page.tsx)
- Update footer link text.

### Components
#### [MODIFY] [components/CommandPalette.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/components/CommandPalette.tsx)
- Update search placeholder/title.

### Documentation
#### [MODIFY] All `.md` files
- Update project name in `INDEX.md`, `WALKTHROUGH.md`, etc.

## Verification Plan

### Automated Tests
- Run `npm run lint` to check for any broken references.
- Run `npm run build` to ensure the project still compiles correctly.

### Manual Verification
1. Check the browser tab title.
2. Verify the logo text in the Navbar.
3. Scroll to the footer to see the updated copyright.
4. Visit the About page to confirm the mission statement has been rebranded.
5. Search for "PhungX" in the codebase again to ensure 0 results.
