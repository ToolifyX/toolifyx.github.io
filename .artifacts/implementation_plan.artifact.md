# Add "Apps" Category to Home Page

Add a new "Apps" category to the category selection menu and tool discovery sections on the home page to showcase mobile applications.

## User Review Required

- The "Apps" tab will be added to the category list on the home page.
- When selected, it will display the 16 mobile apps recently added.
- "All" count will remain 106 (or be updated to 122 if preferred, but usually "All" refers to the web tools). Based on the user's prompt, they might want to keep the current counts and just add "Apps" as a new category.

## Proposed Changes

### Types & Config
#### [MODIFY] [types.ts](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/tools/types.ts)
- Add `"apps"` to the `ToolCategory` type definition.

### Components
#### [MODIFY] [CategoryMenu.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/components/CategoryMenu.tsx)
- Add the `"apps"` category to the menu list.
- Import `mobileApps` from `@/lib/appsData` to calculate the count for the "Apps" tab.

#### [NEW] [AppCard.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/components/AppCard.tsx)
- Create a new component to display mobile apps in the home grid.
- Similar styling to `ToolCard` but links directly to the Google Play Store and supports image icons (`iconPath`).

### Pages
#### [MODIFY] [page.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/app/page.tsx)
- Add `"apps"` to the `categories` array used for the discovery sections.
- Update the filtering logic to handle the "apps" category.
- When the "apps" category is active, render `AppCard` components instead of `ToolCard`.
- When searching, include mobile apps in the results.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure type safety across the new category and unified filtering logic.

### Manual Verification
1. Open the home page and verify the "Apps" tab appears in the category menu with the correct count (16).
2. Click the "Apps" tab and verify the mobile apps are displayed in the grid.
3. Search for a mobile app (e.g., "ROLLO") and ensure it appears in the results.
4. Verify that clicking an app card opens the correct Google Play Store page in a new tab.
