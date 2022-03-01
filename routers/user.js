const { request, response } = require("express")
const express = require("express")
const app = express()
const md5 = require("md5")

app.use(express.json())

const models = require("../models/index")
const user = models.users

// authorization
const {auth} = require("./login")
app.use(auth)

app.get("/", async (request, response) => {
    let dataUser = await user.findAll()

    return response.json(dataUser)
})

//endpoint add new user
app.post("/", (request, response) => {
    let newUser = {
        name: request.body.name,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role
    }

    user.create(newUser)
    .then(result => {
        response.json({
            message: `Data Added Successfully`
        })
    })
    .catch(error => {
        response.json({
            message: error.message
        })
    })
})

//endpoint update user
app.put("/:id", (request, response) => {
    let data = {
        name: request.body.name,
        username: request.body.username,
        role: request.body.role
    }

    if (request.body.password) {
        data.password = md5(request.body.password)
    }

    let parameter = {
        id: request.params.id
    }

    user.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: `Data Updated Successfully`,
            data: result
        })
    })

    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

//endpoint delete user
app.delete("/:id", (request, response) => {
    let parameter = {
        id: request.params.id
    }

    user.destroy({where: parameter})
    .then(result => {
        return response.json({
            message: `Data Deleted Successfully`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

module.exports = app