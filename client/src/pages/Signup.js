import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Typography,
} from "@material-ui/core";
import { register } from "../store/utils/thunkCreators";

import AuthSideBanner from "../components/AuthSideBanner";
import RedirectGrid from "../components/Auth/RedirectGrid";
import DefaultFormControl from "../components/Auth/DefaultFormControl";
import FormButton from "../components/Auth/FormButton";
import PasswordFormControl from "../components/Auth/PasswordFormControl";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    width: "100vw",
    display: "flex",
  },
  formBox: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'start',
    gap: '2rem',
    margin: 'auto',
    width: '90%',
    maxWidth: '450px',

    '& div': {
      width: '100%'
    },
    '& p': {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    '& button': {
      alignSelf: 'center',
      marginTop: '0.75rem',
    }
  },
}));

const Signup = (props) => {
  const classes = useStyles();
  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <div className={classes.root}>
      <AuthSideBanner />
      <Box className={classes.formBox}>
        <RedirectGrid text="Already have an account?" buttonText="Login" page="/login" />

        <form onSubmit={handleRegister} className={classes.formContainer}>
          <Typography>Create an account.</Typography>
          <DefaultFormControl
            ariaLabel="username"
            label="Username"
            name="username"
            type="text"
          />
          <DefaultFormControl
            ariaLabel="e-mail address"
            label="E-mail address"
            name="email"
            type="email"
          />
          <PasswordFormControl
            formErrorMessage={formErrorMessage}
            inputProps={{ minLength: 6 }}
            ariaLabel="password"
            label="Password"
            name="password"
            type="password"
          />
          <PasswordFormControl
            formErrorMessage={formErrorMessage}
            inputProps={{ minLength: 6 }}
            ariaLabel="confirm password"
            label="Confirm Password"
            name="confirmPassword" type="password"
          />
          <FormButton type="submit" text="Create" />
        </form>
      </Box>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
