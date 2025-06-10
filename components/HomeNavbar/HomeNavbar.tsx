import Link from "next/link";
import styles from "./HomeNavbar.module.css";

export default function HomeNavbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6.045 8.2605C6.224 6.80721 6.92827 5.46953 8.02513 4.49948C9.12199 3.52943 10.5357 2.99397 12 2.99397C13.4643 2.99397 14.878 3.52943 15.9749 4.49948C17.0717 5.46953 17.776 6.80721 17.955 8.2605C19.2184 8.34351 20.4 8.91481 21.2497 9.85352C22.0993 10.7922 22.5505 12.0247 22.5076 13.2901C22.4647 14.5555 21.9312 15.7546 21.0199 16.6336C20.1087 17.5127 18.8911 18.0027 17.625 18H6.375C5.10886 18.0027 3.89134 17.5127 2.98008 16.6336C2.06881 15.7546 1.53529 14.5555 1.49242 13.2901C1.44954 12.0247 1.90067 10.7922 2.75035 9.85352C3.60002 8.91481 4.78158 8.34351 6.045 8.2605Z"
              fill="url(#paint0_linear_2_5)"
            />
            <path
              d="M11.25 13.125C11.25 14.4179 10.7364 15.6579 9.82215 16.5721C8.90791 17.4864 7.66793 18 6.375 18C5.08207 18 3.84209 17.4864 2.92785 16.5721C2.01361 15.6579 1.5 14.4179 1.5 13.125C1.5 11.8321 2.01361 10.5921 2.92785 9.67785C3.84209 8.76361 5.08207 8.25 6.375 8.25C7.66793 8.25 8.90791 8.76361 9.82215 9.67785C10.7364 10.5921 11.25 11.8321 11.25 13.125Z"
              fill="url(#paint1_linear_2_5)"
              fillOpacity="0.3"
            />
            <path
              d="M12 15C13.1551 14.9999 14.2856 14.6663 15.2558 14.0394C16.2259 13.4124 16.9945 12.5188 17.4692 11.4657C17.9439 10.4126 18.1045 9.24495 17.9318 8.10283C17.7591 6.96072 17.2603 5.89273 16.4955 5.02713C15.7307 4.16152 14.7322 3.53509 13.62 3.22306C12.5079 2.91103 11.3293 2.92666 10.2258 3.26808C9.12231 3.6095 8.14083 4.26219 7.39921 5.14778C6.65759 6.03337 6.18736 7.1142 6.045 8.2605C6.155 8.2535 6.265 8.25 6.375 8.25C7.16876 8.24982 7.95055 8.44346 8.65246 8.81411C9.35437 9.18475 9.95516 9.72118 10.4026 10.3768C10.8501 11.0324 11.1307 11.7874 11.2201 12.5761C11.3095 13.3648 11.2049 14.1634 10.9155 14.9025C11.2685 14.9675 11.63 15 12 15Z"
              fill="url(#paint2_linear_2_5)"
              fillOpacity="0.3"
            />
            <path
              d="M12 15C13.1551 14.9999 14.2856 14.6663 15.2558 14.0394C16.2259 13.4124 16.9945 12.5188 17.4692 11.4657C17.9439 10.4126 18.1045 9.24495 17.9318 8.10283C17.7591 6.96072 17.2603 5.89273 16.4955 5.02713C15.7307 4.16152 14.7322 3.53509 13.62 3.22306C12.5079 2.91103 11.3293 2.92666 10.2258 3.26808C9.12231 3.6095 8.14083 4.26219 7.39921 5.14778C6.65759 6.03337 6.18736 7.1142 6.045 8.2605C6.155 8.2535 6.265 8.25 6.375 8.25C7.16876 8.24982 7.95055 8.44346 8.65246 8.81411C9.35437 9.18475 9.95516 9.72118 10.4026 10.3768C10.8501 11.0324 11.1307 11.7874 11.2201 12.5761C11.3095 13.3648 11.2049 14.1634 10.9155 14.9025C11.2685 14.9675 11.63 15 12 15Z"
              fill="url(#paint3_radial_2_5)"
            />
            <path
              d="M6.045 8.2605C6.224 6.80721 6.92827 5.46953 8.02513 4.49948C9.12199 3.52943 10.5357 2.99397 12 2.99397C13.4643 2.99397 14.878 3.52943 15.9749 4.49948C17.0717 5.46953 17.776 6.80721 17.955 8.2605C19.2184 8.34351 20.4 8.91481 21.2497 9.85352C22.0993 10.7922 22.5505 12.0247 22.5076 13.2901C22.4647 14.5555 21.9312 15.7546 21.0199 16.6336C20.1087 17.5127 18.8911 18.0027 17.625 18H6.375C5.10886 18.0027 3.89134 17.5127 2.98008 16.6336C2.06881 15.7546 1.53529 14.5555 1.49242 13.2901C1.44954 12.0247 1.90067 10.7922 2.75035 9.85352C3.60002 8.91481 4.78158 8.34351 6.045 8.2605Z"
              fill="url(#paint4_radial_2_5)"
              fillOpacity="0.5"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2_5"
                x1="2.25"
                y1="5.8125"
                x2="11.922"
                y2="19.881"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0FAFFF" />
                <stop offset="1" stopColor="#367AF2" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_2_5"
                x1="1.5"
                y1="9.9195"
                x2="8.073"
                y2="15.738"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="#FCFCFC" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_2_5"
                x1="8.118"
                y1="3.675"
                x2="9.705"
                y2="11.9475"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="#FCFCFC" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint3_radial_2_5"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(6.513 12.825) rotate(-22.9258) scale(7.31634 6.54027)"
              >
                <stop offset="0.412" stopColor="#2C87F5" />
                <stop offset="1" stopColor="#2C87F5" stopOpacity="0" />
              </radialGradient>
              <radialGradient
                id="paint4_radial_2_5"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(11.1255 2.0625) rotate(64.0336) scale(18.4854 131.815)"
              >
                <stop offset="0.5" stopColor="#DD3CE2" stopOpacity="0" />
                <stop offset="1" stopColor="#DD3CE2" />
              </radialGradient>
            </defs>
          </svg>{" "}
          <span>CLOUD CANVAS</span>
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/#about">About</Link>
          </li>{" "}
          <li>
            <Link href="/code">Code</Link>
          </li>
          <li>
            <Link href="/#pricing">Pricing</Link>
          </li>{" "}
          <li>
            <Link href="https://github.com/aravinth-krishna/cloud-canvas/blob/main/README.md">
              Docs
            </Link>
          </li>{" "}
        </ul>
        <Link href="/code">
          <span className={styles.signInButton}>Sign In</span>
        </Link>
      </div>
    </nav>
  );
}
