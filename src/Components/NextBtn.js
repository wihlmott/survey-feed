import classes from "./NextBtn.module.css";

const NextBtn = ({ gotoFeed }) => {
  return (
    <div className={classes.nextBtn} onClick={gotoFeed}>
      next
    </div>
  );
};

export default NextBtn;
