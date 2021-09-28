const { Op, Sequelize } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  // user that created the conversation (to prevent conversation with the same name)
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  // for conversations 1-1 the name can be username1_username2 or user1Id_user2Id
  // for group messages the name can be set
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

// Through table
const UserConversation = db.define("user_conversation", {
  lastMessageReadId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: null,
  }
});

// find conversation given conversation userId and name
Conversation.findConversation = async function (userId, name, creationDate) {
  const conversation = await Conversation.findOne({
    where: {
      userId: userId,
      name: name,
      createdAt: creationDate,
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = { Conversation, UserConversation };
