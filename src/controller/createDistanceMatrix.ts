const createDistanceMatrix = (args: {
  setDistanceMatrixResponse: any;
  yourPlace: google.maps.places.PlaceResult;
  theirPlace: google.maps.places.PlaceResult;
  nearbySearchResults: google.maps.places.PlaceResult[];
}) => {
  const {
    nearbySearchResults,
    setDistanceMatrixResponse,
    yourPlace,
    theirPlace,
  } = args;
  const googleMapsDistanceMatrixRequest: google.maps.DistanceMatrixRequest = {
    origins: [yourPlace!.geometry!.location!, theirPlace!.geometry!.location!],
    destinations: nearbySearchResults
      .map(
        (
          placeResult: google.maps.places.PlaceResult
        ): google.maps.LatLng | undefined => placeResult.geometry?.location
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
};

export { createDistanceMatrix };
