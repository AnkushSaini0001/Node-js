const express = require("express");
const dotenv = require("dotenv");
const mysqlPool = require("./config/db");
const path = require("path");

//configure dotenv

dotenv.config(); //its main function is to acces data from env file

const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/test", (req, res) => {
  res.status(200).send("<h1>Node js mysql app</h1>");
});
app.use("/api/v1/student", require("./routes/studentsRoutes"));
app.use("/api/v1/user", require("./routes/loginRoutes"));
app.use("/api/v1", require("./routes/courseRoute"));

const PORT = process.env.PORT;
mysqlPool
  .query("SELECT 1")
  .then(() => {
    console.log("Mysql db connected");
    app.listen(PORT, () => {
      console.log(`Server Running on port----${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
