import { TextField, Typography } from "@mui/material";
import { Autocomplete as MapsAutocomplete } from "@react-google-maps/api";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from "@mui/material/Switch";
import React from "react";
import { useState } from "react";

type ConsoleProps = any;

const StartConsole = (props: ConsoleProps) => {
  const {
    yourPlace,
    handleYourPlaceChanged,
    linkSharingMode,
    setLinkSharingMode
  } = props;

  const [yourName, setYourName] = useState<string>("");
  const [yourRawLocation, setYourRawLocation] = useState<string>("");
  const [yourAutocomplete, setYourAutocomplete] = useState<any>(undefined);
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const getShareableLink = () => {
    if (!yourName) {
        createAlert(false, "Please enter your name");
    } else if (!yourPlace) {
        createAlert(false, "Please enter a valid location");
    } else {
        createAlert(true, "Link copied to clipboard");
        navigator.clipboard.writeText(`${window.location.origin}?name=${yourName}&sharedPlaceId=${yourPlace.place_id}`);
    }
  };

  const createAlert = (type: boolean, msg: string) => {
        setAlertSuccess(type);
        setAlertMsg(msg);
        setTimeout(() => {
            setAlertSuccess(false);
            setAlertMsg("");
        }, 2000);
  };

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
        <TextField
            label="Your name"
            onChange={(e) => {
              setYourName(e.target.value);
            }}
            value={yourName}
            placeholder="Enter your name"
            fullWidth
        />
        <div style={{margin: '25px'}} />
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
        <div style={{margin: '15px'}} />
        <Button fullWidth onClick={getShareableLink} variant="contained">Get shareable link</Button>
        { alertMsg 
            ? <Alert severity={alertSuccess ? "success" : "error"} style={{marginTop: '10px'}}>{alertMsg}</Alert>
            : <div/>
        }
      </CardContent>
    </Card>
  );
};

export { StartConsole };
