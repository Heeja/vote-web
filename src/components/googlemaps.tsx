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
}: {
  center: google.maps.LatLng | null | google.maps.LatLngLiteral;
  zoom: number;
}) {
  const divMap = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (divMap.current) {
      new window.google.maps.Map(divMap.current, {
        center,
        zoom,
        disableDefaultUI: true,
      });
    }
  }, []);

  return <GMap ref={divMap} id="map" />;
}

export default function Googlemaps() {
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
        <Gmapgeocode />
        <MapComponent center={center} zoom={zoom} />
        {/* <MarkerComponent cetner={center} map={MapComponent} /> */}
      </MapBox>
    </Wrapper>
  );
}
