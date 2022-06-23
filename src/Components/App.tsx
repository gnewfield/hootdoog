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
import { useEffect, useState } from "react";
import GoogleMapPlaceType from "./GoogleMapPlaceType";
import { PlaceInfo } from "./PlaceInfo";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { findBestMatch } from "string-similarity";

type TransitPair = {
  destination: string;
  origin: string;
  times: google.maps.DistanceMatrixResponseElement;
};

type PlaceAssemblage = {
  transitTimes: TransitPair[];
  placeResult: google.maps.places.PlaceResult;
};

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

  const [yourPlace, setYourPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [theirPlace, setTheirPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [nearbyPlaceMarkers, setNearbyPlaceMarkers] = useState<MarkerProps[]>(
    []
  );

  const [selectedPlaceAssemblage, setSelectedPlaceAssemblage] =
    useState<PlaceAssemblage | null>(null);

  const [map, setMap] = useState<any>(null);
  const [nearbySearchResults, setNearbySearchResults] = useState<
    google.maps.places.PlaceResult[] | null
  >(null);

  const [distanceMatrixResponse, setDistanceMatrixResponse] =
    useState<google.maps.DistanceMatrixResponse | null>(null);

  const [placeAssemblage, setPlaceAssemblage] = useState<PlaceAssemblage[]>([]);

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
            setNearbySearchResults(results);
          }
        }
      );
    }
  }, [yourPlace, theirPlace]);

  // change the api responses to have return usememo, as right now they're not returning
  // anything lol
  useEffect(() => {
    if (nearbySearchResults && nearbySearchResults?.length > 0) {
      // distance matrix from yourPlace, theirPlace to all the found places
      // unfortunately we need the actual fastest way to get around, but can only toggle
      // one method of search at a time.

      const googleMapsDistanceMatrixRequest: google.maps.DistanceMatrixRequest =
        {
          origins: [
            yourPlace!.geometry!.location!,
            theirPlace!.geometry!.location!,
          ],
          destinations: nearbySearchResults
            .map(
              (
                placeResult: google.maps.places.PlaceResult
              ): google.maps.LatLng | undefined =>
                placeResult.geometry?.location
            )
            .filter((placeOrUndefined: google.maps.LatLng | undefined) => {
              return placeOrUndefined?.lat && placeOrUndefined.lng;
            }) as google.maps.LatLng[],
          travelMode: google.maps.TravelMode.TRANSIT,
        };

      new google.maps.DistanceMatrixService().getDistanceMatrix(
        googleMapsDistanceMatrixRequest,
        (response, status) => {
          if (status === "OK") {
            setDistanceMatrixResponse(response);
          }
        }
      );

      // @ts-ignore
      const nearbyPlaceMarkers: MarkerProps[] = nearbySearchResults
        .filter((placeResult: google.maps.places.PlaceResult) => {
          return (
            placeResult.geometry &&
            placeResult.geometry.location &&
            placeResult.name &&
            placeResult.icon &&
            placeResult.vicinity
          );
        })
        .map((placeResult: google.maps.places.PlaceResult): MarkerProps => {
          return {
            position: placeResult!.geometry!.location!,
            title: placeResult.name,
            animation: window.google.maps.Animation.DROP,
            onClick: (e: google.maps.MapMouseEvent) => {
              const selectedPlaceAssemblageRow = placeAssemblage.find(
                (placeAssemblageRow: PlaceAssemblage) => {
                  return (
                    placeAssemblageRow.placeResult.vicinity ===
                    placeResult!.vicinity!
                  );
                }
              );

              if (selectedPlaceAssemblageRow) {
                setSelectedPlaceAssemblage(selectedPlaceAssemblageRow);
              } else {
                console.log("no assemblage found!!");
              }
            },
            icon: {
              url: placeResult!.icon!,
              scaledSize: new window.google.maps.Size(20, 20),
            },
          };
        });

      setNearbyPlaceMarkers(nearbyPlaceMarkers);
    }
  }, [nearbySearchResults]);

  useEffect(() => {
    // create the assemblage of locations
    if (nearbySearchResults !== null && distanceMatrixResponse !== null) {
      const placeAssemblage = nearbySearchResults.map(
        (
          nearbySearchResult: google.maps.places.PlaceResult
        ): PlaceAssemblage => {
          const { vicinity = "" } = nearbySearchResult;

          // it's fucking street vs st...
          // solution: use document distance
          const { destinationAddresses, rows, originAddresses } =
            distanceMatrixResponse;

          const { bestMatchIndex: destinationIndex } = findBestMatch(
            vicinity,
            destinationAddresses
          );

          const transitTimes: TransitPair[] = rows.map(
            (
              row: google.maps.DistanceMatrixResponseRow,
              index: number
            ): TransitPair => {
              return {
                destination: destinationAddresses[destinationIndex], // this is mainly for sanity
                origin: originAddresses[index],
                times: row.elements[destinationIndex],
              };
            }
          );

          return {
            transitTimes,
            placeResult: nearbySearchResult,
          };
        }
      );

      setPlaceAssemblage(placeAssemblage);
    }
  }, [nearbySearchResults, distanceMatrixResponse]);

  console.log(selectedPlaceAssemblage);

  return isLoaded ? (
    <div>
      <Container
        maxWidth={false}
        disableGutters={true}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
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
              <Console
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
                }}
              />
            </Grid>
            {selectedPlaceAssemblage && (
              <Grid item>
                <PlaceInfo />
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
