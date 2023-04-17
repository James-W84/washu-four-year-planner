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
      const response = await axios.post("/api/classes/search", searchParams);
      props.onSearch(response.data);
    }
    fetchData();
  };

  return (
    <form
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "20px",
      }}
      onSubmit={handleSubmit}
    >
      <label htmlFor="school_code" style={{ flex: 1 }}>
        School Code:
      </label>
      <input
        type="text"
        name="school_code"
        style={{ flex: 1 }}
        onChange={handleInputChange}
      />
      <label htmlFor="dept_num" style={{ flex: 1 }}>
        Department Number:
      </label>
      <input
        type="text"
        name="dept_num"
        style={{ flex: 1 }}
        onChange={handleInputChange}
      />
      <label htmlFor="dept_code" style={{ flex: 1 }}>
        Department Code:
      </label>
      <input
        type="text"
        name="dept_code"
        style={{ flex: 1 }}
        onChange={handleInputChange}
      />
      <label htmlFor="class_num" style={{ flex: 1 }}>
        Class Number:
      </label>
      <input
        type="text"
        name="class_num"
        style={{ flex: 1 }}
        onChange={handleInputChange}
      />
      <button
        className="btn waves-effect waves-light"
        type="submit"
        style={{ flex: 1 }}
      >
        Search
      </button>
    </form>
  );
};

export default SearchComponent;
