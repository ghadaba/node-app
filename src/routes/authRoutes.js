const router = require("express").Router();
const { register, login, makeAdmin } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/make-admin", auth, adminMiddleware, makeAdmin);

module.exports = router;
