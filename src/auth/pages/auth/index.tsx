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
import SEO from '@app/common/components/seo';

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className='flex flex-col w-96 shadow-2xl p-4 rounded-lg'>
      <SEO title='Auth' description='Authenticate user' />
      <div className='flex items-center justify-between'>
        <h4 className='text-2xl'>Sign in</h4>
        <Link href='/auth/sign-up'>Don&apos;t have an account?</Link>
      </div>
      <Button variant='contained' className='bg-red-500'>
        Sign in with Google
      </Button>
      <Button variant='contained' className='bg-blue-500 mt-2'>
        Sign in with Facebook
      </Button>
      <Button variant='contained' className='bg-purple-500 mt-2'>
        Connect wallet
      </Button>
      <div className='w-full flex py-5 items-center'>
        <div className='flex-grow border-gray-300 border-2 border-solid' />
        <span className='flex-shrink mx-4 text-gray-400'>Or sign in with</span>
        <div className='flex-grow border-gray-300 border-2 border-solid' />
      </div>
      <FormControl variant='standard'>
        <InputLabel htmlFor='emailOrUsername'>Email/Username</InputLabel>
        <Input id='emailOrUsername' />
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
      <Button variant='outlined' className='mt-2'>
        Sign in
      </Button>
    </div>
  );
}
