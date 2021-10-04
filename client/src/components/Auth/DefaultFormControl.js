import React from "react";
import {
  FormControl,
  TextField,
} from "@material-ui/core";


const DefaultFormControl = ({ ariaLabel, label, name, type }) => {

  return (
    <FormControl>
      <TextField
        aria-label={ariaLabel}
        label={label}
        name={name}
        type={type}
        required
      />
    </FormControl>
  );
};

export default DefaultFormControl;
