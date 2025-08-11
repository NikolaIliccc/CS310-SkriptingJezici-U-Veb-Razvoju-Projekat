import Comment from "../models/commentModel.js";

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { gameId } = req.params;

    if (!text) {
      return res.status(400).json({ message: "Komentar ne moze biti prazan" });
    }

    const comment = await Comment.create({
      game: gameId,
      user: req.user.id,
      text
    });

    await comment.populate('user', 'username').execPopulate?.() || await comment.populate('user', 'username');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommentsByGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    const comments = await Comment.find({ game: gameId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
