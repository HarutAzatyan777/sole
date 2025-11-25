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
import SecretRedirect from "./components/SecretRedirect";
import ExchangeRatePage from "./pages/ExchangeRate/ExchangeRate";
import GoldCalculator from "./pages/GoldCalculator/GoldCalculator";

// BLOG IMPORTS
import BlogAdmin from "./components/BlogAdmin/BlogAdmin";
import BlogPublic from "./components/BlogPublic/BlogPublic";
import BlogPost from "./components/BlogPublic/BlogPost";

const ADMIN_EMAIL = "admin@solejewelry.com";

export const getRoutes = (user) => [
  <Route
    key="/"
    path="/"
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

  // -------------------------
  // 📌 ADMIN PANEL (MAIN)
  // -------------------------
  <Route
    key="/admin"
    path="/admin"
    element={
      user?.email === ADMIN_EMAIL ? (
        <>
          <Header />
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

  // -------------------------
  // 📌 BLOG ADMIN (secured)
  // -------------------------
  <Route
    key="/admin-blog"
    path="/admin-blog"
    element={
      user?.email === ADMIN_EMAIL ? (
        <>
          <Header />
          <BlogAdmin />
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

  // -------------------------
  // 📌 PUBLIC BLOG
  // -------------------------
  <Route
    key="/blog"
    path="/blog"
    element={
      <>
        <Header />
        <BlogPublic />
        <Footer />
      </>
    }
  />,

  <Route
  key="/blog-post"
  path="/blog/:slug"
  element={
    <>
      <Header />
      <BlogPost />
      <Footer />
    </>
  }
/>,

  <Route key="*" path="*" element={<Navigate to="/" />} />,
];
