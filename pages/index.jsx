import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import 'purecss/build/pure.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import ParkTrackLogo from '@/public/ParkTrackAlternate.png';

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
          <h1>Welcome to ParkTrack!</h1>
          <Image src={ParkTrackLogo} alt='ParkTrack logo' height={241} width={883} className='home-page-image'/>
          <p> 
            ParkTrack is your one-stop shop for planning and logging your adventures at US National Parks. 
          </p>
          <h3>Create an account or sign in below</h3>
          <SignUpButton mode='modal'/>
          <SignInButton mode='modal'/>
        </div>
      </SignedOut>
    </>
  );
}
