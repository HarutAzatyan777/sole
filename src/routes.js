import React from "react";
import { Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import MenuPage from "./components/JewelleryMenuPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import AdminPanelFirebase from "./components/AdminPanelFirebase";
import LoginForm from "./components/LoginForm";
import DiamondInfoPage from "./pages/DiamondInfoPage/DiamondInfoPage";
import Footer from "./components/Footer/Footer";
import SecretRedirect from "./components/SecretRedirect"; // ✅ Ավելացված է
import ExchangeRatePage from "./pages/ExchangeRate/ExchangeRate"; 
import GoldCalculator from "./pages/GoldCalculator/GoldCalculator";

const ADMIN_EMAIL = "admin@solejewelry.com";

export const getRoutes = (user) => [
  <Route
    key="/"
    path="/"
    element={
      <>
        <Header />
        <SecretRedirect /> {/* ✅ Ավելացված է */}
        <MenuPage />
        <Footer />
      </>
    }
  />,
  <Route
  key="/exchange-rate"
  path="/exchange-rate"
  element={
    <>
      <Header />
      <SecretRedirect />
      <ExchangeRatePage />
      <Footer />
    </>
  }
/>,
<Route
  key="/gold-calculator"
  path="/gold-calculator"
  element={
    <>
      <Header />
      <SecretRedirect />
      <GoldCalculator />
      <Footer />
    </>
  }
/>,


  <Route
    key="/menu"
    path="/menu"
    element={
      <>
        <Header />
        <SecretRedirect />
        <MenuPage />
        <Footer />
      </>
    }
  />,
  <Route
    key="/about"
    path="/about"
    element={
      <>
        <Header />
        <SecretRedirect />
        <AboutPage />
        <Footer />
      </>
    }
  />,
  <Route
    key="/diamond-info"
    path="/diamond-info"
    element={
      <>
        <Header />
        <SecretRedirect />
        <DiamondInfoPage />
        <Footer />
      </>
    }
  />,
  <Route
    key="/contact"
    path="/contact"
    element={
      <>
        <Header />
        <SecretRedirect />
        <ContactPage />
        <Footer />
      </>
    }
  />,
  <Route
    key="/admin"
    path="/admin"
    element={
      user?.email === ADMIN_EMAIL ? (
        <>
          <Header />
          {/* Այս էջում **SecretRedirect** հատուկ պետք չի, բայց կարող ես ավելացնել եթե ցանկանաս */}
          <AdminPanelFirebase />
        </>
      ) : (
        <>
          <Header />
          <LoginForm />
          <Footer />
        </>
      )
    }
  />,
  <Route key="*" path="*" element={<Navigate to="/" />} />,
];
