import {useEffect} from 'react';
import {initializeApp} from 'firebase/app';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {decode} from 'js-base64';
import type {Dispatch, RootState} from '@app/store';

export default function useAuth() {
  const {
    auth: {setAuthLoading, signIn, clearAuth},
  } = useDispatch<Dispatch>();
  const auth = useSelector((rootState: RootState) => rootState.auth);

  const getType = (providerId: string) => {
    switch (providerId) {
      case 'google.com':
        return 'google';
      case 'facebook.com':
        return 'facebook';
      default:
        return 'email';
    }
  };

  useEffect(() => {
    initializeApp(JSON.parse(decode(process.env.NEXT_PUBLIC_FIREBASE_CONFIG_BASE64 as string).toString()));
    onAuthStateChanged(getAuth(), (user) => {
      if (auth.loading) {
        setAuthLoading(false);
      }
      if (user) {
        const type = getType(user.providerData[0].providerId);
        signIn({
          firebaseId: user.uid,
          displayName: user.displayName || 'User',
          type,
          username: '',
          email: user.email || '',
          emailVerified: user.emailVerified,
        });
      } else {
        clearAuth();
      }
    });
  }, [auth.loading, clearAuth, setAuthLoading, signIn]);
}
