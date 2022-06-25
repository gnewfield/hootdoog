import * as React from "react";
import Container from "@mui/material/Container";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  MarkerProps,
} from "@react-google-maps/api";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { Console } from "./Console";
import { StartConsole } from "./StartConsole";
import { SharedConsole } from "./SharedConsole";
import { useEffect, useState } from "react";
import GoogleMapPlaceType from "./GoogleMapPlaceType";
import { PlaceInfo } from "./PlaceInfo";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { PlaceAssemblage } from "src/model/types";
import { createPlaceAssemblages } from "src/controller/createPlaceAssemblages";
import { createDistanceMatrix } from "src/controller/createDistanceMatrix";
import { createPlaceMarkerProps } from "src/controller/createPlaceMarkerProps";

const NEW_YORK_COORDINATES = {
  lat: 40.745,
  lng: -73.984,
};

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
  }>(NEW_YORK_COORDINATES);

  const params = new URLSearchParams(window.location.search);
  const [name, setName] =
    useState<string | null>(params.get("name") || null);
  const [sharedPlaceId, setSharedPlaceId] =
    useState<string | null>(params.get("sharedPlaceId") || null);
  const [linkSharingMode, setLinkSharingMode] =
    useState<boolean>(name && sharedPlaceId ? true : false);
  const [yourPlace, setYourPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [theirPlace, setTheirPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [nearbyPlaceMarkers, setNearbyPlaceMarkerProps] = useState<
    MarkerProps[]
  >([]);

  const [selectedPlaceAssemblage, setSelectedPlaceAssemblage] =
    useState<PlaceAssemblage | null>(null);

  const [map, setMap] = useState<any>(null);
  const [nearbySearchResults, setNearbySearchResults] = useState<
    google.maps.places.PlaceResult[]
  >([]);
  const [nearbySearchResultsError, setNearbySearchResultsError] =
    useState<any>(null);

  const [distanceMatrixResponse, setDistanceMatrixResponse] =
    useState<google.maps.DistanceMatrixResponse | null>(null);

  const [placeAssemblages, setPlaceAssemblages] = useState<PlaceAssemblage[]>(
    []
  );

  // order of the effects matters!!
  useEffect(() => {
    if (map && sharedPlaceId) {
      const service = new google.maps.places.PlacesService(map);
      service.getDetails({placeId: sharedPlaceId }, (place) => setYourPlace(place));
    }
  }, [map])
  

  // toggle map center, calculate distance (todo: separate)
  useEffect(() => {
    if (yourPlace) {
      setMapCenter({
        lat: yourPlace!.geometry!.location!.lat(),
        lng: yourPlace!.geometry!.location!.lng(),
      });
    }
    if (yourPlace && theirPlace) {
      // make the map fit the boundary
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(yourPlace!.geometry!.location!);
      bounds.extend(theirPlace!.geometry!.location!);
      map.fitBounds(bounds);

      const newCenter = {
        lat:
          (yourPlace!.geometry!.location!.lat() +
            theirPlace!.geometry!.location!.lat()) /
          2,
        lng:
          (yourPlace!.geometry!.location!.lng() +
            theirPlace!.geometry!.location!.lng()) /
          2,
      };

      setMapCenter(newCenter);

      // calculate the distance between the two places
      const distance =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          yourPlace!.geometry!.location!,
          theirPlace!.geometry!.location!
        );

      // do a search for places around
      new google.maps.places.PlacesService(map).nearbySearch(
        {
          location: newCenter,
          radius: distance / 2, // search for places around the center of the map
          type: GoogleMapPlaceType.restaurant,
        },
        (results, status) => {
          if (status === "OK") {
            setNearbySearchResults(results || []);
          }
        }
      );
    }
  }, [yourPlace, theirPlace]);

  // create distance matrix
  useEffect(() => {
    if (
      yourPlace &&
      theirPlace &&
      nearbySearchResults &&
      nearbySearchResults?.length > 0
    ) {
      // has to use a callback pattern
      createDistanceMatrix({
        yourPlace,
        theirPlace,
        nearbySearchResults,
        setDistanceMatrixResponse,
      });
    }
  }, [nearbySearchResults]);

  // create place assemblages
  useEffect(() => {
    if (nearbySearchResults !== null && distanceMatrixResponse !== null) {
      const placeAssemblages: PlaceAssemblage[] = createPlaceAssemblages(
        nearbySearchResults,
        distanceMatrixResponse
      );
      setPlaceAssemblages(placeAssemblages);
    }
  }, [nearbySearchResults, distanceMatrixResponse]);

  // create markers
  useEffect(() => {
    if (nearbySearchResults.length > 0 && placeAssemblages.length > 0) {
      const nearbyPlaceMarkerProps: MarkerProps[] = createPlaceMarkerProps({
        placeAssemblages,
        setSelectedPlaceAssemblage,
        nearbySearchResults,
      });
      setNearbyPlaceMarkerProps(nearbyPlaceMarkerProps);
    }
  }, [nearbySearchResults, placeAssemblages]);

  console.log(selectedPlaceAssemblage);

  const getConsole = () => {
    if (linkSharingMode && name && yourPlace) {
      return <SharedConsole
                {...{
                  name,
                  theirPlace,
                  handleTheirPlaceChanged: (
                    place: google.maps.places.PlaceResult
                  ) => {
                    setTheirPlace(place);
                  },
                  linkSharingMode,
                  setLinkSharingMode,
                }}
              />
    } else if (linkSharingMode) {
      return <StartConsole
                {...{
                  yourPlace,
                  handleYourPlaceChanged: (
                    place: google.maps.places.PlaceResult
                  ) => {
                    setYourPlace(place);
                  },
                  linkSharingMode,
                  setLinkSharingMode,
                }}
              />
    } else {
        return <Console
                  {...{
                    yourPlace,
                    theirPlace,
                    handleYourPlaceChanged: (
                      place: google.maps.places.PlaceResult
                    ) => {
                      setYourPlace(place);
                    },
                    handleTheirPlaceChanged: (
                      place: google.maps.places.PlaceResult
                    ) => {
                      setTheirPlace(place);
                    },
                    linkSharingMode,
                    setLinkSharingMode,
                  }}
                />
    }
  };

  return isLoaded ? (
    <div>
      <Container
        maxWidth={false}
        disableGutters={true}
        style={{
          display: "flex",
          alignItems: "left",
          justifyContent: "left",
          margin: "auto"
        }}
      >
        <Paper
          style={{
            zIndex: 10,
            margin: "1rem",
          }}
        >
          <Grid container spacing={2}>
            <Grid item>
              {getConsole()}
            </Grid>
            {selectedPlaceAssemblage && (
            <Grid item>
                <PlaceInfo
                  {...{
                    name: selectedPlaceAssemblage.placeResult.name,
                    vicinity: selectedPlaceAssemblage.placeResult.vicinity,
                    transitTimes: selectedPlaceAssemblage.transitTimes,
                    priceLevel: selectedPlaceAssemblage.placeResult.price_level,
                    reviewCount:
                      selectedPlaceAssemblage.placeResult.user_ratings_total,
                    rating: selectedPlaceAssemblage.placeResult.rating,
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Paper>
        <Paper>
          <GoogleMap
            {...{
              center: mapCenter,
              zoom: 14,
              onLoad: (map) => {
                setMap(map);
              },
              mapContainerStyle: {
                width,
                height,
                position: "absolute",
                top: 0,
                left: 0,
              },
              options: {
                clickableIcons: true,
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              },
            }}
          >
            {yourPlace && (
              <Marker
                {...{
                  position: yourPlace!.geometry!.location!,
                  title: "Your place",
                }}
              />
            )}
            {theirPlace && (
              <Marker
                {...{
                  position: theirPlace!.geometry!.location!,
                  title: "Their place",
                }}
              />
            )}
            {[...new Set(nearbyPlaceMarkers)].map((marker) => (
              <Marker key={marker.title} {...marker} />
            ))}
          </GoogleMap>
        </Paper>
      </Container>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
