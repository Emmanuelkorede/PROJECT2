const express = require('express') ;
const router = express.Router() ;
const validate = require('../middleware/validate')  ;
const {createUser , getUserByemail , login} = require('../queries/auth')

const createUserRules = [
    { field : 'name',  required : true , type : 'string'  }, 
    { field : 'email',      required : true , type : 'string' }, 
    { field : 'password',   required : true , type : 'string', minLength : 3, maxLength : 50 },
]

const loginRules = [
    { field : 'email',      required : true , type : 'string' }, 
    { field : 'password',   required : true , type : 'string', minLength : 3, maxLength : 50 },
]


router.post('/register' , validate(createUserRules)  , createUser)
router.post('/user' , getUserByemail) ;
router.post('/login' , validate(loginRules) ,login)

module.exports = router ; 