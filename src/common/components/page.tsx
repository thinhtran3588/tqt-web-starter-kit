import {useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import type {RootState} from '@app/store';
import {CircularProgress} from '@mui/material';
import Button from './button';

interface Props {
  children?: React.ReactNode;
  authRequired?: boolean;
}

export default function Page({children, authRequired}: Props) {
  const router = useRouter();
  const auth = useSelector((rootState: RootState) => rootState.auth);

  const goToSignIn = () => router.push('/auth');
  const goToVerifyEmail = () => router.push('auth/verify-email');

  if (!authRequired) {
    return <div>{children}</div>;
  }

  if (auth.loading) {
    return (
      <div className='flex flex-1 justify-center items-center'>
        <CircularProgress size='4rem' />
      </div>
    );
  }

  if (authRequired && !auth.loading && !auth.signedIn) {
    return (
      <div className='flex flex-1 h-full flex-col justify-center items-center'>
        <span>Please sign to proceed</span>
        <Button variant='contained' className='mt-4' onClick={goToSignIn}>
          Sign In
        </Button>
      </div>
    );
  }

  if (auth.signedIn && auth.type === 'email' && !auth.emailVerified) {
    return (
      <div className='flex flex-1 h-full flex-col justify-center items-center'>
        <span>Please verify your email</span>
        <Button variant='contained' className='mt-4' onClick={goToVerifyEmail}>
          Verify email
        </Button>
      </div>
    );
  }

  return <div>{children}</div>;
}
