import { useState } from "react";
import classes from "./SurveyBtn.module.css";

const SurveyBtn = ({ text, sendSelection, selected }) => {
  const send = () => {
    sendSelection(text);
  };
  return (
    <div
      className={
        selected
          ? `${classes.surveyBtn} ${classes.selectedBtn}`
          : `${classes.surveyBtn}`
      }
      onClick={send}
    >
      {text}
    </div>
  );
};

export default SurveyBtn;
