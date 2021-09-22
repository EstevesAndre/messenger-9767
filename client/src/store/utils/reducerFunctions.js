export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  // Add updated conversation to the start of the array
  // If we use push it will be added to the end of the array -> last element of chat users
  // It it is at the start, it is not necessary to update the order
  if (state[0].id !== message.conversationId)
    state.unshift(
      state.splice(
        state.findIndex(a => a.id === message.conversationId),
        1)[0]
    );

  return state
    .map((convo) => {
      if (convo.id === message.conversationId) {
        const convoCopy = { ...convo };
        convoCopy.messages.push(message);
        convoCopy.latestMessageText = message.text;
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
  // It it is at the start, it is not necessary to update the order
  if (state[0].otherUser.id !== recipientId)
    state.unshift(
      state.splice(
        state.findIndex(a => a.otherUser.id === recipientId),
        1)[0]
    );

  return state
    .map((convo) => {
      if (convo.otherUser.id === recipientId) {
        const convoCopy = { ...convo };
        convoCopy.id = message.conversationId;
        convoCopy.messages.push(message);
        convoCopy.latestMessageText = message.text;
        return convoCopy;
      } else {
        return convo;
      }
    });
};
