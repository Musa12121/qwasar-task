import { API_BASE_URL } from "../../api";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth-context";
import type { Post, User } from "../../types";
import DeleteConfirmation from "../post/DeleteConfirmation";
import { useNavigate } from "react-router-dom";
import '../../styles/AdminPage.css'
import Spinner from "../Spinner";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigator = useNavigate();

  async function togglePublished(id: number) {
    setError("");
    const response = await fetch(
      `${API_BASE_URL}/api/admin/posts/${id}/published`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      const data = await response.json();
      setError(data.message);
      setLoading(false);
      return;
    }
    setLoading(false);

    const updatedPost = await response.json();
    setPosts((currentPosts) =>
      currentPosts.map((post) => (post.id === id ? updatedPost : post)),
    );
  }

  useEffect(() => {
    async function getPosts() {
      const response = await fetch(`${API_BASE_URL}/api/admin/posts`, {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      }
    }

    async function getUsers() {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);

      setUsers(data);
    }

    getUsers();
    getPosts();
  }, []);

  return (
    <main className="admin-page">
      <button className="back-button" onClick={() => navigator("/posts")}>
    ← Back to Posts
  </button>
      <h1>Admin Panel</h1>

      <section className="admin-section">
        <h2>Users</h2>

        <div className="admin-list">
          {users.map((user) => (
            <div className="admin-card" key={user.id}>
              <p>
                <strong>{user.username}</strong>
              </p>
              <p>{user.email}</p>
              <p className="admin-role">{user.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Posts</h2>

        {loading && <Spinner/>}
        {error && <p className="admin-error">{error}</p>}

        {!loading && !error && posts.length === 0 && <p>No posts found.</p>}

        <div className="admin-list">
          {posts.map((post) => (
            <div className="admin-card" key={post.id}>
              <h3>{post.title}</h3>

              <p className={post.published ? "published" : "unpublished"}>
                {post.published ? "Published" : "Unpublished"}
              </p>

              <div className="admin-actions">
                <button onClick={() => togglePublished(post.id)}>
                  {post.published ? "Unpublish" : "Publish"}
                </button>

                <button onClick={() => navigator(`/posts/${post.id}/edit`)}>
                  Edit
                </button>

                <DeleteConfirmation id={post.id} setPostList={setPosts} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
