import { MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import {divIcon, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import MapIcon from '@/components/mapIcon';
import ReactDOMServer  from 'react-dom/server';
import Link from 'next/link';

export default function MapComponent(props)
{
  const usLatLongMin = [12, -180];
  const usLatLongMax = [75, -66];
  //map bounds
  const bounds = latLngBounds(usLatLongMin, usLatLongMax);
  const {parks} = props;
  
  return (
    <MapContainer className='mapContainer' center={[40, -100]} zoom={6} scrollWheelZoom={true} bounds={bounds} maxBounds={bounds} maxBoundsViscosity={1.0} minZoom={4} maxZoom={8}>
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
           <Link href={`/parks/${park.id}`}>{park.name}</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}