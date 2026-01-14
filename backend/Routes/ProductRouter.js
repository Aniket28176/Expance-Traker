const ensureAUthenticated = require('../Middlewares/Auth');

const router = require('express').Router();

router.post('/', ensureAUthenticated, (req, res) => {
    console.log('---logged in user detail---',req.body);
    res.status(200).json([
        { name: "mobile", price: 10000 },
        { name: "tv", price: 20000 },
    ]);
});

module.exports = router;
