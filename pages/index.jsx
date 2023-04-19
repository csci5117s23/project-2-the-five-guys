import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {useEffect, useState} from "react";
import NationalParkItem from "@/components/NationalParkItem"
import ExploreParkItem from "@/components/ExploreParkItem"
import { getNationalParks } from '../modules/requests';
import Stack from '@mui/material/Stack';
import exp from 'constants';
import dynamic from 'next/dynamic';
import { Chip } from '@mui/material';

export default function Home() {
  const [nationalParks, setNationalParks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exploreView, setExploreView] = useState("map");
  
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

  function changeExploreView(view)
  {
    setExploreView(view);
  }

  if(loading)
  {
    return (
      <p>Loading......</p>
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
      loading: () => <span>loading map....</span>,
      ssr: false // line prevents server-side render
    }
  )

  return (
    <>
    <div className='exploreSelector'>
      {/* <button onClick={() => setExploreView('list')}>
        List View
      </button>
      <button onClick={() => setExploreView('map')}>
        Map View
      </button> */}
      <Chip label="List View" onClick={() => setExploreView('list')} />
      <Chip label="Map View" variant="outlined" onClick={() => setExploreView('map')} />
    </div>
    {exploreView === 'list' && (<span className = "parkStackWrapper">
      <Stack className="parkStack" spacing={2}>
        {parkList}
      </Stack>
    </span>)}
    {exploreView === 'map' && (
        <Map parks={nationalParks}/>
    )}
    </>
  )
}
