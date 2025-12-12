const express = require("express");
const expenseController = require("../controllers/expenseController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// All routes protected
router.use(protect);

router
  .get("/", expenseController.getAllExpense)
  .post("/", expenseController.createExpense);

router
  .put("/:id", expenseController.updateExpense)
  .delete("/:id", expenseController.deleteExpense);

module.exports = router;
