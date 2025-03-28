import { CAuthorizer } from "@diaskappassov/casbin-js";
import { useEffect, useState } from "react";
import { TFuncLoadPermissions } from "../createPermissionsLoad";

export function createPermissionsCanAny<T extends string>({
  authorizer,
  loadPermissions,
}: {
  authorizer: CAuthorizer;
  loadPermissions: TFuncLoadPermissions;
}) {
  function usePermissionsCanAny({
    listRvals,
    onError,
  }: {
    listRvals: T[][];
    onError?: TFuncOnError;
  }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [available, setAvailable] = useState<boolean | undefined>(undefined);

    const loadIsAvailable = async () => {
      setLoading(true);
      const setAvailableAfterInit = async () => {
        setAvailable(await authorizer.canAny(listRvals));
      };

      try {
        if (!authorizer.isInited()) {
          await loadPermissions({ onInitCallback: setAvailableAfterInit });
        } else {
          await setAvailableAfterInit();
        }
      } catch (err) {
        onError?.(err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadIsAvailable();
    }, [JSON.stringify(listRvals)]);

    useEffect(() => {
      const func = loadIsAvailable;
      authorizer.onInitCallbacks.push(func);
      return () => {
        authorizer.onInitCallbacks.remove(func);
      };
    }, []);

    return { available, loading };
  }

  function PermissionsCanAny({
    listRvals,
    render,
    children,
    childrenOnUnavailable,
    childrenOnUndefined,
    childrenOnLoading,
    onError,
  }: {
    listRvals: T[][];
    render?: (
      props: ReturnType<typeof usePermissionsCanAny>
    ) => React.ReactNode;
    children?: React.ReactNode;
    childrenOnUnavailable?: React.ReactNode;
    childrenOnUndefined?: React.ReactNode;
    childrenOnLoading?: React.ReactNode;
    onError?: TFuncOnError;
  }) {
    const { available, loading } = usePermissionsCanAny({ listRvals, onError });

    if (render) return <>{render({ available, loading })}</>;
    if (loading && childrenOnLoading) return <>{childrenOnLoading}</>;
    if (available === true) return <>{children}</>;
    if (available === false) return <>{childrenOnUnavailable}</>;
    return <>{childrenOnUndefined}</>;
  }

  return { usePermissionsCanAny, PermissionsCanAny };
}
