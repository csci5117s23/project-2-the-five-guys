import { MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import Control from 'react-leaflet-custom-control'
import {divIcon, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import MapIcon from '@/components/mapIcon';
import ReactDOMServer  from 'react-dom/server';
import Link from 'next/link';
import {useState, useEffect} from 'react'
import { Button, Modal, Box, IconButton, CircularProgress} from '@mui/material';
import NationalParkItem from '@/components/NationalParkItem';
import CloseIcon from '@mui/icons-material/Close';
import MyLocationIcon from '@mui/icons-material/MyLocation';

//button cant be a child of mapcomponent or causes errors, must be a sibling, so separate from map component
function GoToCurrentLocationButton(props) {
    //button that goes to current user location on map, keeps same zoom in
    const {userLocation} = props;
    const map = useMap();
    function locationChange()
    {
      let userLatLong = [userLocation.coords.latitude, userLocation.coords.longitude];
      map.flyTo(userLatLong, map._zoom);
    }
    return (
      <Control prepend position='topleft'>
        <button onClick={() => locationChange()} className='locationButton' color='inherit'>
          <MyLocationIcon />
        </button>
      </Control>
    )
  }
export default function MapComponent(props)
{
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPark, setSelectedPark] = useState(null);
  const usLatLongMin = [12, -180];

  const usLatLongMax = [75, -60];
  const [userLocation, setUserLocation] = useState(null)
  //map bounds
  const bounds = latLngBounds(usLatLongMin, usLatLongMax);
  const {parks} = props;

  useEffect(() => {
    //on success will setUserLocation, otherwise error
    navigator.geolocation.getCurrentPosition(setUserLocation, error);
  }, [])
  function error() {
    console.log("Unable to retrieve your location");
  }
  function SetUserLocation() {
    const map = useMap();
    let userLatLong = [userLocation.coords.latitude, userLocation.coords.longitude];
    map.flyTo(userLatLong, 6);
  }
  function handleOpen(park) {
    setSelectedPark(park);
    setModalOpen(true);
  }
  function handleClose() {
    setModalOpen(false);
    setSelectedPark(null);
  }
  if(!userLocation)
  {
    return (
      <div className='centered'>
        <CircularProgress style={{color: "#1B742E"}}/>
        <div>Getting Location...</div>
      </div>
      )
  }
  return (
    <>
    <MapContainer className='mapContainer' center={[40, -100]} zoom={6} scrollWheelZoom={true} bounds={bounds} maxBounds={bounds} maxBoundsViscosity={1.0} minZoom={4} maxZoom={8}>
      {!userLocation && (<SetUserLocation/>)}
      <TileLayer
        //using OSM for map
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GoToCurrentLocationButton userLocation={userLocation}/>
      {parks.map(park => (
        //custom markers
        <Marker key={park.id} position={[park.latitude, park.longitude]} icon={divIcon({
          className: 'icon',
          html: ReactDOMServer.renderToString(
            <MapIcon parkInfo={park}/>
          )
        })}>
          <Popup>
           <Button style={{color: "#1B742E"}} onClick={() => handleOpen(park)}>{park.name}</Button>
              <Modal
                  open={modalOpen}
                  onClose={() => handleClose()}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description">
                  <Box className="modalContentsContainer">
                   <IconButton aria-label="back" size='large' onClick={() => handleClose()}>
                      <CloseIcon style={{fontSize: "2rem", color:"#1B742E"}}/>
                   </IconButton>
                    <NationalParkItem nationalPark={selectedPark}></NationalParkItem>
                  </Box>
            </Modal>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </>
  );
}