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
import SEO from '@app/common/components/seo';
import type {Dispatch, RootState} from '@app/store';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const count = useSelector((rootState: RootState) => rootState.count.count);
  const incrementAsyncLoading = useSelector((rootState: RootState) => rootState.loading.effects.count.incrementAsync);
  const {
    count: {increment, incrementAsync},
  } = useDispatch<Dispatch>();

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className='flex flex-col w-96 shadow-2xl p-4 rounded-lg'>
      <SEO title='Register' description='Create a new user' />
      <div className='flex items-center justify-between'>
        <h4 className='text-2xl'>Sign up</h4>
        <Link href='/auth'>Already have an account?</Link>
      </div>
      <FormControl variant='standard'>
        <InputLabel htmlFor='email'>Email</InputLabel>
        <Input id='email' />
      </FormControl>
      <FormControl variant='standard'>
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
        />
      </FormControl>
      <FormControl variant='standard'>
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
        />
      </FormControl>
      <Button variant='outlined' className='mt-2'>
        Sign up
      </Button>
      <span>{count}</span>
      <span>{incrementAsyncLoading ? 'loading...' : ''}</span>
      <Button variant='outlined' className='mt-2' onClick={() => increment(2)}>
        increment
      </Button>
      <Button variant='outlined' className='mt-2' onClick={() => incrementAsync(2)}>
        incrementAsync
      </Button>
    </div>
  );
}
