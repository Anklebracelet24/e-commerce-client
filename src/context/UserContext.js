import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          id: null,
          isAdmin: false,
        };
  });

  const unsetUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser({
      id: null,
      isAdmin: false,
    });
  };

  // Effect to fetch and verify user data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched user data:", data);

          const userData = data.user;

          if (userData && userData._id) {
            const userToSave = {
              id: userData._id,
              isAdmin: userData.isAdmin,
            };
            setUser(userToSave);
            localStorage.setItem("user", JSON.stringify(userToSave));
          } else {
            unsetUser();
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          unsetUser();
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, unsetUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
