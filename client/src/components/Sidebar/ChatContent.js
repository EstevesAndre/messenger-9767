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
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  textBold: {
    fontWeight: 'bold',
    color: "black",
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
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser, readIds: { userMessagesToRead } } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText + " " + (userMessagesToRead !== 0 ? classes.textBold : "")}>
          {latestMessageText}
        </Typography>
      </Box>
      {userMessagesToRead !== 0 &&
        <Box>
          <Typography className={classes.badge}>
            {userMessagesToRead}
          </Typography>
        </Box>
      }
    </Box>
  );
};

export default ChatContent;
