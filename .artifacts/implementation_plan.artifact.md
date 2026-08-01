# Implement Comprehensive Tool Usage Tracking

Enhance the analytics system to track detailed user interactions with tools, including processing actions, downloads, and mobile app discovery.

## User Review Required

> [!IMPORTANT]
> This update will increase the number of events sent to your analytics providers (Firebase, GA4, PostHog). It focuses on:
> - **Tool Usage:** When a user actually *uses* a tool (e.g., clicks "Format", "Compress", "Convert").
> - **Outputs:** When a user downloads a file or copies a result.
> - **App Discovery:** When a user clicks on a mobile app to view it on the Play Store.

## Proposed Changes

### Analytics Hooks
#### [MODIFY] [useTrackTool.ts](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/analytics/hooks/useTrackTool.ts)
- Add new methods:
    - `trackProcessed(properties)`: Track when a tool performs its main logic.
    - `trackCopied(properties)`: Track when a user copies the output.
- These will send events like `tool_processed` and `tool_output_copied`.

#### [NEW] [useTrackApp.ts](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/analytics/hooks/useTrackApp.ts)
- Create a hook to track interactions with mobile apps:
    - `trackAppClick(appId, appName)`: Track when a user clicks to view an app on the Play Store.

### Components
#### [MODIFY] [AppCard.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/components/AppCard.tsx)
- Use `useTrackApp` to track clicks to the Play Store.

### High-Usage Tools (Phase 1)
#### [MODIFY] [JsonFormatter.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/tools/components/JsonFormatter.tsx)
- Track "Format JSON" action.
- Track "Copy to Clipboard" action.

#### [MODIFY] [ImageCompressor.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/tools/components/ImageCompressor.tsx)
- Track "Process" start and completion (with file counts).
- Track "Download" and "Download All" (ZIP) actions.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure all hooks are correctly integrated.

### Manual Verification
1. Open the browser console with `NEXT_PUBLIC_ANALYTICS_DEBUG=true`.
2. **Visits:** Verify `page_view` and `tool_opened` fire when navigating.
3. **Usage:**
    - Use the JSON Formatter; verify `tool_processed` and `tool_output_copied` fire.
    - Use the Image Compressor; verify `tool_started`, `tool_completed`, and `download` fire.
4. **Apps:** Click on a mobile app card; verify `app_store_click` fires.
5. **Search:** Search on the home page; verify `search_submitted` fires.
