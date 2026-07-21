# Add "apps" Tab for Mobile App Promotion

Add a new tab named "apps" to the navigation bar and a dedicated page to showcase mobile applications from the developer's Google Play Store profile.

## User Review Required

- The tab in the navigation bar will be labeled **"apps"** (lowercase) as requested.
- A new page `/apps` will be created to feature the developer's apps.
- Links will point directly to the Google Play Store.

## Proposed Changes

### Data Layer
#### [NEW] [appsData.ts](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/lib/appsData.ts)
- Define the list of apps with titles, descriptions, package IDs, and icons.
- Featured apps: ROLLO, OldSoul, Filmory, DualView, AuraPro, Fieldly, 10MB Browser, IPTV+ Player, etc.

### UI Components
#### [NEW] [app/apps/page.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/app/apps/page.tsx)
- Create a clean, visually appealing showcase page.
- Use a grid layout with cards for each app.
- Include "Download on Google Play" badges/buttons.

### Navigation Integration
#### [MODIFY] [tools/quickAccessTools.ts](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/tools/quickAccessTools.ts)
- Add the `apps` entry to `QUICK_ACCESS_TOOLS` to ensure it appears in the top Navbar.

```typescript
export const QUICK_ACCESS_TOOLS: QuickAccessTool[] = [
  {
    slug: 'apps',
    title: 'apps',
    route: '/apps',
  },
];
```

## Verification Plan

### Automated Tests
- Run `npm run lint` to verify code quality.

### Manual Verification
1. Verify the "apps" tab is present in the Navbar on both desktop and mobile.
2. Ensure clicking "apps" navigates to the showcase page.
3. Verify that app links correctly open the Google Play Store in a new tab.
