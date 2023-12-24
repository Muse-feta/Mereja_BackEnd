const express = require('express')
const cors = require('cors')
const app = express();
const {connection} = require('./Config/db')
const { userTable } = require('./Model/model')
require('dotenv').config()
const PORT = process.env.PORT || 5000


// middleWares
app.use(express.json())
app.use(cors())

//userMiddleware
const userRouter = require('./Routes/userRoute');
app.use('/api/users', userRouter)


// dbConnection
const startApp = async (PORT) => {
    const startConnection = await connection.getConnection()
    console.log("Databse Connection Established")
    try {
        await connection.query(userTable)
        app.listen(PORT, () => {
            console.log(`srver listening on port ${PORT}`)
        })
    } catch (error) {
        console.log(error.message)
        connection.releaseConnection()
    }
}
startApp(PORT)

