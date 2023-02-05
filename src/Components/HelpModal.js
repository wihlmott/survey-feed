import classes from "./HelpModal.module.css";

const HelpModal = ({ open, setOpen }) => {
  const close = () => {
    setOpen(false);
  };

  return (
    <div className={classes.overlay} onClick={close}>
      <div className={classes.modal}>
        <span className={classes.closeBtn} onClick={close}>
          ✖
        </span>
        <span className={classes.nextBtn}>{">"}</span>
      </div>
    </div>
  );
};

export default HelpModal;
