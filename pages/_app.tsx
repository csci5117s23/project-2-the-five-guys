import '@/styles/globals.css'
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import type { AppProps } from 'next/app';
import {useRouter} from 'next/router'
import 'purecss/build/pure.css';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {useState} from 'react'
import MapIcon from "@mui/icons-material/Map";
import FavoriteIcon from "@mui/icons-material/Favorite"

export default function App({ Component, pageProps }: AppProps) {
  const [bottomChoice, setBottomChoice] = useState("");
  const router = useRouter();

  const navBarSelected={
    color: 'white',
    '& .Mui-selected': {color:'white'}}

  return (
    <ClerkProvider {...pageProps}>
      <SignedIn>
        <div className="topHeader">
          Explore
          <span className="userButton" ><UserButton/></span>
        </div>
        <Component {...pageProps} />
        <BottomNavigation showLabels value={bottomChoice} 
          sx={{
            bgcolor: 'green',
            position: 'fixed', 
            bottom: 0,
            left: 0, right: 0
          }}
          onChange={(event, newValue) => {
            console.log(newValue);
            if(newValue == 0){
              router.push("/");
            }else{
              router.push("/");
            }
            setBottomChoice(newValue);
          }}
        >
          <BottomNavigationAction label="Explore" icon={<MapIcon />} sx={navBarSelected}/>
          <BottomNavigationAction label="My Trips" icon={<FavoriteIcon />} sx={navBarSelected}/>
        </BottomNavigation>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}
