/* eslint-disable react/jsx-props-no-spreading */
import {useRouter} from 'next/router';
import CssBaseline from '@mui/material/CssBaseline';
import {StyledEngineProvider} from '@mui/material/styles';
import {Provider} from 'react-redux';
import {SnackbarProvider} from 'notistack';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import type {AppProps} from 'next/app';
import Layout, {Module} from '@app/common/components/layout';
import AuthLayout from '@app/auth/components/layout';
import {store} from '@app/store';
import useAuth from '@app/auth/hooks/use-auth';
import '../common/global.css';

const modules: Module[] = [
  {
    title: 'Module 1',
    showTitle: true,
    showDivider: true,
    menuItems: [
      {
        path: '/',
        label: 'Dashboard 1(public)',
        icon: <InboxIcon />,
      },
    ],
  },
  {
    title: 'Module 2',
    showTitle: true,
    menuItems: [
      {
        path: '/demo',
        label: 'Demo 1(auth)',
        icon: <MailIcon />,
      },
    ],
  },
];

function BaseApp({Component, pageProps}: AppProps): JSX.Element {
  useAuth();
  const router = useRouter();

  if (router.pathname.startsWith('/auth')) {
    return (
      <AuthLayout>
        <Component {...pageProps} />
      </AuthLayout>
    );
  }

  return (
    <Layout modules={modules}>
      <Component {...pageProps} />
    </Layout>
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
