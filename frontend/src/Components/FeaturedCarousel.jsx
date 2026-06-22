import { useEffect, useState } from "react";
import { motion } from "motion/react";
import "./FeaturedCarousel.css";

const API_URL =
  process.env.REACT_APP_API_URL;

export default function FeaturedCarousel({
  books = [],
  onBookClick
}) {

  const [activeIndex,
         setActiveIndex] =
    useState(0);

  const [paused,
         setPaused] =
    useState(false);

  useEffect(() => {

    if (
      paused ||
      books.length < 3
    ) {
      return;
    }

    const timer =
      setInterval(() => {

        setActiveIndex(
          prev =>
            (prev + 1) %
            books.length
        );

      }, 8000);

    return () =>
      clearInterval(timer);

  }, [
    paused,
    books.length
  ]);

  if (
    books.length < 3
  ) {
    return null;
  }

  const radius = 350;

  const getPosition =
    (bookIndex) => {

      let offset =
        bookIndex -
        activeIndex;

      if (
        offset >
        books.length / 2
      ) {
        offset -=
          books.length;
      }

      if (
        offset <
        -books.length / 2
      ) {
        offset +=
          books.length;
      }

      const angle =
        offset * 120;

      const radians =
        angle *
        Math.PI /
        180;

      const x =
        Math.sin(
          radians
        ) * radius;

      const z =
        Math.cos(
          radians
        ) * radius;

      const scale =
        0.6 +
        (
          (z + radius)
          /
          (radius * 2)
        ) *
        0.4;

      const opacity =
        0.15 +
        (
          (z + radius)
          /
          (radius * 2)
        ) *
        0.85;

      return {

        x,

        scale,

        opacity,

        zIndex:
          Math.round(z),

        rotateY:
          -angle * 0.25

      };

    };

  return (

    <div
      className=
        "carousel-container"
    >

      {

        books.map(
          (
            book,
            index
          ) => {

            const pos =
              getPosition(
                index
              );

            const isCenter =
              index ===
              activeIndex;

            if (
              pos.opacity <
              0.05
            ) {
              return null;
            }

            return (

              <motion.div

                key={
                  book.id
                }

                className=
                  "carousel-book"

                initial={
                  {x:0}
                }

                animate={
                  pos
                }

                transition={{

                  duration: 1.6,

                  ease:
                    "easeInOut"

                }}

                onClick={
                  (e) => {

                    if (
                      isCenter
                    ) {

                      const rect =
                        e.currentTarget
                          .querySelector(
                            "img"
                          )
                          .getBoundingClientRect();

                      onBookClick(
                        book,
                        rect
                      );

                      return;
                    }

                    setPaused(
                      true
                    );

                    setActiveIndex(
                      index
                    );

                    setTimeout(
                      () =>
                        setPaused(
                          false
                        ),
                      1600
                    );

                  }
                }

              >

                <img

                  src={
                    `${API_URL}${book.cover}`
                  }

                  alt={
                    book.title
                  }

                  draggable={
                    false
                  }

                />

              </motion.div>

            );

          }
        )

      }

    </div>

  );

}