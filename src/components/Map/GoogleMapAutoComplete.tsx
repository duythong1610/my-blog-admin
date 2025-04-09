import { $googleApiKey } from "constant";
import { Coords } from "google-map-react";
import React from "react";
import AutoComplete from "react-google-autocomplete";

export interface CoordAddress extends Coords {
  address: string;
}

interface IGoogleMapAutoComplete {
  onPlaceSelected: (coordAddress: CoordAddress) => void;
  defaultBounds?: any;
}

export const GoogleMapAutoComplete = ({
  onPlaceSelected,
  defaultBounds,
}: IGoogleMapAutoComplete) => {
  return (
    <div>
      <AutoComplete
        apiKey={$googleApiKey}
        options={{
          bounds: defaultBounds,
          types: ["geocode"],
        }}
        style={{ width: "100%" }}
        language="ja"
        onPlaceSelected={(place) => {
          console.log("onPlaceSelected:", place);
          if (place.geometry) {
            onPlaceSelected({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              address: place.formatted_address || "",
            });
          }
        }}
      />
    </div>
  );
};
