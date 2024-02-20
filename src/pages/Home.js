import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/Home.css";
import he from "he";

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("https://o.canada.com//wp-json/wp/v2/users")
      .then((response) => {
        const decodedUsers = response.data.map((user) => {
          return { ...user, name: he.decode(user.name) };
        });
        setUsers(decodedUsers);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="text-center align-items-center pt-5">
        <h1>Benvenuto all'app WordPress!</h1>
        <p className="fs-5">Unisciti ai nostri collaboratori</p>
      </div>
      <div className="position-relative" style={{ height: "75vh" }}>
        {users.map((user) => (
          <div
            key={user.id}
            className="user-name"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 2}s`,
              color: `hsl(${Math.random() * 360}, 50%, 50%)`,
            }}
          >
            {user.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
