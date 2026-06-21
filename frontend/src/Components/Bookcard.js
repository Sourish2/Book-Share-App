const API_URL =
  "http://localhost:5000";

function BookCard({
  book,
  onClick
}) {

  return (

    <div

      className="book-card"

      onClick={(e) => {

        const rect =
          e.currentTarget
            .getBoundingClientRect();

        onClick(
          book,
          rect
        );

      }}

    >

      {
        book.cover
          ? (
              <img
                className="book-cover"
                src={
                  API_URL +
                  book.cover
                }
                alt={
                  book.title
                }
              />
            )
          : (
              <div className="book-template">
                {book.title}
              </div>
            )
      }

      <p>{book.title}</p>

    </div>

  );

}

export default BookCard;