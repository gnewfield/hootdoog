import { TextField, Typography } from "@mui/material";
import { Autocomplete as MapsAutocomplete } from "@react-google-maps/api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from "@mui/material/Switch";
import React from "react";
import { useState } from "react";

type ConsoleProps = any;

const Console = (props: ConsoleProps) => {
  const {
    yourPlace,
    handleYourPlaceChanged,
    theirPlace,
    handleTheirPlaceChanged,
    linkSharingMode,
    setLinkSharingMode
  } = props;

  const [yourRawLocation, setYourRawLocation] = useState<string>("");
  const [theirRawLocation, setTheirRawLocation] = useState<string>("");
  const [yourAutocomplete, setYourAutocomplete] = useState<any>(undefined);
  const [theirAutocomplete, setTheirAutocomplete] = useState<any>(undefined);

  return (
    <Card style={{width: '350px'}}>
      <CardHeader
        title={<Typography variant="h5">hoot | doog</Typography>}
        subheader={
          <Typography variant="body2">find food between you guys</Typography>
        }
      />
      <CardContent>
        <FormGroup style={{margin: '10px'}}>
          <FormControlLabel control={<Switch checked={linkSharingMode} onChange={() => setLinkSharingMode(!linkSharingMode)}/>} label="Link Sharing" />
        </FormGroup>
        <MapsAutocomplete
          onPlaceChanged={() => {
            const place: google.maps.places.PlaceResult =
              yourAutocomplete.getPlace();
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
            fullWidth
          />
        </MapsAutocomplete>
        <div style={{margin: '25px'}} />
        <MapsAutocomplete
          onPlaceChanged={() => {
            const place: google.maps.places.PlaceResult =
              theirAutocomplete.getPlace();
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
            fullWidth
          />
        </MapsAutocomplete>
      </CardContent>
    </Card>
  );
};

export { Console };
