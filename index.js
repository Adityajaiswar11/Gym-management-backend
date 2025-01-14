const express = require('express');
const app = express();
const port = 8080;
const connectDatabase = require('./db/ConnectDatabase');
require('dotenv').config();
const fs = require('fs');
// Connect to MongoDB
connectDatabase();

// Middleware for parsing JSON request bodies
app.use(express.json());

// Routes
//automated routes
const routesPath = "./routes";
const routeFiles = fs.readdirSync(routesPath);
console.log(routeFiles)
routeFiles.map((r) => app.use("/api", require(`./routes/${r}`)));



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
