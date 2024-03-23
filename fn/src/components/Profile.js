import React, { useEffect } from "react";

const Profile = () => {
  const name = localStorage.getItem("name");

  useEffect(() => {
    console.log("redirect");
    return () => {};
  }, []);

  return (
    <div style={{ marginTop: "100px" }}>
      <h2>Welcome, {name}</h2>
    </div>
  );
};

export default Profile;
