import { useAuth } from '../context/AuthContext';

export const useAuthGuard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  return { isAuthenticated, isAdmin };
};

export default useAuthGuard;
