import styles from "./Footer.module.css"; // Updated import path

export default function Footer() {
  // Updated function name
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      &copy; {currentYear} Cloud Canvas. All Rights Reserverd.
    </footer>
  );
}
