import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { defaults as defaultControls, Control } from 'ol/control';
import { fromLonLat } from 'ol/proj';
import MapIcon from '@/components/mapIcon';
import Overlay from 'ol/Overlay.js';

export default function MapComponent(props)
{
    const mapRef = useRef(null);
    const mapIconsContainer = useRef(null);
    //bounds for the map
    const usLatLongMin = fromLonLat([-170, 24]);
    const usLatLongMax = fromLonLat([-66, 72]);
    const defaultCenter = fromLonLat([-100, 40]);
    const [overlayList, setOverlayList] = useState([]);

    const {parks} = props 
    useEffect(() => {
      // make sure all the mapicons are ready to be added, children length
      // will be 2 * park length
      if (mapIconsContainer.current.children.length !== parks.length * 2) {
        return;
      }
      const newOverlayList = [];
      for(let i = 0; i < parks.length; i++)
      {
        newOverlayList.push(new Overlay({
          element: mapIconsContainer.current.children[i],
          position: fromLonLat([parks[i].longitude, parks[i].latitude]),
        }));
      }
      setOverlayList(newOverlayList);
    }, [mapIconsContainer]);

    //set map and overlays
    useEffect(() => {
      if (!mapRef.current) {
        return;
      }
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            //using open street maps for the map
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [defaultCenter[0], defaultCenter[1]],
          zoom: 5.5,
        //min x, min y, max x, max y
          extent: [usLatLongMin[0], usLatLongMin[1], usLatLongMax[0], usLatLongMax[1]], 
        }),
        controls: defaultControls({
            zoom: true,
            rotate: false,
            attribution: true,
            attributionOptions: {
                collapsible: false,
            }
        }),
        overlays: overlayList,
      });

      //icons wont show without this
      return () => {
        map.dispose();
      };
    }, [mapRef, overlayList]);
      

    return (
          <>
            <div ref={mapRef} className='mapContainer'/>
            <div ref={mapIconsContainer}>
              {/* for some reason for this to work properly every mapicon div needs a div after it?? */}
              {parks.map(park => (
                <>
                  <div>
                    <MapIcon parkName={park.name}></MapIcon>
                  </div>
                  <div></div>
                </>
              ))}
            </div>          
          </>
    );
}
