export const addMessageToStore = (state, payload) => {
  const { message, recipient, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      readIds: {
        unreadMessagesCount: 1,
        lastMessageReadId: message.id,
      }
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;

      // update messages to read to recipient
      // Increments messages to read and updates otherUser last message index
      if (recipient !== null) {
        convoCopy.readIds.unreadMessagesCount++;
        convoCopy.readIds.lastMessageReadId = message.id;
      }

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {

  // Add updated conversation to the end of the array
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);

      convoCopy.readIds = {
        unreadMessagesCount: 0,
        lastMessageReadId: -1,
      };

      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateConversationReadToStore = (state, payload) => {
  const { conversationId, senderId } = payload;

  // Updates the unreadMessagesCount 
  // Updates the lastMessageReadId  for socket broadcast
  // There is no need to update the messages since they are the same
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };

      if (senderId !== null && senderId !== convoCopy.otherUser.id)
        convoCopy.readIds.lastMessageReadId = convoCopy.messages[convoCopy.messages.length - 1].id;
      else
        convoCopy.readIds.unreadMessagesCount = 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};
