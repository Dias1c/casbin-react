import { CAuthorizer } from "@diaskappassov/casbin-js";
import { useEffect, useState } from "react";
import { TFuncLoadPermissions } from "../createPermissionsLoad";

export function createPermissionsCan<T extends string>({
  authorizer,
  loadPermissions,
}: {
  authorizer: CAuthorizer;
  loadPermissions: TFuncLoadPermissions;
}) {
  function usePermissionsCan({
    rvals,
    onError,
  }: {
    rvals: T[];
    onError?: TFuncOnError;
  }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [available, setAvailable] = useState<boolean | undefined>(undefined);

    const loadIsAvailable = async () => {
      setLoading(true);
      const setAvailableAfterInit = async () => {
        setAvailable(await authorizer.can(rvals));
      };

      try {
        if (!authorizer.isInited()) {
          await loadPermissions({ onInitCallback: setAvailableAfterInit });
        } else {
          await setAvailableAfterInit();
        }
      } catch (err) {
        onError?.(err);
        setAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadIsAvailable();
    }, [JSON.stringify(rvals)]);

    useEffect(() => {
      const func = loadIsAvailable;
      authorizer.onInitCallbacks.push(func);
      return () => {
        authorizer.onInitCallbacks.remove(func);
      };
    }, []);

    return { available, loading };
  }

  function PermissionsCan({
    rvals,
    render,
    children,
    childrenOnUnavailable,
    childrenOnUndefined,
    childrenOnLoading,
    onError,
  }: {
    rvals: T[];
    render?: (props: ReturnType<typeof usePermissionsCan>) => React.ReactNode;
    children?: React.ReactNode;
    childrenOnUnavailable?: React.ReactNode;
    childrenOnUndefined?: React.ReactNode;
    childrenOnLoading?: React.ReactNode;
    onError?: TFuncOnError;
  }) {
    const { available, loading } = usePermissionsCan({ rvals, onError });

    if (render) return <>{render({ available, loading })}</>;
    if (loading && childrenOnLoading) return <>{childrenOnLoading}</>;
    if (available === true) return <>{children}</>;
    if (available === false) return <>{childrenOnUnavailable}</>;
    return <>{childrenOnUndefined}</>;
  }

  return { usePermissionsCan, PermissionsCan };
}
