import '@/styles/globals.css'
import { ClerkProvider, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import {useRouter} from 'next/router';
import 'purecss/build/pure.css';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {useState} from 'react'
import MapIcon from "@mui/icons-material/Map";
import FavoriteIcon from "@mui/icons-material/Favorite"

export default function App({ Component, pageProps }) {
  const [bottomChoice, setBottomChoice] = useState("");
  const router = useRouter();

  const navBarSelected={
    color: 'white',
    '& .Mui-selected': {color:'white'}
  };
  
  return (
    <ClerkProvider {...pageProps}>
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
    </ClerkProvider>
  );
}