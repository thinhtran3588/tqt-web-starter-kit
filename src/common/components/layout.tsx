import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '@mui/material/Avatar';
import {Dispatch, RootState} from '@app/store';
import React, {useState} from 'react';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface MenuItem {
  path: string;
  label: string;
  icon?: JSX.Element;
}

export interface Module {
  title: string;
  showTitle?: boolean;
  showDivider?: boolean;
  menuItems: MenuItem[];
}

interface Props {
  children?: React.ReactNode;
  modules: Module[];
}

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(({theme, open}) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function Layout({children, modules}: Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const {loading: authLoading, signedIn, displayName} = useSelector((rootState: RootState) => rootState.auth);
  const {
    auth: {signOut},
  } = useDispatch<Dispatch>();
  const activeMenuItem = modules.flatMap((mod) => mod.menuItems).find((item) => router.pathname === item.path);
  const avatarText =
    displayName.trim().length === 0
      ? ''
      : `${displayName
          .split(' ')
          .filter((w) => w)
          .map((w) => w[0])
          .join('')
          .toUpperCase()}`;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const goToSignIn = () => {
    router.push('/auth');
  };

  const signOutAndGoToHome = () => {
    signOut().then(() => router.push('/'));
  };

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{
              marginRight: 5,
              ...(open && {display: 'none'}),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            {activeMenuItem?.label}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent' open={open}>
        <DrawerHeader className='flex justify-between'>
          <Image priority src='/assets/black-icon.svg' height={40} width={40} alt='App icon' />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider className='mb-2' />
        {signedIn && open && (
          <>
            <div className='flex flex-col items-center px-2 pt-4 pb-4'>
              <Avatar className='h-32 w-32 bg-red-400'>
                <span className='text-6xl'> {avatarText}</span>
              </Avatar>
              <span className='mt-4'>Hello, {displayName || ''}</span>
            </div>
            <Divider className='mb-2' />
          </>
        )}
        {modules.map((mod) => (
          <React.Fragment key={mod.title}>
            {mod.showTitle && mod.title && <div className='pl-6 text-lg font-bold'>{open ? mod.title : ''}</div>}
            <List>
              {mod.menuItems.map((item) => (
                <ListItem key={item.label} disablePadding sx={{display: 'block'}}>
                  <Link href={item.path} className='no-underline text-gray-900'>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      {Boolean(item.icon) && (
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                            color: activeMenuItem === item ? '#1976D2' : undefined,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{color: activeMenuItem === item ? '#1976D2' : undefined}}
                        sx={{opacity: open ? 1 : 0}}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </List>
            {mod.showDivider && <Divider className='mb-2' />}
          </React.Fragment>
        ))}
        <Divider className='mb-2' />
        {!authLoading && (
          <List>
            {signedIn && (
              <ListItem disablePadding sx={{display: 'block'}} onClick={signOutAndGoToHome}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary='Sign Out' sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
              </ListItem>
            )}
            {!signedIn && (
              <ListItem disablePadding sx={{display: 'block'}} onClick={goToSignIn}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary='Sign In' sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        )}
      </Drawer>
      <Box component='main' sx={{flexGrow: 1, p: 3}}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
