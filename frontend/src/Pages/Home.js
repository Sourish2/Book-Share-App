import {
  useState,
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  motion
} from "motion/react";

import Navbar from "../Components/Navbar";
import SearchBar from "../Components/Searchbar";
import BookGrid from "../Components/Bookgrid";
import FeaturedCarousel from "../Components/FeaturedCarousel";
const API_URL =
  process.env.REACT_APP_API_URL
function Home() {

  const navigate =
    useNavigate();

  const [books, setBooks] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [selectedBook,
          setSelectedBook] =
    useState(null);

  const [selectedRect,
          setSelectedRect] =
    useState(null);

  useEffect(() => {

    const loadBooks =
      async () => {

        try {

          const response =
            await fetch(
              `${API_URL}/api/books/home/50`
            );

          const data =
            await response.json();
          setBooks(data);

        }
        catch (error) {

          console.error(error);

        }
        finally {

          setLoading(false);

        }

      };

    loadBooks();

  }, []);

  const filteredBooks =
    books.filter(
      (book) =>
        book.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const surpriseMe = () => {

    if (
      filteredBooks.length === 0
    ) {
      return;
    }

    const random =
      filteredBooks[
        Math.floor(
          Math.random() *
          filteredBooks.length
        )
      ];

    alert(
      `Try reading: ${random.title}`
    );

  };

  const openBook =
    (book, rect) => {

      setSelectedBook(
        book
      );

      setSelectedRect(
        rect
      );

      setTimeout(
        () => {

          navigate(
            `/book/${encodeURIComponent(
              book.filename
            )}`
          );

        },
        1200
      );

    };

  if (loading) {

    return (
      <>
        <Navbar />
        <h2>
          Loading books...
        </h2>
      </>
    );

  }

  return (

    <>

      <Navbar />

      <SearchBar
        search={search}
        setSearch={setSearch}
        surpriseMe={surpriseMe}
      />
      <FeaturedCarousel
    books={books.slice(0, 10)}
    onBookClick={openBook}/>

      <div

        style={{

          opacity:
            selectedBook
              ? 0.25
              : 1,

          transition:
            "opacity 0.3s"

        }}

      >

        <BookGrid

          books={
            filteredBooks
          }

          onBookClick={
            openBook
          }

        />

      </div>

      {

        selectedBook &&
        selectedRect && (

          <motion.div

            initial={{
              background:
                "rgba(0,0,0,0)"
            }}

            animate={{
              background:
                "rgba(0,0,0,0.75)"
            }}

            transition={{
              duration: 0.3
            }}

            style={{

              position:
                "fixed",

              inset: 0,

              zIndex: 1000

            }}

          >

            <motion.img

              src={
                selectedBook.cover
                  ? `${API_URL}${selectedBook.cover}`
                  : ""
              }

              alt={
                selectedBook.title
              }

              initial={{

                position:
                  "fixed",

                left:
                  selectedRect.left,

                top:
                  selectedRect.top,

                width:
                  selectedRect.width,

                height:
                  selectedRect.height

              }}

              animate={{

                left:
                  window.innerWidth / 2
                  - 130,

                top:
                  window.innerHeight / 2
                  - 190,

                width: 260,

                height: 380

              }}

              transition={{

                duration: 2,

                ease:
                    [0.16, 1, 0.3, 1]

              }}

              style={{

                position:
                  "fixed",

                objectFit:
                  "cover",

                borderRadius:
                  "12px",

                zIndex: 1001,

                boxShadow:
                  "0 0 40px rgba(255,255,255,0.3)"

              }}

            />

          </motion.div>

        )

      }

    </>

  );

}

export default Home;