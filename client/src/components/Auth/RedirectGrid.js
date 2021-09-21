import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Button
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  redirectContainer: {
    justifyContent: 'flex-end',
    padding: '2rem 3rem',
    gap: "2rem",
    alignItems: 'center'
  },
  redirectText: {
    color: "rgba(0, 0, 0, 0.25)",
  },
  button: {
    color: '#3A8DFF',
    boxShadow: "0 2px 10px 1px rgb(225,225,225)",
    padding: '1rem 4rem',
  },
}));

const RedirectGrid = ({ text = "", buttonText = "", page = "#" }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Grid container item className={classes.redirectContainer}>
      <Typography className={classes.redirectText}>{text}</Typography>
      <Button
        onClick={() => history.push(page)}
        className={classes.button}
      >
        {buttonText}
      </Button>
    </Grid>
  );
};

export default RedirectGrid;
