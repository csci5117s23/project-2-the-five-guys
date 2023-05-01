import { Accordion, AccordionDetails, AccordionSummary, Grid, Fab, Modal, Box, Typography, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Autocomplete, Button } from "@mui/material";
import Stack from "@mui/joy/Stack";
import dynamic from "next/dynamic";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Carousel from "react-material-ui-carousel";
import Skeleton from "@mui/material/Skeleton";
import { useState } from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import abbrState from "../modules/util";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchItemData } from "../modules/data";
import { formatDate } from "../modules/util";
import AddIcon from "@mui/icons-material/Add";
import { getNationalParks, createTrip } from "../modules/requests";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useRouter } from "next/router";

export default function NationalParkItem(props) {
  const nationalPark = props.nationalPark;
  const selectedFromMap = props.selectedFromMap;
  const tripId = props.tripId;
  const tripLink = "/trip/" + tripId;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const { userId, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState(null);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [park, setPark] = useState(null);
  const router = useRouter();

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setError(null);
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (park && startDate && endDate && name) {
      const trip = {
        nationalPark_id: park.id,
        parkCode: park.parkCode,
        title: name,
        startDate: startDate.toJSON(),
        endDate: endDate.toJSON(),
      };
      const token = await getToken({ template: "codehooks" });
      if (token) {
        const newTrip = await createTrip(token, trip);
        handleClose();
        router.push("/trips");
      }
    } else {
      setError("Please fill out the form");
    }
  };

  useEffect(() => {
    async function fetchTrip() {
      const token = await getToken({ template: "codehooks" });
      const data = await fetchItemData(userId, tripId, setTripData, token);
      if (selectedFromMap) {
        console.log("National Park: ", nationalPark);
        setPark(nationalPark);
      } else {
        const unfilteredParks = await getNationalParks();
        console.log("Router query: ", router.query);
        const park = unfilteredParks.data.filter((element) => {
          return element.id === router.query.id;
        });
        console.log("Hello");
        console.log("park: ", park[0]);
        setPark(park[0]);
      }

      setLoading(false);
    }
    if (tripId || router.query) {
      fetchTrip();
    } else {
      setLoading(false);
    }
  }, [loading]);

  const ParkMap = dynamic(() => import("@/components/parkMap"), {
    loading: () => <Skeleton variant="rectangular" width={"100%"} height={"20rem"} />,
    ssr: false, // line prevents server-side render
  });

  // Convert state abbreviations into full names
  let statesList = nationalPark.states.split(",");
  statesList = statesList.map((state) => {
    return abbrState(state);
  });

  function openImageModal(image) {
    setModalOpen(true);
    setModalImage(image);
  }

  function closeImageModal() {
    setModalOpen(false);
  }

  function ImageModal(props) {
    const { image } = props;
    return (
      <>
        {image && (
          <Modal open={modalOpen} onClose={closeImageModal} style={{ borderRadius: "1rem" }}>
            <Box className="imageModal">
              <IconButton aria-label="back" size="large" onClick={() => closeImageModal()}>
                <CloseIcon style={{ fontSize: "2rem", color: "#1B742E" }} />
              </IconButton>
              <div style={{ height: "40vw", width: "70vw", position: "relative" }}>
                <Image src={image.url} fill style={{ objectFit: "contain" }} alt={image.alt} />
              </div>
              <div style={{ marginLeft: "auto", marginRight: "auto", marginTop: "1rem", marginBotton: "1rem", maxWidth: 720 }}>
                <Accordion style={{ border: "5px Solid #1B742E" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      <div style={{ fontSize: "1rem" }}>{image.title}</div>
                      <div style={{ fontSize: ".7rem" }}>{image.credit}</div>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      <div style={{ fontSize: ".9rem" }}>{image.caption}</div>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </div>
            </Box>
          </Modal>
        )}
      </>
    );
  }

  // If loading, return loading screen
  if (loading) {
    return (
      <div className="centered">
        <CircularProgress style={{ color: "#1B742E" }} />
        <div>Loading {nationalPark.fullName}...</div>
      </div>
    );
  }

  return (
    <div className="nationalParkItemContainer">
      <div className="nationalParkItemContents">
        {/* Name of park and map of noteworthy locations */}

        <Box sx={{ flexGrow: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <div className="parkName"> {nationalPark.fullName} </div>
            </Grid>
            <Grid item xs={1}>
              <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
                <AddIcon />
              </Fab>
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
        </Box>
        <div>
          {" "}
          <ParkMap park={nationalPark} />{" "}
        </div>

        <Stack style={{ fontSize: "1.3rem" }} spacing={2}>
          {/* Link to most recent trip to park */}
          {tripData && (
            <>
              <div className="parkAbout">
                {Date.now() < new Date(tripData.endDate).getTime() ? <>Upcoming Visit:&nbsp;</> : <>Previous Visit:&nbsp;</>}
                <span className="parkAbout">
                  <Link style={{ color: "#000" }} href={tripLink}>
                    {tripData.title && <>{tripData.title}</>}
                  </Link>
                </span>
              </div>
            </>
          )}

          {/* Description of park from API */}
          <div className="parkAbout"> About: </div>
          <div style={{ fontSize: "1rem" }}> {nationalPark.description} </div>
          <div style={{ fontSize: "1.1rem" }}> Located in: {statesList.join(", ")} </div>

          {/* Link to official park page */}
          <div style={{ fontSize: "1.1rem" }}>
            {" "}
            <Link style={{ color: "#1B742E" }} href={nationalPark.url}>
              Official Park Page
            </Link>{" "}
          </div>
        </Stack>

        <div>
          {/* Park images carousel */}
          <div className="parkItemImages">
            <div className="imagesCarouselContainer">
              <Carousel className="imagesCarousel" animation="slide" swipe navButtonsAlwaysVisible autoPlay="false">
                {nationalPark.images.map((image, index) => {
                  return (
                    <>
                      <div key={index}>
                        <img className="carouselImage" src={image.url} alt={image.title} loading="lazy" onClick={() => openImageModal(image)} />
                        {/* <Image src={image.url} alt={image.alt} fill style={{ objectFit: 'cover' }}  onClick={() => openImageModal(image)}/> */}
                        <Stack direction="column">
                          <div style={{ paddingLeft: "1rem", fontSize: "1.3rem" }}>{image.title}</div>
                          <div style={{ paddingLeft: "1rem", fontSize: ".8rem" }}>{image.credit}</div>
                          <div style={{ paddingLeft: "1rem" }}>{image.description}</div>
                        </Stack>
                      </div>
                      <ImageModal image={modalImage} />
                    </>
                  );
                })}
              </Carousel>
            </div>
          </div>

          {/* List of park activities */}
          <div className="activitiesAccordion">
            <Accordion style={{ color: "green", border: "5px Solid #1B742E" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography fontSize={"1.3rem"}>Park Activities</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {nationalPark.activities.map((activity, index) => (
                    <Typography key={index} color={"black"} fontSize={".9rem"}>
                      {activity.name}
                    </Typography>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
            {dialogOpen && (
              <Dialog open={dialogOpen} onClose={handleClose} fullWidth={true}>
                <DialogTitle>New Trip</DialogTitle>
                <DialogContent>
                  {error && <Alert severity="error">{error}</Alert>}
                  <Stack spacing={2} pt={1}>
                    <TextField label="Name" variant="outlined" value={name} onChange={(event) => setName(event.target.value)} fullWidth />
                    <TextField variant="outlined" value={park.fullName} />
                    <DatePicker label="Start Date" fullWidth value={startDate} onChange={(newValue) => setStartDate(newValue)} />
                    <DatePicker label="End Date" fullWidth value={endDate} onChange={(newValue) => setEndDate(newValue)} />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleSubmit}>Create Trip</Button>
                </DialogActions>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
