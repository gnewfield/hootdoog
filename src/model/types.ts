type TransitPair = {
  destination: string;
  origin: string;
  times: google.maps.DistanceMatrixResponseElement;
};

type PlaceAssemblage = {
  transitTimes: TransitPair[];
  placeResult: google.maps.places.PlaceResult;
};

export type { TransitPair, PlaceAssemblage };
