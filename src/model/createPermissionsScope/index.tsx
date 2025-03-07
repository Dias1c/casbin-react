import { CAuthorizer } from "@diaskappassov/casbin-js";
import { createActionPermissionsInit } from "../createActionPermissionsInit";
import { createActionPermissionsReset } from "../createActionPermissionsReset";
import { createPermissionsCan } from "../createPermissionsCan";
import { createPermissionsCanAll } from "../createPermissionsCanAll";
import { createPermissionsCanAny } from "../createPermissionsCanAny";
import {
  createPermissionsLoad,
  TFuncGetPermissionsInitData,
} from "../createPermissionsLoad";

export function createPermissionsScope<T extends string>({
  get,
}: {
  get: TFuncGetPermissionsInitData;
}) {
  const authorizer = new CAuthorizer();

  const { loadPermissions } = createPermissionsLoad({
    authorizer,
    get,
  });

  const { useActionPermissionsInit } = createActionPermissionsInit({
    loadPermissions,
  });
  const { useActionPermissionsReset } = createActionPermissionsReset({
    authorizer,
  });

  const { PermissionsCan, usePermissionsCan } = createPermissionsCan<T>({
    authorizer,
    loadPermissions,
  });
  const { PermissionsCanAny, usePermissionsCanAny } =
    createPermissionsCanAny<T>({
      authorizer,
      loadPermissions,
    });
  const { PermissionsCanAll, usePermissionsCanAll } =
    createPermissionsCanAll<T>({
      authorizer,
      loadPermissions,
    });

  return {
    authorizer,
    loadPermissions,
    useActionPermissionsInit,
    useActionPermissionsReset,
    PermissionsCan,
    usePermissionsCan,
    PermissionsCanAny,
    usePermissionsCanAny,
    PermissionsCanAll,
    usePermissionsCanAll,
  };
}
