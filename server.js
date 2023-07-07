const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleswares/errorMiddleware");
// routePath
const authRoutes = require("./routes/authRoute");
const openaiRoutes = require("./routes/openaiRoute");

// dotenv
dotenv.config();
// mongo connection
connectDB();
// rest object
const app = express();
// middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(errorHandler);
// listen app
const PORT = process.env.PORT || 8080;

// API route
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/openai", openaiRoutes);
app.listen(PORT, () => {
  console.log(
    `server running in ${process.env.DEV_MODE} on ${PORT}`.bgCyan.white
  );
});
