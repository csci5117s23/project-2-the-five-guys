import { MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import {divIcon, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import MapIcon from '@/components/mapIcon';
import ReactDOMServer  from 'react-dom/server';
import Link from 'next/link';
import {useState, useEffect} from 'react'
import { Button, Modal, Box, IconButton} from '@mui/material';
import NationalParkItem from '@/components/NationalParkItem';
import CloseIcon from '@mui/icons-material/Close';

export default function MapComponent(props)
{
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPark, setSelectedPark] = useState(null);
  const usLatLongMin = [12, -180];
  const usLatLongMax = [75, -66];
  //map bounds
  const bounds = latLngBounds(usLatLongMin, usLatLongMax);
  const {parks} = props;
  
  function SetUserLocation(){
    const map = useMap();
    function success(position) {
      let userLatLong = [position.coords.latitude, position.coords.longitude];
      map.setView(userLatLong, 6); 
    }

    function error() {
      console.log("Unable to retrieve your location");
    }

    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
    return null;
  }
   
  function handleOpen(park) {
    setSelectedPark(park);
    setModalOpen(true);
  }
  
  return (
    <>
    <MapContainer className='mapContainer' center={[40, -100]} zoom={6} scrollWheelZoom={true} bounds={bounds} maxBounds={bounds} maxBoundsViscosity={1.0} minZoom={4} maxZoom={8}>
      <SetUserLocation/>
      <TileLayer
        //using OSM for map
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
                  onClose={() => setModalOpen(false)}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description">
                  <Box className="modalContentsContainer">
                   <IconButton aria-label="back" size='large' onClick={() => setModalOpen(false)}>
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