import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { divIcon, latLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import MapIcon from "@/components/mapIcon";
import ReactDOMServer from "react-dom/server";
import { useState, useEffect } from "react";
import { Button, Modal, Box, IconButton, CircularProgress, Alert, AlertTitle } from "@mui/material";
import NationalParkItem from "@/components/NationalParkItem";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";

//button cant be a child of mapcomponent or causes errors, must be a sibling, so separate from map component
function GoToCurrentLocationButton(props) {
  //button that goes to current user location on map, keeps same zoom in
  const { userLocation, error } = props;
  const map = useMap();
  function locationChange() {
    let userLatLong = [userLocation.coords.latitude, userLocation.coords.longitude];
    map.flyTo(userLatLong, map._zoom);
  }
  return (
    <Control prepend position="topleft">
      {!error && (
        <button onClick={() => locationChange()} className="locationButton" color="inherit">
          <MyLocationIcon />
        </button>
      )}
    </Control>
  );
}
export default function MapComponent(props) {
  const [tripId, setTripId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPark, setSelectedPark] = useState(null);
  const [errorPopup, errorPopupShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const usLatLongMin = [-20, -180];
  const usLatLongMax = [75, -60];
  const [userLocation, setUserLocation] = useState(null);
  //map bounds
  const bounds = latLngBounds(usLatLongMin, usLatLongMax);
  const parks = props.parks;
  const visitedParks = props.visitedParks;

  useEffect(() => {
    //on success will setUserLocation, otherwise error
    navigator.geolocation.getCurrentPosition(setUserLocation, setErrorMessage);
  }, []);

  useEffect(() => {
    //if error, set default user location and show error message
    setUserLocation({ coords: { latitude: 40, longitude: -100 } });
    errorPopupShow(true);
  }, [errorMessage]);

  useEffect(() => {
    if (userLocation) {
      //if user location is out of map bounds give error popup
      if (userLocation.coords.latitude < usLatLongMin[0] || userLocation.coords.longitude < usLatLongMin[1] || userLocation.coords.latitude > usLatLongMax[0] || userLocation.coords.longitude > usLatLongMax[1]) {
        const msg = { message: "Outside of map bounds" };
        setErrorMessage(msg);
        errorPopupShow(true);
      }
    }
  }, [userLocation]);

  function SetUserLocation() {
    const map = useMap();
    let userLatLong = [userLocation.coords.latitude, userLocation.coords.longitude];
    map.flyTo(userLatLong, 6);
  }

  // When a park is opened, check whether this park has been visited
  // If so, set the trip id accordingly
  function handleOpen(park) {
    setSelectedPark(park);
    if (visitedParks) {
      const trip = visitedParks.find((visit) => visit[0] === park.id);
      if (trip) {
        setTripId(trip[3]);
      } else {
        setTripId(null);
      }
    }
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setTripId(null);
    setSelectedPark(null);
  }

  if (!userLocation) {
    return (
      <div className="centered">
        <CircularProgress style={{ color: "#1B742E" }} />
        <div>Getting Location...</div>
      </div>
    );
  }

  return (
    <>
      {errorPopup && errorMessage && (
        <div className="alertContainer">
          <Alert
            severity="error"
            onClose={() => {
              errorPopupShow(false);
            }}
          >
            <AlertTitle>ERROR: Unable to retrieve your location</AlertTitle>
            {errorMessage.message}
          </Alert>
        </div>
      )}
      <MapContainer className="mapContainer" center={[userLocation.coords.latitude, userLocation.coords.longitude]} zoom={6} scrollWheelZoom={true} bounds={bounds} maxBounds={bounds} maxBoundsViscosity={1.0} minZoom={4} maxZoom={8}>
        {!userLocation && <SetUserLocation />}
        <TileLayer
          //using OSM for map
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GoToCurrentLocationButton userLocation={userLocation} error={errorMessage} />
        {parks.map((park) => (
          //custom markers
          <Marker
            key={park.id}
            position={[park.latitude, park.longitude]}
            icon={divIcon({
              className: "icon",
              html: ReactDOMServer.renderToString(<MapIcon parkInfo={park} visitedParks={visitedParks} />),
            })}
          >
            <Popup>
              <Button style={{ color: "#1B742E" }} onClick={() => handleOpen(park)}>
                {park.name}
              </Button>
              <Modal open={modalOpen} onClose={() => handleClose()} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box className="modalContentsContainer">
                  <IconButton aria-label="back" size="large" onClick={() => handleClose()}>
                    <CloseIcon style={{ fontSize: "2rem", color: "#1B742E" }} />
                  </IconButton>
                  <NationalParkItem nationalPark={selectedPark} tripId={tripId} selectedFromMap={true} />
                </Box>
              </Modal>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
