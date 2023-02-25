import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {useDispatch, useSelector} from 'react-redux';
import {useSnackbar} from 'notistack';
import {useRouter} from 'next/router';
import SEO from '@app/common/components/seo';
import type {Dispatch, RootState} from '@app/store';
import Button from '@app/common/components/button';

export default function VerifyEmail() {
  const loadingAuth = useSelector((rootState: RootState) => rootState.auth.loading);
  const loading = useSelector((rootState: RootState) => rootState.loading.effects.auth.verifyEmail);
  const auth = useSelector((rootState: RootState) => rootState.auth);
  const {enqueueSnackbar} = useSnackbar();
  const {
    auth: {verifyEmail},
  } = useDispatch<Dispatch>();
  const router = useRouter();

  const sendVerificationEmail = () => {
    verifyEmail().then(({error}) => {
      if (error) {
        enqueueSnackbar(error, {variant: 'error'});
        return;
      }
      enqueueSnackbar('Email sent. Please check your mailbox', {variant: 'success'});
    });
  };

  const goBackToHome = () => {
    router.push({
      pathname: '/',
    });
  };

  return (
    <form className='flex flex-col w-96 shadow-2xl p-4 rounded-lg'>
      <SEO title='Verify email' description='Verify email' />
      <div className='flex items-center justify-between'>
        <h4 className='text-2xl'>Email Verification</h4>
      </div>
      <FormControl variant='standard'>
        <InputLabel htmlFor='email'>Email</InputLabel>
        <Input id='email' name='email' value={auth.email || ''} disabled />
      </FormControl>
      <Button
        variant='contained'
        className='mt-2'
        disabled={loadingAuth}
        loading={loading}
        onClick={sendVerificationEmail}
      >
        Send verification email
      </Button>
      <Button variant='outlined' className='mt-2' onClick={goBackToHome}>
        Back
      </Button>
    </form>
  );
}
