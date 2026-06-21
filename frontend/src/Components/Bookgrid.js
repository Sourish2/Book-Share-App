import BookCard
  from "./Bookcard";

function BookGrid({
  books,
  onBookClick
}) {

  return (

    <div className="book-grid">

      {
        books.map(
          (book) => (

            <BookCard
              key={
                book.filename
              }
              book={book}
              onClick={
                (book, rect) =>
    onBookClick(
      book,
      rect
    )
              }
            />

          )
        )
      }

    </div>

  );

}

export default BookGrid;