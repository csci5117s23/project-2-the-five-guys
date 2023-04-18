import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import 'purecss/build/pure.css';
import { useRouter } from 'next/router';

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
    </>
  );
}
