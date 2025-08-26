// import { useState } from 'react'
// import { Route } from "react-router-dom"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WelcomePage from "./pages/WelcomePage";
import { AuthProvider } from "./contexts/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
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

const AppContent = () => {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
          <Route path="/docs">
            <Route index element={<Navigate to="introduction" replace />} />
            <Route path="introduction" element={<Introduction />} />
            <Route path="recipe" element={<RecipeDocs />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <ThemeProvider>
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
