import React from 'react';
import {Redirect} from "react-router-dom";

export default ({ context  }) => {
  const authUser = context.authenticatedUser;
  return (
      <Redirect from="/" to="/" />

  );
}
