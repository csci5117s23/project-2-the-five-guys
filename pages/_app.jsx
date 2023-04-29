import "@/styles/globals.css";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import "purecss/build/pure.css";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { AppBar, Box, Paper, ThemeProvider, createTheme } from "@mui/material";
import { useState } from "react";
import MapIcon from "@mui/icons-material/Map";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Image from "next/image";
import ParkTrackLogo from "@/public/ParkTrack.png";
import Head from "next/head";
import Link from "next/link";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

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
      mode: "light",
      primary: {
        main: "#387238",
      },
      secondary: {
        main: "#fff",
      },
      success: {
        main: "#1B742E",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ClerkProvider {...pageProps}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Website title */}
          <Head>
            <title> ParkTrack </title>
          </Head>

          {/* Header */}
          <AppBar component="nav" position="sticky" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <Box sx={{py: 0.5}}>
              <Image
                src={ParkTrackLogo}
                alt="ParkTrack logo"
                height={40}
              />
            </Box>
          </AppBar>
          <Box sx={{ pb: 7}}>
            <Component {...pageProps} />

            {/* Bottom navigation bar */}
            <Paper
              sx={{
                position: "fixed",
                zIndex: 100,
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
                  if (newValue == 0) {
                    router.push("/parks");
                  } else if (newValue == 1) {
                    router.push("/trips");
                  }
                  setBottomChoice(newValue);
                }}
              >
                <BottomNavigationAction label="Explore" icon={<MapIcon />} />
                <BottomNavigationAction label="My Trips" icon={<FavoriteIcon />} />
                <SignedIn>
                  <BottomNavigationAction icon={<UserButton />} />
                </SignedIn>
              </BottomNavigation>
            </Paper>
          </Box>
        </LocalizationProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
