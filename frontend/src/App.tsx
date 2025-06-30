// import { useState } from 'react'
// import { Route } from "react-router-dom"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WelcomePage from "./pages/WelcomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import { AuthProvider } from "./contexts/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import RecipeList from "./pages/RecipeList";
import RecipeAdd from "./pages/RecipeAdd";
import { Toaster } from "sonner";
import Fridge from "./pages/Fridge";
import GroceryPlan from "./pages/GroceryPlan";

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
            <Route index element={<RecipeList />} />
            <Route path="add-a-recipe" element={<RecipeAdd />} />
          </Route>
          <Route path="/fridge" element={<Fridge />} />
          <Route path="/grocery">
            <Route index element={<Navigate to="plan-meals" replace />} />
            <Route path="plan-meals" element={<GroceryPlan />} />
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
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
