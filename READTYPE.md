# TypeScript Types and Interfaces - Complete Guide

## Table of Contents
1. [Type Annotations](#type-annotations)
2. [Interface Definitions](#interface-definitions)
3. [Type Aliases](#type-aliases)
4. [Generic Types](#generic-types)
5. [Union and Intersection Types](#union-and-intersection-types)
6. [Utility Types](#utility-types)
7. [Literal Types](#literal-types)
8. [Function Types](#function-types)
9. [Array and Tuple Types](#array-and-tuple-types)
10. [Object Types](#object-types)
11. [When to Use What](#when-to-use-what)

---

## Type Annotations

**What they are:** Inline declarations that specify the type of a variable, parameter, or return value.

### Basic Examples
```typescript
// Primitive types
const name: string = "John";
const age: number = 25;
const isActive: boolean = true;
const data: null = null;
const value: undefined = undefined;

// Function parameters and return types
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Variable with explicit type
let count: number;
count = 42;
```

### When to Use
- Simple, one-time type declarations
- Function parameters and return types
- Variables where TypeScript can't infer the type
- When you want to be explicit about types for clarity

---

## Interface Definitions

**What they are:** Contracts that define the structure of objects, including their properties and methods.

### Basic Examples
```typescript
// Basic interface
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Optional property
}

// Using the interface
const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};

// Interface inheritance
interface AdminUser extends User {
  permissions: string[];
  lastLogin: Date;
}

// Interface with methods
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}
```

### Advanced Interface Features
```typescript
// Interface merging
interface Window {
  customProperty: string;
}

interface Window {
  anotherProperty: number;
}
// Both properties are now available on Window

// Index signatures
interface StringDictionary {
  [key: string]: string;
}

// Readonly properties
interface ReadonlyUser {
  readonly id: number;
  readonly createdAt: Date;
  name: string; // This can still be modified
}
```

### When to Use
- Object shapes that will be reused across your application
- React component props
- API response structures
- When you need inheritance or extension
- When you want interface merging capabilities

---

## Type Aliases

**What they are:** Custom names for existing types, including complex type combinations.

### Basic Examples
```typescript
// Simple aliases
type UserID = string;
type EventHandler = (event: Event) => void;

// Object type alias
type Point = {
  x: number;
  y: number;
};

// Union types
type Status = 'loading' | 'success' | 'error';
type Theme = 'light' | 'dark' | 'auto';

// Function types
type ApiCall<T> = (data: T) => Promise<Response>;
```

### Complex Type Aliases
```typescript
// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

// Mapped types
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Template literal types
type EventName = `on${Capitalize<string>}`;
```

### When to Use
- Union and intersection types
- Function type signatures
- Complex computed types
- Template literal types
- When you need type manipulation utilities

---

## Generic Types

**What they are:** Types that work with multiple types by using type parameters.

### Basic Examples
```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Usage
const stringResult = identity<string>("hello"); // T is string
const numberResult = identity(42); // T is inferred as number

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Usage
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "John" },
  status: 200,
  message: "Success"
};
```

### Advanced Generics
```typescript
// Multiple type parameters
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

// Generic constraints
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Generic with default types
interface Container<T = string> {
  value: T;
}
```

### When to Use
- When you want type safety with flexibility
- Creating reusable components or functions
- Building utility types
- API response types that can contain different data
- When the same logic applies to multiple types

---

## Union and Intersection Types

### Union Types (`|`)
**What they are:** Types that can be one of several types.

```typescript
// Basic union
type StringOrNumber = string | number;

// Function parameter unions
function formatId(id: string | number): string {
  return id.toString();
}

// Object unions
type LoadingState = {
  status: 'loading';
  progress: number;
};

type SuccessState = {
  status: 'success';
  data: any;
};

type ErrorState = {
  status: 'error';
  error: string;
};

type AppState = LoadingState | SuccessState | ErrorState;
```

### Intersection Types (`&`)
**What they are:** Types that combine multiple types into one.

```typescript
// Basic intersection
type UserWithTimestamps = User & {
  createdAt: Date;
  updatedAt: Date;
};

// Mixin pattern
type Draggable = {
  drag(): void;
};

type Resizable = {
  resize(): void;
};

type UIElement = Draggable & Resizable & {
  render(): void;
};
```

### When to Use
**Union Types:**
- When a value can be one of several types
- State management (loading, success, error states)
- Function parameters that accept multiple types
- API responses with different structures

**Intersection Types:**
- Combining multiple object types
- Mixin patterns
- Adding additional properties to existing types

---

## Utility Types

**What they are:** Built-in TypeScript types that help transform existing types.

### Common Utility Types
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial - makes all properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string; }

// Pick - selects specific properties
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;
// { id: number; name: string; email: string; }

// Omit - excludes specific properties
type SafeUser = Omit<User, 'password'>;
// { id: number; name: string; email: string; }

// Required - makes all properties required
type RequiredUser = Required<PartialUser>;
// { id: number; name: string; email: string; password: string; }

// Record - creates object type with specific keys and value types
type UserRoles = Record<'admin' | 'user' | 'guest', boolean>;
// { admin: boolean; user: boolean; guest: boolean; }
```

### Advanced Utility Types
```typescript
// ReturnType - extracts return type of function
function getUser() {
  return { id: 1, name: "John" };
}
type UserReturnType = ReturnType<typeof getUser>;
// { id: number; name: string; }

// Parameters - extracts parameter types
function updateUser(id: number, data: Partial<User>) {
  // ...
}
type UpdateUserParams = Parameters<typeof updateUser>;
// [number, Partial<User>]

// Exclude - removes types from union
type NonErrorStatus = Exclude<'loading' | 'success' | 'error', 'error'>;
// 'loading' | 'success'

// Extract - keeps only specific types from union
type ErrorStatus = Extract<'loading' | 'success' | 'error', 'error'>;
// 'error'
```

### When to Use
- Transforming existing types rather than creating new ones
- Creating variations of interfaces (public vs private data)
- Working with function types and their parameters/returns
- Building type-safe APIs and form handling

---

## Literal Types

**What they are:** Types that represent exact values rather than general types.

### Examples
```typescript
// String literals
type Direction = 'north' | 'south' | 'east' | 'west';
type ButtonSize = 'small' | 'medium' | 'large';

// Number literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type HttpSuccessCode = 200 | 201 | 202;

// Boolean literals
type AllowedBoolean = true; // Only true is allowed

// Template literal types
type EventName<T extends string> = `on${Capitalize<T>}`;
type MouseEvent = EventName<'click' | 'hover'>; // 'onClick' | 'onHover'
```

### When to Use
- Exact values that shouldn't change (like status codes, directions)
- Configuration options with specific allowed values
- State management with predefined states
- API endpoints or method names

---

## Function Types

**What they are:** Types that describe the shape of functions.

### Examples
```typescript
// Basic function type
type GreetFunction = (name: string) => string;

// Function with optional parameters
type LogFunction = (message: string, level?: 'info' | 'warn' | 'error') => void;

// Function with rest parameters
type MathOperation = (first: number, ...rest: number[]) => number;

// Function overloads
interface Calculator {
  add(a: number, b: number): number;
  add(a: string, b: string): string;
}

// Generic function type
type MapFunction<T, U> = (item: T, index: number) => U;

// Async function type
type AsyncDataFetcher<T> = (url: string) => Promise<T>;
```

### Event Handlers in React
```typescript
// React event handlers
type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
type FormSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
type InputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;

// Custom event handlers
type TodoHandler = (todoId: string) => void;
type ValidationHandler = (isValid: boolean, errors: string[]) => void;
```

### When to Use
- Defining callback function shapes
- React event handlers
- API function signatures
- Higher-order functions
- Async operations

---

## Array and Tuple Types

### Array Types
```typescript
// Basic arrays
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ['John', 'Jane'];

// Array of objects
const users: User[] = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];

// Readonly arrays
const readonlyNumbers: readonly number[] = [1, 2, 3];
// readonlyNumbers.push(4); // Error!
```

### Tuple Types
```typescript
// Basic tuple
type Coordinates = [number, number];
const point: Coordinates = [10, 20];

// Named tuples
type NamedCoordinates = [x: number, y: number];

// Optional tuple elements
type HttpResponse = [status: number, body?: string];

// Rest elements in tuples
type StringNumberBooleans = [string, number, ...boolean[]];
```

### When to Use
**Arrays:**
- Collections of the same type
- Dynamic lists
- API response arrays

**Tuples:**
- Fixed-length arrays with known types
- Coordinates, RGB values
- Function return values with multiple types
- CSV row data

---

## Object Types

### Basic Object Types
```typescript
// Inline object type
const user: { id: number; name: string } = {
  id: 1,
  name: 'John'
};

// Nested object types
type Address = {
  street: string;
  city: string;
  zipCode: string;
};

type UserWithAddress = {
  id: number;
  name: string;
  address: Address;
};
```

### Index Signatures
```typescript
// String index signature
type StringDictionary = {
  [key: string]: string;
};

// Number index signature
type NumberArray = {
  [index: number]: number;
};

// Mixed index signatures
type MixedObject = {
  [key: string]: any;
  length: number; // Known property
};
```

### When to Use
- Simple object structures
- Dynamic objects with unknown keys
- Configuration objects
- Data transfer objects

---

## When to Use What

### Quick Decision Tree

```
Need to define the shape of an object?
├─ Will it be reused in multiple places?
│  ├─ Yes → Use Interface
│  └─ No → Use inline type annotation
├─ Need to extend/inherit from it?
│  └─ Yes → Use Interface
└─ Need union types or complex computations?
   └─ Yes → Use Type Alias
```

### Specific Use Cases

| Use Case | Recommended Approach | Example |
|----------|---------------------|---------|
| React component props | Interface | `interface ButtonProps { ... }` |
| API response structure | Interface | `interface ApiResponse { ... }` |
| Status/state values | Union type alias | `type Status = 'loading' \| 'success'` |
| Function signatures | Type alias | `type EventHandler = (e: Event) => void` |
| Utility/helper types | Type alias | `type Partial<T> = { ... }` |
| Simple variable types | Type annotation | `const id: string = '123'` |
| Configuration objects | Interface | `interface Config { ... }` |
| Generic containers | Generic interface | `interface Container<T> { ... }` |

### Best Practices

#### ✅ Do
```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  name: string;
}

// Use type aliases for unions
type Status = 'pending' | 'approved' | 'rejected';

// Use generics for reusable logic
interface ApiResponse<T> {
  data: T;
  success: boolean;
}

// Use utility types to transform existing types
type CreateUserRequest = Omit<User, 'id'>;
```

#### ❌ Don't
```typescript
// Don't use interfaces for simple unions
interface Status {
  value: 'pending' | 'approved' | 'rejected';
}

// Don't use type aliases when you need inheritance
type BaseUser = { name: string };
type AdminUser = BaseUser & { permissions: string[] }; // Works but interface is clearer

// Don't use any when you can be more specific
const data: any = fetchUser(); // Bad
const data: User = fetchUser(); // Good
```

### Performance Considerations

- **Interfaces** are generally faster for TypeScript compiler
- **Type aliases** can be slower with complex computations
- **Generic types** add compile-time overhead but improve runtime safety
- **Union types** with many members can slow down compilation

### Summary

Choose your TypeScript types based on:
1. **Reusability** - Interfaces for reusable object shapes
2. **Flexibility** - Type aliases for unions and computations
3. **Simplicity** - Type annotations for one-off declarations
4. **Extensibility** - Interfaces when you need inheritance
5. **Performance** - Consider compilation speed for complex types

Remember: The goal is readable, maintainable, and type-safe code. When in doubt, start simple and refactor as your needs become clearer!