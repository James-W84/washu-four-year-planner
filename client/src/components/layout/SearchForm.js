import React, { useState } from "react";
import axios from "axios";

const SearchComponent = (props) => {
  const [searchParams, setSearchParams] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    async function fetchData() {
      console.log(searchParams);
      const response = await axios.post("/api/classes/search", searchParams);
      props.onSearch(response.data);
      console.log(response.data);
    }
    fetchData();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="school_code">School Code:</label>
        <input type="text" name="school_code" onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="dept_num">Department Number:</label>
        <input type="text" name="dept_num" onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="dept_code">Department Code:</label>
        <input type="text" name="dept_code" onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="class_num">Class Number:</label>
        <input type="text" name="class_num" onChange={handleInputChange} />
      </div>
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchComponent;
