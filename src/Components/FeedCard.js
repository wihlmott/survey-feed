import classes from "./FeedCard.module.css";
import SingleFeed from "./SingleFeed";
import { useEffect, useState } from "react";

const FeedCard = ({
  comments,
  setPrivate,
  setPublic,
  setAnonymous,
  privateStatus,
  deleteFeed,
  upvote,
}) => {
  const [publicButtonClass, setPublicButtonClass] = useState(
    `${classes.publicButton}`
  );
  const [privateButtonClass, setPrivateButtonClass] = useState(
    `${classes.privateButton}`
  );
  const [anonymousButtonClass, setAnonymousButtonClass] = useState(
    `${classes.anonymousButton}`
  );
  const [optionsOpen, setOptionsOpen] = useState(false);

  useEffect(() => {
    toggleOptions();
  }, [optionsOpen]);

  const toggleOptions = () => {
    if (!optionsOpen) return;

    if (privateStatus === "public") {
      setAnonymousButtonClass(`${classes.anonymousButton} ${classes.moved1}`);
      setPrivateButtonClass(`${classes.privateButton} ${classes.moved2}`);
    } else if (privateStatus === "public anonymous") {
      setPrivateButtonClass(`${classes.privateButton} ${classes.moved1}`);
      setPublicButtonClass(`${classes.publicButton} ${classes.moved2}`);
    } else if (privateStatus === "private") {
      setPublicButtonClass(`${classes.publicButton} ${classes.moved1}`);
      setAnonymousButtonClass(`${classes.anonymousButton} ${classes.moved2}`);
    }
  };

  const togglePrivate = (click) => {
    setOptionsOpen(!optionsOpen);

    if (click.target.innerHTML === "public") {
      setPublic();
      setPublicButtonClass(`${classes.publicButton} ${classes.selectedButton}`);
      setAnonymousButtonClass(`${classes.anonymousButton}`);
      setPrivateButtonClass(`${classes.privateButton}`);
    } else if (click.target.innerHTML === "private") {
      setPrivate();
      setPrivateButtonClass(
        `${classes.privateButton} ${classes.selectedButton}`
      );
      setAnonymousButtonClass(`${classes.anonymousButton}`);
      setPublicButtonClass(`${classes.publicButton}`);
    } else if (click.target.innerHTML === "public anonymous") {
      setAnonymous();
      setAnonymousButtonClass(
        `${classes.anonymousButton} ${classes.selectedButton}`
      );
      setPrivateButtonClass(`${classes.privateButton}`);
      setPublicButtonClass(`${classes.publicButton}`);
    }
  };
  const upvoteHandler = (id) => {
    upvote(id);
  };
  const deleteHandler = (id) => {
    deleteFeed(id);
  };

  return (
    <>
      <div className={classes.privateSetting} onClick={togglePrivate}>
        <div
          className={
            privateStatus === "public"
              ? `${publicButtonClass} ${classes.selectedButton}`
              : `${publicButtonClass}`
          }
        >
          public
        </div>
        <div
          className={
            privateStatus === "public anonymous"
              ? `${anonymousButtonClass} ${classes.selectedButton}`
              : `${anonymousButtonClass}`
          }
        >
          public anonymous
        </div>
        <div
          className={
            privateStatus === "private"
              ? `${privateButtonClass} ${classes.selectedButton}`
              : `${privateButtonClass}`
          }
        >
          private
        </div>
      </div>
      <p className={classes.feedInfo}>
        {privateStatus === "private"
          ? `comment is private`
          : `comment will be submitted to the public feed`}
      </p>
      <div className={classes.feedCard}>
        {comments
          .slice()
          .reverse()
          .map((entry) => {
            return (
              <SingleFeed
                feed={entry}
                key={entry.id}
                upvote={upvoteHandler}
                deleteFeed={deleteHandler}
                privateStatus={privateStatus}
              />
            );
          })}
      </div>
    </>
  );
};

export default FeedCard;
