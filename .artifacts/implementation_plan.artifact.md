# Remove entire Design Category and all its Tools

This plan covers the permanent removal of the "Design" category and its 7 associated tools from PhungX.

## User Review Required

> [!IMPORTANT]
> The following 7 features and their source code will be permanently removed:
> - **Color Picker**
> - **Gradient Generator**
> - **Box Shadow Generator**
> - **Border Radius Generator**
> - **Color Palette Generator**
> - **Contrast Checker**
> - **Font Preview Tool**
>
> The "Design" category will also be removed from the UI.

## Proposed Changes

### Configuration & Registry
#### [MODIFY] [tools/config.ts](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/tools/config.ts)
- Remove all 7 design tool entries.

#### [MODIFY] [tools/registry.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/tools/registry.tsx)
- Remove the dynamic import entries for all 7 design tools.

#### [MODIFY] [tools/types.ts](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/tools/types.ts)
- Remove `"design"` from the `ToolCategory` union type.

### UI Components
#### [MODIFY] [components/CategoryMenu.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/components/CategoryMenu.tsx)
- Remove the "Design" category from the menu.

#### [MODIFY] [app/(main)/page.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/app/(main)/page.tsx)
- Remove "Design" from the `categories` array used for the home page sections.

### Source Files
#### [DELETE] all design tool components:
- `tools/components/ColorPicker.tsx`
- `tools/components/GradientGenerator.tsx`
- `tools/components/BoxShadowGenerator.tsx`
- `tools/components/BorderRadiusGenerator.tsx`
- `tools/components/ColorPaletteGenerator.tsx`
- `tools/components/ContrastChecker.tsx`
- `tools/components/FontPreviewTool.tsx`

### Documentation & Tracking
#### [MODIFY] [config_slugs.txt](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/config_slugs.txt)
- Remove the slugs for all 7 design tools.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure no broken references (especially in search and filtering logic).

### Manual Verification
1. Verify that the "Design" tab is gone from the Home page.
2. Verify that none of the design tools appear in the "All" section or search results.
3. Ensure the total tool count is updated correctly.
