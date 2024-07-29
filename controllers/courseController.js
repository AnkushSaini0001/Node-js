const db = require("../config/db");
const multer = require("multer");
// const mysql = require("mysql2/promise");

// ------for save image in db in blob form-----------------
// const storage = multer.memoryStorage();
// -------------------------------------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to save the file
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Unique file name
  },
});
const upload = multer({ storage: storage });

const AddCourse = async (req, res) => {
  try {
    const { title, expiry, description } = req.body;
    console.log("re--", req.body, req.file);
    if (!title || !expiry || !description) {
      return res.status(400).send({
        message: "Bad request",
      });
    }
    if (!req.file) {
      return res.status(400).send({
        message: "Image file is required",
      });
    }

    // ------------------For save image in db in blob form--------------------

    // const imageName = req.file.originalname;
    // const imageData = req.file.buffer;
    // console.log("file-=", req.file.path, req.protocol);
    // const data = await db.execute(
    //   `INSERT INTO user_course (title,expiry,description,image, image_name) VALUES(?,?,?,?,?)`,
    //   [title, expiry, description, imageData, imageName]
    // );

    // -----------------------------------------------------------------------

    // --------------------save img in server direcory--------------------------------
    const image_path = req.file.path.replace(/\\/g, "/"); // Replace backslashes with forward slashes
    const image_url = `${req.protocol}://${req.get("host")}/${image_path}`; // URL to access the image

    const imageName = req.file.originalname;
    const imageData = req.file.buffer;

    console.log("url--", image_url);

    const data = await db.query(
      `INSERT INTO user_course (title,expiry,description,image, image_name,image_path) VALUES(?,?,?,?,?,?)`,
      [title, expiry, description, imageData, imageName, image_url]
    );

    // -----------------------------------------------------------------------------------------
    return res.status(200).send({
      message: "Course Added successfully!",
    });
  } catch (error) {
    console.log(error);
    // resizeBy.status(500).send({
    //   success: false,
    //   message: "Api failed",
    //   error,
    // });
  }
};

// Helper function to convert image data to Base64
const convertToBase64 = (buffer) => {
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
};
const getAllCourse = async (req, res) => {
  try {
    let data = await db.query("SELECT * from user_course");

    if (!data) {
      return res.status(404).send({
        success: false,
        message: "no data found!",
      });
    }

    const courses = data[0].map((course) => ({
      ...course,
      image: course.image ? convertToBase64(course.image) : null,
    }));
    return res.status(200).send({
      success: true,
      message: "All data records",
      data: courses,
    });
  } catch (error) {
    console.log(error);
    resizeBy.status(500).send({
      success: false,
      message: "Api failed",
      error,
    });
  }
};

const getImgByCourseId = async (req, res) => {
  console.log("Enteryy");
  try {
    const courseId = req.params.courseId;
    const rows = await db.query(
      "SELECT image_path FROM user_course WHERE courseId = ?",
      [courseId]
    );

    if (rows[0].length === 0) {
      return res.status(404).send({
        message: "Course not found",
      });
    }
    const imagePath = rows[0][0].image_path;
    // const imageUrl = `${req.get("host")}/${imagePath}`;
    // console.log("r--", rows[0][0].image_path, imageUrl);
    return res.status(200).send({
      image_url: imagePath,
    });
  } catch (error) {
    console.log(error);
    resizeBy.status(500).send({
      success: false,
      message: "Api failed",
      error,
    });
  }
};

module.exports = {
  AddCourse,
  getAllCourse,
  upload,
  getImgByCourseId,
};
