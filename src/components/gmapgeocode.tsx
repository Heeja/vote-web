import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const AddressForm = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Input = styled.input`
  margin: 12px 0px;
`;

function GAutoComplete({
  input,
  setCenter,
}: {
  input: React.RefObject<HTMLInputElement>;
  setCenter?: React.Dispatch<
    React.SetStateAction<google.maps.LatLng | google.maps.LatLngLiteral | null>
  >;
}) {
  const inputed = input.current as HTMLInputElement;

  const options = {
    country: ["kr"],
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
  };

  const gMapAutoComplate = new window.google.maps.places.Autocomplete(
    inputed,
    options
  );
  gMapAutoComplate.addListener("place_changed", () => {
    const place = gMapAutoComplate.getPlace();
    const geometry = place.geometry?.location;
    if (geometry) {
      const lat = geometry.lat();
      const lng = geometry.lng();
      if (setCenter) {
        setCenter({ lat: lat, lng: lng });
      }
    }
  });

  const searchBoxs = new window.google.maps.places.SearchBox(inputed);
  searchBoxs.addListener("place_changed", () => {
    const places = searchBoxs.getPlaces();
    if (places?.length == 0) return;
    console.log(places);
  });
}

export default function Gmapgeocode({
  setCenter,
  map,
}: {
  setCenter: React.Dispatch<
    React.SetStateAction<google.maps.LatLng | google.maps.LatLngLiteral | null>
  >;
  map: google.maps.Map | undefined;
}) {
  const [location, setLocation] = useState("");
  const locationInput = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (location.length < 1) {
      alert("검색할 주소를 입력해주세요!");
      return;
    }
    const searchBoxs = GAutoComplete;
    console.log("searchBoxs:", searchBoxs);

    const Ggeocode = new google.maps.Geocoder();
    Ggeocode.geocode({ address: location }).then(
      (res: google.maps.GeocoderResponse) => {
        const info = res.results[0].formatted_address;
        const geometry = res.results[0].geometry.location;
        const geoLatLng = { lat: geometry.lat(), lng: geometry.lng() };

        setCenter(geoLatLng);
        // const infoWindow = new google.maps.InfoWindow({
        //   content: info,
        //   ariaLabel: location,
        // });
        // console.log(infoWindow);
      }
    );
    // console.log("submit complete.");
  };

  useEffect(() => {
    if (locationInput != null) {
      GAutoComplete({
        input: locationInput,
        setCenter: setCenter,
      });
    }
  }, []);

  return (
    <AddressForm action="submit" onSubmit={onSubmit}>
      <Input
        id="location"
        type="text"
        ref={locationInput}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="주소 입력.."
      />
    </AddressForm>
  );
}
