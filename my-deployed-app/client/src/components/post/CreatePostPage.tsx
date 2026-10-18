import { API_BASE_URL } from "../../api";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/CreatePost.css";
import { useAuth } from "../../context/auth-context";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const navigator = useNavigate();
  const { logout } = useAuth();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(`${API_BASE_URL}/api/posts`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      setError(data.message);
      return;
    }

    navigator("/posts");
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
    <main className="create-page">
      <h1>Create Post</h1>
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
            onChange={(e) => imageHandler(e)}
          />
          {preview && (
            <img src={preview} alt="Selected image preview" width="300" />
          )}
        </div>

        <button type="submit">Create Post</button>
      </form>
    </main>
  );
}
