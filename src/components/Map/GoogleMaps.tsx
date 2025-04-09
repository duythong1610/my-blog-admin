import React, { useEffect, useRef, useState } from "react";
import GoogleMapReact from "google-map-react";
import { $googleApiKey } from "constant";
import { Marker } from "./components/Marker";
import { CoordAddress, GoogleMapAutoComplete } from "./GoogleMapAutoComplete";

interface IGoogleMaps {
  center?: GoogleMapReact.Coords;
  zoom?: number;
  coords?: GoogleMapReact.Coords[];
  onPlaceSelected?: (coordAddress: CoordAddress) => void;
}

export const GoogleMaps = ({
  center = {
    lat: 33.5983773,
    lng: 130.3641155,
  },
  coords = [],
  zoom = 11,
  onPlaceSelected,
}: IGoogleMaps) => {
  const [coordSelected, setCoordSelected] = useState<CoordAddress | null>();
  const mapRef = useRef<any>(null);

  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  };

  const handlePlaceSelect = (coordAddress: CoordAddress) => {
    setCoordSelected(coordAddress);
    onPlaceSelected?.(coordAddress);
  };

  useEffect(() => {
    if (coordSelected) {
      mapRef.current?.setCenter(coordSelected);
    }
  }, [coordSelected]);

  return (
    <div style={{ height: "400px" }}>
      <GoogleMapAutoComplete
        defaultBounds={defaultBounds}
        onPlaceSelected={handlePlaceSelect}
      />

      <GoogleMapReact

        // bootstrapURLKeys={{ key: $googleApiKey || "" }}
        bootstrapURLKeys={{
          key: $googleApiKey || "",
          libraries: ["places"],
          language: "vi",
        }}
        onGoogleApiLoaded={({ map, maps }) => {
          mapRef.current = map;
        }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        {coordSelected ? (
          <Marker lat={coordSelected.lat} lng={coordSelected.lng} />
        )
          : coords.map((e, i) => (
            <Marker key={i} lat={e.lat} lng={e.lng} />
          ))}
      </GoogleMapReact>
    </div>
  );
};
