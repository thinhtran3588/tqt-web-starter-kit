import Button from '@mui/material/Button';
import Link from 'next/link';
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
import SEO from '@app/common/components/seo';
import type {Dispatch, RootState} from '@app/store';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().min(6, 'Too Short!').max(50, 'Too Long!').required('Required'),
  confirmPassword: yup
    .string()
    .required('Required')
    .oneOf([yup.ref('password')], 'Password must match'),
});

const initialValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const count = useSelector((rootState: RootState) => rootState.count.count);
  const incrementAsyncLoading = useSelector((rootState: RootState) => rootState.loading.effects.count.incrementAsync);
  const {
    count: {increment, incrementAsync},
  } = useDispatch<Dispatch>();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(values, null, 2));
      incrementAsync(1);
    },
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <form className='flex flex-col w-96 shadow-2xl p-4 rounded-lg' onSubmit={formik.handleSubmit}>
      <SEO title='Register' description='Create a new user' />
      <div className='flex items-center justify-between'>
        <h4 className='text-2xl'>Sign up</h4>
        <Link href='/auth'>Already have an account?</Link>
      </div>
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
              <IconButton aria-label='toggle password visibility' onClick={toggleShowPassword}>
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
      <FormControl variant='standard' className='mt-2'>
        <InputLabel htmlFor='confirmPassword'>Confirm Password</InputLabel>
        <Input
          id='confirmPassword'
          type={showConfirmPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton aria-label='toggle confirm password visibility' onClick={toggleShowConfirmPassword}>
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
        />
      </FormControl>
      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        <FormHelperText error>{formik.errors.confirmPassword}</FormHelperText>
      )}
      <Button variant='outlined' className='mt-2' type='submit' disabled={incrementAsyncLoading}>
        Sign up
      </Button>
      <span>{count}</span>
      <span>{incrementAsyncLoading ? 'loading...' : ''}</span>
      <Button variant='outlined' className='mt-2' onClick={() => increment(2)}>
        increment
      </Button>
    </form>
  );
}
