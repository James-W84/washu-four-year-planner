import React, { useEffect } from "react";
import styles from "../../styles/Semester.module.css";

function Semester(props) {
  const { year, season, semester, setSemester, sendClassesData } = props;
  console.log(semester);
  const key = year.toLowerCase() + season;
  //to remove courses
  const removeCourse = (setSemester, semester, classToRemove) => {
    const newArray = semester.filter((item) => item !== classToRemove);
    setSemester(newArray);
    console.log(newArray);
    sendClassesData(key, newArray);
  };

  // useEffect(() => {
  //   console.log("semester changed:", semester);
  // }, [semester]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          This is {year} {season} semester
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
                  removeCourse(setSemester, semester, item);
                }}
                type="submit"
              >
                Cancel<i className="material-icons right">cancel</i>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Semester;
