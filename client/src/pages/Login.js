import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Typography,
} from "@material-ui/core";
import { login } from "../store/utils/thunkCreators";
import AuthSideBanner from "../components/AuthSideBanner";
import RedirectGrid from "../components/Auth/RedirectGrid";
import DefaultFormControl from "../components/Auth/DefaultFormControl";
import PasswordFormControl from "../components/Auth/PasswordFormControl";
import FormButton from "../components/Auth/FormButton";


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

const Login = (props) => {
  const classes = useStyles();
  const { user, login } = props;

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <div className={classes.root}>
      <AuthSideBanner />
      <Box className={classes.formBox}>
        <RedirectGrid text="Don’t have an account?" buttonText="Create Account" page="/register" />

        <form onSubmit={handleLogin} className={classes.formContainer}>
          <Typography>Welcome back!</Typography>
          <DefaultFormControl
            ariaLabel="username"
            label="Username"
            name="username"
            type="text"
          />
          <PasswordFormControl
            ariaLabel="password"
            label="Password"
            name="password"
            type="password"
          />
          <FormButton type="submit" text="Login" />
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
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
