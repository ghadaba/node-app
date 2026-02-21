const Post = require("../models/Post");

exports.createPost = async (req, res) => {
    const post = await Post.create({
        ...req.body,
        user: req.user
    });
    res.status(201).json(post);
};

exports.getAllPosts = async (req, res) => {
    const posts = await Post.find({ user: req.user });
    res.json(posts);
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