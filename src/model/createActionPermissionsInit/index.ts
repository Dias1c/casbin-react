import { useState } from "react";
import { TFuncLoadPermissions } from "../createPermissionsLoad";

export const createActionPermissionsInit = ({
  loadPermissions,
}: {
  loadPermissions: TFuncLoadPermissions;
}) => {
  function useActionPermissionsInit({ onError }: { onError?: TFuncOnError }) {
    const [loading, setLoading] = useState(false);

    const run = async () => {
      try {
        setLoading(true);
        await loadPermissions();
      } catch (err) {
        onError?.(err);
      } finally {
        setLoading(false);
      }
    };

    return { run, loading };
  }

  return { useActionPermissionsInit };
};
