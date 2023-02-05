import classes from "./HelpModal.module.css";
import { help } from "../Config/Config";
import { useState } from "react";

const HelpModal = ({ open, setOpen }) => {
  const [i, setI] = useState(0);
  const close = () => {
    setOpen(false);
  };
  const next = () => {
    if (i !== help.length - 1) setI((prev) => prev + 1);
    else setI(0);
  };

  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <span className={classes.closeBtn} onClick={close}>
          ✖
        </span>
        <p className={classes.text}>{help[i]}</p>
        <span className={classes.nextBtn} onClick={next}>
          {">"}
        </span>
      </div>
    </div>
  );
};

export default HelpModal;
