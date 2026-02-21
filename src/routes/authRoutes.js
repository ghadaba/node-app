const router = require("express").Router();
const { register, login, makeAdmin } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/make-admin", auth, admin, makeAdmin);

module.exports = router;
