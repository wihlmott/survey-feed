import classes from "./Card.module.css";
import Div100vh from "react-div-100vh";
import Theme from "./Theme";
import NextBtn from "./NextBtn";
import HelpModal from "./HelpModal";
import { useState } from "react";

const Card = (props) => {
  const [open, setOpen] = useState(false);

  const goBack = () => {
    props.goBack();
  };
  const openHelp = () => {
    setOpen(true);
  };
  return (
    <Div100vh className={classes.div100}>
      <Theme />
      <div className={classes.card}>
        <h2 className={classes.title}>Young marrieds workshop</h2>
        <div className={classes.cardBody}>{props.children}</div>
      </div>
      <div className={classes.footer}>
        <span className={classes.footerText}>{props.message}</span>
        {props.page !== "login" && (
          <div className={classes.helpBtn} onClick={openHelp}>
            help
          </div>
        )}
        {props.page === "feedPage" && (
          <div className={classes.backBtn} onClick={goBack}>
            back
          </div>
        )}
        {props.page === "questionPage" && <NextBtn gotoFeed={props.gotoFeed} />}
      </div>
      {open && <HelpModal open={open} setOpen={setOpen} />}
    </Div100vh>
  );
};

export default Card;
