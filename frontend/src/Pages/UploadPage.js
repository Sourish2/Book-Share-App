import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ePub from "epubjs";

import "./UploadPage.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

function UploadPage() {

    const navigate = useNavigate();

    const [file, setFile] =
        useState(null);

    const [coverUrl, setCoverUrl] =
        useState(null);

    const [coverFile, setCoverFile] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const handleFileSelect =
        async (event) => {

            const selectedFile =
                event.target.files[0];

            setFile(
                selectedFile
            );

            if (!selectedFile) {

                setCoverUrl(
                    null
                );

                setCoverFile(
                    null
                );

                return;

            }

            try {

                const arrayBuffer =
                    await selectedFile
                        .arrayBuffer();

                const book =
                    ePub(
                        arrayBuffer
                    );

                const cover =
                    await book.coverUrl();

                setCoverUrl(
                    cover
                );

                const response =
                    await fetch(
                        cover
                    );

                const blob =
                    await response
                        .blob();

                const imageFile =
                    new File(

                        [blob],

                        "cover.jpg",

                        {
                            type:
                                blob.type
                        }

                    );

                setCoverFile(
                    imageFile
                );

            }
            catch (error) {

                console.error(
                    "Cover extraction failed:",
                    error
                );

                setCoverUrl(
                    null
                );

                setCoverFile(
                    null
                );

            }

        };

    const handleUpload =
        async () => {

            if (!file) {

                setMessage(
                    "Please select an EPUB."
                );

                return;

            }

            const formData =
                new FormData();

            formData.append(
                "book",
                file
            );

            if (coverFile) {

                formData.append(
                    "cover",
                    coverFile
                );

            }

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/upload`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                const data =
                    await response.json();

                if (data.success) {

                    alert(
                        "File Uploaded. Thank You for Contributing!"
                    );

                    navigate("/");

                }
                else {

                    setMessage(
                        data.message
                    );

                }

            }
            catch (error) {

                console.error(
                    error
                );

                setMessage(
                    "Upload failed."
                );

            }

        };

    return (

        <div className="upload-page">

            <h1>
                Share Your Books
            </h1>

            <p>
                Help expand the community
                library by sharing your EPUB
                collection. Every upload
                makes it easier for readers
                to discover new books.
            </p>

            <div className="upload-controls">

                <input
                    type="file"
                    accept=".epub"
                    onChange={
                        handleFileSelect
                    }
                />

                <div className="cover-preview">

                    {
                        coverUrl
                            ? (
                                <img
                                    src={
                                        coverUrl
                                    }
                                    alt="Book Cover"
                                />
                            )
                            : (
                                <div className="cover-placeholder">
                                    No Cover Found
                                </div>
                            )
                    }

                </div>

                <button
                    onClick={
                        handleUpload
                    }
                >
                    Upload
                </button>

                <button
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Back
                </button>

            </div>

            <p>
                {message}
            </p>

        </div>

    );

}

export default UploadPage;