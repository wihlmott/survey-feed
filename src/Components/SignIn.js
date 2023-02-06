import UserContext from "../Context/UserContext";
import { useContext, useState } from "react";
import Dots from "react-activity/dist/Dots";
import "react-activity/dist/Dots.css";

import { retrieveUsers, setNewUser, signInWithGoogle } from "../Firebase";

import classes from "./SignIn.module.css";

const SignIn = ({ setLoggedIn }) => {
  const [user, setUserCtx, setPage] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const signInUser = async () => {
    setIsLoading(true);
    let dbInfo, googleInfo;
    try {
      //google user info
      await signInWithGoogle().then((res) => {
        googleInfo = res;
      });
      //db all users
      await retrieveUsers().then((res) => {
        dbInfo = res;
      });
      //check for user
      if (
        dbInfo.find((user) => {
          return user === googleInfo.user.email;
        })
      ) {
        console.log(`found`); //set user
        setActiveUser(googleInfo.user);
        setPage("questionPage");
      } else {
        console.log(`not found = users ${dbInfo}`); //add user
        await setNewUser(googleInfo);
        setActiveUser(googleInfo.user);
        setPage("questionPage");
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const setActiveUser = (user) => {
    setUserCtx({ username: user.email, author: user.displayName });
    window.localStorage.setItem("savedUser", JSON.stringify(user));
    // setLoggedIn(true);
  };

  return (
    <>
      {isLoading && <Dots className={classes.dots} />}
      <div className={classes.googleButton} onClick={signInUser}>
        <div className={classes.googleIconWrapper}>
          <img
            className={classes.googleIcon}
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          />
        </div>
        <p className={classes.buttonText}>
          <b>Sign in with google</b>
        </p>
      </div>
    </>
  );
};

export default SignIn;
