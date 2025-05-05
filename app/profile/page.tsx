"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchUserAttributes,
  updateUserAttributes,
  sendUserAttributeVerificationCode,
  confirmUserAttribute,
  updatePassword,
  signOut,
} from "aws-amplify/auth";
import Navbar from "@/components/Navbar/Navbar";
import StatusBar from "@/components/StatusBar/StatusBar";
import styles from "./page.module.css";
import { IoMdArrowBack } from "react-icons/io";

export default function ProfilePage() {
  // 1) Track form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState(""); // store for comparison
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  // 2) Email verification flow
  const [emailCode, setEmailCode] = useState("");
  const [needEmailConfirm, setNeedEmailConfirm] = useState(false);

  // 3) Password fields & messages
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");

  // 4) Load attributes on mount
  useEffect(() => {
    (async () => {
      try {
        const attrs = await fetchUserAttributes(); // fetch name & email :contentReference[oaicite:4]{index=4}
        setName(attrs.name || "");
        setEmail(attrs.email || "");
        setOriginalEmail(attrs.email || "");
      } catch (e) {
        console.error("Failed to load user:", e);
      }
    })();
  }, []);

  // 5) Save profile (name + optional email)
  const saveProfile = async () => {
    setSavingProfile(true);
    setProfileMessage("");
    try {
      // Always update name; if email changed, update that too
      const userAttrs: Record<string, string> = { name };
      if (email !== originalEmail) {
        userAttrs.email = email;
      }
      await updateUserAttributes({ userAttributes: userAttrs }); // push changes :contentReference[oaicite:5]{index=5}

      // Only trigger verification if email was updated
      if (email !== originalEmail) {
        setNeedEmailConfirm(true);
        await sendUserAttributeVerificationCode({ userAttributeKey: "email" }); // code to new email :contentReference[oaicite:6]{index=6}
        setProfileMessage(
          "Profile saved. Verification code sent to new email."
        );
      } else {
        setProfileMessage("Profile saved.");
      }
      setOriginalEmail(email);
    } catch (e: unknown) {
      const errorMsg =
        e instanceof Error ? e.message : "Unable to update profile.";
      console.error("Profile save error:", e);
      setProfileMessage(`Error: ${errorMsg}`);
    } finally {
      setSavingProfile(false);
    }
  };

  // 6) Confirm new email
  const confirmEmail = async () => {
    try {
      await confirmUserAttribute({
        // confirmUserAttribute API :contentReference[oaicite:7]{index=7}
        userAttributeKey: "email",
        confirmationCode: emailCode,
      });
      setProfileMessage("Email verified successfully!");
      setNeedEmailConfirm(false);
      setEmailCode("");
    } catch (e: unknown) {
      let errorMessage = "Verification failed";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      console.error("Email confirm error:", e);
      setProfileMessage(`Verification failed: ${errorMessage}`);
    }
  };

  // 7) Change password with clear errors
  const changePassword = async () => {
    setPwdMessage("");
    if (newPwd !== confirmPwd) {
      setPwdMessage("New passwords do not match.");
      return;
    }
    try {
      await updatePassword({ oldPassword: oldPwd, newPassword: newPwd }); // updatePassword API :contentReference[oaicite:8]{index=8}
      setPwdMessage("Password updated successfully.");
      setOldPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (e: unknown) {
      let errorMessage = "Password change error";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      console.error("Password change error:", e);
      setPwdMessage(`Error: ${errorMessage}`);
    }
  };

  // 8) Logout
  const handleLogout = async () => {
    try {
      await signOut(); // signOut API :contentReference[oaicite:9]{index=9}
      window.location.reload();
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      {/* BACK BUTTON */}
      <Link href="/code" className={styles.backButton}>
        <IoMdArrowBack /> Back
      </Link>

      {/* Profile Card */}
      <div className={styles.card}>
        <h2>Profile Settings</h2>

        {/* Name */}
        <label className={styles.field}>
          <span>Name</span>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </label>

        {/* Email */}
        <label className={styles.field}>
          <span>Email</span>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="johndoe@example.com"
          />
        </label>

        <button
          className={styles.button}
          onClick={saveProfile}
          disabled={savingProfile}
        >
          {savingProfile ? "Saving…" : "Save Profile"}
        </button>

        {/* Email confirmation UI */}
        {needEmailConfirm && (
          <div className={styles.confirmSection}>
            <input
              className={styles.codeInput}
              placeholder="Email verification code"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
            />
            <button className={styles.smallButton} onClick={confirmEmail}>
              Confirm Email
            </button>
          </div>
        )}

        {profileMessage && <p className={styles.message}>{profileMessage}</p>}
      </div>

      {/* Password Card */}
      <div className={styles.card}>
        <h2>Change Password</h2>

        <label className={styles.field}>
          <span>Current Password</span>
          <input
            type="password"
            className={styles.input}
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
            placeholder="********"
          />
        </label>

        <label className={styles.field}>
          <span>New Password</span>
          <input
            type="password"
            className={styles.input}
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="********"
          />
        </label>

        <label className={styles.field}>
          <span>Confirm New Password</span>
          <input
            type="password"
            className={styles.input}
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            placeholder="********"
          />
        </label>

        <button className={styles.button} onClick={changePassword}>
          Change Password
        </button>
        {pwdMessage && <p className={styles.message}>{pwdMessage}</p>}
      </div>

      {/* Logout Card */}
      <div className={styles.card}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <StatusBar />
    </div>
  );
}
