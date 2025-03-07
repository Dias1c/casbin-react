# casbin-react

🔐 Simple library that supports access control models like ACL, RBAC, ABAC for React Application.

<p align="center">
  <img alt="ts" src="https://badgen.net/badge/-/TypeScript?icon=typescript&label&labelColor=blue&color=555555">
  <a href="https://www.npmjs.com/package/@diaskappassov/casbin-react">
    <img alt="NPM package version" src="https://img.shields.io/npm/v/@diaskappassov/casbin-react"/>
    <img alt="NPM package downloads count" src="https://img.shields.io/npm/dy/@diaskappassov/casbin-react?label=Downloads&logo=npm" />
  </a>
  <a href="https://github.com/Dias1c/casbin-react/">
    <img alt="Visit package GitHub page" src="https://img.shields.io/github/stars/Dias1c/casbin-react?style=social&label=GitHub&maxAge=2592000"/>
  </a>
</p>

> [!NOTE]
>
> - Changelogs [here](./CHANGELOGS.md).
> - Read more about casbin [here](https://casbin.org/docs/overview).

## Installation

```sh
npm i @diaskappassov/casbin-react
```

## Usage

<!-- TODO: in examples directory -->

You can see all usage examples bellow

### Generate hooks/components

```tsx
import { createPermissionsScope } from "@diaskappassov/casbin-react";

function getAuth() {
  return {
    m: `
# Request definition
[request_definition]
# Can subject, do_action, on_object
r = sub, act, obj

# Policy definition
[policy_definition]
p = sub, act, obj

# Role definition
[role_definition]
g = _, _

# Policy effect
[policy_effect]
e = some(where (p.eft == allow))

# Matchers
[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
`,
    p: [
      ["p", "cat", "walk", "ground"],
      ["p", "cat", "run", "ground"],
      ["p", "cat", "swim", "water"],
      ["p", "cat", "breathe", "air"],
    ],
  };
}

export const {
  PermissionsCan,
  PermissionsCanAll,
  PermissionsCanAny,
  authorizer,
  loadPermissions,
  useActionPermissionsInit,
  useActionPermissionsReset,
  usePermissionsCan,
  usePermissionsCanAll,
  usePermissionsCanAny,
} = createPermissionsScope({
  get: getAuthzPermissions,
});
```

### PermissionsCan

Use wrapper component

```tsx
export function App() {
  return (
    <>
      {/* Wrap children */}
      <PermissionsCan
        rvals={["cat", "run", "ground"]}
        childrenOnLoading={"Loading..."}
        childrenOnUnavailable={"No cat can't do it :("}
        childrenOnUndefined={"Sorry, cant recognize"}
        onError={(err) => {
          console.error("PermissionsCan: something wen'Øt wrong", err);
        }}
      >
        Yes cat can run on the ground
      </PermissionsCan>

      {/* Or */}
      {/* Use render props pattern */}
      <PermissionsCan
        rvals={["cat", "run", "ground"]}
        render={({ available, loading }) => {
          if (loading) return "Loading...";
          if (available === true) return "YES";
          if (available === false) return "NO";
          return "I DONT KNOW";
        }}
        onError={(err) => {
          console.error("PermissionsCan: something went wrong", err);
        }}
      />
    </>
  );
}
```

Use hook

```tsx
export function App() {
  const { available, loading } = usePermissionsCan({
    rvals: ["cat", "run", "ground"],
  });

  if (loading) return "Loading...";
  if (available === true) return "YES";
  if (available === false) return "NO";
  return "I DONT KNOW";
}
```

## TODO

- [ ] Examples
- [ ] Documentation
- [ ] Test
- [ ] Release v1.0.0
