import { PlaceAssemblage, TransitPair } from "src/model/types";
import { findBestMatch } from "string-similarity";

const createPlaceAssemblages = (
  nearbySearchResults: google.maps.places.PlaceResult[],
  distanceMatrixResponse: google.maps.DistanceMatrixResponse
): PlaceAssemblage[] => {
  const placeAssemblage = nearbySearchResults.map(
    (nearbySearchResult: google.maps.places.PlaceResult): PlaceAssemblage => {
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
  return placeAssemblage;
};

export { createPlaceAssemblages };
