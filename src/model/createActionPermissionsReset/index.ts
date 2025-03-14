import { CAuthorizer } from "@diaskappassov/casbin-js";
import { useState } from "react";

export const createActionPermissionsReset = ({
  authorizer,
}: {
  authorizer: CAuthorizer;
}) => {
  function useActionPermissionsReset({ onError }: { onError?: TFuncOnError }) {
    const [loading, setLoading] = useState(false);

    const run = async () => {
      try {
        setLoading(true);
        authorizer.reset();
      } catch (err) {
        await onError?.(err);
      } finally {
        setLoading(false);
      }
    };

    return { run, loading };
  }

  return { useActionPermissionsReset };
};
