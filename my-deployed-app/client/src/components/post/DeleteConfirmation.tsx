import { API_BASE_URL } from "../../api";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useAuth } from "../../context/auth-context";
import type { Post } from "../../types";

export default function DeleteConfirmation({
  id,
  setPostList,
}: {
  id: number;
  setPostList: Dispatch<SetStateAction<Post[]>>;
}) {
  const { logout } = useAuth();
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      const data = await response.json();
      setError(data.message);
      return;
    }

    setPostList((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <>
      <button className="delete-button" onClick={handleDelete}>
        Delete Post
      </button>
      {error && <p className="error-message">{error}</p>}
    </>
  );
}
