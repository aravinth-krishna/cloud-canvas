import Link from "next/link";
import styles from "./FloatingChatbot.module.css";

export const FloatingChatbot = () => {
  return (
    <div className={styles.floatingChatbot}>
      <Link href={"/chatbot"}>Ask AI ✨</Link>
    </div>
  );
};
