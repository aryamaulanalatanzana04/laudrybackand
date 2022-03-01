const { request, response } = require("express")
const express = require("express")
const app = express()

app.use(express.json())

const models = require("../models/index")

const transaction = models.transactions
const transaction_detail = models.transaction_details

// authorization
const {auth} = require("./login")
app.use(auth)

//endpoint get transaction
app.get("/", async (request, response) => {
    let data = await transaction.findAll({
        include: [
            {model: models.members, as: "member"},
            {model: models.users, as: "user"},
            {
                model: models.transaction_details, 
                as: "transactionDetail",
                include: [
                    {model: models.packages, as: "package"}
                ]
            }
        ]
    })
    return response.json(data)
})

//endpoint new transaction
app.post("/", (request, response) => {
    let newTransaction = {
        member_id: request.body.member_id,
        date: request.body.date,
        due_date: request.body.due_date,
        payment_date: request.body.payment_date,
        status: 1,
        paid: request.body.paid,
        user_id: request.body.user_id
    }

    transaction.create(newTransaction)
    .then(result => {
        // if insert data successfully, continue insert data into detail transaction
        let newId = result.id //id in transaction table

        let detail = request.body.transaction_detail
        for (let i = 0; i < detail.length; i++) {
            detail[i].transaction_id = newId ;
        }

        //transaction detail insert data process
        transaction_detail.bulkCreate(detail)
        .then(result => {
            return response.json({
                message: `Transaction Detail Data Added Successfully`
            })
        })
    })
    .catch(error => {
        response.json({
            message: error.message
        })
    })
})

//endpoint update transaction
app.put( "/:id", async (request, response) => {

    //load data for updating transaction table
    let dataTransaction = {
        member_id: request.body.member_id,
        date: request.body.date,
        due_date: request.body.due_date,
        payment_date: request.body.payment_date,
        status: 1,
        paid: request.body.paid,
        user_id: request.body.user_id
    }

    let parameter = {
        id: request.params.id
    }

    let detail_params = {
        transaction_id: request.params.id
    }

    transaction.update(dataTransaction, {where: parameter})
    .then(async(result) => {
        await transaction_detail.destroy({where: detail_params})
        
        let detail = request.body.transaction_detail
        for (let i = 0; i < detail.length; i++) {
            detail[i].transaction_id = request.params.id ;
        }

        //transaction detail insert data process
        transaction_detail.bulkCreate(detail)
        .then(result => {
            return response.json({
                message: `Transaction Detail Data Added Successfully`
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
});

//endpoint delete transaction
app.delete( "/:id", (request, response) => {

    //parameter kurang satu untuk memanggil transaction_id di tabel transaction_details
    let parameter = {
        id: request.params.id
    }

    let detail_params = {
        transaction_id: request.params.id
    }

    //delete data transaction
    transaction_detail.destroy({where: detail_params})
    .then(result => {
        transaction.destroy({where: parameter})
        .then(result => {
            return response.json({
                message: `Transaction Detail Data Deleted Successfully`
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

//endpoint to change transaction status
app.post("/status/:id", (request, response) => {
    
    //load status condition
    let data = {
        status: request.body.status
    }
    
    //load the parameter
    let parameter = {
        id: request.params.id
    }

    //update status process
    transaction.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: "status condition updated"
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

//endpoint to change payment status
app.get("/payment/:id", (request, response) => {

    let parameter = {
        id: request.params.id
    }

    let data = {
        //get today's date
        payment_date: new Date().toISOString().split("T")[0],
        paid: true
    }

    transaction.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: `transaction has been paid`
        })
    })
    .catch(error => {
        message = error.message
    })
})

module.exports = app