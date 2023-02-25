import {useDispatch, useSelector} from 'react-redux';
import {useSnackbar} from 'notistack';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import SEO from '@app/common/components/seo';
import type {Dispatch, RootState} from '@app/store';
import Button from '@app/common/components/button';

export default function CompleteEmailVerification() {
  const router = useRouter();
  const {enqueueSnackbar} = useSnackbar();
  const {
    auth: {handleVerifyEmail},
  } = useDispatch<Dispatch>();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const loadingAuth = useSelector((rootState: RootState) => rootState.auth.loading);
  const loading = useSelector((rootState: RootState) => rootState.loading.effects.auth.handleVerifyEmail);
  const {oobCode} = router.query;

  useEffect(() => {
    handleVerifyEmail(oobCode as string)
      .then(({error}) => {
        if (error) {
          enqueueSnackbar(error, {variant: 'error'});
          return;
        }
        setIsSuccessful(true);
      })
      .catch((error) => enqueueSnackbar(error.message, {variant: 'error'}));
  }, [enqueueSnackbar, handleVerifyEmail, oobCode]);

  const goBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <form className='flex flex-col w-96 shadow-2xl p-4 rounded-lg'>
      <SEO title='Email verification' description='Email verification' />
      <div className='flex items-center justify-between'>
        <h4 className='text-2xl'>Email Verification</h4>
      </div>
      {(loadingAuth || loading) && (
        <div className='flex items-center justify-center'>
          <CircularProgress />
        </div>
      )}
      {!loadingAuth && !loading && isSuccessful && (
        <div>Your email has been verified. Please go back to home page.</div>
      )}

      <Button variant='outlined' className='mt-2' onClick={goBackToHome}>
        Back to home
      </Button>
    </form>
  );
}
