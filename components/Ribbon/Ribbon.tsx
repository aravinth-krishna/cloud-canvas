"use client";

import styles from "./Ribbon.module.css";

const Ribbon = () => {
  return (
    <div className={styles.ribbon}>
      <button>File</button>
      <button>Edit</button>
      <button>View</button>
      <button>Runtime</button>
      <button>Tools</button>
      <button>Help</button>
    </div>
  );
};

export default Ribbon;
