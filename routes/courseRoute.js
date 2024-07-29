const express = require("express");

const {
  AddCourse,
  getAllCourse,
  upload,
  getImgByCourseId,
} = require("../controllers/courseController");
const jwt = require("jsonwebtoken");

const router = express.Router();

function validateToken(req, res, next) {
  //get token from request header
  const authHeader = req.headers["authorization"];

  const token = authHeader?.split(" ")[1];
  console.log("yskhk");
  console.log("token--==", token, authHeader);
  let privateKey = "gfg_jwt_secret_key";
  //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
  if (token == undefined) {
    return res.sendStatus(400).send("Token not present");
  }

  jwt.verify(token, privateKey, (err, user) => {
    console.log("error--", err);
    if (err instanceof jwt.TokenExpiredError) {
      statusDescription = {
        statusCode: 303,
        statusMessage: "Jwt token expired",
      };

      return res.status(303).json({ statusDescription });
    } else if (err instanceof jwt.JsonWebTokenError) {
      // res.status(403).send("Token invalid");
      console.log("errror==", err);

      statusDescription = {
        statusCode: 404,
        statusMessage: "Unauthorize access",
      };
      return res.status(404).json({ statusDescription });
    } else {
      req.user = user;
      next(); //proceed to the next action in the calling function
    }
  }); //end of jwt.verify()
}

router.post("/add/course", upload.single("image"), AddCourse);
router.get("/all/course", getAllCourse);
router.get("/get-course-image/:courseId", getImgByCourseId);

module.exports = router;
