# MangaCompass Task Completion Checklist

## After Making Code Changes

### 1. Code Quality Checks
```bash
npm run lint
```
- Fix any ESLint errors or warnings
- Ensure no unused variables or imports
- Check for proper TypeScript types

### 2. Build Verification
```bash
npm run build
```
- Ensure build completes without errors
- Check for any TypeScript compilation issues
- Verify no missing dependencies

### 3. Manual Testing
- Start dev server: `npm run dev`
- Test all affected pages:
  - Landing page loads correctly
  - Onboarding flow works end-to-end
  - Dashboard displays recommendations
- Check console for errors

### 4. Responsive Design
- Test on mobile viewport (375px)
- Test on tablet viewport (768px)
- Test on desktop viewport (1280px)
- Ensure touch interactions work on mobile

### 5. Feature-Specific Checks
- **Affiliate Links**: Verify all Amazon links include `mangacompass-20` tag
- **LocalStorage**: Check data persists between page refreshes
- **Recommendations**: Ensure algorithm produces logical results
- **Loading States**: Verify loading indicators appear correctly
- **Error States**: Test error handling for edge cases

### 6. Performance
- Page load time should be under 3 seconds
- Images should have loading states
- No layout shifts during loading

### 7. Before Committing
- Review all changes
- Ensure no debug console.logs remain
- Verify no sensitive data exposed
- Check that mock data is appropriate