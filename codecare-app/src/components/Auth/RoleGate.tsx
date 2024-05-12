import {ReactNode, useMemo} from "react";
import {useUser} from "@clerk/clerk-react";
import {skipToken} from "@reduxjs/toolkit/query";
import {useMeQuery} from "../../store/api/meApi";
import FullPageSpinner from "../common/FullPageSpinner";
import * as authUtil from "../../utils/auth-util";
import type {User} from "../../models/auth/User";

type RoleGateProps = {
  allowedRoles: string[];
  children: ReactNode;

  showWhileLoading?: boolean;

  fallback?: ReactNode;
};

export default function RoleGate({
                                   allowedRoles,
                                   children,
                                   showWhileLoading = false,
                                   fallback = null,
                                 }: Readonly<RoleGateProps>): JSX.Element | null {
  const {isSignedIn, isLoaded} = useUser();

  const {data: me, isLoading: isMeLoading, isError} = useMeQuery(
      isSignedIn ? undefined : skipToken
  );

  const isLoading = !isLoaded || (isSignedIn && isMeLoading);

  const isAllowed = useMemo(() => {
    if (!isSignedIn || isError || !me) return false;
    return authUtil.isUserInRole(me as User, allowedRoles);
  }, [isSignedIn, isError, me, allowedRoles]);

  if (isLoading) {
    return showWhileLoading ? <FullPageSpinner/> : null;
  }

  if (!isAllowed) return <>{fallback}</>;

  return <>{children}</>;
}
