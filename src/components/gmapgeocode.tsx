import { useRef, useState } from "react";
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

function Gmapgeocode() {
  const [location, setLocation] = useState("");

  const addList = useRef<HTMLElement | null>(null);
  const locationInput = useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const locationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);

    if (locationInput) {
      const inputed = locationInput.current as HTMLInputElement;
      const options = {
        fields: ["formatted_address", "geometry", "name"],
        strictBounds: false,
      };

      console.log(inputed);

      const gMapAutoComplate = new google.maps.places.Autocomplete(
        inputed,
        options
      );
      const place = gMapAutoComplate.getPlace();

      console.log("autocomplate", gMapAutoComplate);
      console.log("place", place);

      //   if (addressListId) {
      //     addressListId.children.namedItem("place-name").textContent = place.name;
      //     addressListId.children.namedItem("place-name").textContent =
      //       place.formatted_address;
      //   }
    }
  };

  return (
    <AddressForm action="submit" onSubmit={onSubmit}>
      <Input
        id="location"
        type="text"
        value={location}
        onChange={locationChange}
        placeholder="주소 입력.."
      />
      <AddressList
        id="address-list"
        ref={addList}
        style={location.length > 0 ? {} : { display: "none" }}
      >
        <span id="place-name"></span>
        <span id="place-address"></span>
      </AddressList>
    </AddressForm>
  );
}

export default Gmapgeocode;
