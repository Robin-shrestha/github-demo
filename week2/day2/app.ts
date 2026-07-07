// DOM Selection

document
  .getElementById("grandparent")
  ?.addEventListener("click", () => console.log("grandparent"));
document.getElementById("parent")?.addEventListener("click", (e) => {
  return console.log("parent");
});
document.getElementById("child")?.addEventListener("click", (e) => {
  e.stopPropagation();
  return console.log("child");
});

const form = document.querySelector<HTMLFormElement>("#student-form")!;
const form2 = document.querySelector<HTMLFormElement>("#student-form2")!;
const nameInput = document.querySelector<HTMLInputElement>("#student-name")!;
const roleInput = document.querySelector<HTMLInputElement>("#student-role")!;
const cardsContainer =
  document.querySelector<HTMLDivElement>("#cards-container")!;

// Types

interface Student {
  id: number;
  name: string;
  role: string;
  avatar: string;
  highlighted: boolean;
}

// State

let students: Student[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Frontend",
    avatar: "https://i.pravatar.cc/150?img=1",
    highlighted: false,
  },
  {
    id: 2,
    name: "Priya Thapa",
    role: "Backend",
    avatar: "https://i.pravatar.cc/150?img=5",
    highlighted: false,
  },
  {
    id: 3,
    name: "Bikash Rai",
    role: "Fullstack",
    avatar: "https://i.pravatar.cc/150?img=12",
    highlighted: false,
  },
];

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

  const removeBtn = document.createElement("button");
  removeBtn.className = "btn btn--remove";
  removeBtn.textContent = "Remove";

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

renderCards();

// Event Listener — Form Submit
form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();

  console.log("🚀 ~ nameInput:", nameInput);

  const selectedAvatar = form.querySelector<HTMLInputElement>(
    'input[name="avatar"]:checked',
  )!;

  const newStudent: Student = {
    id: Date.now(),
    name: nameInput.value,
    role: roleInput.value,
    avatar: selectedAvatar.value,
    highlighted: false,
  };

  students.push(newStudent);
  renderCards();
  form.reset();
});

const customEvent = new CustomEvent("test", {
  detail: {
    name: "cat",
  },
});

cardsContainer.addEventListener("test", (e) => console.log("custom event", e));

form.addEventListener("click", () => {
  console.log("here");

  cardsContainer.dispatchEvent(customEvent);
});

cardsContainer.dispatchEvent(customEvent);

// Event Delegation — Toggle & Remove
cardsContainer.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  console.log("🚀 ~ target:", target);
  const card = target.closest<HTMLElement>(".card");

  console.log("🚀 ~ card:", card);
  if (!card) return;

  const id = Number(card.dataset.id);

  if (target.classList.contains("btn--remove")) {
    students = students.filter((student) => student.id !== id);
    renderCards();
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
