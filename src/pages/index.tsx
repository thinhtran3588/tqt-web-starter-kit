import Link from 'next/link';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import Button from '@mui/material/Button';
import SEO from '@app/common/components/seo';
import type {Dispatch, RootState} from '@app/store';

export default function Home() {
  const router = useRouter();
  const auth = useSelector((rootState: RootState) => rootState.auth);
  const {
    auth: {signOut},
  } = useDispatch<Dispatch>();

  const goToVerifyEmail = () => {
    router.push('/auth/verify-email');
  };

  return (
    <div>
      <SEO />
      {auth.signedIn && (
        <div>
          ${JSON.stringify(auth)}
          {auth.type === 'email' && !auth.emailVerified && (
            <div>
              <Button onClick={goToVerifyEmail}>Verify email</Button>
            </div>
          )}
          <div>
            <Button onClick={signOut}>Sign out</Button>
          </div>
        </div>
      )}
      {!auth.signedIn && (
        <div>
          <Button onClick={() => router.push('/auth')}>Sign in</Button>
          <Button onClick={() => router.push('/auth/sign-up')}>Sign up</Button>
        </div>
      )}

      <Link href='/demo'>Demo</Link>
    </div>
  );
}
