const pool = require('../db') ;
const handleDbError = require('../middleware/dberror')
const bcrypt = require('bcrypt') ; 
const jwt = require('jsonwebtoken') ; 

const getUserByemail = async (req , res) => {
    try {
        const {email} = req.body
        const result = await pool.query('SELECT * FROM users WHERE email = $1' , [email]) ; 
        res.status(200).json({result : result.rows[0] }) ; 

    } catch(err) {
        handleDbError(err ,res)
    }
}

const createUser = async (req , res) => {
    try {
        const {name , email , password } = req.body ; 
        const hashedPassword  = await bcrypt.hash(password ,10) ; 
        const result = await pool.query('INSERT INTO users (name , email , password) VALUES ($1 , $2 , $3) RETURNING *', [name , email , hashedPassword]) ;
        res.status(201).json({message : 'user created successfully' , result : result.rows})
    }catch(err) {
        handleDbError(err , res)
    }

}

const login =  async (req , res) => {
    try {

        const {email , password} = req.body ; 
        const result = await pool.query('SELECT * FROM users WHERE email = $1' , [email]) ;
        const user = result.rows[0]
        if (!user) return res.status(401).json({message : 'invalid Email or password'}) ;

        const validPassword = await bcrypt.compare(password , user.password) ;
        if (!validPassword) return res.status(401).json({message : 'invalid Email or password'}) ;

        const token = jwt.sign(
            {userId :user.id, userEmail :user.email } ,
            process.env.JWT_SECRET , 
            {expiresIn : process.env.JWT_EXPIRES_IN}
        )

        res.status(200).json({
            message : 'Login succesful' ,
            token ,
            user  : {
                id : user.id ,
                name : user.name ,
                email : user.email
            }
        })

    } catch(err) {
        handleDbError(err ,res)
    }
}

module.exports = {createUser , getUserByemail , login}