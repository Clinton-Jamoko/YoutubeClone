// models/mockUsersDb.js

let mockUsers = [];

// helper
const rand = (max) => Math.floor(Math.random() * max) + 1;

// Generate mock users (channels)
for (let i = 1; i <= 20; i++) {
  mockUsers.push({
    id: i,
    username: `user${i}`,
    email: `user${i}@example.com`,
    password: "hashed_password_here", // mock
    avatar: `https://i.pravatar.cc/100?u=user${i}`,
    subscribers: rand(50000),
    subscriptions: rand(100),
    joined: `${rand(5)} years ago`,
    bio: `This is channel ${i} sharing tech and creative content.`,
  });
}

const mockUsersDb = {
  query: async (sql, params = []) => {
    const q = sql.toLowerCase();

    // SELECT * FROM users
    if (q.startsWith("select") && !q.includes("where")) {
      return [mockUsers];
    }

    // SELECT * FROM users WHERE id = ?
    if (q.includes("where id = ?")) {
      const user = mockUsers.find((u) => u.id === Number(params[0]));
      return [[user]];
    }

    // SELECT * FROM users WHERE username = ?
    if (q.includes("where username = ?")) {
      const user = mockUsers.find((u) => u.username === params[0]);
      return [[user]];
    }

    // INSERT INTO users (...)
    if (q.startsWith("insert")) {
      const newUser = {
        id: mockUsers.length + 1,
        ...params[0],
      };
      mockUsers.push(newUser);
      return [{ insertId: newUser.id }];
    }

    // UPDATE users SET ... WHERE id = ?
    if (q.startsWith("update")) {
      const userId = params[1];
      const updates = params[0];

      const user = mockUsers.find((u) => u.id === userId);
      if (!user) return [{}];

      Object.assign(user, updates);
      return [{}];
    }

    return [[]];
  },
};

module.exports = mockUsersDb;
