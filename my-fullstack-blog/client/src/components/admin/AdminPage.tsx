import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import DeleteConfirmation from "../post/DeleteConfirmation";
import { useNavigate } from "react-router-dom";
import '../../styles/AdminPage.css'
import Spinner from "../Spinner";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useContext(AuthContext);
  const navigator = useNavigate();

  async function getPosts() {
    const postsResponse = await fetch("http://localhost:5500/api/admin/posts", {
      credentials: "include",
    });

    const postsData = await postsResponse.json();

    if (postsResponse.ok) {
      setPosts(postsData);
    }
  }

  async function togglePublished(id: number) {
    setError("");
    const response = await fetch(
      `http://localhost:5500/api/admin/posts/${id}/published`,
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

    getPosts();
  }

  useEffect(() => {
    setLoading(true);
    async function getUsers() {
      const response = await fetch("http://localhost:5500/api/admin/users", {
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
