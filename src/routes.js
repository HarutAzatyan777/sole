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
import MMToConverter from "./pages/MMToConverter/MMToConverter";
import MMToConverterEn from "./pages/MMToConverter/MMToConverterEn";
import JewelryPriceCalculator from "./pages/JewelryPriceCalculator/JewelryPriceCalculator";
import GoldPrice from "./components/GoldPrice/GoldPrice";
import JewelryMoodboard from "./pages/JewelryMoodboard/JewelryMoodboard";

const ADMIN_EMAIL = "admin@solejewelry.com";

const PageShell = ({ children, withSecretRedirect = true, withFooter = true }) => (
  <>
    <Header />
    {withSecretRedirect && <SecretRedirect />}
    {children}
    {withFooter && <Footer />}
  </>
);

export const getRoutes = (user) => [
  <Route
    key="/"
    path="/"
    element={
      <PageShell>
        <MenuPage />
      </PageShell>
    }
  />,

  <Route
    key="/exchange-rate"
    path="/exchange-rate"
    element={
      <PageShell>
        <ExchangeRatePage />
        <BlogPublic />
      </PageShell>
    }
  />,
  <Route
    key="/vosku-gine"
    path="/vosku-gine"
    element={
      <PageShell>
        <GoldPrice />
        <BlogPublic />
      </PageShell>
    }
  />,


  <Route
    key="/gold-calculator"
    path="/gold-calculator"
    element={
      <PageShell>
        <GoldCalculator />
      </PageShell>
    }
  />,
  <Route
  key="/diamont-mm-converter"
  path="/diamont-mm-converter"
  element={
    <PageShell>
      <MMToConverter />
    </PageShell>
  }
/>,
  <Route
  key="/diamont-mm-converter/en"
  path="/diamont-mm-converter/en"
  element={
    <PageShell>
      <MMToConverterEn />
    </PageShell>
  }
/>,

<Route
key="/jewelry-priceCalculator-calculator/en"
path="/jewelry-priceCalculator-calculator/en"
element={
  <PageShell>
    {/* <GoldPrice /> */}
    <JewelryPriceCalculator />
  </PageShell>
}
/>,

  <Route
    key="/menu"
    path="/menu"
    element={
      <PageShell>
        <MenuPage />
      </PageShell>
    }
  />,

  <Route
    key="/about"
    path="/about"
    element={
      <PageShell>
        <AboutPage />
      </PageShell>
    }
  />,

  <Route
    key="/diamond-info"
    path="/diamond-info"
    element={
      <PageShell>
        <DiamondInfoPage />
      </PageShell>
    }
  />,

  <Route
    key="/contact"
    path="/contact"
    element={
      <PageShell>
        <ContactPage />
      </PageShell>
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
        <PageShell withSecretRedirect={false} withFooter={false}>
          <AdminPanelFirebase />
        </PageShell>
      ) : (
        <PageShell withSecretRedirect={false}>
          <LoginForm />
        </PageShell>
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
        <PageShell withSecretRedirect={false} withFooter={false}>
          <BlogAdmin />
        </PageShell>
      ) : (
        <PageShell withSecretRedirect={false}>
          <LoginForm />
        </PageShell>
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
      <PageShell withSecretRedirect={false}>
        <BlogPublic />
      </PageShell>
    }
  />,
  <Route
  key="/jewelry-moodboard"
  path="/jewelry-moodboard"
  element={
    <PageShell withSecretRedirect={false}>
      <JewelryMoodboard />
    </PageShell>
  }
/>,

  <Route
  key="/blog-post"
  path="/blog/:slug"
  element={
    <PageShell withSecretRedirect={false}>
      <BlogPost />
    </PageShell>
  }
/>,


  <Route key="*" path="*" element={<Navigate to="/" />} />,
];
