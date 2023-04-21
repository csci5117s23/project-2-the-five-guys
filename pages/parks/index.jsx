import {useEffect, useState} from "react";
import ExploreParkItem from "@/components/ExploreParkItem"
import { getNationalParks } from '@/modules/requests';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import RedirectToHome from '@/components/RedirectToHome';
import { Chip, Stack } from '@mui/material';
import dynamic from 'next/dynamic';

export default function Home() {
  const [nationalParks, setNationalParks] = useState([]);
  const [exploreView, setExploreView] = useState("list");
  const [loading, setLoading] = useState(true);
  
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

  if(loading)
  {
    return (
      <div className='centered'> Loading National Parks... </div>
    )
  }
  
  const parkList = nationalParks.map((park, index)=> {
    return(
    <ExploreParkItem key={index} nationalPark={park} />)
  });

  //leaflet react doest work well with server side rendering(nextjs)
  //credit to fixing the issue: https://stackoverflow.com/questions/57704196/leaflet-with-next-js
  //answer is "answer for 2020"
  const Map = dynamic(
    () => import('@/components/map'),
    {
      loading: () => <div className='centered'> Loading map... </div>,
      ssr: false // line prevents server-side render
    }
  )

  return (
    <>
      <SignedIn>
        <div className='exploreSelector'>
          <Chip label="List View" onClick={() => setExploreView('list')} />
          <Chip label="Map View" onClick={() => setExploreView('map')} />
        </div>
        {exploreView === 'list' && (
          <span className = "parkStackWrapper">
            <Stack className="parkStack" spacing={2}>
              {parkList}
            </Stack>
          </span>
        )}
        {exploreView === 'map' && (
          <Map parks={nationalParks}/>
        )}
      </SignedIn>

      <SignedOut>
        <RedirectToHome />
      </SignedOut>
    </>
  )
}