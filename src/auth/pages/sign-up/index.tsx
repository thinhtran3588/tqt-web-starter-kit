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
import {useSnackbar} from 'notistack';
import {useRouter} from 'next/router';
import SEO from '@app/common/components/seo';
import type {Dispatch, RootState} from '@app/store';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup
    .string()
    .required('Required')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,20})/, 'regex'),
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

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const loading = useSelector((rootState: RootState) => rootState.loading.effects.auth.signUpWithEmail);
  const {enqueueSnackbar} = useSnackbar();
  const {
    auth: {signUpWithEmail},
  } = useDispatch<Dispatch>();
  const router = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) =>
      signUpWithEmail(values)
        .then(({error}) => {
          if (error) {
            enqueueSnackbar(error, {variant: 'error'});
            return;
          }
          enqueueSnackbar('Signed up successfully', {variant: 'success'});
          router.push({
            pathname: '/auth',
            query: {
              email: values.email,
            },
          });
        })
        .catch((error) => enqueueSnackbar(error.message, {variant: 'error'})),
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const isValidPassword = (
    rule:
      | 'validLength'
      | 'hasAtLeastOneUppercaseLetter'
      | 'hasAtLeastOneLowercaseLetter'
      | 'hasAtLeastOneDigit'
      | 'hasAtLeastOneSpecialCharacter',
  ) => {
    let regExp: RegExp;
    const {password} = formik.values;
    switch (rule) {
      case 'validLength':
        regExp = /.{6,20}/;
        break;
      case 'hasAtLeastOneUppercaseLetter':
        regExp = /[A-Z]/;
        break;
      case 'hasAtLeastOneLowercaseLetter':
        regExp = /[a-z]/;
        break;
      case 'hasAtLeastOneDigit':
        regExp = /[0-9]/;
        break;
      case 'hasAtLeastOneSpecialCharacter':
        regExp = /[^A-Za-z0-9]/;
        break;
      default:
        return false;
    }
    return regExp.test(password);
  };

  return (
    <form className='flex flex-col w-96 shadow-2xl p-4 rounded-lg' onSubmit={formik.handleSubmit}>
      <SEO title='Sign Up' description='Create a new user' />
      <div className='flex items-center justify-between'>
        <h4 className='text-2xl'>Sign up</h4>
        <Link href='/auth'>Already have an account?</Link>
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
          error={formik.touched.password && !!formik.errors.password}
        />
      </FormControl>
      {formik.touched.password && formik.errors.password && (
        <ul>
          {!isValidPassword('validLength') && (
            <li>
              <FormHelperText error>Password length must be from 6 to 20 characters</FormHelperText>
            </li>
          )}
          {!isValidPassword('hasAtLeastOneUppercaseLetter') && (
            <li>
              <FormHelperText error>Password must have at least one uppercase character</FormHelperText>
            </li>
          )}
          {!isValidPassword('hasAtLeastOneLowercaseLetter') && (
            <li>
              <FormHelperText error>Password must have at least one lower character</FormHelperText>
            </li>
          )}
          {!isValidPassword('hasAtLeastOneDigit') && (
            <li>
              <FormHelperText error>Password must have at least one digit</FormHelperText>
            </li>
          )}
          {!isValidPassword('hasAtLeastOneSpecialCharacter') && (
            <li>
              <FormHelperText error>Password must have at least one special character</FormHelperText>
            </li>
          )}
        </ul>
      )}
      <FormControl variant='standard' className='mt-2'>
        <InputLabel htmlFor='confirmPassword'>Confirm Password</InputLabel>
        <Input
          id='confirmPassword'
          type={showConfirmPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle confirm password visibility'
                onClick={toggleShowConfirmPassword}
                tabIndex={-1}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
        />
      </FormControl>
      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        <FormHelperText error>{formik.errors.confirmPassword}</FormHelperText>
      )}
      <Button variant='outlined' className='mt-2' type='submit' disabled={loading}>
        Sign up
      </Button>
    </form>
  );
}