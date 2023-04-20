import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import 'purecss/build/pure.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import ParkTrackLogo from '@/public/ParkTrackAlternate.png';
import Button from '@mui/material/Button';

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
        <div className='home-page'>    
          {/* Home page when not signed in */}
          <h1> Welcome to ParkTrack! </h1>
          <Image src={ParkTrackLogo} alt='ParkTrack logo' height={241} width={883} className='home-page-image'/>
          <p> 
            ParkTrack is your one-stop shop for planning and logging your adventures at US National Parks. 
          </p>
          <h3> Sign in or create an account below </h3>

          {/* Sign in and sign up buttons */}
          <div className='sign-in-buttons'>
            <SignInButton mode='modal'>
              <Button variant='contained' color='success'> Sign In </Button>
            </SignInButton>
          </div>

          <div className='sign-in-buttons'>
            <SignUpButton mode='modal'>
              <Button variant='contained' color='success'> Create Account </Button>
            </SignUpButton>
          </div>

          {/* <SignUpButton mode='modal'/>
          <SignInButton mode='modal'/> */}
        </div>
      </SignedOut>
    </>
  );
}
