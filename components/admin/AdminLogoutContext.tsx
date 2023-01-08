import { createContext, useContext } from 'react';

function logoutNotSet() {
  console.error('Logout was called, but the real admin logout function is not available...');
}

const baseContext = createContext(logoutNotSet);
baseContext.displayName = 'Admin Logout Context';

export const AdminLogoutContext = baseContext.Provider;

export function useAdminLogout() {
  return useContext(baseContext);
}
