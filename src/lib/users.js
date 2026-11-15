// Demo staff accounts. Passwords are bcrypt hashes (never plaintext).
//   Admin:  admin@medicare.hospital  / admin123
//   Doctor: doctor@medicare.hospital / doctor123
// Change these before giving the site to a real hospital, and set
// JWT_SECRET in .env.local. In production these users live in the database.

export const users = [
  {
    email: "admin@medicare.hospital",
    name: "Dr. Johnson",
    role: "admin",
    passwordHash: "$2b$10$d3zU21O9YU17JmHnHmqyPenFM9P1MDiZFyLLbnIj18nxZvpnaD.im",
  },
  {
    email: "doctor@medicare.hospital",
    name: "Dr. James Wilson",
    role: "doctor",
    passwordHash: "$2b$10$9jF2d7/6Zi8F3WUc6dTqrOTFtKdfRSN52jf5sL6OlwbwUov8lobO6",
  },
];

export function findUser(email) {
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null;
}
