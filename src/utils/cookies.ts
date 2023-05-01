import { Cookies } from 'react-cookie';
import { __DEV__ } from '.';
export const CookieNames = {
  AccessToken: 'accessToken',
  RefreshToken: 'refreshToken',
  IsWorkspaceActive: 'isWorkspaceActive',
} as const;
export interface DecodedToken {
  role: string;
  domain: string;
  username: string;
  sub: string;
  iat: number;
  exp: number;
  wstatus: boolean;
}
export const appCookies = (function () {
  const cookies = new Cookies();
  return {
    setAccessToken: (token: string) => cookies.set(CookieNames.AccessToken, token),
    getAccessToken: () => cookies.get(CookieNames.AccessToken),
    getRefreshToken: () => cookies.get(CookieNames.RefreshToken),
    getDecodedAccessToken: (): DecodedToken | null => {
      const token = cookies.get(CookieNames.AccessToken);
      try {
        return JSON.parse(atob(token.split('.')[1])) as DecodedToken;
      } catch (e) {
        return null;
      }
    },
    clearAll: () => {
      cookies.remove(CookieNames.AccessToken);
      cookies.remove(CookieNames.RefreshToken);
      cookies.remove(CookieNames.IsWorkspaceActive);
    },
    setWorkspaceActive: () => {
      const now = new Date();
      const expires = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      cookies.remove(CookieNames.IsWorkspaceActive);
      cookies.set(CookieNames.IsWorkspaceActive, true, {
        domain: __DEV__ ? 'localhost' : process.env.REACT_APP_PUBLIC_DOMAIN,
        expires,
      });
    },
    getWorkspaceActive: () => cookies.get(CookieNames.IsWorkspaceActive),
  };
})();
