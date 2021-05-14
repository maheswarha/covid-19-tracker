import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { showDataOnMap } from "../../common/utils";
import "./Map.css";

function Map({ countries, casesType, center, zoom }) {
  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  return (
    <MapContainer className="map">
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Loop through and draw circles on the map */}
      {showDataOnMap(countries, casesType)}
    </MapContainer>
  );
}

export default Map;
