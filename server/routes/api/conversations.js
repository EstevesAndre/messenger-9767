const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");


const getReadIds = (otherUserId, messages) => {

  var senderRead = -1, userRead = -1;

  const setUserReadValue = (j) => {
    userRead = (userRead === -1 ? j : userRead);
  };
  const setSenderReadValue = (msgId) => {
    senderRead = (senderRead === -1 ? msgId : senderRead);
  };

  // start from last to the beginning (more efficient)
  for (var j = messages.length - 1; j >= 0; j--) {
    const msgId = messages[j].id;

    // Other user message
    if (otherUserId === messages[j].senderId) {
      if (messages[j].isRead) setUserReadValue(j);
      setSenderReadValue(msgId);
    }
    // this user message
    else {
      if (messages[j].isRead) setSenderReadValue(msgId);
      setUserReadValue(j);
    }

    if (senderRead !== -1 && userRead !== -1) break;
  }

  return { senderRead, userRead };
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
      // convoJSON.messages.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
      convoJSON.messages.sort((a, b) => a.createdAt - b.createdAt);

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // get index of the last message seen by each user
      const { senderRead, userRead } = getReadIds(convoJSON.otherUser.id, convoJSON.messages);

      convoJSON.readIds = {
        userMessagesToRead: userRead === -1 ? convoJSON.messages.length : convoJSON.messages.length - (userRead + 1),
        otherUserLastMessageReadIndex: senderRead
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

// updates read conversation
router.put("/read/:id", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const conversationId = req.params.id;

    const conversation = await Conversation.findOne({
      where: {
        id: conversationId
      },
      attributes: ["id"],
      include: [
        { model: Message, limit: 1, order: [['createdAt', 'DESC']] }
      ]
    });

    if (conversation.messages.length && !conversation.messages[0].isRead) {
      conversation.messages[0].isRead = true;
      conversation.messages[0].save();
    }

    return res.status(200).json(conversation.messages[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
