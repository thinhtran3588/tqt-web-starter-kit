import {useEffect, useState} from 'react';
import {initializeApp} from 'firebase/app';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
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
    initializeApp(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string));
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
