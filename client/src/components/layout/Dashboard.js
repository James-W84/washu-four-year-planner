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
  //check where the user came from
  const navigate = useNavigate();
  const location = useLocation();

  //check if user is logged in then set the user
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  //search reults for communicating between searchform and tabs
  const [searchResults, setSearchResults] = useState([]);
  //state management for when class is added
  const [classToAdd, setclassToAdd] = useState("");
  const [freshmanFall, setFreshmanFall] = useState(
    user && user.semesters && user.semesters.freshmanFall
      ? [user.semesters.freshmanFall, console.log(user.semesters.freshmanFall)]
      : []
  );

  const [freshmanSpring, setFreshmanSpring] = useState([]);
  const [sophomoreFall, setSophomoreFall] = useState([]);
  const [sophomoreSpring, setSophomoreSpring] = useState([]);
  const [juniorFall, setJuniorFall] = useState([]);
  const [juniorSpring, setJuniorSpring] = useState([]);
  const [seniorFall, setSeniorFall] = useState([]);
  const [seniorSpring, setSeniorSpring] = useState([]);

  //for when user logs in/ tries to illegally access
  useEffect(() => {
    if (location.state && location.state.isLoggedIn == true) {
      setIsLoggedIn(location.state.isLoggedIn);
    } else {
      navigate("/");
    }
    //get user data
    setUser(location.state.user.user);
    console.log(user);
  }, [location.state, navigate]);

  async function sendClassesData(sem, semInfo) {
    const response = await axios
      .post("/api/users/update", {
        email: user.email,
        semester: sem,
        classes: semInfo,
      })
      .catch(function (error) {
        console.log(error);
      });
    setUser(response.data.user);
    console.log(response.data.user);
  }

  // //handle class adds
  const handleClassAdd = (data, term) => {
    switch (term) {
      case "FF":
        if (freshmanFall.includes(data)) {
          alert("Semester already added");
          return;
        }
        setFreshmanFall([...freshmanFall, data]);
        sendClassesData("freshmanFall", [...freshmanFall, data]);

        break;
      case "FS":
        if (freshmanSpring.includes(data)) {
          alert("Semester already added");
          return;
        }
        setFreshmanSpring([...freshmanSpring, data]);
        sendClassesData("freshmanSpring", [...freshmanSpring, data]);
        break;
      case "SF":
        if (sophomoreFall.includes(data)) {
          alert("Semester already added");
          return;
        }
        setSophomoreFall((prevData) => [...sophomoreFall, data]);
        sendClassesData("sophomoreFall", [...sophomoreFall, data]);
        break;
      case "SS":
        if (sophomoreSpring.includes(data)) {
          alert("Semester already added");
          return;
        }
        setSophomoreSpring((prevData) => [...sophomoreSpring, data]);
        sendClassesData("sophomoreSpring", [...sophomoreSpring, data]);
        break;
      case "JF":
        if (juniorFall.includes(data)) {
          alert("Semester already added");
          return;
        }
        setJuniorFall((prevData) => [...juniorFall, data]);
        sendClassesData("juniorFall", [...juniorFall, data]);
        break;
      case "JS":
        if (juniorSpring.includes(data)) {
          alert("Semester already added");
          return;
        }
        setJuniorSpring((prevData) => [...juniorSpring, data]);
        sendClassesData("juniorSpring", [...juniorSpring, data]);
        break;
      case "SrF":
        if (seniorFall.includes(data)) {
          alert("Semester already added");
          return;
        }
        setSeniorFall((prevData) => [...seniorFall, data]);
        sendClassesData("seniorFall", [...seniorFall, data]);
        break;
      case "SrS":
        if (seniorSpring.includes(data)) {
          alert("Semester already added");
          return;
        }
        setSeniorSpring((prevData) => [...seniorSpring, data]);
        sendClassesData("seniorSpring", [...seniorSpring, data]);
        break;
      default:
        console.error(`Invalid term: ${term}`);
    }
  };
  async function selectProgram(programId) {
    const response = await axios
      .post("/api/users/updateProgram", {
        email: user.email,
        programId: programId,
      })
      .catch(function (error) {
        console.log(error);
      });
    setUser(response.data.user);
  }
  return (
    <div className={styles.container}>
      <div className={styles.side_bar}>
        <div className={styles.search_section}>
          <SearchForm onSearch={setSearchResults} />
        </div>
        <div className={styles.tabs}>
          <Tabs
            selectProgram={selectProgram}
            handleClassAdd={handleClassAdd}
            searchResults={searchResults}
          />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.welcome}>
          <h1>
            Welcome,<b> {user.name}</b>
          </h1>
        </div>

        <div className={styles.college_time}>
          <Semester
            year="Freshman"
            season="Fall"
            semester={freshmanFall}
            setSemester={setFreshmanFall}
            sendClassesData={sendClassesData}
          />

          <Semester
            year="Freshman"
            season="Spring"
            semester={freshmanSpring}
            setSemester={setFreshmanSpring}
            sendClassesData={sendClassesData}
          />
          <Semester
            year="Sophomore"
            season="Fall"
            semester={sophomoreFall}
            setSemester={setSophomoreFall}
            sendClassesData={sendClassesData}
          />
          <Semester
            year="Sophomore"
            season="Spring"
            semester={sophomoreSpring}
            setSemester={setSophomoreSpring}
            sendClassesData={sendClassesData}
          />
          <Semester
            year="Junior"
            season="Fall"
            semester={juniorFall}
            setSemester={setJuniorFall}
            sendClassesData={sendClassesData}
          />
          <Semester
            year="Junior"
            season="Spring"
            semester={juniorSpring}
            setSemester={setJuniorSpring}
            sendClassesData={sendClassesData}
          />
          <Semester
            year="Senior"
            season="Fall"
            semester={seniorFall}
            setSemester={setSeniorFall}
            sendClassesData={sendClassesData}
          />
          <Semester
            year="Senior"
            season="Spring"
            semester={seniorSpring}
            setSemester={setSeniorSpring}
            sendClassesData={sendClassesData}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
