import React, { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

import { gMapKey } from "../../api/gmap";
import styled from "styled-components";
import Gmapgeocode from "./gmapgeocode";

const MapBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 20px 20px;
  top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
`;

const GMap = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px 10px;
`;

function MapComponent({
  center,
  zoom,
  setMap,
}: {
  center: google.maps.LatLng | null | google.maps.LatLngLiteral;
  zoom: number;
  setMap: React.Dispatch<React.SetStateAction<google.maps.Map | undefined>>;
}) {
  const divMap = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (divMap.current) {
      const newMap = new window.google.maps.Map(divMap.current, {
        center,
        zoom,
        disableDefaultUI: true,
      });
      setMap(newMap);
    }
  }, []);

  return <GMap ref={divMap} id="map" />;
}

function MarkerComponent({
  center,
  map,
}: {
  center: google.maps.LatLng | null | google.maps.LatLngLiteral;
  map: google.maps.Map | undefined;
}) {
  const marker = new google.maps.Marker({
    position: center,
    title: "Marker Point !!",
  });

  useEffect(() => {
    if (map) {
      marker.setMap(map);
    }
  }, [map]);

  return <></>;
}

export default function Googlemaps() {
  const [map, setMap] = useState<google.maps.Map>();
  const [center, setcenter] = useState<
    google.maps.LatLng | null | google.maps.LatLngLiteral
  >({ lat: 37.479306, lng: 126.952736 });
  const [zoom, setZoom] = useState<number>(18);

  const render = (status: Status) => {
    return <h1>{status}</h1>;
  };

  return (
    <Wrapper apiKey={gMapKey} render={render}>
      <MapBox>
        {/* <Gmapgeocode /> */}
        <MapComponent center={center} zoom={zoom} setMap={setMap} />
        <MarkerComponent center={center} map={map} />
      </MapBox>
    </Wrapper>
  );
}
