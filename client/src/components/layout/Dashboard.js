import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Tabs from "./Tabs";
import axios from "axios";
import styles from "../../styles/Dashboard.module.css";
import SearchBox from "./Searchbox";
import SearchForm from "./SearchForm";
function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  //check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (location.state && location.state.isLoggedIn == true) {
      setIsLoggedIn(location.state.isLoggedIn);
    } else {
      navigate("/");
    }
  }, [location.state, navigate]);

  //get user data
  let UserObject = location.state.user.user;
  console.log(UserObject);
  //search reults for communicating between searchform and tabs
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className={styles.container}>
      <div className={styles.side_bar}>
        <div className={styles.search_section}>
          {/* <SearchBox searchAttribute="school_code" />
          <SearchBox searchAttribute="dept_num" />
          <SearchBox searchAttribute="dept_code" />
          <SearchBox searchAttribute="class_num" /> */}
          <SearchForm onSearch={setSearchResults} />
        </div>
        <div className={styles.tabs}>
          <Tabs searchResults={searchResults} />
        </div>
      </div>
      <div className={styles.main}>
        <h1>Welcome, {UserObject.name}</h1>
      </div>
    </div>
  );
}

export default Dashboard;
