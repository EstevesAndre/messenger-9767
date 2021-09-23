const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

const getUserUnreadCount = (messages, otherUserId) => {

  // start from last to the beginning (more efficient)
  for (let index = messages.length - 1; index >= 0; index--) {
    const msg = messages[index];

    if (otherUserId === msg.senderId) {
      if (msg.isRead) return messages.length - (index + 1);
    } else return messages.length - (index + 1);
  }

  return messages.length;
};

const getOtherUserLastMessageReadId = (messages, otherUserId) => {

  // start from last to the beginning (more efficient)
  for (let index = messages.length - 1; index >= 0; index--) {
    const msg = messages[index];

    // To prevent lookup for the rest of the conversation 
    // (if sender writes a message it should me considered that he read everything that is above)
    if (otherUserId === msg.senderId) return null;
    else {
      // last message read
      if (msg.isRead) return msg.id;
    }
  }

  return null;
};

const getReadInformation = (otherUserId, messages) => {

  let senderRead = -1, userRead = -1;

  const setUserUnreadCount = (newValue) => {
    userRead = (userRead === -1 ? newValue : userRead);
  };
  const setSenderReadId = (newId) => {
    senderRead = (senderRead === -1 ? newId : senderRead);
  };

  // start from last to the beginning (more efficient)
  for (let index = messages.length - 1; j >= 0; j--) {
    const msg = messages[j];

    // Other user message
    if (otherUserId === msg.senderId) {
      if (msg.isRead) setUserUnreadCount(j);

      // To prevent lookup for the rest of the conversation 
      // (if sender writes a message it should me considered that he read everything that is above)
      setSenderReadId(null);
    }
    // this user message
    else {
      if (msg.isRead) setSenderReadId(msg.id);
      setUserUnreadCount(j);
    }

    if (senderRead !== -1 && userRead !== -1) break;
  }

  return {
    unreadMessagesCount: userRead === -1 ? messages.length : messages.length - (userRead + 1),
    lastMessageReadId: senderRead
  };
};

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // Sort the messages by latest last
      convoJSON.messages.sort((a, b) => a.createdAt - b.createdAt);

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // get index of the last message seen by each user
      convoJSON.readIds = {
        unreadMessagesCount: getUserUnreadCount(convoJSON.messages, convoJSON.otherUser.id),
        lastMessageReadId: getOtherUserLastMessageReadId(convoJSON.messages, convoJSON.otherUser.id)
      };

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
