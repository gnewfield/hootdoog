import * as React from "react";
import axios from "axios";
import Container from "@mui/material/Container";
// import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";
import {
  useJsApiLoader,
  GoogleMap,
  GoogleMapProps,
  Marker,
  MarkerProps,
} from "@react-google-maps/api";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { Console } from "./Console";
import { useEffect, useState } from "react";
import GoogleMapPlaceType from "./GoogleMapPlaceType";
import { convertCompilerOptionsFromJson } from "typescript";
import { Typography } from "@mui/material";
import { PlaceInfo } from "./PlaceInfo";

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
  }>({ lat: 48.397, lng: 2.644 });

  const [yourPlace, setYourPlace] = useState<any>(undefined);
  const [theirPlace, setTheirPlace] = useState<any>(undefined);

  // markers needs to be a dictionary so you can remove the old "your place marker"
  const [markers, setMarkers] = useState<MarkerProps[]>([]);

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [map, setMap] = useState<any>(null);
  const [nearbySearchResults, setNearbySearchResults] = useState<
    google.maps.places.PlaceResult[] | null
  >(null);

  const googleMapProps: GoogleMapProps = {
    center: mapCenter,
    zoom: 15,
    onLoad: (map) => {
      setMap(map);
    },
    mapContainerStyle: {
      width,
      height,
    },
    options: {
      clickableIcons: true,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    },
  };

  useEffect(() => {
    if (yourPlace) {
      setMapCenter({
        lat: yourPlace.geometry.location.lat(),
        lng: yourPlace.geometry.location.lng(),
      });
    }
    if (yourPlace && theirPlace) {
      // make the map fit the boundary
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(yourPlace.geometry.location);
      bounds.extend(theirPlace.geometry.location);
      map.fitBounds(bounds);

      const newCenter = {
        lat:
          (yourPlace.geometry.location.lat() +
            theirPlace.geometry.location.lat()) /
          2,
        lng:
          (yourPlace.geometry.location.lng() +
            theirPlace.geometry.location.lng()) /
          2,
      };

      setMapCenter(newCenter);

      // calculate the distance between the two places
      const distance =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          yourPlace.geometry.location,
          theirPlace.geometry.location
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

  useEffect(() => {
    if (nearbySearchResults) {
      // @ts-ignore
      const nearbyPlaceMarkers: MarkerProps[] = nearbySearchResults
        .map((placeResult: google.maps.places.PlaceResult) => {
          if (placeResult.geometry) {
            return {
              position: placeResult?.geometry?.location!,
              title: placeResult?.name,
              animation: window.google.maps.Animation.DROP,
              onClick: (e: google.maps.MapMouseEvent) => {
                setSelectedPlace(placeResult);
              },
              icon: {
                url: placeResult.icon,
                scaledSize: new window.google.maps.Size(15, 15),
              },
            };
          } else {
            return null;
          }
        })
        .filter((marker) => marker !== null);

      setMarkers((prevMarkers) => [...prevMarkers, ...nearbyPlaceMarkers]);
    }
  }, [nearbySearchResults]);

  return isLoaded ? (
    <Container maxWidth={false} disableGutters={true}>
      <Console
        {...{
          yourPlace,
          theirPlace,
          handleYourPlaceChanged: (place: any) => {
            setYourPlace(place);
            if (place) {
              setMarkers((prevState) => [
                ...prevState,
                {
                  position: place.geometry.location,
                  title: "Your place",
                },
              ]);
            }
          },
          handleTheirPlaceChanged: (place: any) => {
            setTheirPlace(place);

            if (place) {
              setMarkers((prevState) => [
                ...prevState,
                {
                  position: place.geometry.location,
                  title: "Their place",
                  clickable: true,
                  onClick: (e) => {
                    console.log(e);
                  },
                },
              ]);
            }
          },
        }}
      />
      {selectedPlace && <PlaceInfo place={selectedPlace} />}
      <GoogleMap {...googleMapProps}>
        {[...new Set(markers)].map((marker) => (
          <Marker key={marker.title} {...marker} />
        ))}
      </GoogleMap>
      <div>Map is here</div>
    </Container>
  ) : (
    <div>Loading...</div>
  );
}
