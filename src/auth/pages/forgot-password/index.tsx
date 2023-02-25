import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {useDispatch, useSelector} from 'react-redux';
import {useSnackbar} from 'notistack';
import {useRouter} from 'next/router';
import * as yup from 'yup';
import {useFormik} from 'formik';
import FormHelperText from '@mui/material/FormHelperText';
import SEO from '@app/common/components/seo';
import type {Dispatch, RootState} from '@app/store';
import Button from '@app/common/components/button';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
});

export default function ForgotPassword() {
  const {enqueueSnackbar} = useSnackbar();
  const {
    auth: {resetPassword},
  } = useDispatch<Dispatch>();
  const loadingAuth = useSelector((rootState: RootState) => rootState.auth.loading);
  const loading = useSelector((rootState: RootState) => rootState.loading.effects.auth.resetPassword);
  const router = useRouter();
  const {email} = router.query as {email: string};

  const initialValues = {
    email,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) =>
      resetPassword(values.email)
        .then(({error}) => {
          if (error) {
            enqueueSnackbar(error, {variant: 'error'});
            return;
          }
          enqueueSnackbar('If the mail is correct, Password Reset Email will be sent you. Please check your mailbox.', {
            variant: 'success',
          });
          router.push({
            pathname: '/auth',
            query: {
              email: values.email,
            },
          });
        })
        .catch((error) => enqueueSnackbar(error.message, {variant: 'error'})),
  });

  const goBackToSignIn = () => {
    router.push({
      pathname: '/auth',
      query: {
        email,
      },
    });
  };

  return (
    <form className='flex flex-col w-96 shadow-2xl p-4 rounded-lg' onSubmit={formik.handleSubmit}>
      <SEO title='Forgot password' description='Forgot password' />
      <div className='flex items-center justify-between'>
        <h4 className='text-2xl'>Forgot Password</h4>
      </div>
      <FormControl variant='standard'>
        <InputLabel htmlFor='email'>Email</InputLabel>
        <Input
          id='email'
          name='email'
          onChange={formik.handleChange}
          value={formik.values.email}
          error={formik.touched.email && Boolean(formik.errors.email)}
        />
      </FormControl>
      {formik.touched.email && formik.errors.email && <FormHelperText error>{formik.errors.email}</FormHelperText>}
      <Button variant='contained' className='mt-2' disabled={loadingAuth} loading={loading} type='submit'>
        Reset password
      </Button>
      <Button variant='outlined' className='mt-2' onClick={goBackToSignIn}>
        Back to sign in
      </Button>
    </form>
  );
}
