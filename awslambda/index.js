const {
    S3Client,
    HeadObjectCommand
} = require("@aws-sdk/client-s3");

const mysql =
    require("mysql2/promise");

const s3 =
    new S3Client({});

exports.handler =
    async (event) => {

        const record =
            event.Records[0];

        const bucket =
            record.s3.bucket.name;

        const bookKey =
            decodeURIComponent(
                record.s3.object.key
            );

        const filename =
            bookKey
                .split("/")
                .pop();

        const title =
            filename.replace(
                /\.epub$/i,
                ""
            );

        const coverKey =
            `covers/${title}.jpg`;

        let finalCover =
            null;

        try {

            await s3.send(

                new HeadObjectCommand({

                    Bucket:
                        bucket,

                    Key:
                        coverKey

                })

            );

            finalCover =
                coverKey;

        }

        catch {

            finalCover =
                null;

        }

        const connection =
            await mysql.createConnection({

                host:
                    process.env.DB_HOST,

                port:
                    process.env.DB_PORT,

                user:
                    process.env.DB_USER,

                password:
                    process.env.DB_PASSWORD,

                database:
                    process.env.DB_NAME

            });

        try {

            await connection.execute(

                `INSERT INTO books
                (
                    title,
                    filename,
                    book_key,
                    cover_key
                )
                VALUES
                (
                    ?, ?, ?, ?
                )`,

                [

                    title,

                    filename,

                    bookKey,

                    finalCover

                ]

            );

            console.log(
                `${title} inserted`
            );

        }

        finally {

            await connection.end();

        }

        return {

            statusCode: 200,

            body: JSON.stringify({

                success: true

            })

        };

    };