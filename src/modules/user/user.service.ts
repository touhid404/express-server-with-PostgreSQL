import { pool } from "../../config/db";


export const createUserInDB = async(name:string, email:string, age:number, phone:string)=>{
    const result = await pool.query(
      "INSERT INTO users (name, email, age, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, age, phone]
    );


    return result;

}