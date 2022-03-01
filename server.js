const express = require("express");
const app = express();

//call routers
const member = require("./routers/member");
const package = require("./routers/package");
const user = require("./routers/user");
const transaction = require("./routers/transaction");
const { login } = require("./routers/login");

//call member's router
app.use("/member", member)

//call package's router
app.use("/package", package)

//call user's router
app.use("/user", user)

//call transaction's router
app.use("/transaction", transaction)

//call login's router
app.use("/auth", login)

app.listen(8000, () => {
    console.log('Server berlari kencang di port 8000');
})