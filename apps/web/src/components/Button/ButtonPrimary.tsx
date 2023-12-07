"use client";

import React, { FC } from "react";
import Button, { ButtonProps } from "./Button";

export interface Props extends ButtonProps {}

const ButtonPrimary: FC<Props> = (props) => {
  return <Button {...props} pattern="primary" />;
};

export default ButtonPrimary;
