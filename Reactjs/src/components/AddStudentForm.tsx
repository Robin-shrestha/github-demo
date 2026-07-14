import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import type { Student } from "../types/types";

const AVATAR_OPTIONS = [
  "https://i.pravatar.cc/300?img=1",
  "https://i.pravatar.cc/300?img=5",
  "https://i.pravatar.cc/300?img=12",
  "https://i.pravatar.cc/300?img=20",
  "https://i.pravatar.cc/300?img=32",
];

interface AddStudentFormProps {
  onAddStudent: (student: Omit<Student, "id">) => void;
}

function AddStudentForm({ onAddStudent }: AddStudentFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setavatarURl] = useState(AVATAR_OPTIONS[0]);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>): void {
    setName(event.target.value);
  }

  function handleRoleChange(event: ChangeEvent<HTMLInputElement>): void {
    setRole(event.target.value);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!name.trim()) return;

    onAddStudent({ name, role: role || "Unassigned", avatar: avatar });

    setName("");
    setRole("");
    setavatarURl(AVATAR_OPTIONS[0]);
  }

  return (
    <form className="add-student-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input type="text" placeholder="Name" value={name} onChange={handleNameChange} required />
        <input type="text" placeholder="Role" value={role} onChange={handleRoleChange} />
      </div>

      <fieldset className="avatar-picker">
        <legend>Choose an avatar</legend>
        {AVATAR_OPTIONS.map((url) => (
          <label className="avatar-option" key={url}>
            <input
              type="radio"
              name="avatar"
              value={url}
              checked={avatar === url}
              onChange={() => setavatarURl(url)}
            />
            <img src={url} alt="Avatar option" />
          </label>
        ))}
      </fieldset>

      <button type="submit" className="btn btn--submit">
        Add Student
      </button>
    </form>
  );
}

export default AddStudentForm;
