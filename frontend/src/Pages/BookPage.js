import {
    useParams,
    useNavigate
}
from "react-router-dom";

import "./BookPage.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

function BookPage() {

    const {
        filename
    } = useParams();

    const navigate =
        useNavigate();

    const title =
        decodeURIComponent(
            filename
        ).replace(
            ".epub",
            ""
        );

    const coverUrl =
        `${API_URL}/covers/${title}.jpg`;

    const downloadUrl =
        `${API_URL}/api/books/${encodeURIComponent(
            filename
        )}`;

    return (

        <div
            className="book-page"
        >

            <img
                className="book-page-cover"
                src={coverUrl}
                alt={title}
            />

            <h1>
                {title}
            </h1>

            <div
                className="book-actions"
            >

                <button

                    onClick={() =>
                        navigate(
                            `/reader/${encodeURIComponent(
                                filename
                            )}`
                        )
                    }

                >
                    Read Online
                </button>

                <a
                    href={
                        downloadUrl
                    }
                    download
                >

                    <button>
                        Download
                    </button>

                </a>

            </div>

            <button

                className="back-btn"

                onClick={() =>
                    navigate("/")
                }

            >
                Back
            </button>

        </div>

    );

}

export default BookPage;