import classes from "./Card.module.css";
import Div100vh from "react-div-100vh";
import Theme from "./Theme";

const Card = (props) => {
  return (
    <Div100vh className={classes.div100}>
      <Theme />
      <div className={classes.card}>
        <h2 className={classes.title}>Young marrieds workshop</h2>
        {props.children}
      </div>
    </Div100vh>
  );
};

export default Card;
