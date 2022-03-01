const { request, response } = require("express")
const express = require("express")
const app = express()

//membaca request dari body dengan tipe json
app.use(express.json())

//call package's model
const models = require("../models/index")
const package = models.packages

// authorization
const {auth} = require("./login")
app.use(auth)

//endpoint for get all package
app.get("/", async (request, response) => {
    let dataPackage = await package.findAll()

    return response.json(dataPackage)
})

//endpoint add new package
app.post("/", (request, response) => {
    let newPackage = {
        type: request.body.type,
        price: request.body.price
    }

    package.create(newPackage)
    .then(result => {
        response.json({
            message: `Data added`
        })
    })
    .catch(error => {
        response.json({
            message: error.message
        })
    })
})

//endpoint update package
app.put("/:id", (request, response) => {
    let data = {
        type: request.body.type,
        price: request.body.price,
    }

    let parameter = {
        id: request.params.id
    }

    package.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: `Data Updated`,
            data: result
        })
    })

    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

//endpoint delete package
app.delete("/:id", (request, response) => {
    let parameter = {
        id: request.params.id
    }

    package.destroy({where: parameter})
    .then(result => {
        return response.json({
            message: `Data Deleted`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

module.exports = app