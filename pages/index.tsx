import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {useEffect, useState} from "react";
import NationalParkItem from "@/components/NationalParkItem"
import ExploreParkItem from "@/components/ExploreParkItem"

export default function Home() {
  const [nationalParks, setNationalParks] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_NATIONAL_PARK_KEY;
  
  useEffect(()=> {
    async function loadNationalParkData()
    {
      let response = await fetch(`https://developer.nps.gov/api/v1/parks?limit=950`, {
        method: 'GET',
        headers: {'x-api-key': `${apiKey}`}
      });
      let data = await response.json();
      let filteredParks = data.data.filter((element) => element.designation.includes("National Park"));
      setNationalParks(filteredParks);
      setLoading(false);
    }
    loadNationalParkData();
  },[]);

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

  return (
    <>
    <div>
      {parkList}
    {/* <NationalParkItem nationalPark={nationalParks[0]} /> */}
    </div>
    </>
  )
}
