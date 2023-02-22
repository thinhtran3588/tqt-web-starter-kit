/* eslint-disable react/jsx-props-no-spreading */
import {useRouter} from 'next/router';
import CssBaseline from '@mui/material/CssBaseline';
import {StyledEngineProvider} from '@mui/material/styles';
import {Provider} from 'react-redux';
import {SnackbarProvider} from 'notistack';
import type {AppProps} from 'next/app';
import Layout from '@app/common/components/layout';
import AuthLayout from '@app/auth/components/layout';
import {store} from '@app/store';
import useAuth from '@app/auth/hooks/use-auth';
import '../common/global.css';

function BaseApp({Component, pageProps}: AppProps): JSX.Element {
  useAuth();
  const router = useRouter();
  let LayoutComponent = Layout;

  if (router.pathname.startsWith('/auth')) {
    LayoutComponent = AuthLayout;
  }

  return (
    <LayoutComponent>
      <Component {...pageProps} />
    </LayoutComponent>
  );
}

export default function MyApp(props: AppProps): JSX.Element {
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <StyledEngineProvider injectFirst>
          <CssBaseline />
          <BaseApp {...props} />
        </StyledEngineProvider>
      </SnackbarProvider>
    </Provider>
  );
}
