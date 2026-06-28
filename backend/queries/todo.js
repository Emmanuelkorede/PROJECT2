const pool = require('../db') ;
const handleDbError = require('../middleware/dberror') ; 

const createTodo = async (req , res) => {
    try {
        const userId = req.user.userId ; 
        const {title , content , category} = req.body ; 
        const result = await pool.query('INSERT INTO todos (title , content , category , user_id) VALUES ($1 , $2 , $3 , $4)  RETURNING * ' , [title , content , category , userId ]) ; 
        res.status(201).json({message : 'Todo inserted succesfully ' , result :result.rows[0]})

    } catch(err ) {
        handleDbError(err , res)
    }
}

const updateTodo = async (req , res) => {
     try {
        const userId = req.user.userId ; 
        const {id} = req.params
        const {title , content , is_completed } = req.body ; 
        const result = await pool.query('UPDATE todos SET title =$1 ,content= $2 ,is_completed=$3 WHERE id = $4 AND user_id = $5 RETURNING * ' , [title , content , is_completed , id , userId]) ; 

        res.status(200).json({message : 'updated successfully ' , result : result.rows[0]})

     } catch(err ) {
        handleDbError(err , res)
    }
}

const deleteTodo = async (req , res) => {
        try {
        const userId = req.user.userId ; 
        const {id} = req.params ; 

        const result = await pool.query('DELETE FROM todos WHERE id = $1 AND user_id = $2' , [id, userId ]) ; 
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Todo not found or unauthorized' });
        }
        res.status(200).json({message : 'Todo deleted succesfully ' })

    } catch(err ) {
        handleDbError(err , res)
    }
}

const getTodo = async (req , res) => {
    try {
        const userId = req.user.userId ; 
        const {category , is_completed} = req.query ; 
        let result  ;

        if(category) {
            result = await pool.query('SELECT * FROM todos WHERE category = $1 AND user_id = $2 ORDER BY created_at DESC' , [category , userId]) ; 
        } else if (is_completed) {
        result = await pool.query('SELECT * FROM todos WHERE is_completed = $1 AND user_id = $2 ORDER created_at BY DESC' , [is_completed , userId]) ; 
        } else {
            result = await pool.query('SELECT * FROM todos WHERE user_id = $1' , [userId])
        }

        res.status(200).json({result : result.rows  })

    } catch(err ) {
        handleDbError(err , res)
    }
}

module.exports = {createTodo , updateTodo , deleteTodo , getTodo}