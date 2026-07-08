// Promise States

export {};

/**
 * promises have 3 states
 * 1) pending
 * 2) resolved(success)
 * 3) rejected
 */

// const willResolve = new Promise<string>((resolve) => {
//   setTimeout(() => resolve("done"), 2000);
// });

// const willReject = new Promise<string>((_resolve, reject) => {
//   setTimeout(() => reject(new Error("failed")), 2000);
// });

// willResolve.then((value) => console.log(value));
// willReject.catch((error) => console.log((error as Error).message));

// Chaining

interface User {
  id: number;
  name: string;
}

function fetchUserPromise(id: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: "Aarav Sharma" }), 200);
  });
}

function fetchPostsPromise(userId: number): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(["Post 1", "Post 2"]), 200);
  });
}

function fetchCommentsPromise(postId: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    // setTimeout(() => resolve(["Comment1 1", "Comment1 2"]), 200);
    reject(new Error("failed"));
  });
}

fetchUserPromise(1)
  .then((user) => {
    console.log(user);
    return fetchPostsPromise(user.id);
  })
  .then((posts) => {
    console.log(posts);
    return fetchCommentsPromise(1);
  })
  .then((comments) => console.log(comments))
  .catch((error) => console.log((error as Error).message))
  .finally(() => {
    console.log("this always runs");
  });
