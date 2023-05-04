import React, { FC } from "react";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import ButtonSecondary from "@/components/Button/ButtonSecondary";
import Textarea from "@/components/Textarea/Textarea";
import Button from "@/components/Button/Button";

export interface SingleCommentFormProps {
  className?: string;
  onClickSubmit?: () => void;
  onClickCancel?: () => void;
  textareaRef?: React.MutableRefObject<null>;
  defaultValue?: string;
  rows?: number;
}

const SingleCommentForm: FC<SingleCommentFormProps> = ({
  className = "mt-5",
  onClickSubmit,
  onClickCancel,
  textareaRef,
  defaultValue = "",
  rows = 4,
}) => {
  return (
    <form action="#" className={`nc-SingleCommentForm ${className}`}>
      <Textarea
        placeholder="Add to discussion"
        ref={textareaRef}
        required={true}
        defaultValue={defaultValue}
        rows={rows}
      />
      <div className="mt-2 space-x-3">
        <ButtonPrimary onClick={onClickSubmit} type="submit">
          Submit
        </ButtonPrimary>
        <Button type="button" pattern="white" onClick={onClickCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default SingleCommentForm;
