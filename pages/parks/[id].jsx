import {useEffect, useState} from "react";
import NationalParkItem from "@/components/NationalParkItem"
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from 'next/router';
import { getNationalParks } from '@/modules/requests';
import RedirectToHome from '@/components/RedirectToHome';
import { CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from "@clerk/nextjs";
import { fetchVisitedParks } from "../../modules/data";

export default function Home({ park }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { userId, getToken } = useAuth();
  const [visitedParks, setVisitedParks] = useState([]);

  // Grab data pertaining to which parks this user has visited
  useEffect(() => {
    async function grabTrips(){
      // Grab all trips and store in visited parks array
      const token = await getToken({ template: "codehooks" });
      const visits = await fetchVisitedParks(userId, token);
      setVisitedParks(visits);
      setLoading(false);
    }
    grabTrips();
  }, [loading]);

  // If loading, return loading screen
  if(loading){
    return (
      <div className='centered'>
          <CircularProgress style={{color: "#1B742E"}}/>
          <div>Loading {park.fullName}...</div>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <IconButton aria-label="back" size="large" onClick={() => {router.back()}}>
          <ArrowBackIcon style={{fontSize: "3rem", color: "#1B742E"}}/>
        </IconButton>
        <NationalParkItem nationalPark={park} />
      </SignedIn>

      <SignedOut>
        <RedirectToHome />
      </SignedOut>
    </>
  )
}

export async function getStaticPaths() {
  const unfilteredParks = await getNationalParks();
  const filteredParks = unfilteredParks.data.filter((element) => element.designation.includes("National Park") || element.fullName.includes("Redwood")|| element.fullName.includes("American Samoa"));
  const paths = filteredParks.map((park) => ({
    params: { id: park.id },
  }))

  // { fallback: false } means other routes should 404
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const unfilteredParks = await getNationalParks();
  const filteredParks = unfilteredParks.data.filter((element) => element.designation.includes("National Park") || element.fullName.includes("Redwood")|| element.fullName.includes("American Samoa"));

  const park = filteredParks.find((park) => park.id === params.id);

  // Pass post data to the page via props
  return { props: { park } }
}
