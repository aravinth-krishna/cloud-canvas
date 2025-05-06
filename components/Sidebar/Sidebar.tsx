// components/Sidebar/Sidebar.tsx
import styles from "./Sidebar.module.css";
import FileList from "../FileExplorer/FileExplorer";

interface SidebarProps {
  files: Array<{ id: string; name: string }>;
  selectedFileId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div className={styles.sidebar}>
      <FileList {...props} />
    </div>
  );
}
