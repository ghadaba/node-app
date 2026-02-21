require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);
app.get(/^\/.*$/, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});