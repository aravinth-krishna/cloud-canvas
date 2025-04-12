// components/Sidebar/Sidebar.tsx
import styles from "./Sidebar.module.css";
import FileExplorer from "../FileExplorer/FileExplorer";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <FileExplorer />
    </div>
  );
};

export default Sidebar;
