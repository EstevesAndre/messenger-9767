const { Op, Sequelize } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  // for conversations 1-1 the name can be username1_username2 or user1Id_user2Id
  // for group messages the name can be set
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

// Through table
const UserConversation = db.define("user_conversation", {});

// find conversation given conversation name
Conversation.findConversation = async function (name) {
  const conversation = await Conversation.findOne({
    where: {
      name: name
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = { Conversation, UserConversation };
