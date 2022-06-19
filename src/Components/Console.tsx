import { Autocomplete, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import React from "react";
import { useState } from "react";

const Console = () => {
  const [yourLocation, setYourLocation] = useState(null);
  const [theirLocation, setTheirLocation] = useState(null);

  const [autocompleteOptions, setAutocompleteOptions] = useState([]);

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <Autocomplete
          {...{
            freeSolo: true,
            options: autocompleteOptions,
            renderInput: (params) => (
              <TextField
                {...params}
                label="Your location"
                InputProps={{ type: "search" }}
              />
            ),
          }}
        />
        <br />
        <Autocomplete
          {...{
            freeSolo: true,
            options: autocompleteOptions,
            renderInput: (params) => (
              <TextField
                {...params}
                label="Their location"
                InputProps={{ type: "search" }}
              />
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};

export { Console };
