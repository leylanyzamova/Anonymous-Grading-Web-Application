import express from "express";
import bcrypt from "bcryptjs";

import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
} from "../DataAccess/UserDA.js";

const userRouter = express.Router();

/* ======================
   SIGN UP
====================== */
userRouter.post("/user/signup", async (req, res) => {
  try {
    const { Email, UserName, Password, UserType } = req.body;

    if (!Email || !UserName || !Password || !UserType) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // ✅ DO NOT load all users – query properly
    const existingUser = await getUserById({ UserName });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = await createUser({
      Email,
      UserName,
      Password: hashedPassword,
      UserType,
    });

    return res.status(201).json({
      UserID: newUser.UserID,
      UserType: newUser.UserType,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
});

/* ======================
   LOGIN
====================== */
userRouter.post("/user/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    // ✅ DO NOT fetch all users
    const user = await getUserById({ UserName: username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.Password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      UserID: user.UserID,
      UserType: user.UserType,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

/* ======================
   BASIC CRUD
====================== */

userRouter.post("/user", async (req, res) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json(user);
  } catch (err) {
    console.error("Create user failed:", err);
    return res.status(500).json({ error: "DB error" });
  }
});

userRouter.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (err) {
    console.error("GET /users failed:", err);
    return res.status(500).json({ error: "DB error" });
  }
});

userRouter.get("/user/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "DB error" });
  }
});

userRouter.delete("/user/:id", async (req, res) => {
  try {
    await deleteUser(req.params.id);
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: "DB error" });
  }
});

userRouter.put("/user/:id", async (req, res) => {
  try {
    const ret = await updateUser(req.params.id, req.body);
    if (ret.error) {
      return res.status(400).json({ error: true, msg: ret.msg });
    }
    return res.status(200).json(ret.obj);
  } catch (err) {
    return res.status(500).json({ error: "DB error" });
  }
});

export default userRouter;
