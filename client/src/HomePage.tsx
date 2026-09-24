import { useContext, useEffect, useState } from "react";
import "./HomePage.css";
import DeleteConfirmation from "./DeleteConfirmation";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Navbar from "./Navbar";

export default function HomePage() {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useContext(AuthContext);
  const navigator = useNavigate();
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("http://localhost:5500/api/posts")
      .then((response) => {if(response.ok){return response.json()}throw new Error("Failed to load posts. Please try again.")})
      .then((data) => {
        setPostList(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="home-page">
      <div className="posts-container">
        <Navbar user={user} />
        <div className="posts-header">
          <h1 className="page-title">Latest Posts</h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: "35px",
            }}
          >
            {user && (
              <NavLink
                style={{ fontSize: "20px" }}
                to="/posts/create"
                className="create-post-button"
              >
                Create Post
              </NavLink>
            )}
          </div>
        </div>
        {loading && <p>Loading posts...</p>}

        {!loading && error && <p>{error}</p>}

        {!loading && !error && postList.length === 0 && (
          <p>No posts available.</p>
        )}
        <div className="posts-grid">
          {postList.map((post) => (
            <article className="post-card" key={post.id}>
              {post.imageUrl && (
                <img
                  className="post-image"
                  src={`http://localhost:5500${post.imageUrl}`}
                  alt={post.title}
                />
              )}

              <div className="post-card-content">
                <h2
                  className="post-title"
                  onClick={() => navigator(`/posts/${post.id}`)}
                >
                  {post.title}
                </h2>

                <p className="post-excerpt">{post.content}</p>

                <div className="post-meta">
                  <span>By {post.user.username}</span>

                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="post-actions">
                  <Link to={`/posts/${post.id}/edit`} className="edit-button">
                    Edit
                  </Link>
                  <DeleteConfirmation setPostList={setPostList} id={post.id} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
