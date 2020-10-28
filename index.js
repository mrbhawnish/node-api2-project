const express = require('express');
const apiRoutes = require('./api/apiRoutes');

const server = express();

server.use("/api", apiRoutes);

const PORT = 5000



server.listen(PORT, () => {
    console.log(`API RUNNING AT PORT ${PORT}`)
})