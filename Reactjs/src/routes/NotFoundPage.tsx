import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="status-message">
      <p>Page not found.</p>
      <Link to="/">Back to all students</Link>
    </div>
  );
}

export default NotFoundPage;
