import {ReactElement} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useUser} from "@clerk/clerk-react";
import {useMeQuery} from "../../store/api/meApi";
import FullPageSpinner from "../common/FullPageSpinner";

interface AuthGuardProps {
  allowedRoles: string[];
  children: JSX.Element;
}

export default function AuthGuard({
                                    allowedRoles,
                                    children,
                                  }: Readonly<AuthGuardProps>): ReactElement {
  const location = useLocation();
  const {isSignedIn, isLoaded} = useUser();

  const {
    data: me,
    isLoading: isMeLoading,
    isError,
  } = useMeQuery(undefined, {
    skip: !isSignedIn,
  });

  if (!isLoaded) {
    return <FullPageSpinner/>;
  }

  if (!isSignedIn) {
    return <Navigate to="/signin" state={{from: location}} replace/>;
  }

  if (isMeLoading) {
    return <FullPageSpinner/>;
  }

  if (isError || !me) {
    return <Navigate to="/signin" replace/>;
  }

  if (!allowedRoles.includes(me.role)) {
    return <Navigate to="/forbidden" replace/>;
  }
  return children;
}
