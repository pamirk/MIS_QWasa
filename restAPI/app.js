const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path');
const employeeRoutes = require("./routes/employeeRoutes");
const routes = require("./routes/routes");

const app = express();

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use(morgan('short'));
app.use("/uploads", express.static('uploads'));

app.use("/api", employeeRoutes);
app.use("/v2.api", routes);


app.use((err, req, res, next) => {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);

    res.status(500).json({
        message: err.message,
        error: process.env.NODE_ENV === 'production' ? {} : err,
    });
});

app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + '/build/index.html'))
});

app.listen(3003, () => {
    console.log("server is up and listening on 3003");
});
