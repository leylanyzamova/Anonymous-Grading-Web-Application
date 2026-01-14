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

    const users = await getUsers();
    const exists = users.find((u) => u.UserName === UserName);

    if (exists) {
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
    console.error(err);
    return res.status(500).json({ message: "Signup failed" });
  }
});

/* ======================
   LOGIN
====================== */
userRouter.post("/user/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = await getUsers();
    const user = users.find((u) => u.UserName === username);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.Password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      UserID: user.UserID,
      UserType: user.UserType,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed" });
  }
});

/* ======================
   BASIC CRUD (EXISTING)
====================== */

// CREATE (legacy)
userRouter.post("/user", async (req, res) => {
  return res.status(201).json(await createUser(req.body));
});

// READ ALL
userRouter.get("/users", async (req, res) => {
  return res.json(await getUsers());
});

// READ ONE
userRouter.get("/user/:id", async (req, res) => {
  return res.json(await getUserById(req.params.id));
});

// DELETE
userRouter.delete("/user/:id", async (req, res) => {
  return res.json(await deleteUser(req.params.id));
});

// UPDATE
userRouter.put("/user/:id", async (req, res) => {
  let ret = await updateUser(req.params.id, req.body);
  if (ret.error) {
    return res.status(400).json({ error: true, msg: ret.msg });
  } else {
    return res.status(200).json(ret.obj);
  }
});

export default userRouter;
