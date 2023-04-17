import React, { useEffect } from "react";
import styles from "../../styles/Semester.module.css";

function Semester(props) {
  const { year, season, semester, setSemester } = props;
  //to remove courses
  const removeCourse = (setSemester, semester, courseIndex) => {
    const updatedSemesterData = { ...semester };
    delete updatedSemesterData[courseIndex];
    setSemester(updatedSemesterData);
  };

  useEffect(() => {
    console.log(semester);
  }, [semester]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          This is {year} {season} semester
        </h2>
      </div>
      <div className={styles.body}>
        {semester &&
          Object.values(semester).map((item, index) => (
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
                class="btn waves-effect waves-light "
                onClick={() => {
                  removeCourse(setSemester, semester, index);
                }}
                type="submit"
              >
                Cancel<i class="material-icons right">cancel</i>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Semester;
