# Quick Reference Guide - Navigation Bar Quick Access Tools

## 🚀 Quick Start

The navbar now shows 6 quick access tools. To customize:

### Step 1: Edit Quick Access Tools
**File**: `tools/quickAccessTools.ts`

```typescript
export const QUICK_ACCESS_TOOLS = [
  {
    slug: 'tool-slug-from-config',      // Must match config.ts slug
    title: 'Display Title',             // Shows in navbar
    route: '/tools/tool-slug-from-config', // The link path
  },
  // ... add more (max 6 recommended)
];
```

### Step 2: Verify Tool Exists
Check in `tools/config.ts` that your tool slug exists:

```typescript
{ slug: 'image-compressor', title: 'Image Compressor', ... }
```

### Step 3: Done!
Navbar automatically updates with new tools.

---

## 📋 Navbar Anatomy

```
Navbar (sticky, always visible)
├── Desktop (lg)
│   ├── Logo
│   ├── Quick Access (inline)
│   ├── More Tools (dropdown)
│   └── Theme + search
│
├── Tablet (md)
│   ├── Logo
│   ├── Quick Access (scrollable)
│   ├── More Tools (dropdown)
│   └── Theme + toggle
│
└── Mobile (sm)
    ├── Logo
    ├── Hamburger Menu
    └── Theme + toggle
        └── More Tools (in menu)
```

---

## 🎨 Styling

### Quick Access Link States

| State | Class | Example |
|-------|-------|---------|
| Normal | `text-foreground` | Black text |
| Hover | `hover:text-blue-600 hover:underline` | Blue with underline |
| Active | `text-blue-600 bg-blue-50 underline` | Highlighted |

### Responsive Classes

```
hidden lg:flex        - Desktop only (quick access inline)
hidden md:flex lg:hidden - Tablet only (scrollable)
hidden md:hidden      - Mobile only
```

### Dark Mode

Add `dark:` prefix for dark mode variants:
- `dark:text-blue-400` - Active text in dark
- `dark:bg-blue-950/30` - Active background in dark

---

## 🔗 Route Matching & Active States

The navbar uses `usePathname()` to detect current route:

```typescript
const isToolActive = (slug: string) => {
  return pathname === `/tools/${slug}`;
};
```

**How it works:**
- User visits `/tools/image-compressor`
- `pathname` = `/tools/image-compressor`
- "Image Compressor" link gets active styling

---

## 📱 Responsive Behavior

### Desktop (≥ 1024px)
✅ All 6 tools visible inline
✅ More Tools dropdown (hover)
✅ Horizontal layout

```
[Logo] [Tool1] [Tool2] [Tool3] [Tool4] [Tool5] [Tool6] [More▼]
```

### Tablet (768px - 1023px)
✅ Tools in scrollable row
✅ More Tools dropdown (hover)
✅ Left/right scroll to see all

```
[Logo] [Tool1 | Tool2 → scroll → Tool6] [More▼]
```

### Mobile (< 768px)
✅ Tools hidden
✅ Hamburger menu shows all
✅ Tap to expand categories

```
[Logo] [≡]
→ More Tools (expandable)
  → Image Tools
    → Image Compressor
    → ...
```

---

## 🛠️ Common Tasks

### Change Text of Quick Access Tool
**File**: `tools/quickAccessTools.ts`
```typescript
{
  slug: 'image-compressor',
  title: 'Image Compress', // Change this
  route: '/tools/image-compressor',
}
```

### Add a 7th Tool (Not Recommended)
**File**: `tools/quickAccessTools.ts`
```typescript
export const QUICK_ACCESS_TOOLS: QuickAccessTool[] = [
  // ... existing 6 tools
  {
    slug: 'new-tool',
    title: 'New Tool',
    route: '/tools/new-tool',
  },
];
```
⚠️ **Warning**: May cause overflow on desktop. Keep to 6 max.

### Change Hover Color
**File**: `components/Navbar.tsx`
```typescript
// Line ~66: Change blue-600 to another color
hover:text-blue-600  // → hover:text-purple-600
```

### Hide Quick Access on Desktop
**File**: `components/Navbar.tsx`
```typescript
// Line ~58: Change from
hidden lg:flex  // → hidden  (hide always)
```

