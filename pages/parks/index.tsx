import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {useEffect, useState} from "react";
import NationalParkItem from "@/components/NationalParkItem"

export default function ExplorePage() {
  const [nationalParks, setNationalParks] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_NATIONAL_PARK_KEY;
  
  useEffect(()=> {
    async function loadNationalParkData()
    {
      let response = await fetch(`https://developer.nps.gov/api/v1/parks`, {
        method: 'GET',
        headers: {'x-api-key': `${apiKey}`}
      })
      let data = await response.json();
      setNationalParks(data.data);
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

  return (
    <>
    <NationalParkItem nationalPark={nationalParks[0]} />
    </>
  )
}
