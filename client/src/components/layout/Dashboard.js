import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Tabs from "./Tabs";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (location.state && location.state.isLoggedIn == true) {
      setIsLoggedIn(location.state.isLoggedIn);
    } else {
      navigate("/");
    }
  }, [location.state, navigate]);
  let UserObject = location.state.user.user;

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.post("/api/classes/getAll");
      setData(response.data);
    }
    fetchData();
  }, []);
  console.log(data);
  return (
    <div style={{ height: "75vh" }} className="container valign-wrapper">
      <h1>meep moop college planner loop</h1>
      <div>
        {data.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
      <Tabs />
    </div>
  );
}

export default Dashboard;
