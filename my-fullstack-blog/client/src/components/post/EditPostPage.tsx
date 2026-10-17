import { API_BASE_URL } from "../../api";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/EditPostPage.css";
import { useAuth } from "../../context/auth-context";

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    async function getPost() {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`,{ credentials: "include" });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setError("");
      setTitle(data.title);
      setContent(data.content);
    }

    getPost();
  }, [id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    if (response.status===401) {
      logout();
      return;
    }

    if (!response.ok) {
      setError(data.message);
      return;
    }

    navigate("/posts");
  }

  function imageHandler(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
    return;
  }

  return (
    <main className="edit-page">
      <h1>Edit Post</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="content">Content</label>

          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Image</label>

          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              imageHandler(e);
            }}
          />
          {preview && (
            <img src={preview} alt="Selected image preview" width="300" />
          )}
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </main>
  );
}
