const express = require("express")
const md5 = require("md5")
const login = express()

login.use(express.json())
const jwt = require("jsonwebtoken")
const secretKey = "aryamaulanalatanzana04"

const models = require("../models/index")
const user = models.users;

login.post('/', async (request, response) => {

    let newLogin = {
        username: request.body.username,
        password: md5(request.body.password)
    }

    let dataUser = await user.findOne({
        where: newLogin
    });

    if(dataUser){
        let payload = JSON.stringify(dataUser)
        let token = jwt.sign(payload, secretKey)
        return response.json({
            logged: true,
            token: token
        })
    }
    else {
        return response.json({
            logged: false,
            message: 'Invalid username or password'
        })
    }
})

//auth is used for sended token verification
const auth = (request, response, next) => {
    
    //get authorization's data
    let header = request.headers.authorization
    //header = Bearer *token*
    
    //get token's data
    let token = header && header.split(" ")[1]

    if (token == null) {
        /* if token is empty we can't access the 
        endpoint beacause the user is unauthorized 
        with empty token */
        return response.status(401).json({
            message: 'Unauthorized'
        })
    }
    else {
        let jwtHeader = {
            algorithm: "HS256"
        }

        //given token's verification
        jwt.verify(token, secretKey, jwtHeader, error => {
            if (error) {
                return response.status(401).json({
                    message: 'Invalid Token'
                })
            }
            else {
                next()
            }
        })
    }
}

module.exports = { login, auth }