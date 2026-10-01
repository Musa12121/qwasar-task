import { useContext, useEffect, useState } from "react";
import "./HomePage.css";
import DeleteConfirmation from "./DeleteConfirmation";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

export default function HomePage() {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useContext(AuthContext);
  const navigator = useNavigate();
  useEffect(() => {
    setError("");
    fetch("http://localhost:5500/api/posts", { credentials: "include" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to load posts. Please try again.");
      })
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
        {loading && <Spinner />}

        {!loading && error && <p>{error}</p>}

        {!loading && !error && postList.length === 0 && (
          <p>No posts available.</p>
        )}
        {!loading && !error && postList.length > 0 && (
          <div className="posts-grid">
            {postList.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="card-content" onClick={() => navigator(`/posts/${post.id}`)}>
                  {post.imageUrl && (
                    <img
                      className="post-image"
                      src={`http://localhost:5500${post.imageUrl}`}
                      alt={post.title}
                    />
                  )}

                  <h2 className="post-title">{post.title}</h2>

                  <p className="post-excerpt">{post.content}</p>

                  <div className="post-meta">
                    <span>By {post.user.username}</span>

                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                  {user && user.id === post.authorId && (
                    <div className="post-actions">
                      <Link
                        to={`/posts/${post.id}/edit`}
                        className="edit-button"
                      >
                        Edit
                      </Link>
                      <DeleteConfirmation
                        setPostList={setPostList}
                        id={post.id}
                      />
                    </div>
                  )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
