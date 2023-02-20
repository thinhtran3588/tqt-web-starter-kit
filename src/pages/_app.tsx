/* eslint-disable react/jsx-props-no-spreading */
import {useRouter} from 'next/router';
import CssBaseline from '@mui/material/CssBaseline';
import {StyledEngineProvider} from '@mui/material/styles';
import type {AppProps} from 'next/app';
import {Provider} from 'react-redux';
import Layout from '@app/common/components/layout';
import AuthLayout from '@app/auth/components/layout';
import {store} from '@app/store';
import '../common/global.css';

export default function MyApp({Component, pageProps}: AppProps): JSX.Element {
  const router = useRouter();
  let LayoutComponent = Layout;

  if (router.pathname.startsWith('/auth')) {
    LayoutComponent = AuthLayout;
  }

  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <LayoutComponent>
          <Component {...pageProps} />
        </LayoutComponent>
      </StyledEngineProvider>
    </Provider>
  );
}
