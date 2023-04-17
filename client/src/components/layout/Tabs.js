import { Tab } from "@headlessui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Tabs.module.css";
import Select from "react-select";

function Tabs(props) {
  //get all classes
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const response = await axios.post("/api/classes/getAll");
      setData(response.data);
    }
    fetchData();
  }, []);
  //add class by using state in dashboard
  function handleAdd(item, term) {
    props.handleClassAdd(item, term);
  }
  // set selecion optoins
  const options = [
    { value: "FF", label: "Freshman Fall" },
    { value: "FS", label: "Freshman Spring" },
    { value: "SF", label: "Sophomore Fall" },
    { value: "SS", label: "Sophomore Spring" },
    { value: "JF", label: "Junior Fall" },
    { value: "JS", label: "Junior Spring" },
    { value: "SrF", label: "Senior Fall" },
    { value: "SrS", label: "Senior Spring" },
  ];
  const [selectedTerm, setSelectedTerm] = useState("");

  //get all requirements
  return (
    <Tab.Group>
      <Tab.List className={styles.tab_button}>
        <Tab
          className="waves-effect waves-light btn"
          style={{ fontSize: "11px" }}
        >
          Course Search
        </Tab>
        <Tab
          className="waves-effect waves-light btn"
          style={{ fontSize: "11px" }}
        >
          Requirements
        </Tab>
        <Tab
          className="waves-effect waves-light btn"
          style={{ fontSize: "11px" }}
        >
          Program Search
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <div>
            {props.searchResults.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid black",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  margin: "10px 0",
                  whiteSpace: "break-spaces",
                }}
              >
                <span>{item.name}</span>
                <Select
                  options={options}
                  placeholder="term"
                  // value={selectedTerm}
                  onChange={(selectedOption) => {
                    setSelectedTerm(selectedOption.value);
                  }}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      textAlign: "center",
                      fontWeight: "bold",
                      minWidth: "100px",
                      marginRight: "10px",
                    }),
                  }}
                />

                <button
                  type="submit"
                  style={{
                    // backgroundColor: "#26a69a",
                    backgroundColor: "grey",
                    border: "none",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleAdd(item, selectedTerm)}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </Tab.Panel>
        <Tab.Panel>Content 2</Tab.Panel>
        <Tab.Panel>Content 3</Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
export default Tabs;
