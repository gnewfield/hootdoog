import * as React from "react";
import Container from "@mui/material/Container";
// import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  useJsApiLoader,
  GoogleMap,
  GoogleMapProps,
  Marker,
  Autocomplete,
  MarkerProps,
} from "@react-google-maps/api";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { Console } from "./Console";
import { useEffect, useState } from "react";

const libraries = ["places", "geometry"];

export default function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY!,
    // @ts-ignore
    libraries,
  });

  const { width, height } = useWindowDimensions();
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 48.397, lng: 2.644 });

  const [yourPlace, setYourPlace] = useState<any>(undefined);
  const [theirPlace, setTheirPlace] = useState<any>(undefined);
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [map, setMap] = useState<any>(null);

  const googleMapProps: GoogleMapProps = {
    center: mapCenter,
    zoom: 15,
    onLoad: (map) => {
      setMap(map);
    },
    mapContainerStyle: {
      width,
      height,
    },
    options: {
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    },
  };

  useEffect(() => {
    if (yourPlace) {
      setMapCenter({
        lat: yourPlace.geometry.location.lat(),
        lng: yourPlace.geometry.location.lng(),
      });
    }
    if (yourPlace && theirPlace) {
      // make the map fit the boundary
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(yourPlace.geometry.location);
      bounds.extend(theirPlace.geometry.location);
      map.fitBounds(bounds);

      setMapCenter({
        lat:
          (yourPlace.geometry.location.lat() +
            theirPlace.geometry.location.lat()) /
          2,
        lng:
          (yourPlace.geometry.location.lng() +
            theirPlace.geometry.location.lng()) /
          2,
      });
    }
  }, [yourPlace, theirPlace]);

  return isLoaded ? (
    <Container maxWidth={false} disableGutters={true}>
      <Console
        {...{
          yourPlace,
          theirPlace,
          handleYourPlaceChanged: (place: any) => {
            setYourPlace(place);
            if (place) {
              setMarkers((prevState) => [
                ...prevState,
                {
                  position: place.geometry.location,
                  title: "Your place",
                },
              ]);
            }
          },
          handleTheirPlaceChanged: (place: any) => {
            setTheirPlace(place);

            if (place) {
              setMarkers((prevState) => [
                ...prevState,
                {
                  position: place.geometry.location,
                  title: "Their place",
                },
              ]);
            }
          },
        }}
      />
      <GoogleMap {...googleMapProps}>
        {markers.map((marker) => (
          <Marker key={marker.title} {...marker} />
        ))}
      </GoogleMap>
      <div>Map is here</div>
    </Container>
  ) : (
    <div>Loading...</div>
  );
}
