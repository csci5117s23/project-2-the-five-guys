import {
  Chip,
  Stack,
  TextField,
  CircularProgress, 
  ListItem, 
  Box, 
  Container, 
  List, 
  Typography, 
  Divider,
  ButtonGroup, 
  Button} from '@mui/material';
import {useEffect, useState} from "react";
import ExploreParkItemList from "@/components/ExploreParkItemList";
import { getNationalParks } from '@/modules/requests';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import RedirectToHome from '@/components/RedirectToHome';
import dynamic from 'next/dynamic';
import { fetchAllItems } from '../../modules/data';
import { useAuth } from '@clerk/nextjs';

export default function Home({ nationalParks }) {
  const [exploreView, setExploreView] = useState("list");
  const [searchValue, setSearchValue] = useState("");
  const [visitedParks, setVisitedParks] = useState([]);
  const { userId, getToken } = useAuth();

  useEffect(() => {
    async function grabTrips(){
      // Grab all trips and store in visited parks array
      const token = await getToken({ template: "codehooks" });
      const trips = await fetchAllItems(userId, setVisitedParks, token);

      // Parse through 
      let data = visitedParks;
      if(visitedParks){
        data = visitedParks.map((item) => {
          return item.nationalPark_id;
        });
      }
      setVisitedParks(data);
    }
    grabTrips();
  }, []);

  console.log(visitedParks);

  //leaflet react doest work well with server side rendering(nextjs)
  //credit to fixing the issue: https://stackoverflow.com/questions/57704196/leaflet-with-next-js
  //answer is "answer for 2020"
  const Map = dynamic(
    () => import('@/components/map'),
    {
      loading: () => <div className='centered'>
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

  return (
    <>
      <SignedIn>
        {/* Buttons to toggle list or map view */}
        <div className='exploreSelector'>
          {/* { exploreView === 'list' ? ( */}
            <>
              <Button sx={{ marginRight: 0.5, color: exploreView === 'list' ? 'success' : 'secondary' }} variant='contained' onClick={() => setExploreView('list')}> 
                List View 
              </Button>
              <Button sx={{ marginLeft: 0.5, color: exploreView === 'map' ? 'success' : 'secondary' }} variant='contained' color='secondary' onClick={() => setExploreView('map')}> 
                Map View 
              </Button>
            </>
          {/* ) : ( */}
            {/* <>
              <Button sx={{ marginRight: 0.5 }} variant='contained' color='secondary' onClick={() => setExploreView('list')}> 
                List View 
              </Button>
              <Button sx={{ marginLeft: 0.5 }} variant='contained' color='success' onClick={() => setExploreView('map')}> 
                Map View 
              </Button>
            </> */}
          {/* )} */}
        </div>

        {/* If in list view, show list of National Parks with search bar */}
        {exploreView === 'list' && (
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
        {exploreView === 'map' && (
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
