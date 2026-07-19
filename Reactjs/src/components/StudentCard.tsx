import { memo } from "react";
import { Link } from "react-router-dom";
import type { Student } from "../types/types";

interface StudentCardProps extends Student {
  onDelete: (id: number) => void;
}

function StudentCard({ id, name, role, avatar, onDelete }: StudentCardProps) {
  return (
    <div className="card">
      <img src={avatar} alt="Student avatar" className="card__image" />
      <div className="card__body">
        <h3 className="card__name">{name}</h3>
        <p className="card__role">{role}</p>
      </div>
      <div className="card__footer">
        <Link to={`/students/${id}`} className="btn">
          View Profile
        </Link>
        <button type="button" className="btn btn--delete" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default memo(StudentCard);
