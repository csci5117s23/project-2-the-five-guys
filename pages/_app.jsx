import '@/styles/globals.css'
import { ClerkProvider, UserButton } from '@clerk/nextjs';
import {useRouter} from 'next/router';
import 'purecss/build/pure.css';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Paper } from '@mui/material';
import {useState} from 'react'
import MapIcon from "@mui/icons-material/Map";
import FavoriteIcon from "@mui/icons-material/Favorite"

export default function App({ Component, pageProps }) {
  const [bottomChoice, setBottomChoice] = useState(0);
  const router = useRouter();

  // Styling for bottom navigation buttons
  const navBarSelected={
    color: 'white',
    '& .Mui-selected': {color:'white'}
  };
  
  return (
    <ClerkProvider {...pageProps}>
      {/* Header */}
      <div className="topHeader">
        Explore
        <span className="userButton" ><UserButton/></span>
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
          sx={{bgcolor: '#1B742E'}}
          showLabels 
          value={bottomChoice} 
          onChange={(event, newValue) => {
            console.log(newValue);
            if(newValue == 0){
              router.push("/parks");
            }else{
              router.push("/parks");
            }
            setBottomChoice(newValue);
          }}
        >
          <BottomNavigationAction label="Explore" icon={<MapIcon />} sx={navBarSelected}/>
          <BottomNavigationAction label="My Trips" icon={<FavoriteIcon />} sx={navBarSelected}/>
        </BottomNavigation>
      </Paper>
    </ClerkProvider>
  );
}