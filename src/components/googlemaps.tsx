import React, { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

import { gMapKey } from "../../api/gmap";
import styled from "styled-components";
import Gmapgeocode from "./gmapgeocode";

const MapBox = styled.div`
	min-height: 500px;
	padding: 20px 20px;
	top: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const GMap = styled.div`
	overflow: none;
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
				// disableDefaultUI: true,
			});
			setMap(newMap);
		}
	}, [center]);

	return (
		<GMap style={{ width: "100%", height: "50vh" }} ref={divMap} id="map" />
	);
}

function MarkerComponent({
	center,
	map,
	setMarker,
}: {
	center: google.maps.LatLng | null | google.maps.LatLngLiteral;
	map: google.maps.Map | undefined;
	setMarker: React.Dispatch<
		React.SetStateAction<google.maps.Marker | undefined>
	>;
}) {
	const newMarker = new google.maps.Marker({
		position: center,
	});

	useEffect(() => {
		if (map) {
			setMarker(newMarker);
			newMarker.setMap(map);
		}
	}, [map]);

	return <></>;
}

function clear({ marker }: { marker: google.maps.Marker }) {
	// marker clear.
	marker.setMap(null);
}

export default function Googlemaps() {
	const [map, setMap] = useState<google.maps.Map>();
	const [marker, setMarker] = useState<google.maps.Marker>();
	const [center, setCenter] = useState<
		google.maps.LatLng | null | google.maps.LatLngLiteral
	>({ lat: 37.479306, lng: 126.952736 });
	const [zoom, setZoom] = useState<number>(18);

	console.log("marker:", marker);
	console.log("center:", center);

	const render = (status: Status) => {
		return <h1>{status}</h1>;
	};

	return (
		<Wrapper apiKey={gMapKey} libraries={["places"]} render={render}>
			<MapBox>
				<Gmapgeocode setCenter={setCenter} />
				<MapComponent center={center} zoom={zoom} setMap={setMap} />
				<MarkerComponent center={center} map={map} setMarker={setMarker} />
			</MapBox>
		</Wrapper>
	);
}
