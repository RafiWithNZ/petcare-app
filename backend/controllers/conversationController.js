import Conversation from "../models/ConversationSchema.js";
import createError from "../utils/createError.js";

export const createConversation = async (req, res, next) => {
  const newConversation = new Conversation({
    id:
      req.role === "caretaker"
        ? req.userId + req.body.to
        : req.body.to + req.userId,
    sellerId: req.role === "caretaker" ? req.userId : req.body.to,
    buyerId: req.role === "caretaker" ? req.body.to : req.userId,
    readBySeller: req.role === "caretaker" ? true : false,
    readByBuyer: req.role === "customer" ? true : false,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json({ success: true, data: savedConversation });
  } catch (err) {
    next(err);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          ...(req.role === "caretaker"
            ? { readBySeller: true }
            : { readByBuyer: true }),
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id });
    if (!conversation) return next(createError(404, "Not found!"));

    res.status(200).json({ success: true, data: conversation });
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find(
      req.role === "caretaker"
        ? { sellerId: req.userId }
        : { buyerId: req.userId }
    )
      .sort({ updatedAt: -1 })
      .populate("sellerId", "name photo")
      .populate("buyerId", "name photo");
    res.status(200).json({ success: true, conversations });
  } catch (err) {
    next(err);
  }
};

export const checkUnreadMessages = async (req, res, next) => {
  try {
    const unreadConversations = await Conversation.find(
      req.role === "caretaker"
        ? { sellerId: req.userId, readBySeller: false }
        : { buyerId: req.userId, readByBuyer: false }
    );

    if (!unreadConversations) return;

    const hasUnreadMessages = unreadConversations.length > 0;
    res.status(200).json({
      success: true,
      hasUnreadMessages,
      unreadCount: unreadConversations.length,
    });
  } catch (err) {
    next(err);
  }
};
