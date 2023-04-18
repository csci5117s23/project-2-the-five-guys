import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {useEffect, useState} from "react";
import NationalParkItem from "@/components/NationalParkItem"
import ExploreParkItem from "@/components/ExploreParkItem"
import { getNationalParks } from '@/modules/requests';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import RedirectToHome from '@/components/RedirectToHome';

export default function Home() {
  const [nationalParks, setNationalParks] = useState([]);
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
      <p>Loading......</p>
    )
  }
  const parkList = nationalParks.map((park, index)=> {
    return(
    <ExploreParkItem key={index} nationalPark={park} />)
  });

  return (
    <>
      <SignedIn>
        <div>
          {parkList}
          {/* <NationalParkItem nationalPark={nationalParks[0]} /> */}
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToHome />
      </SignedOut>
    </>
  )
}
