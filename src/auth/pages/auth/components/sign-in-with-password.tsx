import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {FormHelperText} from '@mui/material';
import {useSnackbar} from 'notistack';
import {useRouter} from 'next/router';
import type {Dispatch, RootState} from '@app/store';
import Link from 'next/link';
import Button from '@app/common/components/button';

interface Props {
  defaultEmail?: string;
}

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().required('Required'),
});

export default function SignInWithPassword({defaultEmail}: Props) {
  const initialValues = {
    email: defaultEmail || '',
    password: '',
  };

  const [showPassword, setShowPassword] = useState(false);
  const loadingAuth = useSelector((rootState: RootState) => rootState.auth.loading);
  const loading = useSelector((rootState: RootState) => rootState.loading.effects.auth.signInWithEmail);
  const {enqueueSnackbar} = useSnackbar();
  const router = useRouter();
  const {
    auth: {signInWithEmail},
  } = useDispatch<Dispatch>();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) =>
      signInWithEmail(values)
        .then(({error, emailVerified}) => {
          if (error) {
            enqueueSnackbar(error, {variant: 'error'});
            return;
          }
          if (!emailVerified) {
            enqueueSnackbar('Please verify your email', {variant: 'warning'});
            router.push({
              pathname: '/auth/verify-email',
              query: {
                email: values.email,
              },
            });
            return;
          }
          enqueueSnackbar('Signed in successfully', {variant: 'success'});
          router.push('/');
        })
        .catch((err) => enqueueSnackbar(err.message, {variant: 'error'})),
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <form className='flex flex-col' onSubmit={formik.handleSubmit}>
      <FormControl variant='standard'>
        <InputLabel htmlFor='email'>Email</InputLabel>
        <Input id='email' name='email' onChange={formik.handleChange} value={formik.values.email} />
      </FormControl>
      {formik.touched.email && formik.errors.email && <FormHelperText error>{formik.errors.email}</FormHelperText>}
      <FormControl variant='standard' className='mt-2'>
        <InputLabel htmlFor='password'>Password</InputLabel>
        <Input
          id='password'
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton aria-label='toggle password visibility' onClick={toggleShowPassword} tabIndex={-1}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          onChange={formik.handleChange}
          value={formik.values.password}
        />
      </FormControl>
      {formik.touched.password && formik.errors.password && (
        <FormHelperText error>{formik.errors.password}</FormHelperText>
      )}
      <div className='flex justify-end mt-2'>
        <Link href={`/auth/forgot-password?email=${formik.values.email}`}>Forgot password?</Link>
      </div>
      <Button variant='outlined' className='mt-2' type='submit' disabled={loadingAuth} loading={loading}>
        Sign in
      </Button>
    </form>
  );
}
