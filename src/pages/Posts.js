import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Card, Button, Modal, Row, Col, Container } from "react-bootstrap";
import he from "he";
import "../css/Posts.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [images, setImages] = useState({});
  const [categories, setCategories] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [postCount, setPostCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNoResults(false);
    const timerId = setTimeout(() => {
      axios
        .get(
          `https://o.canada.com/wp-json/wp/v2/posts?search=${searchQuery}&per_page=${postCount}`
        )
        .then((response) => {
          if (response.data.length === 0) {
            setNoResults(true);
          } else {
            setPosts(response.data);
            const authorIds = [
              ...new Set(response.data.map((post) => post.author)),
            ];
            authorIds.forEach((id) => {
              axios
                .get(`https://o.canada.com/wp-json/wp/v2/users/${id}`)
                .then((response) => {
                  setAuthors((prevAuthors) => ({
                    ...prevAuthors,
                    [id]: he.decode(response.data.name),
                  }));
                })
                .catch((error) => {
                  console.error(
                    `There was an error fetching the author with ID ${id}!`,
                    error
                  );
                });
            });

            const imageIds = [
              ...new Set(response.data.map((post) => post.featured_media)),
            ];
            imageIds.forEach((id) => {
              axios
                .get(`https://o.canada.com/wp-json/wp/v2/media/${id}`)
                .then((response) => {
                  setImages((prevImages) => ({
                    ...prevImages,
                    [id]: response.data.source_url,
                  }));
                })
                .catch((error) => {
                  console.error(
                    `There was an error fetching the image with ID ${id}!`,
                    error
                  );
                });
            });

            const categoryIds = [
              ...new Set(response.data.flatMap((post) => post.categories)),
            ];
            categoryIds.forEach((id) => {
              axios
                .get(`https://o.canada.com/wp-json/wp/v2/categories/${id}`)
                .then((response) => {
                  setCategories((prevCategories) => ({
                    ...prevCategories,
                    [id]: response.data.name,
                  }));
                })
                .catch((error) => {
                  console.error(
                    `There was an error fetching the category with ID ${id}!`,
                    error
                  );
                });
            });
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("There was an error!", error);
          setLoading(false);
        });
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery, postCount]);

  const handleOpen = (post) => {
    setSelectedPost(post);
  };

  const handleClose = () => {
    setSelectedPost(null);
  };

  const removeHTMLTags = (str) => {
    let noTags = str.replace(/<[^>]*>/g, "");
    let noHTMLEntities = noTags.replace(/&[^;]+;/g, "");
    let noBrackets = noHTMLEntities.replace(/\[\]/g, "");
    return noBrackets;
  };

  const loadMorePosts = (event) => {
    event.preventDefault();
    setPostCount(postCount + 8);
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex justify-content-center py-5">
        <h1 style={{ marginBottom: "-10dvh" }}>Tutti gli articoli</h1>
      </div>
      <div className="d-flex justify-content-center py-5">
        <input
          type="text"
          placeholder="Cerca..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>
      <Container>
        <Row xs={1} md={2} lg={4} className="g-4 pb-5">
          {posts
            .filter((post) =>
              removeHTMLTags(post.title.rendered)
                .toLowerCase()
                .trim()
                .includes(searchQuery.toLowerCase().trim())
            )
            .map((post) => (
              <Col key={post.id}>
                <Card
                  style={{
                    width: "18rem",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    backgroundColor:
                      "linear-gradient(to bottom, #f9f9f9, #fff)",
                  }}
                >
                  <Card.Img variant="top" src={images[post.featured_media]} />
                  <Card.Body>
                    <Card.Title>
                      {removeHTMLTags(post.title.rendered)}
                    </Card.Title>
                    <Card.Text>
                      {removeHTMLTags(post.excerpt.rendered)}
                    </Card.Text>
                    <Button variant="success" onClick={() => handleOpen(post)}>
                      Continua a leggere
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
        {loading ? (
          <>
            <div className="d-flex justify-content-center pb-5">
              <div
                className="spinner-border"
                role="status"
                style={{ width: "3rem", height: "3rem", color: "#198754" }}
              ></div>
            </div>
          </>
        ) : noResults ? (
          <div className="d-flex justify-content-center py-5">
            <p style={{ color: "#198754" }}>Nessun risultato trovato</p>
          </div>
        ) : (
          <div className="d-flex justify-content-center pb-5">
            <Button variant="success" onClick={loadMorePosts}>
              Carica altri post
            </Button>
          </div>
        )}
      </Container>

      {selectedPost && (
        <Modal show={true} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {removeHTMLTags(selectedPost.title.rendered)}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ overflowY: "auto", maxHeight: "60vh" }}>
            <Card.Subtitle className="mb-2 text-muted">
              Autore: {` ${authors[selectedPost.author]}`}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">
              Pubblicazione:{" "}
              {` ${new Date(selectedPost.date).toLocaleDateString("it-IT")}`}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">
              Categoria: {` ${categories[selectedPost.categories[0]]}`}
            </Card.Subtitle>
            <div
              dangerouslySetInnerHTML={{
                __html: selectedPost.content.rendered,
              }}
              style={{
                maxWidth: "100%",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                overflowX: "hidden",
                overflowWrap: "break-word",
                boxSizing: "border-box",
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Home;
