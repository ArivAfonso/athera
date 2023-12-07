"use client";

import React, { FC } from "react";
import Button, { ButtonProps } from "./Button";

export interface Props extends ButtonProps {}

const ButtonThird: FC<Props> = (props) => {
  return <Button {...props} pattern="third" />;
};

export default ButtonThird;
