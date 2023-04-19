import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import 'purecss/build/pure.css';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {useEffect, useState} from "react";
import NationalParkItem from "@/components/NationalParkItem"
import ExploreParkItem from "@/components/ExploreParkItem"
import { getNationalParks } from '../modules/requests';
import Stack from '@mui/material/Stack';

export default function Home() {
  const router = useRouter();

  function RedirectToExplore() {
    router.push('/parks');
  }

  return (
    <>
      <SignedIn>
        <RedirectToExplore />
      </SignedIn>

      <SignedOut>
        <div>
          <h1>Welcome to your National Parks Trip Tracker!</h1>
          <h3>Create an account or sign in below</h3>

          <SignUpButton mode='modal'/>
          <SignInButton mode='modal'/>
        </div>
      </SignedOut>
  );
}
