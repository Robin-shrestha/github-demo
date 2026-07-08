// Callbacks

export {};

interface User {
  id: number;
  name: string;
}

function fetchUser(id: number, callback: (user: User) => void): void {
  setTimeout(() => {
    callback({ id, name: "Aarav Sharma" });
  }, 300);
}

fetchUser(1, (user) => {
  console.log(user);
});

// Callback Hell

function fetchUserCb(id: number, cb: (user: User) => void): void {
  setTimeout(() => cb({ id, name: "Aarav Sharma" }), 200);
}

function fetchPostsCb(userId: number, cb: (posts: string[]) => void): void {
  setTimeout(() => cb(["Post 1", "Post 2"]), 200);
}

function fetchCommentsCb(post: string, cb: (comments: string[]) => void): void {
  setTimeout(() => cb([`Comment on ${post}`]), 200);
}

fetchUserCb(1, (user) => {
  // additional logic

  fetchPostsCb(user.id, (posts) => {
    // additional logic
    fetchCommentsCb(posts[0], (comments) => {
      console.log(user, posts, comments);
    });
  });
});
