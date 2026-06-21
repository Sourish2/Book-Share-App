const API_URL =process.env.REACT_APP_API_URL ;

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