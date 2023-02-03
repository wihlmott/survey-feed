import { createContext } from "react";

const UserContext = createContext({
  privateComments: [],
  username: "user@test.com",
  author: "user",
});

export default UserContext;
