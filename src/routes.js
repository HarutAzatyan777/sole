import React from "react";
import { Route, Navigate } from "react-router-dom";
import MenuPage from "./components/JewelleryMenuPage";
import AdminPanelFirebase from "./components/AdminPanelFirebase";
import LoginForm from "./components/LoginForm";


const ADMIN_EMAIL = "admin@solejewelry.com";

export const getRoutes = (user) => [
  <Route key="/" path="/" element={<MenuPage />} />,
  <Route
    key="/admin"
    path="/admin"
    element={
      user?.email === ADMIN_EMAIL ? (
        <AdminPanelFirebase />
      ) : (
        <LoginForm />
      )
    }
  />,
  <Route key="*" path="*" element={<Navigate to="/" />} />,
];
