import express, { Request, Response } from "express";
import config from "./config";
import { initDB, pool } from "./config/db";


const app = express();

// Middleware
app.use(express.json());



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

//  Get All Users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json({ success: true, users: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//  Get User by ID
app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

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

// Delete User by ID
app.delete("/user-delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
});

// update User by ID
app.put("/user-update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, age, phone } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, age=$3, phone=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 RETURNING *`,
      [name, email, age, phone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
    });
  }
});

app.use((req,res)=>{

  res.status(404).send({
    success:false,
    message:"Route not found"
  })

})

// Start Server
app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
