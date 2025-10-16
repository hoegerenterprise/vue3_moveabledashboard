# Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### Issue: Peer dependency warnings
```
npm WARN vue3-moveable-dashboard@1.0.0 requires a peer of vue@^3.0.0
```

**Solution**: Install the required peer dependencies:
```bash
npm install vue@^3.0.0 vuetify@^3.0.0 vue3-moveable@^0.28.0
```

#### Issue: Module not found errors

**Solution**: Make sure you've installed the package correctly:
```bash
# For published package
npm install vue3-moveable-dashboard

# For local development
npm install /path/to/vue3_moveable_dashboard
```

### Import Issues

#### Issue: Cannot find module 'vue3-moveable-dashboard'

**Solution**: Check your import statement:
```typescript
// Correct
import { MoveableDashboard, DashboardCard } from 'vue3-moveable-dashboard';

// Also correct (for plugin)
import Vue3MoveableDashboard from 'vue3-moveable-dashboard';
```

#### Issue: Type definitions not found

**Solution**: Make sure TypeScript is configured to include node_modules:
```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "types": ["node"]
  }
}
```

### Vuetify Issues

#### Issue: Vuetify components not rendering correctly

**Solution**: Make sure Vuetify is properly initialized:
```typescript
// main.ts
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

app.use(vuetify);
```

#### Issue: Missing Vuetify styles

**Solution**: Import Vuetify styles in your main.ts:
```typescript
import 'vuetify/styles';
```

### Component Usage Issues

#### Issue: Cards not showing on dashboard

**Solution**: Make sure your cards array has the required properties:
```typescript
const cards = ref([
  {
    id: 'card-1',        // Required: unique ID
    x: 20,              // Required: x position
    y: 20,              // Required: y position
    width: 300,         // Required: width in pixels
    rotate: 0,          // Required: rotation in degrees
    header: 'My Card',  // Optional: card title
    z: 1                // Optional: z-index
  }
]);
```

#### Issue: Cards not draggable

**Solution**: Check that edit mode is enabled:
```vue
<MoveableDashboard
  :cards="cards"
  :enable-edit="true"
  :draggable="true"
/>
```

#### Issue: Cards disappear when selected

**Solution**: Make sure you're not modifying the cards array incorrectly. Use proper Vue reactivity:
```typescript
// Correct
const cards = ref([...]);

// Incorrect
let cards = [...];
```

### Styling Issues

#### Issue: Dashboard has no height

**Solution**: Set a height on the container:
```vue
<template>
  <div style="height: 600px;">
    <MoveableDashboard :cards="cards">
      <!-- ... -->
    </MoveableDashboard>
  </div>
</template>
```

Or use CSS:
```css
.dashboard-container {
  height: 100vh;
  min-height: 600px;
}
```

#### Issue: Cards overlap or have wrong positions

**Solution**: Make sure the dashboard container has `position: relative` (it should be automatic, but check if you've overridden styles).

### Event Issues

#### Issue: Events not firing

**Solution**: Make sure you're using the correct event names with the `@` syntax:
```vue
<!-- Correct -->
<MoveableDashboard
  @card-moved="handleMove"
  @card-resized="handleResize"
/>

<!-- Incorrect -->
<MoveableDashboard
  @cardMoved="handleMove"
  @cardResized="handleResize"
/>
```

#### Issue: Can't access updated card positions

**Solution**: Listen to the `update:cards` event:
```vue
<MoveableDashboard
  :cards="cards"
  @update:cards="cards = $event"
/>
```

Or use v-model pattern (if implemented in your version).

### TypeScript Issues

#### Issue: Type errors with card object

**Solution**: Import and use the proper types:
```typescript
import type { IMoveableDashboardContainer } from 'vue3-moveable-dashboard';

const cards = ref<IMoveableDashboardContainer[]>([
  // your cards
]);
```

#### Issue: Slot props type errors

**Solution**: Define the slot prop types:
```vue
<template #default="{ card, isSelected }: { card: IMoveableDashboardContainer, isSelected: boolean }">
  <!-- ... -->
</template>
```

### Build Issues

#### Issue: Build fails with vue3-moveable errors

**Solution**: Make sure vue3-moveable is properly externalized in vite.config.ts:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', 'vuetify', 'vue3-moveable']
    }
  }
});
```

#### Issue: CSS not included in build

**Solution**: Make sure you're importing the CSS:
```typescript
// Automatically included with component import
import { MoveableDashboard } from 'vue3-moveable-dashboard';

// Or manually import
import 'vue3-moveable-dashboard/dist/vue3-moveable-dashboard.css';
```

### Performance Issues

#### Issue: Dashboard is slow with many cards

**Solution**: Limit the number of cards or implement virtual scrolling. For most use cases, up to 50-100 cards should work fine.

#### Issue: Resizing/rotating is laggy

**Solution**:
1. Reduce the number of DOM elements in card content
2. Use `v-show` instead of `v-if` for conditional content
3. Implement lazy loading for card content

### Development Issues

#### Issue: Hot reload not working

**Solution**: Restart the dev server:
```bash
npm run dev
```

#### Issue: Changes not reflected in demo

**Solution**: Make sure you're running the dev server and not looking at a built version:
```bash
# Run dev server
npm run dev

# Not the preview server
npm run preview
```

## Still Having Issues?

1. Check the [README.md](README.md) for complete documentation
2. Review the [EXAMPLES.md](EXAMPLES.md) for working examples
3. Examine the demo implementation in `src/demo/DemoPage.vue`
4. Check the browser console for error messages
5. Verify all dependencies are installed: `npm list`
6. Try with a fresh install: `rm -rf node_modules && npm install`
7. Check that your Vue and Vuetify versions are compatible

## Debugging Tips

### Enable debug logging
```typescript
const cards = ref([...]);

// Log card changes
watch(cards, (newCards) => {
  console.log('Cards updated:', newCards);
}, { deep: true });
```

### Check component registration
```typescript
// In your component
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
console.log('Available components:', instance?.appContext.components);
```

### Verify Vuetify setup
```typescript
import { useDisplay } from 'vuetify';

// In your component
const display = useDisplay();
console.log('Vuetify display:', display);
```

## Getting Help

If you're still experiencing issues:

1. Create a minimal reproduction example
2. Check the browser console for errors
3. Verify your environment (Node version, npm version)
4. Open an issue with:
   - Vue version
   - Vuetify version
   - Package version
   - Error message
   - Steps to reproduce
   - Code sample
