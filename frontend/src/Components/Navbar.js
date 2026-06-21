import { useNavigate }
from "react-router-dom";

function Navbar() {

  const navigate =
    useNavigate();

  return (

    <nav className="navbar">

      <h1>📚 BookShelf</h1>

      <button
        className="upload-btn"
        onClick={() =>
          navigate("/upload")
        }
      >
        Upload EPUB
      </button>

    </nav>

  );

}

export default Navbar;