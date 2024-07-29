//Get all students list

const db = require("../config/db");

const getStudents = async (req, res) => {
  console.log("enter");

  try {
    let data = await db.query("SELECT * from students");
    console.log("d--", data);
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "no data found!",
      });
    }
    return res.status(200).send({
      success: true,
      message: "All data records",
      data: data[0],
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

const getStudentsById = async (req, res) => {
  console.log("req--", req.params.id);

  try {
    let data = await db.query(
      `SELECT * from students WHERE id=${req.params.id}`
    );
    console.log("d--", data);
    if (data[0]?.length == 0) {
      return res.status(404).send({
        success: false,
        message: "no data found!",
      });
    }
    return res.status(200).send({
      statusDescription: {
        statusCode: 200,
        message: "All data records",
      },
      success: true,

      data: data[0],
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

const CreateStudent = async (req, res) => {
  try {
    const { name, roll_no, fees, medium } = req.body;
    if (!name || !roll_no || !fees || !medium || !req.body.class) {
      return res.status(400).send({
        message: "Bad request",
      });
    }

    let dbNameArr = await db.query(`SELECT name from students`);
    let findName = dbNameArr?.[0]?.map((arg) => arg.name);
    console.log("fy--", findName);
    if (findName?.includes(name)) {
      return res.status(220).send({
        meesage: "Student already created",
      });
    }
    const data = db.query(
      `INSERT INTO students (name,roll_no,class,fees,medium) VALUES(?,?,?,?,?)`,
      [name, roll_no, fees, req.body.class, medium]
    );

    return res.status(200).send({
      message: "Student created successfully!",
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

//Update students

const updateStudents = async (req, res) => {
  console.log("req--", req.params.id);

  try {
    const id = req.params.id;
    const { name, fees, medium } = req.body;
    if (!id) {
      return res.status(400).send({
        message: "Please provide id!",
      });
    }
    let data = db.query(
      `UPDATE students SET name=?,fees=?,medium=? WHERE id=?`,
      [name, fees, medium, id]
    );
    return res.status(200).send({
      message: "Successfully updated!",
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

// Delete students

const deleteStudents = async (req, res) => {
  console.log("req--", req.params.id);

  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({
        message: "Please provide id!",
      });
    }
    let data = db.query(`DELETE FROM students WHERE id=?`, [id]);
    return res.status(200).send({
      message: "Successfully Deleted!",
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
  getStudents,
  getStudentsById,
  CreateStudent,
  updateStudents,
  deleteStudents,
};
