import React from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import SignupForm from "../SignupForm/SignupForm";

const OtherLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className="container">
        {children}
      </div>
      <SignupForm />
      <Footer />
    </>
  );
};

export default OtherLayout;
