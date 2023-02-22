/* eslint-disable react/jsx-props-no-spreading */
import CircularProgress from '@mui/material/CircularProgress';
import MuiButton, {ButtonProps} from '@mui/material/Button';
import {forwardRef} from 'react';

interface Props extends ButtonProps {
  loading?: boolean;
}

const Button = forwardRef<any, Props>(({loading, disabled, children, ...other}, ref) => (
  <MuiButton ref={ref} disabled={disabled || loading} {...other}>
    {children}
    {loading && <CircularProgress className='ml-2' color='inherit' size='1rem' />}
  </MuiButton>
));

export default Button;
