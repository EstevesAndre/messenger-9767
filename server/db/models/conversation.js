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

const UserConversation = db.define("user_conversation", {});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = { Conversation, UserConversation };
