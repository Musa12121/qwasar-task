import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SinglePostPage() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const parsedId = parseInt(id);

  useEffect(() => {
    setLoading(true);
    setError('')
    const main = async () => {
      try {
        const response = await fetch(
          `http://localhost:5500/api/posts/${parsedId}`,
        );
        const data = await response.json();
        if (!response.ok) {
          setLoading(false);
          setError(data.message);
          return;
        }
        setLoading(false);
        setData(data);
      } catch {
        setError("Failed to load post. Please try again.");
        setLoading(false);
      }
    };
    main();
  }, [parsedId]);
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading && <p>Loading post...</p>}

      {!loading && error && <p>{error}</p>}

      {!loading && !error && !data && <p>Post not found.</p>}

      {data && (
        <article className="post-card" style={{ maxWidth: "350px" }}>
          {data.imageUrl && (
            <img
              className="post-image"
              src={`http://localhost:5500${data.imageUrl}`}
              alt={data.title}
            />
          )}

          <div className="post-card-content">
            <h2 className="post-title">{data.title}</h2>

            <p className="post-excerpt">{data.content}</p>

            <div className="post-meta">
              <span>By {data.author.username}</span>

              <span>{new Date(data.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
