import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(2),
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
    textTransform: 'capitalize'
  },
  previewText: {
    fontSize: 12,
    color: (props) => props.textColor,
    fontWeight: (props) => props.fontWeight,
    letterSpacing: -0.17,
  },
  badge: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1),
    color: 'white',
    fontSize: '0.8rem',
    borderRadius: '25px',
    minWidth: '25px',
    height: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

const ChatContent = (props) => {

  const classes = useStyles({
    textColor: props.messagesToRead === 0 ? "#9CADC8" : "black",
    fontWeight: props.messagesToRead === 0 ? "normal" : "bold",
  });

  const { conversation, messagesToRead } = props;
  const { latestMessageText, otherUser } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {messagesToRead !== 0 &&
        <Box>
          <Typography className={classes.badge}>
            {messagesToRead}
          </Typography>
        </Box>
      }
    </Box>
  );
};

export default ChatContent;
