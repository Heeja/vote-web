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

const AddressList = styled.span`
  position: absolute;
  top: 40px;
  z-index: 3;
  background: black;
  width: 100%;
  height: 100%;
`;

function GAutoComplete({
  input,
  // listBox,
  setCenter,
}: {
  input: React.RefObject<HTMLInputElement>;
  // listBox: React.RefObject<HTMLElement>;
  setCenter: React.Dispatch<
    React.SetStateAction<google.maps.LatLng | google.maps.LatLngLiteral | null>
  >;
}) {
  const inputed = input.current as HTMLInputElement;
  // const listDiv = listBox.current as HTMLElement;
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

      console.log(lat, lng);
      setCenter({ lat: lat, lng: lng });
    }
    // listDiv.children.namedItem("place_name")?.textContent == place.name;
    // listDiv.children.namedItem("place_address")?.textContent ==
    //   place.formatted_address;
  });
}

export default function Gmapgeocode({
  setCenter,
}: {
  setCenter: React.Dispatch<
    React.SetStateAction<google.maps.LatLng | google.maps.LatLngLiteral | null>
  >;
}) {
  const [location, setLocation] = useState("");
  // const addList = useRef<HTMLElement>(null);
  const locationInput = useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (location.length < 1) {
      alert("검색할 주소를 입력해주세요!");
      return;
    }
    const Ggeocode = new google.maps.Geocoder();
    Ggeocode.geocode({ address: location }).then(
      (res: google.maps.GeocoderResponse) => {
        const info = res.results[0].formatted_address;
        const geometry = res.results[0].geometry.location;
        const geoArray = [geometry.lat(), geometry.lng()];
        console.log("info:", info);
        console.log("geometry:", geoArray);
      }
    );
    console.log("submit action.");
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
      {/* <AddressList
        id="address-list"
        ref={addList}
        style={location.length > 0 ? {} : { display: "none" }}
      >
        <span id="place_name"></span>
        <span id="place_address"></span>
      </AddressList> */}
    </AddressForm>
  );
}
