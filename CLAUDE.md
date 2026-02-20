# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 application using the App Router with:
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4 with PostCSS

### Project Structure

- `app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Homepage
  - `globals.css` - Global styles and Tailwind theme
- Path alias: `@/*` maps to project root

### Styling

Custom color palette defined in `app/globals.css` via CSS variables and Tailwind's `@theme inline`:
- Primary: `#3e9fd8` (bright ocean blue) with light/dark variants
- Secondary: `#ff6b35` (vibrant coral orange)
- Accent: `#8b5cf6` (purple)
- Full neutral scale (50-900)
- Status colors (success, warning, error, info)

Use Tailwind classes: `bg-primary`, `text-secondary`, `border-accent`, etc.

## File Headers

When creating or modifying files, add this header at the top:
```
/**
 * @author Zakaria Tejjani
 * @date YYYY-MM-DD
 */
```

Use the current date when creating new files. For existing files, preserve the original date if present, or add today's date if no header exists.

## Internationalization (i18n)

**Never hardcode user-facing text.** Always use translation keys.

### Rules

1. **French is the primary language** - Always add French translations first
2. **Define translation keys** in locale files. (arabic as default RTL)
3. **Use the t() function** or equivalent i18n hook to render text
4. **Key naming convention**: Use dot notation with descriptive hierarchy
   - Format: `section.component.element`
   - Example: `auth.login.submitButton`, `dashboard.stats.totalUsers`

### Example

❌ **Wrong:**
```tsx
Soumettre
Bienvenue sur notre plateforme
```

✅ **Correct:**
```tsx
{t('common.submit')}
{t('home.welcome')}
```

In `locales/fr.json` (primary):
```json
{
  "common": {
    "submit": "Soumettre"
  },
  "home": {
    "welcome": "Bienvenue sur notre plateforme"
  }
}
```

In `locales/en.json`:
```json
{
  "common": {
    "submit": "Submit"
  },
  "home": {
    "welcome": "Welcome to our platform"
  }
}
```

### When adding new text:
1. Create a meaningful translation key
2. Add the key and **Arabic text first** to `locales/ar.json`
3. Add the English translation to `locales/en.json`
4. Use the key in the component with `t()` or your i18n function


## UI Component Standards

### No Native Browser Dialogs

**Never use JavaScript's native dialog functions:**

❌ **Forbidden:**
```javascript
alert('Message')
confirm('Are you sure?')
prompt('Enter value')
window.alert()
window.confirm()
window.prompt()
```

✅ **Use instead:**
- Custom modal components
- Toast notifications
- Confirmation dialog components from your UI library

### No Native HTML Select Elements

**Never use the default `<select>` tag.** Always use searchable React select components.

❌ **Wrong:**
```tsx

  France
  United States

```

✅ **Correct:**
```tsx
import Select from 'react-select'

<Select
  options={[
    { value: 'fr', label: 'France' },
    { value: 'us', label: 'United States' }
  ]}
  value={selectedCountry}
  onChange={setSelectedCountry}
  isSearchable={true}
  placeholder={t('common.selectCountry')}
/>
```

This applies to all dropdowns, regardless of the number of options. Users should always be able to search/filter options.

### Icons - Use Tabler Icons Only

**Never hardcode icons or use other icon libraries.** Always use `@tabler/icons-react`.

❌ **Wrong:**
```tsx
// Hardcoded SVG
...

// Other icon libraries
import { FaUser } from 'react-icons/fa'
import { MdSettings } from 'react-icons/md'

// Unicode or emoji icons
⚙️
✓
```

✅ **Correct:**
```tsx
import { IconUser, IconSettings, IconCheck, IconSearch } from '@tabler/icons-react'





```

### Tabler Icons Usage:
- Import icons individually from `@tabler/icons-react`
- Icon names are PascalCase with `Icon` prefix (e.g., `IconHome`, `IconShoppingCart`)
- Customize with `size`, `stroke`, `color`, or `className` props
- Browse available icons at: https://tabler.io/icons


## Currency

**Use Moroccan Dirham (MAD) as the default currency, not USD.**

❌ **Wrong:**
```tsx
$99.99
USD 100
{price} USD
```

✅ **Correct:**
```tsx
99.99 MAD
100 DH
{price} MAD

// Or with formatting
new Intl.NumberFormat('fr-MA', { 
  style: 'currency', 
  currency: 'MAD' 
}).format(price)
```

- Currency symbol: MAD or DH (Dirham)
- Default to MAD for all monetary values
- Place currency code/symbol after the number (e.g., `250 MAD` or `250 DH`)
