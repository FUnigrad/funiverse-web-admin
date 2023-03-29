import React, { useEffect } from 'react';
import { useAppCookies } from 'src/hooks';
import { __DEV__ } from 'src/utils';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [cookies] = useAppCookies();
  const refreshToken = cookies.refreshToken;
  if (!refreshToken) {
    window.location.href = __DEV__
      ? 'http://localhost:8000/verify'
      : process.env.REACT_APP_LANDING_URL + 'verify';
    return null;
  }
  return <>{children}</>;
}

export default AuthGuard;
