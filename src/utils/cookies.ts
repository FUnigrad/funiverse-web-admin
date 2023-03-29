import { Cookies } from 'react-cookie';
export const CookieNames = {
  AccessToken: 'accessToken',
  RefreshToken: 'refreshToken',
} as const;
export const appCookies = (function () {
  const cookies = new Cookies();
  return {
    getAccessToken: () => cookies.get(CookieNames.AccessToken),
    getRefreshToken: () => cookies.get(CookieNames.RefreshToken),
  };
})();
