import {
  Box,
  Divider,
  List,
  ListItem,
  Typography,
  Stack,
  Fab,
  Grid,
  CardContent,
  Card,
  CardActionArea,
  CardMedia,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import { getNationalParks, getTrips } from "../../modules/requests";
import { formatDate } from "../../modules/util"
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import RedirectToHome from '@/components/RedirectToHome';

export default function TripListPage({ parks }) {
  const [trips, setTrips] = useState([]);
  const { isLoaded, userId, getToken } = useAuth();
  console.log(parks);
  useEffect(() => {
    const loadTrips = async () => {
      const token = await getToken({ template: "codehooks" });
      if (token) {
        const trips = await getTrips(token);
        const updatedTrips = trips.map(trip => {
          const park = parks.find(park => park.id === trip.nationalPark_id);
          const { fullName, images } = park;
          const imageUrl = images[0].url
          return { ...trip, fullName, imageUrl };
        });
        setTrips(updatedTrips);
      }
    };
    loadTrips();
  }, [isLoaded, userId, getToken, parks]);

  return (
    <>
      <SignedIn>
        <Box>
          <Container>
            <List>
              <ListItem>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography variant="h3">My Trips</Typography>
                  <Fab color="primary" aria-label="add">
                    <AddIcon />
                  </Fab>
                </Stack>
              </ListItem>
              <Divider />
              <ListItem>
                <Grid container spacing={2} justifyContent="center">
                  {trips.map((trip) => (
                    <Grid item xs={12} md={6} key={trip._id}>
                      <Card>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="140"
                            image={trip.imageUrl}
                            alt="trip image"
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="div" noWrap>
                              {trip.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </ListItem>
            </List>
          </Container>
        </Box>
      </SignedIn>
      <SignedOut>
        <RedirectToHome />
      </SignedOut>
    </>
  );
}

export async function getStaticProps() {
  const parks = (await getNationalParks()).data;
  return {
    props: {
      parks,
    },
  }
}
