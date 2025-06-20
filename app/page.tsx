import Link from "next/link";
import styles from "./page.module.css";
import HomeNavbar from "@/components/HomeNavbar/HomeNavbar";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      <HomeNavbar />

      <main className={styles.mainContent}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.headline}>
              Unlock AI Development{" "}
              <span className={styles.highlight}>Without Barriers</span>
            </h1>
            <p className={styles.subheadline}>
              Cloud Canvas provides a ready-to-use PyTorch environment in your
              browser. Focus on learning and building, not on hardware setup.
              Pay only for what you compute.
            </p>
            <Link href="/code">
              <button className={styles.ctaButton}>Start Coding Now</button>
            </Link>
            <p className={styles.ctaSubtext}>No credit card required*</p>
          </div>
        </section>

        <section id="about" className={styles.section}>
          <h2 className={styles.sectionTitle}>Stop Worrying About Hardware</h2>
          <p className={styles.sectionText}>
            High-end GPUs and complex local setups shouldn&apos;t block your AI
            journey. Cloud Canvas eliminates the need for expensive hardware,
            offering a seamless, cloud-based PyTorch editor accessible from any
            device. Learn, experiment, and iterate faster.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Features Designed For You</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>📝</span>{" "}
              <h3>Web-Based Editor</h3>
              <p>
                Code directly in your browser with a familiar interface. No
                installation needed.
              </p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>🚀</span>{" "}
              <h3>PyTorch Ready</h3>
              <p>
                Jump straight into development with PyTorch and essential
                libraries pre-installed.
              </p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>☁️</span>{" "}
              <h3>Cloud Powered</h3>
              <p>
                Leverage cloud compute resources on demand. Say goodbye to local
                limitations.
              </p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>💾</span>{" "}
              <h3>Persistent Storage</h3>
              <p>
                Save your code files and projects securely. Pick up right where
                you left off.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.howItWorks}`}>
          <h2 className={styles.sectionTitle}>Get Started in Minutes</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Sign Up / Log In</h3>
              <p>Create your Cloud Canvas account quickly using AWS Cognito.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Create & Code</h3>
              <p>
                Open the editor, create a new file, and start writing your
                PyTorch code.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Run & See Output</h3>
              <p>
                Execute your code on our cloud infrastructure and view the
                results instantly.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Save Your Work</h3>
              <p>
                Your files are saved automatically to DynamoDB, accessible
                anytime.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" className={styles.section}>
          <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
          <div className={styles.pricingCard}>
            <span className={styles.featureIcon}>💰</span> <h3>Pay Per Use</h3>
            <p>
              You only pay for the computational resources (like CPU/GPU time
              and memory) you consume while running your code. File storage is
              included*.
            </p>
            <div className={styles.pricingDetails}>
              <p>
                <strong>Compute Time:</strong> $0.02 per hour
              </p>
              <p className={styles.pricingNote}>
                Clear usage tracking available in your dashboard.
              </p>
            </div>
            <Link href="/code">
              <button className={`${styles.ctaButton} ${styles.pricingCta}`}>
                Start Building
              </button>
            </Link>
          </div>
        </section>

        <section className={`${styles.section} ${styles.finalCtaSection}`}>
          <h2>Ready to Start Your AI Journey?</h2>
          <p>
            Join Cloud Canvas today and experience the easiest way to learn and
            build AI models.
          </p>
          <Link href="/code">
            <button className={styles.ctaButton}>Go to Editor</button>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
