import { TextField, Typography } from "@mui/material";
import { Autocomplete as MapsAutocomplete } from "@react-google-maps/api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import React from "react";
import { useState } from "react";

type ConsoleProps = any;

const SharedConsole = (props: ConsoleProps) => {
  const {
    name,
    theirPlace,
    handleTheirPlaceChanged
  } = props;

  const [theirRawLocation, setTheirRawLocation] = useState<string>("");
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
        <Typography>
            {name}'s location is mapped. Enter yours to search in between.
        </Typography>
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
            label="Your place"
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

export { SharedConsole };
