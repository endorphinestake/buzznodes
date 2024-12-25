// ** React Imports
import { ReactNode, ReactElement, useEffect, useState } from 'react';

// ** Next Imports
import { useRouter } from 'next/router';

// ** Hooks Import
import { useAuth } from '@hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props;

  // ** Hooks
  const router = useRouter();
  const { isInitialization, isInitialized, user } = useAuth();

  // ** State
  const [isRedirected, setIsRedirected] = useState<boolean>(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if(isInitialized && !user) {
      if(!isRedirected) {
        setIsRedirected(true);
        if(router.asPath !== '/') {
          router.replace(`/login?next=${router.asPath}`);
        } else {
          router.replace(`/login`);
        }
      }
    }

  }, [router.route, isInitialized, user]);

  if(isInitialization || !user) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
