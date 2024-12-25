// ** React Imports
import { ReactNode, ReactElement, useState, useEffect } from 'react';

// ** Next Imports
import { useRouter } from 'next/router';

// ** Hooks Import
import { useAuth } from '@hooks/useAuth';

interface GuestGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const GuestGuard = (props: GuestGuardProps) => {
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

    if(user) {
      if(!isRedirected) {
        setIsRedirected(true);
        const returnUrl = router.query.next;
        const redirectURL = (returnUrl && returnUrl !== '/') ? returnUrl : '/';
        router.replace(redirectURL as string);
      }
    }

  }, [router.route, user]);

  if(isInitialization || user) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuestGuard;
