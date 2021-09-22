import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  messagesBox: {
    height: 'calc(100% - 90px)',
    paddingRight: theme.spacing(2),
    overflowY: 'scroll',
  }
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId, otherUserLastMessageReadIndex } = props;

  return (
    <Box className={classes.messagesBox}>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} otherUser={otherUser} isLastMessageRead={otherUserLastMessageReadIndex === message.id} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} isLastMessageRead={otherUserLastMessageReadIndex === message.id} />
        );
      })}
    </Box>
  );
};

export default Messages;
