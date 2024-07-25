import React from "react";
import NavBar from "../NavBar/NavBar";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SignupForm from "../SignupForm/SignupForm";

const MainLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      <Header />
      <div className="container">
        {children}
      </div>
      <SignupForm />
      <Footer />
    </>
  );
};

export default MainLayout;
