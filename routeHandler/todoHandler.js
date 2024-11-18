const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schemas/todoSchemas");
const userSchema = require("../schemas/usersSchema");
const Todo = mongoose.model("Todo", todoSchema);
const User = mongoose.model("User", userSchema);

const checkLogin = require("../middleware/checkLogin");
//GET active todos
router.get("/active", async (req, res) => {
  const todo = new Todo();
  try {
    const data = await todo.findActive();
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

//Static method include
router.get("/js", async (req, res) => {
  try {
    const data = await Todo.findByJs();
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});
//GET Todos by language

router.get("/lang", async (req, res) => {
  try {
    const data = await Todo.find().byLanguage("react");
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

//GET all the todos
router.get("/", checkLogin, async (req, res) => {
  console.log(req.username);
  console.log(req.userId);

  try {
    const data = await Todo.find()
      .populate("user", "name username -_id")
      .select({
        _id: 0,
        __v: 0,
      });

    //console.log(data);
    res.status(200).json({
      result: data,
      message: "Todo  got successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});
//GET a todo by Id
router.get("/:id", async (req, res) => {
  try {
    const data = await Todo.find({ _id: req.params.id });

    //console.log(data);
    res.status(200).json({
      result: data,
      message: "Todo  got successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

//POST a todo
router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({ ...req.body, user: req.userId });
  try {
    const todo = await newTodo.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: todo._id,
        },
      }
    );
    res.status(200).json({
      message: "Todo was inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

//POST multiple todo

router.post("/all", async (req, res) => {
  try {
    const result = await Todo.insertMany(req.body);
    res.status(200).json({
      message: "Todos were inserted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

//PUT  todo

router.put("/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: "active",
        },
      },
      {}
    );
    console.log(result);
    if (result.matchedCount === 0) {
      // If no document was found with the given ID
      return res.status(404).json({
        error: "No todo found with the specified ID!",
      });
    }

    res.status(200).json({
      message: "Todo was updated successfully!",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

//update many

router.put("/updateMany", async (req, res) => {
  try {
    // Log the incoming request to ensure no unnecessary data is being passed
    console.log("Received request to update todos");

    // Perform the update operation
    const result = await Todo.updateMany(
      { status: "active" }, // Query condition: match todos with status "active"
      {
        $set: { status: "inactive" }, // Update operation: set status to "inactive"
      }
    );

    // Log the result of the update operation
    console.log("Update result:", result);

    // If no documents matched the condition, return a 404 error
    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "No todos found with the specified criteria!",
      });
    }

    // If documents were updated, return a success response
    res.status(200).json({
      message: `${result.modifiedCount} todos were updated successfully!`,
    });
  } catch (err) {
    // Log the error details for debugging
    console.error("Error:", err);

    // Return a 500 server error with the error message
    res.status(500).json({
      error: "There was a server side error!",
      details: err.message, // Include error message for debugging
    });
  }
});

//Delete  todo

router.delete("/:id", async (req, res) => {
  try {
    const data = await Todo.deleteOne({ _id: req.params.id });

    //console.log(data);
    res.status(200).json({
      result: data,
      message: "Todo  Deleted  successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

module.exports = router;
