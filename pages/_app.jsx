import '@/styles/globals.css'
import { ClerkProvider, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import 'purecss/build/pure.css';

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
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
            <h2>
              <Link className="bottomLink" href="/">My Trips</Link>
            </h2>
          </div>
        </div>
      </div>
    </ClerkProvider>
  );
}
