import { Autocomplete as MuiAutocomplete, TextField } from "@mui/material";
import { Autocomplete as MapsAutocomplete } from "@react-google-maps/api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import React, { useRef } from "react";
import { useState } from "react";

const Console = () => {
  const [yourLocation, setYourLocation] = useState<any>(undefined);
  const [theirLocation, setTheirLocation] = useState<any>(undefined);
  const [autocomplete, setAutocomplete] = useState<any>(undefined);

  console.log("yourLocation", yourLocation);

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <MapsAutocomplete
          onPlaceChanged={() => {
            const place = autocomplete.getPlace();
            setYourLocation(place);
          }}
          onLoad={(autocomplete) => {
            setAutocomplete(autocomplete);
          }}
        >
          <TextField
            label="Your Location"
            value={yourLocation?.formatted_address ?? ""}
          />
        </MapsAutocomplete>
        <br />
        <MapsAutocomplete>
          <TextField
            label="Their Location"
            value={theirLocation}
            onChange={(e) => setTheirLocation(e.target.value)}
          />
        </MapsAutocomplete>
      </CardContent>
    </Card>
  );
};

export { Console };
