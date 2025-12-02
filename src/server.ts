import express, { Request, Response } from "express";
import config from "./config";
import { initDB, pool } from "./config/db";
import logger from "./middleware/logger";
import { usersRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";


const app = express();

// Middleware
app.use(express.json());



initDB();



// Home Route
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello World No!");
});




// User CRUD Routes
app.use('/users',usersRoutes);
app.use('/auth',authRoutes);
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
