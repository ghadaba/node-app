const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost
} = require("../controllers/postController");

router.use(auth);

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;