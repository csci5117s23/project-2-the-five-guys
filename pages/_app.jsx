import '@/styles/globals.css'
import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs';
import {useRouter} from 'next/router';
import 'purecss/build/pure.css';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Paper, ThemeProvider, createTheme } from '@mui/material';
import {useState} from 'react'
import MapIcon from "@mui/icons-material/Map";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Image from 'next/image';
import ParkTrackLogo from '@/public/ParkTrack.png';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  const [bottomChoice, setBottomChoice] = useState(0);
  const router = useRouter();

  // Styling for bottom navigation buttons
  // const navBarSelected={
  //   color: 'white',
  //   '& .Mui-selected': {color:'white'}
  // };

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#4f703b',
      },
      secondary: {
        main: '#ef6c00',
      },
      success: {
        main: '#85a085',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ClerkProvider {...pageProps}>
        {/* Header */}
        <div className="topHeader">
          {/* <Image src={ParkTrackLogo} alt='ParkTrack logo' height={241} width={883} /> */}
          <Image src={ParkTrackLogo} alt='ParkTrack logo' height={40.2} width={147.2} className='top-logo'/>
        </div>

        <Component {...pageProps} />

        {/* Bottom navigation bar */}
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
          }}
          elevation={3}
        >
          <BottomNavigation
            // sx={{bgcolor: '#1B742E'}}
            showLabels
            value={bottomChoice}
            onChange={(event, newValue) => {
              console.log(newValue);
              if(newValue == 0){
                router.push("/parks");
              } else if(newValue == 1){
                router.push("/parks");
              }
              setBottomChoice(newValue);
            }}
          >
            <BottomNavigationAction label="Explore" icon={<MapIcon />}/>
            <BottomNavigationAction label="My Trips" icon={<FavoriteIcon />}/>
            <SignedIn>
              <BottomNavigationAction icon={<UserButton />}/>
            </SignedIn>
          </BottomNavigation>
        </Paper>
      </ClerkProvider>
    </ThemeProvider>
  );
}
