import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import LoginForm from "./login&register/LoginForm";
import RegisterForm from "./login&register/RegisterForm ";
import "../styles/App.css";
import HomePage from "./post/HomePage";
import CreatePostPage from "./post/CreatePostPage";
import SinglePostPage from "./post/SinglePostPage";
import EditPostPage from "./post/EditPostPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminPage from "./admin/AdminPage";
import DefaultPage from "./login&register/DefaultPage";

export default function App() {
  useEffect(() => {
    document.getElementById("initial-loader")?.remove();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/posts" element={<HomePage />} />
        <Route
          path="/posts/create"
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          }
        />
        <Route path="/posts/:id" element={<SinglePostPage />} />
        <Route
          path="/posts/:id/edit"
          element={
            <ProtectedRoute>
              <EditPostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
