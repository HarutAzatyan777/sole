import React from "react";
import { Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import MenuPage from "./components/JewelleryMenuPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import AdminPanelFirebase from "./components/AdminPanelFirebase";
import LoginForm from "./components/LoginForm";
import DiamondHierarchy from "./pages/DiamondHierarchy/DiamondHierarchy";

const ADMIN_EMAIL = "admin@solejewelry.com";

export const getRoutes = (user) => [
  <Route
    key="/"
    path="/"
    element={
      <>
        <Header />
        <MenuPage />
      </>
    }
  />,
  <Route
    key="/menu"
    path="/menu"
    element={
      <>
        <Header />
        <MenuPage />
      </>
    }
  />,
  <Route
    key="/about"
    path="/about"
    element={
      <>
        <Header />
        <AboutPage />
      </>
    }
  />,
  <Route
  key="/diamond-hierarchy"
  path="/diamond-hierarchy"
  element={
    <>
      <Header />
      <DiamondHierarchy />
    </>
  }
/>,
  <Route
    key="/contact"
    path="/contact"
    element={
      <>
        <Header />
        <ContactPage />
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
          <AdminPanelFirebase />
        </>
      ) : (
        <>
          <Header />
          <LoginForm />
        </>
      )
    }
  />,
  <Route key="*" path="*" element={<Navigate to="/" />} />,
];
