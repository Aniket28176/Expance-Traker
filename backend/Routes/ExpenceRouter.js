const { fetchExpences, addExpences, deleteExpences } = require('../Controllers/ExpenceController');

const router = require('express').Router();

// fetch all the expences of user based on user_id
router.get("/", fetchExpences);
//add Expences
router.post("/", addExpences);
//delete expence
router.delete("/:expenceId", deleteExpences);

module.exports = router;