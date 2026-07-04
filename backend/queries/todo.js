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

const markAsComplete = async (req , res) => {
     try {
        const userId = req.user.userId ; 
        const {id} = req.params
        const {is_completed } = req.body ; 
        const result = await pool.query('UPDATE todos SET is_completed=$1 WHERE id = $2 AND user_id = $3 RETURNING * ' , [!is_completed , id , userId]) ; 
        if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Todo item not found or unauthorized' });
         }

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
        const userId = req.user.userId; 
        const { category, is_completed } = req.query; 

        let queryText = 'SELECT * FROM todos WHERE user_id = $1';
        let queryParams = [userId];

        if (category && typeof category === 'string' && category.trim() !== '') {
            queryParams.push(category);
            queryText += ` AND category = $${queryParams.length}`;
        }

        if (is_completed !== undefined && is_completed !== null && is_completed !== '') {
            queryParams.push(is_completed === 'true'); 
            queryText += ` AND is_completed = $${queryParams.length}`;
        }

        queryText += ' ORDER BY created_at DESC';

        const result = await pool.query(queryText, queryParams);
        res.status(200).json({ result : result.rows });

    } catch(err) {
        handleDbError(err , res);
    }
};

module.exports = {createTodo , updateTodo , deleteTodo , getTodo , markAsComplete}