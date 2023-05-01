import { MapContainer, Marker, Popup, Rectangle, TileLayer, useMap} from 'react-leaflet'
import {divIcon, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react';
import { getParkPlaces } from '@/modules/requests';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReactDOMServer  from 'react-dom/server';
import { Accordion, AccordionDetails, AccordionSummary, Skeleton, Typography, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ParkMapComponent(props)
{
  const [places, setPlaces] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noLocations, setNoLocations] = useState([]);
  const {park} = props;

  useEffect(()=> {
    async function loadParkPlaces()
    {
      let data = await getParkPlaces(park.parkCode);
      setPlaces(data.data);
      setLoading(false);
    }
    loadParkPlaces();
  },[]);

  useEffect(() => {
    if(places)
    {
      //get parks that wont appear on map, no lat or long
      const noLocationPlaces = places.filter((element) => !element.latitude || !element.longitude);
      setNoLocations(noLocationPlaces);
    }
  }, [places])

  if(loading)
  {
    return (
      <Skeleton style={{marginTop: "1rem", borderRadius: "0.5rem"}} variant='rectangular' width={"100%"} height={"20rem"}/>
    )
  }

  const minLatLong = {"minLat":75, "minLong":-66};
  const maxLatLong = {"maxLat":12, "maxLong": -180};
  places.forEach(place => {
    if(place.latitude !== "" && place.longitude !== "")
    {
      minLatLong.minLat = Math.min(minLatLong.minLat, place.latitude);
      minLatLong.minLong = Math.min(minLatLong.minLong, place.longitude);
      maxLatLong.maxLat = Math.max(maxLatLong.maxLat, place.latitude);
      maxLatLong.maxLong = Math.max(maxLatLong.maxLong, place.longitude);
    }
  });

  const parkLatLongMin = [minLatLong.minLat - 1, minLatLong.minLong - 1.5];
  const parkLatLongMax = [maxLatLong.maxLat + 1, maxLatLong.maxLong + 1.5];
  //park bounds
  const bounds = latLngBounds(parkLatLongMin, parkLatLongMax);
  
  return (
    <>
    <div className='parkMap'>
      <MapContainer className='parkMapContainer' center={[park.latitude, park.longitude]} scrollWheelZoom={true} bounds={bounds} maxBounds={bounds} maxBoundsViscosity={1.0} zoom={9} minZoom={8}>
        <TileLayer
          //using OSM for map
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map(place => (
          <Marker key={place.id} position={[place.latitude, place.longitude]} icon={divIcon({
            className: 'parkMapIcon',
            html: ReactDOMServer.renderToString(
              <LocationOnIcon />
            )
          })}>
            <Popup>
              {place.title}
            </Popup>
          </Marker>
        ))}
        <Marker key={park.id} position={[park.latitude, park.longitude]} icon={divIcon({
            className: 'icon',
            html: ReactDOMServer.renderToString(
              <LocationOnIcon style={{ color: 'blue' }}></LocationOnIcon>
            )
          })}>
            <Popup>
              {park.name}
            </Popup>
        </Marker>
      </MapContainer>
    </div>
    <div>
      {noLocations.length > 0 && (<Accordion style={{border: "4px Solid #1B742E", display: 'inline-block', marginTop: '.2rem'}}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography style={{fontSize: '1rem'}}>
            Park places with no location data
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={.2}>
            {noLocations.map((place) => {
            return (
              <div key={place.id}>
                <Typography color={"black"} fontSize={".9rem"}>
                  {place.title}
                </Typography>
              </div>
            );
            })}
          </Stack>
        </AccordionDetails>
      </Accordion>)}
    </div>
  </>
  );
}