import {
  Autocomplete as MuiAutocomplete,
  TextField,
  Typography,
} from "@mui/material";
import { Autocomplete as MapsAutocomplete } from "@react-google-maps/api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import React, { useRef } from "react";
import { useState } from "react";

const Console = () => {
  const [yourLocation, setYourLocation] = useState<any>(undefined);
  const [yourRawLocation, setYourRawLocation] = useState<any>(undefined);
  const [theirLocation, setTheirLocation] = useState<any>(undefined);
  const [theirRawLocation, setTheirRawLocation] = useState<any>(undefined);
  const [yourAutocomplete, setYourAutocomplete] = useState<any>(undefined);
  const [theirAutocomplete, setTheirAutocomplete] = useState<any>(undefined);

  console.log("yourLocation", yourLocation);

  return (
    <Card>
      <CardHeader>
        <Typography variant="h4" component="h1" gutterBottom>
          hootdoog time
        </Typography>
      </CardHeader>
      <CardContent>
        <MapsAutocomplete
          onPlaceChanged={() => {
            const place = yourAutocomplete.getPlace();
            setYourLocation(place);
          }}
          onLoad={(autocomplete) => {
            setYourAutocomplete(autocomplete);
          }}
        >
          <TextField
            onChange={(e) => {
              setYourLocation(undefined);
              setYourRawLocation(e.target.value);
            }}
            label="Your Location"
            value={yourLocation?.formatted_address ?? yourRawLocation}
          />
        </MapsAutocomplete>
        <br />
        <MapsAutocomplete
          onPlaceChanged={() => {
            const place = theirAutocomplete.getPlace();
            setTheirLocation(place);
          }}
          onLoad={(autocomplete) => {
            setTheirAutocomplete(autocomplete);
          }}
        >
          <TextField
            label="Your Location"
            onChange={(e) => {
              setTheirLocation(undefined);
              setTheirRawLocation(e.target.value);
            }}
            value={theirLocation?.formatted_address ?? theirRawLocation}
          />
        </MapsAutocomplete>
      </CardContent>
    </Card>
  );
};

export { Console };
