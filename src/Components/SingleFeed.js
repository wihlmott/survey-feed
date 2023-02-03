import UserContext from "../Context/UserContext";
import { BsArrowUpCircleFill } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import classes from "./SingleFeed.module.css";
import { useContext } from "react";

const SingleFeed = ({ feed, deleteFeed, upvote }) => {
  const [user] = useContext(UserContext);

  const deleteHandler = (e) => {
    deleteFeed(feed.id);
  };
  const upvoteHandler = (e) => {
    upvote(feed.id);
  };

  const liked = feed.voters.find((el) => {
    return el === user.username;
  });

  return (
    <div className={classes.singleFeed}>
      <div className={classes.text}>
        <span className={classes.author}>{feed.author}</span>
        <br />
        <span className={classes.comment}>{feed.comment}</span>
      </div>
      <div className={classes.buttons}>
        <BsArrowUpCircleFill
          className={
            liked
              ? `${classes.upvoteButton} ${classes.liked}`
              : `${classes.upvoteButton}`
          }
          onClick={upvoteHandler}
        />
        <p className={classes.vote}>{feed.voters.length}</p>
        <br />
        {user.username === feed.id.split("^")[1] && (
          <MdDeleteForever
            className={classes.deleteButton}
            onClick={deleteHandler}
          />
        )}
      </div>
    </div>
  );
};

export default SingleFeed;
