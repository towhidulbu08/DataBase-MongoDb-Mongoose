const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schemas/todoSchemas");
const Todo = new mongoose.model("Todo", todoSchema);

//GET all the todos

router.get("/", async (req, res) => {
  try {
    const data = await Todo.find({ status: "active" });

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
router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);
  try {
    await newTodo.save();
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
