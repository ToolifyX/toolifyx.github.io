# Add individual item removal to Recently Used Tools

Add a "remove" button to each tool card in the "Recently Used" section to allow users to delete specific items from their history.

## User Review Required

> [!NOTE]
> A small "X" button will appear on the top-right corner of each tool card **only** in the "Recently Used" section. Clicking this button will remove the tool from the history without opening it.

## Proposed Changes

### Components
#### [MODIFY] [ToolCard.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/components/ToolCard.tsx)
- Add an optional `onRemove` prop to the `ToolCardProps` interface.
- If `onRemove` is provided, render a small close button (`X` icon from `lucide-react`) at the top-right corner of the card.
- Implement click handling with `e.preventDefault()` and `e.stopPropagation()` to ensure removing an item doesn't trigger navigation.

#### [MODIFY] [RecentlyUsedTools.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/components/RecentlyUsedTools.tsx)
- Implement a `removeTool` function that:
    1. Reads the current `recentlyUsedTools` from `localStorage`.
    2. Filters out the specified tool slug.
    3. Saves the updated list back to `localStorage`.
    4. Updates the component's state to reflect the change immediately.
- Pass this `removeTool` function to the `onRemove` prop of each `ToolCard`.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure no regressions.

### Manual Verification
1. Open the Home page and use some tools to populate the "Recently Used" list.
2. Verify that each card in the "Recently Used" section has a small "X" button at the top right.
3. Click the "X" button on one of the cards.
4. Confirm the card is removed immediately from the UI.
5. Refresh the page to ensure the item remains gone (persisted in `localStorage`).
6. Verify that clicking elsewhere on the card still opens the tool as expected.
