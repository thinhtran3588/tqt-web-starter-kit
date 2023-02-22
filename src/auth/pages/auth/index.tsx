import Link from 'next/link';
import {useDispatch, useSelector} from 'react-redux';
import {useSnackbar} from 'notistack';
import {useRouter} from 'next/router';
import SEO from '@app/common/components/seo';
import type {Dispatch, RootState} from '@app/store';
import Button from '@app/common/components/button';
import SignInWithPassword from './components/sign-in-with-password';

export default function Auth() {
  const {enqueueSnackbar} = useSnackbar();
  const router = useRouter();
  const loadingAuth = useSelector((rootState: RootState) => rootState.auth.loading);
  const loadingGoogle = useSelector((rootState: RootState) => rootState.loading.effects.auth.signInWithGoogle);
  const loadingFacebook = useSelector((rootState: RootState) => rootState.loading.effects.auth.signInWithFacebook);
  const {
    auth: {signInWithGoogle, signInWithFacebook},
  } = useDispatch<Dispatch>();
  const {email} = router.query as {email: string};

  const onClickSignInWithGoogle = () =>
    signInWithGoogle()
      .then(({error, cancelled}) => {
        if (cancelled) {
          return;
        }
        if (error) {
          enqueueSnackbar(error, {variant: 'error'});
          return;
        }
        enqueueSnackbar('Signed in successfully', {variant: 'success'});
        router.push('/');
      })
      .catch((error) => {
        enqueueSnackbar(error.message, {variant: 'error'});
      });

  const onClickSignInWithFacebook = () =>
    signInWithFacebook()
      .then(() => {
        enqueueSnackbar('Signed in successfully', {variant: 'success'});
        router.push('/');
      })
      .catch((err) => enqueueSnackbar(err.message, {variant: 'error'}));

  return (
    <div className='flex flex-col w-96 shadow-2xl p-4 rounded-lg'>
      <SEO title='Sign In' description='Sign in' />
      <div className='flex items-center justify-between'>
        <h4 className='text-2xl'>Sign in</h4>
        <Link href='/auth/sign-up'>Don&apos;t have an account?</Link>
      </div>
      <Button
        variant='contained'
        className='bg-red-500'
        disabled={loadingAuth}
        loading={loadingGoogle}
        onClick={onClickSignInWithGoogle}
      >
        Sign in with Google
      </Button>
      <Button
        variant='contained'
        className='bg-blue-500 mt-2'
        disabled={loadingAuth}
        loading={loadingFacebook}
        onClick={onClickSignInWithFacebook}
      >
        Sign in with Facebook
      </Button>
      <Button variant='contained' className='mt-2' disabled>
        Connect wallet
      </Button>
      <div className='w-full flex py-5 items-center'>
        <div className='flex-grow border-gray-300 border-2 border-solid' />
        <span className='flex-shrink mx-4 text-gray-400'>Or sign in with</span>
        <div className='flex-grow border-gray-300 border-2 border-solid' />
      </div>
      <SignInWithPassword defaultEmail={email} />
    </div>
  );
}
