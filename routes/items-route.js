const express = require("express");

const itemsControllers = require("../controllers/items-controller");

const router = express.Router();

router.get("/:id", itemsControllers.getItemDescription);
router.get("/", itemsControllers.searchItems);

module.exports = router;
