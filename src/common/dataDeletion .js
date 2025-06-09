import React from "react";
import Navbar from "./component/navbar";
import BottomBar from "./component/bottomBar";
import "../Css/DataDeletion.css";

const DataDeletion = () => {
  return (
    <>
      <Navbar />
      <div className="policy-container">
        <h1 className="policy-title">Data Deletion Policy</h1>

        <section className="policy-section">
          <h2 className="section-title">1. Introduction</h2>
          <p className="section-text">
            We respect your privacy and are committed to protecting your
            personal data. This page explains how you can request the deletion
            of your data from our systems.
          </p>
        </section>

        <section className="policy-section">
          <h2 className="section-title">2. How to Request Data Deletion</h2>
          <p className="section-text">
            If you would like to delete your personal data from our platform,
            you can follow these steps:
          </p>

          <h3 className="option-title">Option 1: Manual Request</h3>
          <ul className="option-list">
            <li>
              📧 Emailing us at{" "}
              <a
                href="mailto:support@bestpropertiesmohali.com"
                className="contact-link"
              >
                support@bestpropertiesmohali.com
              </a>{" "}
              with the subject "Data Deletion Request".
            </li>
            <li>
              📞 Contacting our support team at{" "}
              <a href="tel:+919781998278" className="contact-link">
                +91 9781998278
              </a>
              .
            </li>
          </ul>

          <h3 className="option-title">Option 2: Self-Service Deletion</h3>
          <ol className="option-list">
            <li>1️⃣ Logging into your account.</li>
            <li>
              2️⃣ Navigating to{" "}
              <strong>Account Settings &gt; Privacy &gt; Delete Account</strong>
              .
            </li>
            <li>3️⃣ Confirming your deletion request.</li>
          </ol>
        </section>

        <section className="policy-section">
          <h2 className="section-title">3. What Happens After Deletion?</h2>
          <ul className="policy-list">
            <li>
              ✅ Your personal data will be permanently removed from our active
              systems within <strong>10</strong> days.
            </li>
            <li>
              ✅ Some data may be retained for legal, security, or backup
              purposes for up to <strong>2</strong> months before being
              automatically deleted.
            </li>
            <li>✅ Once deleted, your account and data cannot be recovered.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2 className="section-title">4. Questions?</h2>
          <p className="section-text">
            If you have any concerns regarding data deletion, contact us at{" "}
            <a
              href="mailto:support@bestpropertiesmohali.com"
              className="contact-link"
            >
              support@bestpropertiesmohali.com
            </a>
            .
          </p>
        </section>
      </div>
      <BottomBar />
    </>
  );
};

export default DataDeletion;
