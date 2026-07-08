// GET

export {};

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function getTodo(): Promise<void> {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1",
    );
    console.log("🚀 ~ getTodo ~ response:", response);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data: Todo = await response.json();
    console.log(data);
  } catch (error) {
    console.log((error as Error).message);
  }
}

getTodo();

// POST

interface NewPost {
  title: string;
  body: string;
  userId: number;
}

async function createPost(post: NewPost): Promise<void> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log((error as Error).message);
  }
}

createPost({ title: "Hello", body: "World", userId: 1 });
