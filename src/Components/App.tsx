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
} from "@react-google-maps/api";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { Console } from "./Console";
import { useEffect, useState } from "react";

const libraries = ["places"];

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

  const googleMapProps: GoogleMapProps = {
    center: mapCenter,
    zoom: 15,
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

  const [yourPlace, setYourPlace] = useState<any>(undefined);
  const [theirPlace, setTheirPlace] = useState<any>(undefined);

  useEffect(() => {
    if (yourPlace && theirPlace) {
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
          },
          handleTheirPlaceChanged: (place: any) => {
            setTheirPlace(place);
          },
        }}
      />
      <GoogleMap {...googleMapProps}>
        <Marker position={{ lat: 48.397, lng: 2.644 }} />
      </GoogleMap>
      <div>Map is here</div>
    </Container>
  ) : (
    <div>Loading...</div>
  );
}
