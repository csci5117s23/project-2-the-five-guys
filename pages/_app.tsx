import '@/styles/globals.css'
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import 'purecss/build/pure.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <SignedIn>
        <div className="topHeader">
          <span>Explore</span>
        </div>
        <UserButton />
        <Component {...pageProps} />
        <div className="bottomFooter">
          <div className="pure-g bottomLink" id="explore">
            <div className="pure-u-1-2">
              <h2><Link className="bottomLink" href="/">Explore
              </Link></h2>
            </div>

            <div className="pure-u-1-2 bottomLink" id="mytrips">
              <h2><Link className="bottomLink" href="/">My Trips
              </Link></h2>
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}
