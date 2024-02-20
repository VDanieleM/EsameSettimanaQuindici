import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Table, Container } from "react-bootstrap";
import he from "he";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://o.canada.com//wp-json/wp/v2/users")
      .then((response) => {
        const decodedUsers = response.data.map((user) => {
          return { ...user, name: he.decode(user.name) };
        });
        setUsers(decodedUsers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="d-flex justify-content-center py-5">
        <h1>Utenti</h1>
      </div>
      <Container>
        {loading ? (
          <div className="d-flex justify-content-center">
            <div
              className="spinner-border"
              role="status"
              style={{ width: "3rem", height: "3rem", color: "#198754" }}
            ></div>
          </div>
        ) : (
          <Table
            striped
            bordered
            hover
            style={{
              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              backgroundColor: "linear-gradient(to bottom, #198754, #fff)",
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default Home;
