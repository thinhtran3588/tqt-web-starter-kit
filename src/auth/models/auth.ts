import {createModel} from '@rematch/core';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut as signOutFirebase,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  AuthProvider,
  sendEmailVerification,
  User,
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'firebase/auth';
import type {RootModel} from '@app/store/models';

type AuthState = {
  type: string;
  username: string;
  displayName: string;
  email: string;
  firebaseId: string;
  loading: boolean;
  signedIn: boolean;
  emailVerified: boolean;
};

const defaultState: AuthState = {
  loading: true,
  firebaseId: '',
  displayName: '',
  email: '',
  type: '',
  signedIn: false,
  username: '',
  emailVerified: false,
} as AuthState;

const setAuthLoading = (draftState: AuthState, loading: boolean) => {
  draftState.loading = loading;
};

const signIn = (draftState: AuthState, payload: Partial<Omit<AuthState, 'loading' | 'signedIn'>>) => {
  Object.assign(draftState, payload);
  draftState.loading = false;
  draftState.signedIn = true;
};

const clearAuth = (draftState: AuthState) => {
  Object.assign(draftState, defaultState);
  draftState.loading = false;
};

const signUpWithEmail = async ({email, password}: {email: string; password: string}): Promise<{error?: string}> =>
  createUserWithEmailAndPassword(getAuth(), email, password)
    .then(() => ({}))
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        return {
          error: 'Email already in use',
        };
      }
      return {
        error: `Error when processing request(${error.code})`,
      };
    });

const signInWithEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{error?: string; emailVerified?: boolean}> =>
  signInWithEmailAndPassword(getAuth(), email, password)
    .then((userCredential) => ({emailVerified: userCredential.user.emailVerified}))
    .catch((error) => {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        return {
          error: `Invalid credentials`,
        };
      }
      if (error.code === 'auth/user-disabled') {
        return {
          error: 'Account has been disabled',
        };
      }
      return {
        error: `Error when processing request(${error.code})`,
      };
    });

const signInWithProvider = async (provider: AuthProvider): Promise<{error?: string; cancelled?: boolean}> =>
  signInWithPopup(getAuth(), provider)
    .then(() => ({}))
    .catch((error) => {
      if (error.code === 'auth/popup-closed-by-user') {
        return {
          cancelled: true,
        };
      }
      return {
        error: `Error when processing request(${error.code})`,
      };
    });

const signInWithGoogle = async (): Promise<{error?: string; cancelled?: boolean}> =>
  signInWithProvider(new GoogleAuthProvider());

const signInWithFacebook = async (): Promise<{error?: string; cancelled?: boolean}> =>
  signInWithProvider(new FacebookAuthProvider());

const signOut = async (): Promise<void> => {
  const auth = getAuth();
  return signOutFirebase(auth);
};

const verifyEmail = async (): Promise<{error?: string}> =>
  sendEmailVerification(getAuth().currentUser as User)
    .then(() => ({}))
    .catch((error) => ({
      error: `Error when processing request(${error.code})`,
    }));

const resetPassword = async (email: string): Promise<{error?: string}> =>
  sendPasswordResetEmail(getAuth(), email)
    .then(() => ({}))
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        // ignore error, not show to user
        return {};
      }
      return {
        error: `Error when processing request(${error.code})`,
      };
    });

const handleVerifyEmail = async (token: string): Promise<{error?: string}> =>
  applyActionCode(getAuth(), token)
    .then(() => ({}))
    .catch((error) => {
      if (error.code === 'auth/invalid-action-code') {
        return {
          error: 'Invalid token',
        };
      }
      return {
        error: `Error when processing request(${error.code})`,
      };
    });

const verifyPasswordResetToken = async (token: string): Promise<{error?: string}> =>
  verifyPasswordResetCode(getAuth(), token)
    .then(() => ({}))
    .catch((error) => {
      if (error.code === 'auth/invalid-action-code') {
        return {
          error: 'Invalid token',
        };
      }
      return {
        error: `Error when processing request(${error.code})`,
      };
    });

const setNewPassword = async ({token, newPassword}: {token: string; newPassword: string}): Promise<{error?: string}> =>
  confirmPasswordReset(getAuth(), token, newPassword)
    .then(() => ({}))
    .catch((error) => {
      if (error.code === 'auth/invalid-action-code') {
        return {
          error: 'Invalid token',
        };
      }
      return {
        error: `Error when processing request(${error.code})`,
      };
    });

const auth = createModel<RootModel>()({
  state: defaultState,
  reducers: {
    setAuthLoading,
    signIn,
    clearAuth,
  },
  effects: () => ({
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    verifyEmail,
    resetPassword,
    handleVerifyEmail,
    verifyPasswordResetToken,
    setNewPassword,
  }),
});

export default auth;
