import {
  useEffect,
  useRef
} from "react";

import {
  motion
} from "motion/react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import ePub from "epubjs";

import "./ReaderPage.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

function ReaderPage() {

  const { filename } =
    useParams();

  const navigate =
    useNavigate();

  const viewerRef =
    useRef(null);

  const renditionRef =
    useRef(null);

  useEffect(() => {

    let book;
    let rendition;
    

    const loadBook =
      async () => {

        try {

          const bookUrl =
            `${API_URL}/api/books/${encodeURIComponent(
              decodeURIComponent(
                filename
              )
            )}`;

          console.log(
            "Loading:",
            bookUrl
          );

          const response =
            await fetch(
              bookUrl
            );

          console.log(
            "Status:",
            response.status
          );

          if (
            !response.ok
          ) {

            throw new Error(
              "Book fetch failed"
            );

          }

          book =
            ePub(bookUrl);

          await book.opened;

          if (
            !viewerRef.current
          ) {
            return;
          }

          rendition =
            book.renderTo(
              viewerRef.current,
              {

                width: 900,

                height: 650,

                spread:
                  "always",

                flow:
                  "paginated"

              }
            );

          renditionRef.current =
            rendition;

          await rendition.display();
          rendition.themes.default({

  body: {

    "background-color":
      "#111",

    color:
      "#ffffff"

  },

  p: {

    color:
      "#ffffff"

  },

  h1: {

    color:
      "#ffffff"

  },

  h2: {

    color:
      "#ffffff"

  },

  h3: {

    color:
      "#ffffff"

  },

  a: {

    color:
      "#7fbfff"

  }

});

        }
        catch (error) {

          console.error(
            "Reader failed:",
            error
          );

        }

      };

    loadBook();

    return () => {

      try {

        rendition?.destroy();

        // leave book alive for now
        // book?.destroy();

      }
      catch (err) {

        console.error(
          err
        );

      }

    };

  }, [filename]);

  const turnNext =
  () => {

    const book =
      document.querySelector(
        ".book-frame"
      );

    book.animate(

      [

        {
          transform:
            "perspective(1200px) rotateY(0deg)"
        },

        {
          transform:
            "perspective(1200px) rotateY(-12deg)"
        },

        {
          transform:
            "perspective(1200px) rotateY(0deg)"
        }

      ],

      {

        duration: 450,

        easing:
          "ease-in-out"

      }

    );

    renditionRef.current?.next();

  };

  const turnPrev =
  () => {

    const book =
      document.querySelector(
        ".book-frame"
      );

    book.animate(

      [

        {
          transform:
            "perspective(1200px) rotateY(0deg)"
        },

        {
          transform:
            "perspective(1200px) rotateY(12deg)"
        },

        {
          transform:
            "perspective(1200px) rotateY(0deg)"
        }

      ],

      {

        duration: 450,

        easing:
          "ease-in-out"

      }

    );

    renditionRef.current?.prev();

  };

  return (

    <div className="reader-page">

      <div className="reader-toolbar">

        <button
          onClick={() =>
            navigate(-1)
          }
        >
          Back
        </button>

        <h2>

          {
            decodeURIComponent(
              filename
            ).replace(
              ".epub",
              ""
            )
          }

        </h2>

      </div>

      <div className="reader-container">

        <button
  className="nav-btn"
  onClick={turnPrev}
>
  ◀
</button>
        
        
        <motion.div

  className="book-frame"

  animate={{
    rotateY: 0
  }}

  transition={{
    duration: 0.4
  }}

>

  <div
    ref={viewerRef}
    className="epub-viewer"
  />

  <div className="page-overlay">

    <div

      className="left-click"

      onClick={turnPrev}

    />

    <div

      className="right-click"

      onClick={turnNext}

    />

  </div>

</motion.div>

        <button
  className="nav-btn"
  onClick={turnNext}
>
  ▶
</button>

      </div>

    </div>

  );

}

export default ReaderPage;