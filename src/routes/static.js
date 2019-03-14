const express = require('express');
const router = express.Router();
const staticController = require("../controllers/staticController");

router.get("/", staticController.index);

router.get("/about", (req, res, next) => {
    res.send("About Blocipedia");
});

module.exports = router;