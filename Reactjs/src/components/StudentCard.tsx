import type { Student } from "../types/types";

interface StudentCardProps extends Student {
  onViewProfile: (id: number) => void;
}

function StudentCard({ id, name, role, avatarUrl, onViewProfile }: StudentCardProps) {
  return (
    <div className="card">
      <img src={avatarUrl} alt="Student avatar" className="card__image" />
      <div className="card__body">
        <h3 className="card__name">{name}</h3>
        <p className="card__role">{role}</p>
      </div>
      <div className="card__footer">
        <button type="button" className="btn" onClick={() => onViewProfile(id)}>
          View Profile
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
