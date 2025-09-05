// import { useState } from 'react'
// import { Route } from "react-router-dom"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import RecipeAdd from "./pages/RecipeAdd";
import { Toaster } from "sonner";
import Fridge from "./pages/Fridge";
import GroceryPlan from "./pages/GroceryPlan";
import RecipeView from "./pages/RecipeView";
import PublicOnlyRoute from "./components/route/PublicOnlyRoute";
import ProtectedRoute from "./components/route/ProtectedRoute";
import Introduction from "./pages/docs/Introduction";
import RecipeDocs from "./pages/docs/RecipeDocs";
import ScrollToTop from "./components/ScrollToTop";
import FridgeDocs from "./pages/docs/FridgeDocs";
import GroceryDocs from "./pages/docs/GroceryDocs";
import PublicDocsLayout from "./layouts/PublicDocsLayout";
import PublicNavBarLayout from "./layouts/PublicNavBarLayout";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<PublicNavBarLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {!isLoading && !isAuthenticated && (
            <Route path="/docs" element={<PublicDocsLayout />}>
              <Route index element={<Navigate to="introduction" replace />} />
              <Route path="introduction" element={<Introduction />} />
              <Route path="recipe" element={<RecipeDocs />} />
              <Route path="fridge" element={<FridgeDocs />} />
              <Route path="grocery" element={<GroceryDocs />} />
            </Route>
          )}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/recipes">
            <Route index element={<RecipeView />} />
            <Route path="add-a-recipe" element={<RecipeAdd />} />
          </Route>
          <Route path="/fridge" element={<Fridge />} />
          <Route path="/grocery">
            <Route index element={<Navigate to="plan-meals" replace />} />
            <Route path="plan-meals" element={<GroceryPlan />} />
          </Route>
          {!isLoading && isAuthenticated && (
            <Route path="/docs">
              <Route index element={<Navigate to="introduction" replace />} />
              <Route path="introduction" element={<Introduction />} />
              <Route path="recipe" element={<RecipeDocs />} />
              <Route path="fridge" element={<FridgeDocs />} />
              <Route path="grocery" element={<GroceryDocs />} />
            </Route>
          )}
        </Route>
      </Route>
    </Routes>
  );
};

function ToasterWrapper() {
  const { theme } = useTheme();
  return <Toaster position="top-center" theme={theme} />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider>
          <ToasterWrapper />
          <AuthProvider>
            <ScrollToTop />
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
