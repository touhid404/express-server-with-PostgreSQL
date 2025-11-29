import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        age INT,
        phone VARCHAR(15),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS todo (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tables are ready");
  } catch (error) {
    console.error("DB Initialization Error:", error);
  }
};

initDB();

// Home Route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World No!");
});

// Test
app.post("/data", (req: Request, res: Response) => {
  console.log(req.body);
  res.status(201).json({ success: true, message: "Data received" });
});

// Create User
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, age, phone } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, age, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, age, phone]
    );

    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ➤ Get All Users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json({ success: true, users: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ➤ Get User by ID
app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
    });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
