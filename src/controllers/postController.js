const Post = require("../models/Post");

exports.createPost = async (req, res) => {
    const post = await Post.create({
        ...req.body,
        user: req.user
    });
    res.status(201).json(post);
};

exports.getAllPosts = async (req, res) => {
    try {
        const search = req.query.search || "";

        let filter = {};

        // 🔎 recherche par titre ou contenu
        if (search) {
            filter = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { content: { $regex: search, $options: "i" } }
                ]
            };
        }

        let posts;

        if (req.role === "admin") {
            // 👑 Admin → tous les posts + propriétaire
            posts = await Post.find(filter)
                .populate("user", "name email");
        } else {
            // 👤 User → seulement ses posts
            posts = await Post.find({
                user: req.user,
                ...filter
            });
        }

        res.json(posts);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post || post.user.toString() !== req.user)
        return res.status(403).json({ message: "Forbidden" });

    res.json(post);
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post)
            return res.status(404).json({ message: "Post not found" });

        // 👇 autoriser si admin OU propriétaire
        if (req.role !== "admin" && post.user.toString() !== req.user) {
            return res.status(403).json({ message: "Forbidden" });
        }

        Object.assign(post, req.body);
        await post.save();

        res.json(post);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post)
            return res.status(404).json({ message: "Post not found" });

        // 👇 autoriser si admin OU propriétaire
        if (req.role !== "admin" && post.user.toString() !== req.user) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await post.deleteOne();

        res.json({ message: "Post deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};