### Adjust Responsive Breakpoints
**File**: `components/Navbar.tsx`
```typescript
// Currently uses: sm, md, lg
// Change to:
hidden 2xl:flex  // Show at 2xl instead of lg
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Tool not in navbar | Check slug matches in `config.ts` |
| Link not working | Verify route is `/tools/{slug}` |
| Active state not showing | Check pathname routing is correct |
| Mobile menu not opening | Ensure `'use client'` directive present |
| Tools not scrollable on tablet | Check `overflow-x-auto` class |
| Wrong styling in dark mode | Add `dark:` prefix to Tailwind class |

---

## 📝 File Structure

```
├── components/
│   └── Navbar.tsx ................. Main navbar component
│
├── tools/
│   ├── quickAccessTools.ts ........ Quick access config ⭐
│   ├── config.ts .................. All tool definitions
│   ├── registry.tsx ............... Component registry
│   └── types.ts ................... Type definitions
│
└── Documentation/
    ├── NAVBAR_IMPLEMENTATION.md .... Full implementation details
    ├── NAVBAR_VISUAL_GUIDE.md ...... Visual breakdown
    ├── IMPLEMENTATION_SUMMARY.md ... Executive summary
    └── QUICKREF.md ................. This file
```

---

## 🎯 Features Summary

| Feature | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Quick Access | ✅ Inline | ✅ Scroll | ❌ Hidden |
| More Tools | ✅ Dropdown | ✅ Dropdown | ✅ Menu |
| Active Highlight | ✅ Yes | ✅ Yes | ✅ Yes |
| Theme Toggle | ✅ Yes | ✅ Yes | ✅ Yes |
| Sticky Header | ✅ Yes | ✅ Yes | ✅ Yes |
| Dark Mode | ✅ Full | ✅ Full | ✅ Full |

---

## 🖱️ Interactions

### Desktop
- **Hover tool link** → Text turns blue, shows underline
- **Click tool link** → Navigate to tool, highlight active
- **Hover More Tools** → Dropdown opens, chevron rotates
- **Click tool in dropdown** → Navigate, close dropdown

### Tablet
- Same as desktop
- Can scroll quick access horizontally

### Mobile
- **Tap hamburger** → Menu opens, icon changes to X
- **Tap More Tools** → Expands to show categories
- **Tap category** → Shows tools in that category
- **Tap tool** → Navigate, close menu

---

## 💾 Data Flow

```
QUICK_ACCESS_TOOLS (quickAccessTools.ts)
        ↓
Navbar Component (Navbar.tsx)
        ├─ Filters tools by slug
        ├─ Groups others by category
        ├─ Detects active route
        └─ Renders based on screen size
```

---

## 🔍 Code Examples

### Add Custom Styling
```typescript
// In Navbar.tsx, modify className:
className={`
  px-3 py-2 text-sm font-medium
  ${isToolActive(tool.slug)
    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 underline shadow-sm' // Add shadow
    : 'text-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline'
  }`
}
```

### Add Analytics
```typescript
// In Navbar.tsx, in Link component:
<Link
  href={tool.route}
  onClick={() => analytics.track('quick_access_click', { tool: tool.slug })}
  className={...}
>
  {tool.title}
</Link>
```

### Add Keyboard Shortcut
```typescript
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.altKey && e.key === 'c') {
      router.push('/tools/image-compressor');
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

## 📚 Dependencies

- `next/link` - Link navigation
- `next/navigation` - usePathname hook
- `lucide-react` - Icons (Menu, X, ChevronDown)
- `React` - State management (useState)
- Tailwind CSS - Styling

**No additional packages needed!**

---

## ✅ Checklist Before Launch

- [ ] All 6 tools have valid slugs in `config.ts`
- [ ] Routes are correct (e.g., `/tools/image-compressor`)
- [ ] Test on desktop, tablet, mobile
- [ ] Active highlighting works on each tool
- [ ] Dark mode looks good
- [ ] More Tools dropdown works
- [ ] Mobile menu opens/closes
- [ ] No console errors
- [ ] Performance is good (no lag)

---

**Last Updated**: May 2026
**Status**: ✅ Ready for Production

