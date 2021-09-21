import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  FormHelperText,
  Grid,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  helperText: {
    fontSize: '0.75rem !important',
    color: 'red',
  },
}));

const PasswordFormControl = ({ formErrorMessage, inputProps, ariaLabel, label, name, type }) => {
  const classes = useStyles();

  return (
    <Grid>
      <FormControl error={!!formErrorMessage?.confirmPassword}>
        <TextField
          aria-label={ariaLabel}
          label={label}
          type={type}
          inputProps={inputProps}
          name={name}
          required
        />
      </FormControl>
      <FormHelperText className={classes.helperText}>
        {formErrorMessage?.confirmPassword}
      </FormHelperText>
    </Grid>
  );
};

export default PasswordFormControl;
