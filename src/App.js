import { useState, useReducer, useEffect } from "react";
//components
import Card from "./Components/Card";
import FeedCard from "./Components/FeedCard";
import Form from "./Components/Form";
import SignIn from "./Components/SignIn";
import Dots from "react-activity/dist/Dots";
import SurveyBtn from "./Components/SurveyBtn";

import classes from "./App.module.css"; //style

import UserContext from "./Context/UserContext"; //context
//retrieval of information
import {
  deletePUBCommentDB,
  retrieveComment,
  updateVoters,
  updatePUB,
  updatePVT,
  retrievePUB,
  retrievePVT,
  deletePVTCommentDB,
  saveChoice,
} from "./Firebase";

import { topics } from "./Config/Config";

const USER = { username: "user@test.com", author: "user" };

const COMMENTS = {
  publicComments: [],
  privateComments: [],
  upvote: false,
};

function App() {
  const [user, setUser] = useState(USER);

  ///
  const upvote = (id) => {
    dispatchFn({ type: "UPVOTE", payload: id });
  };
  const addCommentToPUB = (comment) => {
    dispatchFn({ type: "ADD_TO_PUBLIC", payload: comment });
  };
  const addCommentToPVT = (comment) => {
    dispatchFn({ type: "ADD_TO_PRIVATE", payload: comment });
  };
  const deleteComment = (id) => {
    dispatchFn({ type: "DELETE_COMMENT", payload: id });
  };
  ///

  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("login");
  const [question, setQuestion] = useState();

  const [loading, setLoading] = useState(false);
  const [privateStatus, setPrivateStatus] = useState("public");

  const commentReducer = (state, action) => {
    switch (action.type) {
      case "DELETE_COMMENT":
        //action.payload is the id
        if (action.payload.split("^")[1] !== user.username) return state; //can only delete if you are the OP
        setLoading(true);
        if (privateStatus === "private") {
          deletePVTCommentDB(question, user.username, action.payload).then(
            () => {
              setLoading(false);
            }
          );
          return { ...state };
        } else {
          deletePUBCommentDB(question, action.payload).then(() => {
            setLoading(false);
          });
          return { ...state };
        }
      case "ADD_TO_PUBLIC":
        //action.payload is the comment
        updatePUB(question, action.payload).then(() => {});
        return { ...state };
      case "ADD_TO_PRIVATE":
        //action.payload is the comment
        // const updatedPVTComments = [...state.privateComments, action.payload];
        updatePVT(question, user.username, action.payload).then(() => {});
        // return { ...state, privateComments: updatedPVTComments };
        return { ...state };
      case "UPVOTE":
        if (privateStatus === "private") return state; //can only vote on public comments

        setLoading(true);
        (async function () {
          try {
            const comment = await retrieveComment(question, action.payload);
            const commentVoters = comment.voters;
            if (commentVoters.find((el) => el === user.username)) {
              const updatedVoters = commentVoters.filter(
                (el) => el !== user.username
              );
              updateVoters(question, action.payload, updatedVoters).then(
                () => {}
              );
            } else {
              const updatedVoters = [...commentVoters, user.username];
              updateVoters(question, action.payload, updatedVoters).then(
                () => {}
              );
            }
            setLoading(false);
          } catch (err) {
            console.log(
              err + " upvote unsuccessful, could not retrieve comment -- VL"
            );
          }
        })();
        return { ...state };

      default:
        return { ...state };
    }
  };

  const [state, dispatchFn] = useReducer(commentReducer, COMMENTS);

  const [commentsPUBdb, setCommentsPUBdb] = useState([]);
  const [commentsPVTdb, setCommentsPVTdb] = useState([]);

  useEffect(() => {
    retrievePUB(question).then((res) => {
      setCommentsPUBdb(res);
    });
    retrievePVT(question, user.username).then((res) => {
      setCommentsPVTdb(res);
    });
  }, [state, loading, page === "feedPage"]);

  const sendSelection = (topic) => {
    setQuestion(topic);
  };

  const setPrivate = () => {
    setPrivateStatus("private");
  };
  const setPublic = () => {
    setPrivateStatus("public");
  };
  const setAnonymous = () => {
    setPrivateStatus("public anonymous");
  };

  const setData = (props) => {
    if (privateStatus === "private")
      addCommentToPVT({
        comment: props,
        id: `${Date.now()}^${user.username}^${props}`,
        voters: [],
        author: user.author,
      });
    else
      addCommentToPUB({
        comment: props,
        id: `${Date.now()}^${user.username}^${props}`,
        voters: [],
        author: `${
          privateStatus === "public anonymous" ? `anonymous` : user.author
        }`,
      });
  };

  const goBack = () => {
    setPage("questionPage");
  };
  const gotoFeed = async () => {
    if (!question) return;
    setLoading(true);
    try {
      await saveChoice(question, user.username);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
    setPage("feedPage");
  };

  if (page === "login")
    return (
      <UserContext.Provider value={[user, setUser, setPage]}>
        <Card goBack={goBack} gotoFeed={gotoFeed} page={page}>
          <p className={classes.thankyou}>
            thank you for being a part of our survey
          </p>
          {/* <p className={classes.publicFeed}>
            read through the public feed, if you share the same sentiments as
            you see in a comment,{" "}
            <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
              upvote it
            </span>
            .
          </p>
          <p className={classes.publicButton}>
            by selecting the{" "}
            <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
              public button
            </span>
            , you can choose if your comment should be{" "}
            <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
              anonymous or not
            </span>
            . This will display in the public feed. If you select private, it
            will only be viewed by administration.
          </p> */}
          <SignIn setLoggedIn={setLoggedIn} />
        </Card>
      </UserContext.Provider>
    );
  else if (page === "questionPage")
    return (
      <Card
        goBack={goBack}
        gotoFeed={gotoFeed}
        page={page}
        message={`you will be able to return to choose another topic`}
      >
        {loading && <Dots className={classes.dots} />}
        <p className={classes.question}>which topic most appeals to you:</p>
        {topics.map((topic) => {
          const selected = topic === question;
          return (
            <SurveyBtn
              text={topic}
              key={topic}
              sendSelection={sendSelection}
              selected={selected}
            />
          );
        })}
      </Card>
    );
  else if (page === "feedPage")
    return (
      <div>
        <UserContext.Provider value={[user, setUser]}>
          <Card
            goBack={goBack}
            gotoFeed={gotoFeed}
            page={page}
            message={`your choice has been recorded`}
          >
            {loading && <Dots className={classes.dots} />}
            <Form setData={setData} question={question} />
            {privateStatus === "private" && (
              <FeedCard
                comments={commentsPVTdb}
                setPrivate={setPrivate}
                setPublic={setPublic}
                setAnonymous={setAnonymous}
                privateStatus={privateStatus}
                upvote={upvote}
                deleteFeed={deleteComment}
                loggedIn={loggedIn}
              />
            )}
            {privateStatus !== "private" && (
              <FeedCard
                comments={commentsPUBdb}
                setPrivate={setPrivate}
                setPublic={setPublic}
                setAnonymous={setAnonymous}
                privateStatus={privateStatus}
                upvote={upvote}
                deleteFeed={deleteComment}
                loggedIn={loggedIn}
              />
            )}
          </Card>
        </UserContext.Provider>
      </div>
    );
}

export default App;
