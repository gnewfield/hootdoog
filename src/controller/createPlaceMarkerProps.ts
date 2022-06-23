import { MarkerProps } from "@react-google-maps/api";
import { PlaceAssemblage } from "src/model/types";

const createPlaceMarkerProps = (args: {
  placeAssemblages: PlaceAssemblage[];
  setSelectedPlaceAssemblage: any;
}): MarkerProps[] => {
  const { placeAssemblages, setSelectedPlaceAssemblage } = args;

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
        clickable: placeAssemblages.length > 0,
        onClick: (e: google.maps.MapMouseEvent) => {
          const selectedPlaceAssemblageRow = placeAssemblages.find(
            (placeAssemblageRow: PlaceAssemblage) => {
              return (
                placeAssemblageRow.placeResult.vicinity ===
                placeResult!.vicinity!
              );
            }
          );

          if (selectedPlaceAssemblageRow) {
            setSelectedPlaceAssemblage(selectedPlaceAssemblageRow);
          }
        },
        icon: {
          url: placeResult!.icon!,
          scaledSize: new window.google.maps.Size(20, 20),
        },
      };
    });

  return nearbyPlaceMarkers;
};

export { createPlaceMarkerProps };
