# Navigation Bar - Visual Guide

## Desktop View (1024px and above)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  T │ TOOLIFYX  │ Img Comp │ Img Resize │ Img Crop │ Conv JPG │ PDF Merge │ ...  │
│    │           │ (active) │            │          │          │           │      │
│    │           │  blue    │            │          │          │           │ More  │
│    │           │ underline│            │          │          │           │Tools▼ │
│    │           │          │            │          │          │           │Theme  │
└─────────────────────────────────────────────────────────────────────────────┘

Quick Access Links:
- Image Compressor (active → blue text, underline, light blue bg)
- Image Resizer
- Image Cropper
- Convert to JPG
- PDF Merge
- PDF Split
- More Tools (hover → dropdown menu)

Dropdown Content (on hover):
┌────────────────┐
│ Image Tools    │
├────────────────┤
│  • Convert PNG │
│  • Convert Web │
│  • Editor      │
│  • Base64      │
│  • Metadata    │
│  • Color Tool  │
│  • Thumbnail   │
│  • Blur Detect │
├────────────────┤
│ PDF Tools      │
├────────────────┤
│  • Image to PDF│
│  • Metadata    │
│  • Rotate      │
│  • Compress    │
├────────────────┤
│ Developer T... │
│ Text Tools     │
│ Design Tools   │
│ Utility Tools  │
└────────────────┘
```

## Tablet View (768px - 1023px)

```
┌──────────────────────────────────────────────────────────┐
│  T │ TOOLIFY │ [← Image Comp │ Img Resize │ Img Crop →] │
│    │   X     │         Scrollable Row           │ More▼  │
│    │         │                                  │ Theme  │
└──────────────────────────────────────────────────────────┘

- Same quick access links but in a **scrollable horizontal row**
- Tools may overflow and require left/right scroll
- Like a carousel view
- More Tools dropdown still available (hover)
```

## Mobile View (below 768px)

```
┌────────────────────────────────┐
│  T │ TOOLIFYX          │ ≡ │Theme
│                         │
└────────────────────────────────┘
       Menu Collapsed

When Menu Open (tap ≡):
┌────────────────────────────────┐
│  T │ TOOLIFYX          │ ✕ │Theme
│                         │
├────────────────────────────────┤
│ More Tools ▼                   │
│   ├─ Image Tools               │
│   │   ├─ Converter PNG          │
│   │   ├─ Convert WebP           │
│   │   └─ ...                    │
│   ├─ PDF Tools                 │
│   │   ├─ Image to PDF           │
│   │   └─ ...                    │
│   ├─ Developer Tools           │
│   ├─ Text Tools                │
│   ├─ Design Tools              │
│   └─ Utility Tools             │
│                                │
└────────────────────────────────┘
```

## States & Styling

### Normal State
```
Text Color:   text-foreground (black/gray)
Background:   transparent
Font:         text-sm font-medium
Transition:   smooth
```

### Hover State
```
Text Color:   text-blue-600 (or blue-400 in dark)
Background:   transparent
Underline:    yes
Cursor:       pointer
```

### Active State (Current Page)
```
Text Color:   text-blue-600 dark:text-blue-400
Background:   bg-blue-50 dark:bg-blue-950/30
Underline:    yes
Font:         font-medium
```

### Mobile Expanded
```
Dropdown:     Opens below navbar
Items:        Full width
Spacing:      py-4, space-y-4
Border:       top border-t
```

## Component Layout Breakdown

```
Navbar (sticky top-0 z-50)
├── Container (mx-auto px-4)
│   ├── Main Row (h-14 flex justify-between)
│   │   ├── Logo & Brand (flex-shrink-0)
│   │   │   ├── T Logo Box
│   │   │   └── TOOLIFYX Text
│   │   │
│   │   ├── Quick Access Tools (hidden lg:flex flex-1 mx-6)
│   │   │   ├── Image Compressor
│   │   │   ├── Image Resizer
│   │   │   ├── Image Cropper
│   │   │   ├── Convert to JPG
│   │   │   ├── PDF Merge
│   │   │   └── PDF Split
│   │   │
│   │   └── Right Controls (flex gap-2 sm:gap-4)
│   │       ├── More Tools Dropdown (hidden md:block group)
│   │       │   └── Hover Menu
│   │       ├── Mobile Menu Toggle (md:hidden)
│   │       └── Theme Toggle
│   │
│   ├── Tablet Scroll Row (hidden md:flex lg:hidden px-4)
│   │   └── Horizontally Scrollable Quick Access
│   │
│   └── Mobile Menu (md:hidden)
│       └── Expandable Categories
```

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|-----------|-------|----------|
| `sm` | 640px | Logo text shown |
| `md` | 768px | More Tools visible, Quick access hidden |
| `lg` | 1024px | Quick access inline, tablet scroll hidden |

## Color Scheme

### Light Mode
- Text: `#000000`
- Active: `#2563EB` (blue-600)
- Background: `#F3F4F6` (gray-100)
- Active BG: `#EFF6FF` (blue-50)

### Dark Mode
- Text: `#FFFFFF`
- Active: `#60A5FA` (blue-400)
- Background: `#1F2937` (gray-800)
- Active BG: `#0C2340` (blue-950/30)

## Spacing & Sizing

```
Navbar Height:         56px (h-14)
Container Padding:     px-4 (16px)
Gap between tools:     gap-1 (4px)
Tool Link Padding:     px-3 py-2 (12px x 16px)
Dropdown Item Padding: px-4 py-2 (16px x 16px)
Mobile Menu Padding:   py-4 px-4
Mobile Menu Gap:       space-y-4
```

## Icons Used

- `Menu` - Mobile menu open icon (Lucide)
- `X` - Mobile menu close icon (Lucide)
- `ChevronDown` - More Tools dropdown indicator (Lucide)

## Scroll Behavior

### Desktop
- No scroll (everything visible)
- Fixed width navbar

### Tablet
- Horizontally scrollable quick access row
- Scroll indicators not visible (scrollbar-hide)
- Use standard scroll gestures

### Mobile
- Vertically scrollable menu
- Categories expandable
- Full width navigation

---

**Design Pattern**: Modern SaaS navigation (similar to Figma, Webflow, iLoveIMG)

