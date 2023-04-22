import React, { useEffect } from "react";
import styles from "../../styles/Semester.module.css";

function Semester(props) {
  const { name, semester, user, setUser, sendClassesData } = props;
  // console.log(semester);
  //to remove courses
  const removeCourse = (semester, classToRemove) => {
    const newArray = semester.filter((item) => item !== classToRemove);

    sendClassesData(name, newArray);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          {name
            .replace(/([A-Z])/g, " $1")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </h2>
      </div>
      <div className={styles.body}>
        {semester &&
          semester.length > 0 &&
          semester.map((item, index) => (
            <div
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "0.5px solid rgb(0, 0, 0)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <p style={{ fontWeight: "bold" }}>{item.name}</p>

              <button
                className="btn waves-effect waves-light "
                onClick={() => {
                  removeCourse(semester, item);
                }}
                type="submit"
              >
                Remove<i className="material-icons right">remove</i>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Semester;
