// async/await

export {};

interface User {
  id: number;
  name: string;
}

function fetchUserPromise(id: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: "Aarav Sharma" }), 2000);
  });
}

function fetchPostsPromise(userId: number): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(["Post 1", "Post 2"]), 2000);
  });
}

async function loadUserData(id: number): Promise<void> {
  try {
    console.log("first fn called");
    const user = await fetchUserPromise(id); //2s
    const posts = await fetchPostsPromise(1); //2s
    console.log(user, posts);
  } catch (error) {
    console.log((error as Error).message);
  } finally {
    console.log("finally always runs");
  }
}

loadUserData(1);

// Error Handling

function fetchWillFail(): Promise<never> {
  return new Promise((_resolve, reject) => {
    setTimeout(() => reject(new Error("network error")), 200);
  });
}

async function loadWithFailure(): Promise<void> {
  console.log("second fn called fn called");
  try {
    await fetchWillFail();
  } catch (error) {
    console.log((error as Error).message);
  }
}

loadWithFailure();
