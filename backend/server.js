const express  =  require('express') ;
const app = express()
const cors = require('cors') ;
require('dotenv').config() ;

const PORT = process.env.PORT || 6000 ; 
const {errorHandler} = require('./middleware/errorHandler')

app.use(express.json()) ;
app.use(cors()) ; 


app.use((req , res) => {
    console.log(`${req.method} , ${req.url} not found`)
})

app.use(errorHandler)

app.listen(PORT , () => {
    console.log(`server running at https://localhost:${PORT}/`)
})