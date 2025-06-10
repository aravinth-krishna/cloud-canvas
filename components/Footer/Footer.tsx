import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      &copy; {currentYear} Cloud Canvas. All Rights Reserverd.
    </footer>
  );
}
