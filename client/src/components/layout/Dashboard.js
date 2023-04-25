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

const semesters = {
  FF: "freshmanFall",
  FS: "freshmanSpring",
  SF: "sophomoreFall",
  SS: "sophomoreSpring",
  JF: "juniorFall",
  JS: "juniorSpring",
  SrF: "seniorFall",
  SrS: "seniorSpring",
};

function Dashboard() {
  //check where the user came from
  const navigate = useNavigate();
  const location = useLocation();

  //check if user is logged in then set the user
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  //search reults for communicating between searchform and tabs
  const [searchResults, setSearchResults] = useState([]);
  //state management for when class is added
  const [classToAdd, setclassToAdd] = useState("");

  //for when user logs in/ tries to illegally access
  useEffect(() => {
    async function fetchData() {
      console.log(location.state);
      const response = await axios.post("/api/users/getUser", {
        token: location.state.token,

        user_id: location.state.user.user_id,
      });
      setUser(response.data);
      setLoading(false);
    }

    if (location.state && location.state.isLoggedIn) {
      setIsLoggedIn(location.state.isLoggedIn);
      fetchData();
    } else {
      navigate("/");
    }
  }, [location.state, navigate]);
  useEffect(() => {}, [user]);
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
  }

  //handle class adds
  const handleClassAdd = (data, term) => {
    if (
      Object.values(user.semesters)
        .flatMap((arr) => arr)
        .some((element) => JSON.stringify(element) === JSON.stringify(data))
    ) {
      alert("Course already added");
      return;
    }
    let semester = semesters[term];
    sendClassesData(semester, [...user.semesters[semester], data]);
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

  //Content
  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <div className={styles.container}>
      <div className={styles.side_bar}>
        <div className={styles.search_section}>
          <SearchForm onSearch={setSearchResults} />
        </div>
        <div className={styles.tabs}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "10px 0",
            }}
          >
            <button
              onClick={() => navigate("/")}
              className="btn waves-effect waves-light"
              style={{ margin: "0 0px 10px 0px" }}
            >
              Logout
            </button>
          </div>

          <Tabs
            selectProgram={selectProgram}
            handleClassAdd={handleClassAdd}
            searchResults={searchResults}
            user_id={location.state.user.user_id}
            program={user.program}
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
          {Object.entries(user.semesters).map(([key, value]) => {
            return (
              <Semester
                key={key}
                name={key}
                semester={value}
                user={user}
                setUser={setUser}
                sendClassesData={sendClassesData}
              ></Semester>
            );
            // Pretty straightforward - use key for the key and value for the value.
            // Just to clarify: unlike object destructuring, the parameter names don't matter here.
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
