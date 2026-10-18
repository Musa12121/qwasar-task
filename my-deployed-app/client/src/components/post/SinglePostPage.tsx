import { API_BASE_URL } from "../../api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../Spinner";
import type { Post } from "../../types";

export default function SinglePostPage() {
  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const parsedId = parseInt(id ?? "0");

  useEffect(() => {
    const main = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/posts/${parsedId}`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (!response.ok) {
          setLoading(false);
          setError(data.message);
          return;
        }
        setError("");
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
      {loading && <Spinner />}

      {!loading && error && <p>{error}</p>}

      {!loading && !error && !data && <p>Post not found.</p>}

      {data && (
        <article className="post-card" style={{ maxWidth: "350px" }}>
          <div className="card-content">
          {data.imageUrl && (
            <img
              className="post-image"
              src={`${API_BASE_URL}${data.imageUrl}`}
              alt={data.title}
            />
          )}

            <h2 className="post-title">{data.title}</h2>

            <p className="post-excerpt">{data.content}</p>

            <div className="post-meta">
              <span>By {data.author?.username}</span>

              <span>{new Date(data.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
