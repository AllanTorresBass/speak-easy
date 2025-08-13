# Hydration Mismatch Fixes

This document outlines the fixes implemented to resolve hydration mismatch errors in the SpeakEasy application.

## What is Hydration Mismatch?

Hydration mismatch occurs when the server-rendered HTML doesn't match what the client is trying to render. This commonly happens due to:

1. **Browser Extension Interference**: Extensions like ColorZilla add attributes like `cz-shortcut-listen="true"`
2. **Client-Side Only Operations**: Using `localStorage`, `window` APIs, or `Date.now()` without proper SSR handling
3. **Dynamic Content**: Content that changes between server and client renders

## Implemented Fixes

### 1. Safe Client-Side Operations

#### `useClientOnly` Hook
- Prevents components from running client-side code during SSR
- Ensures consistent rendering between server and client
- Use this hook for components that depend on browser APIs

```tsx
import { useClientOnly } from '@/hooks/use-client-only';

function MyComponent() {
  const mounted = useClientOnly();
  
  if (!mounted) {
    return <div>Loading...</div>;
  }
  
  return <div>Client-only content</div>;
}
```

#### `useLocalStorage` Hook
- Safely accesses localStorage without causing hydration mismatches
- Provides consistent default values during SSR
- Automatically handles client-side persistence

```tsx
import { useLocalStorage } from '@/hooks/use-client-only';

function MyComponent() {
  const [value, setValue] = useLocalStorage('my-key', 'default');
  
  return <div>{value}</div>;
}
```

### 2. NoSSR Component

Use the `NoSSR` component for content that should only render on the client:

```tsx
import { NoSSR } from '@/components/common/no-ssr';

function MyComponent() {
  return (
    <div>
      <h1>Always visible</h1>
      <NoSSR fallback={<div>Loading...</div>}>
        <div>Client-only content</div>
      </NoSSR>
    </div>
  );
}
```

### 3. Safe Utilities

#### `hydration-safe.ts`
- `createStableId()`: Creates consistent IDs across renders
- `safeDateFormat()`: Formats dates without locale mismatches
- `isBrowserAPI()`: Safely checks for browser API availability
- `getBrowserAPI()`: Safely accesses browser APIs

### 4. Theme Context Updates

The theme context now:
- Uses `useLocalStorage` for persistent storage
- Prevents theme changes before mounting
- Ensures consistent initial state between server and client

### 5. Layout Updates

- Added `suppressHydrationWarning` to both `<html>` and `<body>` tags
- This suppresses warnings for browser extension attributes
- Maintains functionality while preventing console errors

## Best Practices

### Do's
- ✅ Use `useClientOnly()` for client-dependent components
- ✅ Use `useLocalStorage()` for persistent state
- ✅ Wrap dynamic content in `NoSSR` when necessary
- ✅ Use safe utilities from `hydration-safe.ts`
- ✅ Check for browser API availability before use

### Don'ts
- ❌ Don't use `Date.now()` or `Math.random()` directly in render
- ❌ Don't access `localStorage` or `window` without proper checks
- ❌ Don't render different content on server vs client
- ❌ Don't ignore hydration warnings

## Common Patterns

### Safe Date Formatting
```tsx
import { safeDateFormat } from '@/lib/hydration-safe';

// Instead of: new Date().toLocaleDateString()
const formattedDate = safeDateFormat(new Date());
```

### Safe Browser API Access
```tsx
import { isBrowserAPI, getBrowserAPI } from '@/lib/hydration-safe';

if (isBrowserAPI('speechSynthesis')) {
  const synthesis = getBrowserAPI('speechSynthesis');
  // Use synthesis safely
}
```

### Conditional Rendering
```tsx
import { useClientOnly } from '@/hooks/use-client-only';

function AudioPlayer() {
  const mounted = useClientOnly();
  
  if (!mounted) {
    return <div>Audio player loading...</div>;
  }
  
  return <audio controls />;
}
```

## Testing Hydration Fixes

1. **Development Mode**: Check console for hydration warnings
2. **Production Build**: Test with `npm run build && npm start`
3. **Browser Extensions**: Test with and without browser extensions
4. **Different Browsers**: Test across Chrome, Firefox, Safari, Edge

## Monitoring

- Watch for hydration warnings in the console
- Use React DevTools to inspect component hydration
- Monitor performance metrics for hydration-related issues
- Test with various browser extensions enabled/disabled

## Future Improvements

- Implement more granular hydration controls
- Add automated hydration testing
- Create more specialized hooks for common use cases
- Optimize bundle splitting for better hydration performance 