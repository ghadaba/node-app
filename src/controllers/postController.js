const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
    const post = await Post.create({
        ...req.body,
        user: req.user
    });
    res.status(201).json(post);
};

exports.getAllPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        
        // Si l'utilisateur est admin, retourner tous les posts
        // Sinon, retourner seulement ses propres posts
        const filter = user.role === "admin" ? {} : { user: req.user };
        const posts = await Post.find(filter).populate("user", "name email");
        
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
    const post = await Post.findById(req.params.id);

    if (!post || post.user.toString() !== req.user)
        return res.status(403).json({ message: "Forbidden" });

    Object.assign(post, req.body);
    await post.save();

    res.json(post);
};

exports.deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post || post.user.toString() !== req.user)
        return res.status(403).json({ message: "Forbidden" });

    await post.deleteOne();

    res.json({ message: "Post deleted" });
};
