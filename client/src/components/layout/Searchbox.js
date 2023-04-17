import React, { useState, useEffect } from "react";
import axios from "axios";

////////////////////////////////
////////////////////////////////
////////////////////////////////
////////////////////////////////
////DEPRECATED, NOW USING SEARCHFORM////
////////////////////////////////
////////////////////////////////
////////////////////////////////
////////////////////////////////
////////////////////////////////
function SearchBox(props) {
  const [searchText, setSearchText] = useState("");
  let searchAttribute = props.searchAttribute;
  let searchTitle = "Search for " + searchAttribute;
  function handleChange(event) {
    setSearchText(event.target.value);
  }
  function handleSubmit(event) {
    event.preventDefault();
    async function fetchData() {
      const response = await axios.post("/api/classes/search", {
        searchAttribute: searchAttribute,
        searchText: searchText,
      });
    }
    fetchData();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search">{searchTitle}</label>
      <input type="text" id="search" onChange={handleChange} />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBox;
