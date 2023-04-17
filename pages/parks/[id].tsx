import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {useEffect, useState} from "react";
import NationalParkItem from "@/components/NationalParkItem"
import ExploreParkItem from "@/components/ExploreParkItem"
import { useAuth, SignIn, UserButton } from "@clerk/nextjs";
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const [itemId, setItemId] = useState("");

  const [nationalParks, setNationalParks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [park, setPark] = useState(null);

  const apiKey = process.env.NEXT_PUBLIC_NATIONAL_PARK_KEY;

    useEffect(() => {
        if(router.query.id){
            setItemId(router.query.id as string);
        }
    },[router.query]);
  
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

  useEffect(()=> {
    if(nationalParks && itemId){
        setPark(nationalParks.find(park => park.id === itemId));
    }
  }, [nationalParks, itemId]); 

  if(loading || !park){
    return(<div>loading...</div>)
  }

    return (
        <NationalParkItem nationalPark={park} />
    )
}