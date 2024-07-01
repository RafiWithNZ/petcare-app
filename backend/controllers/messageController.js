import Message from "../models/MessageSchema.js";
import Conversation from "../models/ConversationSchema.js";

export const createMessage = async (req, res) => {
  const { conversationId, desc, photoUrl } = req.body;

  const newMessage = new Message({
    conversationId: conversationId,
    userId: req.userId,
    desc: desc || null,
    photoUrl: photoUrl || null,
  });

  try {
    const savedMessage = await newMessage.save();
    await Conversation.findOneAndUpdate(
      { id: conversationId },
      {
        $set: {
          readBySeller: req.role === "caretaker" ? true : false,
          readByBuyer: req.role === "customer" ? true : false,
          lastMessage: desc ? desc : "[Gambar]",
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true, savedMessage });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    });
  }
};


export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    });

    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    });
  }
};
