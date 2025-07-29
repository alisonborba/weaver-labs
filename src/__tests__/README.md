# Test Suite Documentation

## 📋 Overview

This test suite covers the most critical parts of the Weaver Labs application, focusing on **meaningful tests** that provide the highest value for preventing bugs and ensuring application reliability.

## 🎯 Test Coverage Areas

### 1. **Schema Validation (Critical)**

- **File**: `schemas/recipeFormSchema.test.ts`
- **File**: `schemas/ingredientFormSchema.test.ts`
- **Purpose**: Validates data integrity at the application boundary
- **Tests**:
  - Valid data acceptance
  - Invalid data rejection
  - Edge cases (null, undefined, wrong types)
  - Error message accuracy

### 2. **Mutation Hooks (Critical)**

- **File**: `hooks/use-mutations.test.tsx`
- **Purpose**: Tests React Query mutations and optimistic updates
- **Tests**:
  - Successful API calls
  - Error handling
  - Optimistic updates
  - Cache invalidation
  - Network failures

### 3. **Server Utilities (Critical)**

- **File**: `lib/server-utils.test.ts`
- **Purpose**: Tests data persistence layer
- **Tests**:
  - File read/write operations
  - Error handling
  - JSON parsing/stringifying
  - Large dataset handling

### 4. **Business Logic (Important)**

- **File**: `utils/business-logic.test.ts`
- **Purpose**: Tests application-specific logic
- **Tests**:
  - Ingredient filtering
  - Recipe validation
  - Data formatting
  - Quantity validation

## 🚀 Running Tests

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Specific Test Files

```bash
# Run only schema tests
npm test -- schemas

# Run only mutation tests
npm test -- mutations

# Run only server utils tests
npm test -- server-utils
```

## 📊 Test Statistics

- **Total Test Files**: 4
- **Total Test Cases**: ~50+
- **Coverage Areas**:
  - ✅ Schema Validation
  - ✅ API Mutations
  - ✅ Data Persistence
  - ✅ Business Logic
  - ✅ Error Handling
  - ✅ Edge Cases

## 🎯 Test Strategy

### **Priority 1: Critical Paths**

1. **Data Validation** - Prevents invalid data from entering the system
2. **API Operations** - Ensures data synchronization works correctly
3. **Data Persistence** - Guarantees data integrity

### **Priority 2: Business Logic**

1. **Ingredient Management** - Core application functionality
2. **Recipe Operations** - Main user workflows
3. **Data Formatting** - UI display logic

### **Priority 3: Edge Cases**

1. **Error Scenarios** - Network failures, invalid data
2. **Boundary Conditions** - Empty arrays, null values
3. **Performance** - Large datasets

## 🔧 Test Configuration

### Jest Configuration

- **Environment**: jsdom (for React components)
- **Setup**: `jest.setup.js` (global mocks and configuration)
- **Coverage**: Excludes UI components and stories
- **Module Mapping**: Supports `@/` imports

### Mock Strategy

- **Fetch API**: Mocked globally for API testing
- **File System**: Mocked for server utilities
- **Next.js Router**: Mocked for navigation testing
- **React Query**: Real instances with mocked data

## 📈 Coverage Goals

- **Schema Validation**: 100% (Critical for data integrity)
- **Mutation Hooks**: 95%+ (Core application logic)
- **Server Utils**: 90%+ (Data persistence)
- **Business Logic**: 85%+ (Application-specific logic)

## 🐛 Common Issues

### TypeScript Errors

If you see TypeScript errors about Jest types:

```bash
npm install --save-dev @types/jest
```

### Module Resolution

If tests can't find modules:

1. Check `jest.config.js` module mapping
2. Ensure `tsconfig.json` paths are correct
3. Verify import paths use `@/` prefix

### React Query Testing

For React Query tests:

1. Always wrap components in `QueryClientProvider`
2. Mock `fetch` before each test
3. Use `waitFor` for async operations

## 🔄 Integration with E2E Tests

These unit tests complement E2E tests by:

- **Faster Feedback**: Unit tests run in milliseconds
- **Isolated Testing**: Test specific functions without UI dependencies
- **Edge Case Coverage**: Test scenarios difficult to reproduce in E2E
- **API Testing**: Validate backend logic independently

## 📝 Adding New Tests

### Schema Tests

```typescript
describe('newSchema', () => {
  it('should validate valid data', () => {
    const result = newSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
```

### Hook Tests

```typescript
describe('useNewHook', () => {
  it('should work correctly', async () => {
    const { result } = renderHook(() => useNewHook(), {
      wrapper: createWrapper(),
    });
    // Test implementation
  });
});
```

### Utility Tests

```typescript
describe('newUtility', () => {
  it('should handle input correctly', () => {
    const result = newUtility(input);
    expect(result).toBe(expectedOutput);
  });
});
```

## 🎉 Success Metrics

- **Zero Critical Bugs**: Schema validation prevents invalid data
- **Reliable API**: Mutation tests ensure data consistency
- **Data Integrity**: Server utils tests guarantee persistence
- **Fast Development**: Quick feedback on business logic changes
