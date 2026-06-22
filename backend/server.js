const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bookRoutes = require("./routes/books");

const app = express();

app.use(
    "/covers",
    express.static("covers")
);

app.use(cors());

app.use("/api", bookRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});





























