const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const router = express.Router();

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            "uploads/"
        );

    },

    filename: (req, file, cb) => {

        cb(
            null,
            file.originalname
        );

    }

});


const upload = multer({
    storage
});



router.post(
    "/upload",

    upload.fields([
        {
            name: "book",
            maxCount: 1
        },
        {
            name: "cover",
            maxCount: 1
        }
    ]),

    async (req, res) => {

        try {

            const book =
                req.files.book?.[0];

            const cover =
                req.files.cover?.[0];

            if (!book) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "No EPUB selected"

                    });

            }

            const bookName =
                path.parse(
                    book.filename
                ).name;

            if (cover) {

                const coverPath =
                    path.join(
                        __dirname,
                        "..",
                        "covers",
                        `${bookName}.jpg`
                    );

                fs.renameSync(
                    cover.path,
                    coverPath
                );

            }

            res.json({

                success: true,

                filename:
                    book.filename,

                cover:
                    cover
                        ? `/covers/${bookName}.jpg`
                        : null

            });

        }
        catch (error) {

            console.error(
                error
            );

            res.status(500)
                .json({

                    success: false,

                    message:
                        "Upload failed"

                });

        }

    }
);

router.get(
    "/books/:filename",
    (req, res) => {

        const filename =
            req.params.filename;

        const filePath =
            path.join(
                __dirname,
                "..",
                "uploads",
                filename
            );

        if (
            !fs.existsSync(filePath)
        ) {
            return res
                .status(404)
                .json({
                    success: false,
                    message:
                        "Book not found"
                });
        }

        res.sendFile(filePath);

    }
);

router.get(
    "/books/download/:filename",

    (req, res) => {

        const filename =
            req.params.filename;

        const filePath =
            path.join(
                __dirname,
                "..",
                "uploads",
                filename
            );

        if (
            !fs.existsSync(
                filePath
            )
        ) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        "Book not found"

                });

        }

        res.download(
            filePath,
            filename,
            (err) => {

                if (err) {

                    console.error(
                        err
                    );

                }

            }
        );

    }
);

router.get(
    "/books/home/:count",
    (req, res) => {

        const count =
            parseInt(
                req.params.count
            ) || 10;

        const uploadPath =
            path.join(
                __dirname,
                "..",
                "uploads"
            );

        const coverPath =
            path.join(
                __dirname,
                "..",
                "covers"
            );

        const books =
            fs.readdirSync(uploadPath)

                .filter(
                    file =>
                        file.endsWith(".epub")
                )

                .map(file => {

                    const title =
                        path.parse(file)
                            .name;

                    const coverFile =
                        path.join(
                            coverPath,
                            `${title}.jpg`
                        );

                    return {

                        title,

                        filename:
                            file,

                        cover:
                            fs.existsSync(
                                coverFile
                            )
                                ? `/covers/${title}.jpg`
                                : null

                    };

                });

        const shuffled =
            [...books]
                .sort(
                    () =>
                        Math.random() - 0.5
                );

        res.json(
            shuffled.slice(
                0,
                count
            )
        );

    }
);

module.exports = router;