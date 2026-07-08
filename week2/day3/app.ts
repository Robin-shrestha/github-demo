// DOM Selection

const form = document.querySelector<HTMLFormElement>("#student-form")!;
const nameInput = document.querySelector<HTMLInputElement>("#student-name")!;
const roleInput = document.querySelector<HTMLInputElement>("#student-role")!;
const cardsContainer =
  document.querySelector<HTMLDivElement>("#cards-container")!;
const statusEl = document.querySelector<HTMLParagraphElement>("#status")!;

// Types

interface Student {
  id: number;
  name: string;
  role: string;
  avatar: string;
  highlighted: boolean;
}

type StudentRecord = Omit<Student, "highlighted">;
type NewStudentInput = Omit<StudentRecord, "id">;

// State

let students: Student[] = [];

// Fetching Initial Data

// Replace with your instructor's local network IP on the day, e.g. http://192.168.1.42:3000/students
const API_URL = "http://0.0.0.0:3000/students";

async function loadStudents(): Promise<void> {
  statusEl.textContent = "Loading students...";
  statusEl.classList.remove("status--error");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data: StudentRecord[] = await response.json();
    students = data.map((student) => ({ ...student, highlighted: false }));
    statusEl.textContent = "";
    renderCards();
  } catch (error) {
    statusEl.textContent = `Could not load students: ${(error as Error).message}`;
    statusEl.classList.add("status--error");
  }
}

// Mutating the Server — Create & Delete

async function createStudentOnServer(
  input: NewStudentInput,
): Promise<StudentRecord> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

async function deleteStudentOnServer(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
}

// Creating Elements

function createCard(student: Student): HTMLElement {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = String(student.id);

  const image = document.createElement("img");
  image.className = "card__image";
  image.src = student.avatar;
  image.alt = student.name;

  const body = document.createElement("div");
  body.className = "card__body";

  const name = document.createElement("h3");
  name.className = "card__name";
  name.textContent = student.name;

  const role = document.createElement("p");
  role.className = "card__role";
  role.textContent = student.role;

  body.append(name, role);

  const footer = document.createElement("div");
  footer.className = "card__footer";

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "btn btn--toggle";
  toggleBtn.textContent = "Highlight";
  toggleBtn.type = "button";

  const removeBtn = document.createElement("button");
  removeBtn.className = "btn btn--remove";
  removeBtn.textContent = "Remove";
  removeBtn.type = "button";

  footer.append(toggleBtn, removeBtn);
  card.append(image, body, footer);

  if (student.highlighted) {
    card.classList.add("card--selected");
  }

  return card;
}

// Rendering / Updating

function renderCards(): void {
  cardsContainer.innerHTML = "";
  students.forEach((student) => {
    cardsContainer.append(createCard(student));
  });
}

loadStudents();

// Event Listener — Form Submit

form.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const selectedAvatar = form.querySelector<HTMLInputElement>(
    'input[name="avatar"]:checked',
  )!;

  const input: NewStudentInput = {
    name: nameInput.value,
    role: roleInput.value,
    avatar: selectedAvatar.value,
  };

  statusEl.textContent = "Adding student...";
  statusEl.classList.remove("status--error");

  try {
    const created = await createStudentOnServer(input);
    students.push({ ...created, highlighted: false });
    renderCards();
    form.reset();
    statusEl.textContent = "";
  } catch (error) {
    statusEl.textContent = `Could not add student: ${(error as Error).message}`;
    statusEl.classList.add("status--error");
  }
});

// Event Delegation — Toggle & Remove

cardsContainer.addEventListener("click", async (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const card = target.closest<HTMLElement>(".card");

  if (!card) return;

  const id = Number(card.dataset.id);

  if (target.classList.contains("btn--remove")) {
    statusEl.textContent = "Removing student...";
    statusEl.classList.remove("status--error");

    try {
      await deleteStudentOnServer(id);
      students = students.filter((student) => student.id !== id);
      renderCards();
      statusEl.textContent = "";
    } catch (error) {
      statusEl.textContent = `Could not remove student: ${(error as Error).message}`;
      statusEl.classList.add("status--error");
    }
    return;
  }

  if (target.classList.contains("btn--toggle")) {
    students = students.map((student) =>
      student.id === id
        ? { ...student, highlighted: !student.highlighted }
        : student,
    );
    renderCards();
  }
});
