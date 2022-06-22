import { TextField, Typography } from "@mui/material";
import { Autocomplete as MapsAutocomplete } from "@react-google-maps/api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import React from "react";
import { useState } from "react";

type ConsoleProps = any;

const Console = (props: ConsoleProps) => {
  const {
    yourPlace,
    handleYourPlaceChanged,
    theirPlace,
    handleTheirPlaceChanged,
  } = props;

  const [yourRawLocation, setYourRawLocation] = useState<any>(undefined);
  const [theirRawLocation, setTheirRawLocation] = useState<any>(undefined);
  const [yourAutocomplete, setYourAutocomplete] = useState<any>(undefined);
  const [theirAutocomplete, setTheirAutocomplete] = useState<any>(undefined);

  return (
    <Card>
      <CardHeader
        title={<Typography variant="h5">hoot|doog</Typography>}
        subheader={
          <Typography variant="body2">find food between you guys</Typography>
        }
      />
      <CardContent>
        <MapsAutocomplete
          onPlaceChanged={() => {
            const place = yourAutocomplete.getPlace();
            handleYourPlaceChanged(place);
          }}
          onLoad={(autocomplete) => {
            setYourAutocomplete(autocomplete);
          }}
        >
          <TextField
            onChange={(e) => {
              handleYourPlaceChanged(undefined);
              setYourRawLocation(e.target.value);
            }}
            label="Your place"
            value={yourPlace?.formatted_address ?? yourRawLocation}
          />
        </MapsAutocomplete>
        <br />
        <MapsAutocomplete
          onPlaceChanged={() => {
            const place = theirAutocomplete.getPlace();
            handleTheirPlaceChanged(place);
          }}
          onLoad={(autocomplete) => {
            setTheirAutocomplete(autocomplete);
          }}
        >
          <TextField
            label="Their place"
            onChange={(e) => {
              handleTheirPlaceChanged(undefined);
              setTheirRawLocation(e.target.value);
            }}
            value={theirPlace?.formatted_address ?? theirRawLocation}
          />
        </MapsAutocomplete>
      </CardContent>
    </Card>
  );
};

export { Console };
