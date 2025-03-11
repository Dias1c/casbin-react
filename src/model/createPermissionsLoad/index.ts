import { CAuthorizer } from "@diaskappassov/casbin-js";

export interface IPermissionsInitProps {
  m: string;
  p: string[][];
}

export type TFuncGetPermissionsInitData = () =>
  | Promise<IPermissionsInitProps>
  | IPermissionsInitProps;

export type TFuncLoadPermissions = (props?: {
  onInitCallback?: () => void;
  onError?: TFuncOnError;
}) => Promise<void>;

export function createPermissionsLoad({
  authorizer,
  get,
}: {
  authorizer: CAuthorizer;
  get: TFuncGetPermissionsInitData;
}) {
  let isLoading = false;

  const loadPermissions: TFuncLoadPermissions = async (props) => {
    const { onInitCallback, onError } = props ?? {};

    if (onInitCallback)
      authorizer.onInitDisposableCallbacks.push(onInitCallback);
    if (isLoading) return;

    try {
      isLoading = true;
      const data = await get();
      await authorizer.init(data.m, data.p);
    } catch (err) {
      onError?.(err);
      if (!onError) {
        console.warn("casbin-react:err:loadPermissions:", err);
      }
      throw err;
    } finally {
      isLoading = false;
    }
  };

  return { loadPermissions };
}
