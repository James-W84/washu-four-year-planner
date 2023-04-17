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
import Semester from "./Semester";
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

  //state management for when class is added
  const [classToAdd, setclassToAdd] = useState("");
  const [freshmanFall, setFreshmanFall] = useState({});
  const [freshmanSpring, setFreshmanSpring] = useState({});
  const [sophomoreFall, setSophomoreFall] = useState({});
  const [sophomoreSpring, setSophomoreSpring] = useState({});
  const [juniorFall, setJuniorFall] = useState({});
  const [juniorSpring, setJuniorSpring] = useState({});
  const [seniorFall, setSeniorFall] = useState({});
  const [seniorSpring, setSeniorSpring] = useState({});
  // to update states when class is added
  const addEntryToDictionary = (value, stateToUpdate) => {
    stateToUpdate((prevState) => ({
      ...prevState,
      [Object.keys(prevState).length]: value,
    }));
  };

  const handleClassAdd = (data, term) => {
    switch (term) {
      case "FF":
        addEntryToDictionary(data, setFreshmanFall);
        break;
      case "FS":
        addEntryToDictionary(data, setFreshmanSpring);
        break;
      case "SF":
        addEntryToDictionary(data, setSophomoreFall);
        break;
      case "SS":
        addEntryToDictionary(data, setSophomoreSpring);
        break;
      case "JF":
        addEntryToDictionary(data, setJuniorFall);
        break;
      case "JS":
        addEntryToDictionary(data, setJuniorSpring);
        break;
      case "SrF":
        addEntryToDictionary(data, setSeniorFall);
        break;
      case "SrS":
        addEntryToDictionary(data, setSeniorSpring);
        break;
      default:
        console.error(`Invalid term: ${term}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.side_bar}>
        <div className={styles.search_section}>
          <SearchForm onSearch={setSearchResults} />
        </div>
        <div className={styles.tabs}>
          <Tabs handleClassAdd={handleClassAdd} searchResults={searchResults} />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.welcome}>
          <h1>
            Welcome,<b> {UserObject.name}</b>
          </h1>
        </div>

        <div className={styles.college_time}>
          <Semester
            year="Freshman"
            season="Fall"
            semester={freshmanFall}
            setSemester={setFreshmanFall}
          />
          <Semester
            year="Freshman"
            season="Spring"
            semester={freshmanSpring}
            setSemester={setFreshmanSpring}
          />
          <Semester
            year="Sophomore"
            season="Fall"
            semester={sophomoreFall}
            setSemester={setSophomoreFall}
          />
          <Semester
            year="Sophomore"
            season="Spring"
            semester={sophomoreSpring}
            setSemester={setSophomoreSpring}
          />
          <Semester
            year="Junior"
            season="Fall"
            semester={juniorFall}
            setSemester={setJuniorFall}
          />
          <Semester
            year="Junior"
            season="Spring"
            semester={juniorSpring}
            setSemester={setJuniorSpring}
          />
          <Semester
            year="Senior"
            season="Fall"
            semester={seniorFall}
            setSemester={setSeniorFall}
          />
          <Semester
            year="Senior"
            season="Spring"
            semester={seniorSpring}
            setSemester={setSeniorSpring}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
