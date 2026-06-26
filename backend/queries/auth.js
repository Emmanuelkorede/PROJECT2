const pool = require('../db') ;
const handleDbError = require('../middleware/dberror')
const bcrypt = require('bcrypt') ; 
const jwt = require('jsonwebtoken') ; 

const getUserByemail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1' , [email]) ; 
    return result.rows ; 
}

const createUser = (req , res) => {
    try {
        const {name , email , password } = req.body ; 
        const hashedPassword  = await bcrypt.hash(password ,10) ; 
        const result = await pool.query('INSERT INTO users (name , email , password) VALUES ($1 , $2 , $3) RETURNING *'[name , email , hashedPassword]) ;
        res.status(201).json({message : 'user created successfully' , result : result.rows})
    }catch(err) {
        handleDbError(err , res)
    }

}