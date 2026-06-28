const express = require('express') ;
const router = express.Router() ;
const validate = require('../middleware/validate')  ;
const authMiddleware = require('../middleware/auth') ; 
const {createTodo , updateTodo ,  deleteTodo , getTodo} = require('../queries/todo') ;

const createRules = [
    { field : 'title',  required : true , type : 'string'  }, 
    { field : 'content',       type : 'string' }, 
    { field : 'category',   required : true , type : 'string', minLength : 3, maxLength : 50 },
]

const updateRules = [
    { field : 'title',   type : 'string'  }, 
    { field : 'content',     type : 'string' }, 
    { field : 'is_completed',   required : true , type : 'boolean', },

]

router.post('/'  ,authMiddleware , validate(createRules) , createTodo)
router.put('/:id' ,authMiddleware , validate(updateRules) , updateTodo) ;
router.delete('/:id' , authMiddleware ,deleteTodo) ;
router.get('/' , authMiddleware  , getTodo)

module.exports = router ;