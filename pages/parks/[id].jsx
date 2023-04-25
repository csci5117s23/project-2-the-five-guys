import {useEffect, useState} from "react";
import NationalParkItem from "@/components/NationalParkItem"
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from 'next/router';
import { getNationalParks } from '@/modules/requests';
import RedirectToHome from '@/components/RedirectToHome';
import { CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Home() {
  const router = useRouter();
  const [itemId, setItemId] = useState("");

  const [nationalParks, setNationalParks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [park, setPark] = useState(null);

  useEffect(() => {
    if(router.query.id){
      setItemId(router.query.id);
    }
  },[router.query]);
  
  useEffect(()=> {
    async function loadNationalParkData()
    {
      let data = await getNationalParks();
      let filteredParks = data.data.filter((element) => element.designation.includes("National Park"));
      setNationalParks(filteredParks);
      setLoading(false);
    }
    loadNationalParkData();
  },[]);

  useEffect(()=> {
    if(nationalParks && itemId){
      setPark(nationalParks.find(park => park.id === itemId));
    }
  }, [nationalParks, itemId]); 

  if(loading || !park){
    return(
      <div className='centered'>
        <CircularProgress style={{color: "#1B742E"}}/>
        <div>Loading Park...</div>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <IconButton aria-label="back" size="large" onClick={() => {router.back()}}>
          <ArrowBackIcon style={{fontSize: "3rem", color: "#1B742E"}}/>
        </IconButton>
        <NationalParkItem nationalPark={park} />
      </SignedIn>

      <SignedOut>
        <RedirectToHome />
      </SignedOut>
    </>
  )
}