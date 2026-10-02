import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function DeleteConfirmation({ id, setPostList }) {
  const { logout } = useContext(AuthContext);
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`http://localhost:5500/api/posts/${id}`, {
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
