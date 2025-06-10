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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [emailCode, setEmailCode] = useState("");
  const [needEmailConfirm, setNeedEmailConfirm] = useState(false);

  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const attrs = await fetchUserAttributes();
        setName(attrs.name || "");
        setEmail(attrs.email || "");
        setOriginalEmail(attrs.email || "");
      } catch (e) {
        console.error("Failed to load user:", e);
      }
    })();
  }, []);

  const saveProfile = async () => {
    setSavingProfile(true);
    setProfileMessage("");
    try {
      const userAttrs: Record<string, string> = { name };
      if (email !== originalEmail) {
        userAttrs.email = email;
      }
      await updateUserAttributes({ userAttributes: userAttrs });

      if (email !== originalEmail) {
        setNeedEmailConfirm(true);
        await sendUserAttributeVerificationCode({ userAttributeKey: "email" });
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

  const confirmEmail = async () => {
    try {
      await confirmUserAttribute({
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

  const changePassword = async () => {
    setPwdMessage("");
    if (newPwd !== confirmPwd) {
      setPwdMessage("New passwords do not match.");
      return;
    }
    try {
      await updatePassword({ oldPassword: oldPwd, newPassword: newPwd });
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

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <Link href="/code" className={styles.backButton}>
        <IoMdArrowBack /> Back
      </Link>

      <div className={styles.card}>
        <h2>Profile Settings</h2>

        <label className={styles.field}>
          <span>Name</span>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </label>

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

      <div className={styles.card}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <StatusBar />
    </div>
  );
}
