import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm ";
import "./App.css";
import HomePage from "./HomePage";
import CreatePostPage from "./CreatePostPage";
import SinglePostPage from "./SinglePostPage";
import EditPostPage from "./EditPostPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminPage from "./AdminPage";
import DefaultPage from "./DefaultPage";

export default function App() {
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
