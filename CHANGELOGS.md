## v0.1.2 - 2025-03-14

### Fixes

#### All functions

- Correct error handling for hooks, components that uses `usePermissions<Can|CanAny|CanAll>` and do not set `false` value to `available` on error.

> Before fix, on error every time hooks setted `false` to `available` value.

- Await error handing functions (`onError`)

#### Funciton `loadPermissions`

- Function `loadPermissions` throws error if the error handling function (`onError`) was not passed as property.
- `console.warn` was removed

## v0.1.1 - 2025-03-11

### Features

#### Funciton `loadPermissions`

- Added optional property to `onError`
- On catch `error` when `onError` undefined, `console.warn` prints error to console

## v0.1.0 - 2025-03-08

Library initialized with minimal documentation and contains all required functions

Release MVP
