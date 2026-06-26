const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2/promise");

const db = mysql.createPool({

  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT

});

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command
} = require(
  "@aws-sdk/client-s3"
);

const router = express.Router();

const upload =
  multer({

    storage:
      multer.memoryStorage()

  });


const s3 =
  new S3Client({

    region:
      process.env.AWS_REGION,

    credentials: {

      accessKeyId:
        process.env
          .AWS_ACCESS_KEY_ID,

      secretAccessKey:
        process.env
          .AWS_SECRET_ACCESS_KEY

    }

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
          book.originalname
        ).name;

      const bookKey =
        `books/${book.originalname}`;
      let coverKey =
        null;

      if (cover) {

        coverKey =
          `covers/${bookName}.jpg`;

        await s3.send(

          new PutObjectCommand({

            Bucket:
              process.env.S3_BUCKET,

            Key:
              coverKey,

            Body:
              cover.buffer,

            ContentType:
              cover.mimetype

          })

        );

      }

      await s3.send(

        new PutObjectCommand({

          Bucket:
            process.env.S3_BUCKET,

          Key:
            bookKey,

          Body:
            book.buffer,

          ContentType:
            "application/epub+zip"

        })

      );

      

      res.json({

        success: true,

        filename:
          book.originalname,

        bookKey,

        coverKey

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
            "Upload failed",

          error:
            error.message

        });

    }

  }

);
router.get(
  "/books/:filename",

  async (req, res) => {

    try {

      const filename =
        req.params.filename;

      const object =
        await s3.send(

          new GetObjectCommand({

            Bucket:
              process.env.S3_BUCKET,

            Key:
              `books/${filename}`

          })

        );

      res.setHeader(
        "Content-Type",
        "application/epub+zip"
      );

      object.Body.pipe(res);

    }

    catch (error) {

      console.error(error);

      res.status(404)
        .json({

          success: false,

          message:
            "Book not found"

        });

    }

  }
);

router.get(

  "/books/download/:filename",

  async (req, res) => {

    try {

      const filename =
        req.params.filename;

      const object =
        await s3.send(

          new GetObjectCommand({

            Bucket:
              process.env.S3_BUCKET,

            Key:
              `books/${filename}`

          })

        );

      res.setHeader(

        "Content-Disposition",

        `attachment; filename="${filename}"`

      );

      res.setHeader(
        "Content-Type",
        "application/epub+zip"
      );

      object.Body.pipe(res);

    }

    catch (error) {

      console.error(error);

      res.status(404)
        .json({

          success: false,

          message:
            "Book not found"

        });

    }

  }

);

router.get(

  "/books/home/:count",

  async (req, res) => {

    try {

      const count =
        parseInt(
          req.params.count
        ) || 10;

      const [rows] = await db.query(
    `
    SELECT
        title,
        filename,
        cover_key
    FROM books
    ORDER BY RAND()
    LIMIT ${Number(count)}
    `
);

      const books =

        rows.map(book => {

          const cleanTitle =

            book.title

              .replace(
                /\s*\(\d+\)\s*$/g,
                ""
              );

          return {

            title:
              cleanTitle,

            filename:
              book.filename,

            cover:
              book.cover_key
                ? `/api/covers/${book.title}.jpg`
                : null

          };

        });

      res.json(
        books
      );

    }

    catch (error) {

      console.error(
        error
      );

      res.status(500)
        .json({

          success: false,

          message:
            "Failed to load books"

        });

    }

  }

);

router.get(

  "/covers/:filename",

  async (req, res) => {

    try {

      const object =
        await s3.send(

          new GetObjectCommand({

            Bucket:
              process.env.S3_BUCKET,

            Key:
              `covers/${req.params.filename}`

          })

        );

      res.setHeader(
        "Content-Type",
        "image/jpeg"
      );

      object.Body.pipe(res);

    }

    catch (error) {

      res.status(404)
        .json({

          success: false,

          message:
            "Cover not found"

        });

    }

  }

);

router.get("/books/search/:name",async (req,res)=>{
  try{
    const name=req.params.name;
    const [rows]=await db.query(`SELECT title,filename,cover_key
      FROM books
      WHERE title like ?
      ORDER BY title`,
    `${name}%`);
    const books=rows.map(book=>{
      const cleanTitle =
            book.title.replace(
              /(\s*\(\d+\))+$/g,
              ""
            );

          return {

            title:
              cleanTitle,

            filename:
              book.filename,

            cover:
              book.cover_key
                ? `/api/covers/${encodeURIComponent(book.cover_key.replace("covers/", ""))}`
                : null
          };
    });
    res.json(books);
  }
  catch(error){
    console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Search failed"

      });

    }

}
);

module.exports = router;