import React from "react";
import {
  Grid,
  Hidden,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import BackgroundSidePicture from '../images/bg-img.png';

const useStyles = makeStyles(theme => ({
  sideContainer: {
    position: 'relative',
  },
  sidePicture: {
    height: '100vh',
    width: 'auto',
    backgroundImage: `url(${BackgroundSidePicture})`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
  },
  sidePictureInformation: {
    position: 'absolute',
    width: '75%',
    maxWidth: '500px',
    zIndex: 2,
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  informationText: {
    color: 'white',
    fontSize: '2.5rem',
  },
  sidePictureGradient: {
    position: 'absolute',
    background: 'linear-gradient(#3A8DFF, #86B9FF)',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    opacity: 0.85,
    zIndex: 1
  },
}));

const AuthSideBanner = () => {
  const classes = useStyles();
  return (
    <Hidden smDown>
      <Grid item md={5} xl={4} className={classes.sideContainer}>
        <div className={classes.sidePicture} />
        <div className={classes.sidePictureGradient} />
        <Paper className={classes.sidePictureInformation} elevation={0}>
          <Typography className={classes.informationText}>
            Converse with anyone with any language
          </Typography>
        </Paper>
      </Grid>
    </Hidden >
  );
};

export default AuthSideBanner;
