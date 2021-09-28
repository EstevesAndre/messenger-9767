const User = require("./user");
const Message = require("./message");
const { Conversation, UserConversation } = require("./conversation");

// associations

// many to many relation between user & conversation
User.belongsToMany(Conversation, { through: UserConversation });
Conversation.belongsToMany(User, { through: UserConversation });

Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message
};
