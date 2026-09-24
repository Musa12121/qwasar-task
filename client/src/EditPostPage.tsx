import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditPostPage.css";
import { AuthContext } from "./AuthContext";

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const {logout}=useContext(AuthContext)

  useEffect(() => {
    setError("");
    async function getPost() {
      const response = await fetch(`http://localhost:5500/api/posts/${id}`);

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setTitle(data.title);
      setContent(data.content);
    }

    getPost();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(`http://localhost:5500/api/posts/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
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

  function imageHandler(e) {
    if (e.target.files.length) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
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
