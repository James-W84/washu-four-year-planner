import { Tab } from "@headlessui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Tabs.module.css";

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

  return (
    <Tab.Group>
      <Tab.List className={styles.tab_button}>
        <Tab className="waves-effect waves-light btn">Course Search</Tab>
        <Tab className="waves-effect waves-light btn">Requirements</Tab>
        <Tab className="waves-effect waves-light btn">Program Search</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <div>
            {props.searchResults.map((item) => (
              <p key={item._id}>
                {item.name}
                <button
                  onClick={() => console.log("Button clicked for", item.name)}
                >
                  Click me
                </button>
              </p>
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
