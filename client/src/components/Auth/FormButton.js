import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: '#3A8DFF',
    color: 'white',
    fontFamily: 'Montserrat, sans-serif',
    padding: '1rem 4rem',

    '&:hover': {
      backgroundColor: '#1A8DFF',
    }
  },
}));

const FormButton = ({ text, type }) => {
  const classes = useStyles();

  return (
    <Button type={type} variant="contained" size="large" className={classes.button}>
      {text}
    </Button>
  );
};

export default FormButton;
