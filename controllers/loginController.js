const db = require("../config/db");
const jwt = require("jsonwebtoken");

const SignUp = async (req, res) => {
  console.log("enter");
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).send({
        message: "Bad request",
      });
    }

    let dbNameArr = await db.query(`SELECT * from user_login`);
    let findName = dbNameArr?.[0]?.map((arg) => arg.userName);
    console.log("fy--", findName);
    if (findName?.includes(userName)) {
      return res.status(220).send({
        meesage: "User already created",
      });
    }
    db.query(`INSERT INTO user_login (userName,password) VALUES(?,?)`, [
      userName,
      password,
    ]);

    return res.status(200).send({
      message: "Student created successfully!",
    });
  } catch (error) {
    console.log("error", error);
    resizeBy.status(500).send({
      success: false,
      message: "Api failed",
      error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).send({
        message: "Bad request",
      });
    }

    let dbNameArr = await db.query(`SELECT * from user_login`);
    let findName = dbNameArr?.[0]?.map((arg) => arg.userName);
    console.log("fy--", findName, dbNameArr[0]);
    if (
      dbNameArr[0].some(
        (arg) => arg.userName == userName && arg.password == password
      )
    ) {
      console.log("Data matched");
      const token = jwt.sign(
        { userName: userName },
        "gfg_jwt_secret_key", // Replace with your actual secret key
        { expiresIn: "10m" } // Token expiry time
      );
      const details = await db.query(
        `SELECT * from user_login where userName=?`,
        [userName]
      );
      console.log("de--", details[0][0]);
      let userDetails = details[0][0];
      return res.status(200).send({
        message: "Login successfully!",
        token,
        userDetails,
      });
    } else {
      return res.status(220).send({
        message: "User not found",
      });
    }
  } catch (error) {
    console.log("error", error);
    resizeBy.status(500).send({
      success: false,
      message: "Api failed",
      error,
    });
  }
};

module.exports = {
  SignUp,
  login,
};
