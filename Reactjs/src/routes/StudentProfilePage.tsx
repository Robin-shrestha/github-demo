import { Link, useNavigate, useParams } from "react-router-dom";
import useStudent from "../hooks/useStudent";

function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const state = useStudent(id);

  if (state.status === "loading") {
    return <p className="status-message">Loading student...</p>;
  }

  if (state.status === "not-found") {
    return (
      <div className="status-message">
        <p>No student found with id "{id}".</p>
        <Link to="/">Back to all students</Link>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <p className="status-message status-message--error">Could not load student: {state.error}</p>
    );
  }

  const { student } = state;

  return (
    <div className="card card--profile">
      <img src={student.avatar} alt="Student avatar" className="card__image" />
      <div className="card__body">
        <h2 className="card__name">{student.name}</h2>
        <p className="card__role">{student.role}</p>
      </div>
      <button type="button" className="btn" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}

export default StudentProfilePage;
