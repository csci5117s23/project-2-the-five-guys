import {
  TextField,
  CircularProgress, 
  ListItem, 
  Box, 
  Container, 
  List, 
  Typography, 
  Divider,
  Button} from '@mui/material';
import {useEffect, useState} from "react";
import ExploreParkItemList from "@/components/ExploreParkItemList";
import { getNationalParks } from '@/modules/requests';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import RedirectToHome from '@/components/RedirectToHome';
import dynamic from 'next/dynamic';
import { fetchVisitedParks } from '../../modules/data';
import { useAuth } from '@clerk/nextjs';

export default function Home({ nationalParks }) {
  const [isListView, setIsListView] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [visitedParks, setVisitedParks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, getToken } = useAuth();

  // Grab data pertaining to which parks this user has visited
  useEffect(() => {
    async function grabTrips(){
      // Grab all trips and store in visited parks array
      const token = await getToken({ template: "codehooks" });
      const visits = await fetchVisitedParks(userId, token);
      // Index 0 = national park ID
      // Index 1 = start date
      // Index 2 = end date
      // Index 3 = trip id
      setVisitedParks(visits);
      setLoading(false);
    }
    grabTrips();
  }, [loading]);

  // console.log(visitedParks);

  //leaflet react doest work well with server side rendering(nextjs)
  //credit to fixing the issue: https://stackoverflow.com/questions/57704196/leaflet-with-next-js
  //answer is "answer for 2020"
  const Map = dynamic(
    () => import('@/components/map'),
    {
      loading: () => 
        <div className='centered'>
          <CircularProgress style={{color: "#1B742E"}}/>
          <div>Loading Map...</div>
        </div>,
      ssr: false // line prevents server-side render
    }
  )

  // Update the search value as the user writes their search
  function handleSearch(e) {
    const input = e.target.value.toString();
    setSearchValue(input);
  }

  // If loading, return loading screen
  if(loading){
    return (
      <div className='centered'>
          <CircularProgress style={{color: "#1B742E"}}/>
          <div>Loading National Parks...</div>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        {/* Buttons to toggle list or map view */}
        <div className='exploreSelector'>
          <>
            <Button sx={{ marginRight: 0.5 }} variant='contained' onClick={() => setIsListView(!isListView)} color={isListView ? 'success' : 'secondary'}> 
              List View 
            </Button>
            <Button sx={{ marginLeft: 0.5 }} variant='contained' onClick={() => setIsListView(!isListView)} color={!isListView ? 'success' : 'secondary'}> 
              Map View 
            </Button>
          </>
        </div>

        {/* If in list view, show list of National Parks with search bar */}
        {isListView && (
          <>
            <Box>
              <Container>
                <List className='parkStackWrapper'>
                  {/* Header above list */}
                  <ListItem>
                    <Typography variant="h3"> National Parks </Typography>
                  </ListItem>

                  <Divider />

                  {/* Search field */}
                  <ListItem>
                    <TextField
                      id='outlined-basic'
                      label='Search parks or states'
                      variant='outlined'
                      value={searchValue}
                      sx={{
                        boxShadow: 1,
                        borderRadius: 2,
                        minWidth: 200,
                        width: 0.5,
                        margin: 'auto',
                      }}
                      onChange={ e => handleSearch(e) }
                    />
                  </ListItem>

                  {/* List of national parks */}
                  <ExploreParkItemList nationalParks={nationalParks} visitedParks={visitedParks} searchValue={searchValue}/>
                </List>
              </Container>
            </Box>
          </>
        )}

        {/* If in map view, show map */}
        {!isListView && (
          <Map parks={nationalParks}/>
        )}
      </SignedIn>

      {/* Don't allow non-signed in users to view this page */}
      <SignedOut>
        <RedirectToHome />
      </SignedOut>
    </>
  )
}

export async function getStaticProps() {
  // Grab all parks and filter
  const unfilteredParks = await getNationalParks();
  const nationalParks = unfilteredParks.data.filter((element) => 
    element.designation.includes("National Park") ||
    element.fullName.includes("Redwood") ||
    element.fullName.includes("American Samoa")
  );

  return {
    props: {
      nationalParks,
    },
  };
}
