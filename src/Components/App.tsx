import * as React from "react";
import Container from "@mui/material/Container";
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

export default function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY!,
    libraries: ["places"],
  });

  const { width, height } = useWindowDimensions();

  const googleMapProps: GoogleMapProps = {
    center: { lat: 48.397, lng: 2.644 },
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

  return isLoaded ? (
    <Container maxWidth={false} disableGutters={true}>
      <Console />
      <GoogleMap {...googleMapProps}>
        <Marker position={{ lat: 48.397, lng: 2.644 }} />
      </GoogleMap>
      <div>Map is here</div>
      {/** */}
      {/* <Typography variant="h4" component="h1" gutterBottom>
          The next stop is Paddington Butthole 
        </Typography> */}
    </Container>
  ) : (
    <div>Loading...</div>
  );
}
