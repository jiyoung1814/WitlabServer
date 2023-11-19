require('dotenv').config();

const express = require('express');
const app = express();
const port  = process.env.PORT;

const routes = require('./routes/index');
const mongoURI = `mongodb://${process.env.mongoHost}:${process.env.mongoPort}/${process.env.mongoName}?retryWrites=true&w=majority`
const dbConnect = require('./db/index');


app.use(express.json());
app.use('/', routes);

const serverStart= async()=> {
    await dbConnect(mongoURI);

    app.listen(port, () => {
        console.log(`server start on port ${port}`);
    })

}

serverStart();


