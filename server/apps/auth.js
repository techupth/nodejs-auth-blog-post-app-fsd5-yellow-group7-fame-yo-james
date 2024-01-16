import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db.js';

const coll = db.collection('users');

const authRouter = Router();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post('/register', async (req, res, next) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  user.password = await hashPassword(user.password);

  try {
    await coll.insertOne(user);
    res.json({ message: 'User has been created successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้

authRouter.post('/login', async (req, res) => {
  let user;
  try {
    user = await coll.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);

  if (!isValidPassword) {
    return res.status(400).json({ message: 'Invalid username or password.' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: '900000',
    },
  );

  return res.json({
    message: 'success',
    token,
  });
});

export default authRouter;
