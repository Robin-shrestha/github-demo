import { Link } from "react-router-dom";

function ForbiddenPage() {
  return (
    <div className="status-message">
      <p>You don't have permission to view this page.</p>
      <Link to="/">Back to all students</Link>
    </div>
  );
}

export default ForbiddenPage;
