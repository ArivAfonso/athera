"use client";

import React, { FC } from "react";
import Button, { ButtonProps } from "./Button";

export interface Props extends ButtonProps {}

const ButtonSecondary: FC<Props> = (props) => {
  return <Button {...props} pattern="secondary" />;
};

export default ButtonSecondary;
