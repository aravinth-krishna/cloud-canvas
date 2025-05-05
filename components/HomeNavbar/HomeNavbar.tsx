import Link from "next/link";
import styles from "./HomeNavbar.module.css";
// Consider using an SVG or an Image component for a real icon
// import Image from 'next/image';

export default function HomeNavbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          {/* Replace with your actual logo/icon */}
          ☁️ Cloud Canvas
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/#about">About</Link>
          </li>{" "}
          {/* Link to section */}
          <li>
            <Link href="/code">Code</Link>
          </li>
          <li>
            <Link href="/#pricing">Pricing</Link>
          </li>{" "}
          {/* Link to section */}
          <li>
            <Link href="https://github.com/aravinth-krishna/cloud-canvas/blob/main/README.md">
              Docs
            </Link>
          </li>{" "}
          {/* Assuming you'll have a docs page */}
        </ul>
        <Link href="/code">
          {/* Adjust '/api/auth/login' based on your Amplify Cognito setup */}
          <span className={styles.signInButton}>Sign In</span>
        </Link>
        {/* Or use Amplify's Authenticator component for a more integrated experience */}
        {/* <Authenticator> */}
        {/* {({ signOut, user }) => ( */}
        {/* <button onClick={signOut} className={styles.signInButton}>Sign Out</button> */}
        {/* )} */}
        {/* </Authenticator> */}
      </div>
    </nav>
  );
}
