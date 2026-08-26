"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
}

export default function Reviews() {
  const reviews: Review[] = [
    {
      id: 1,
      name: "Ananya M.",
      location: "Mumbai, India",
      rating: 5,
      text: "The Daisy Market Tote is absolutely beautiful! You can see the love and precision in every single stitch. The cotton yarn feels so premium, and it holds shape perfectly even when loaded with groceries. Best purchase ever!",
      product: "Daisy Market Tote",
    },
    {
      id: 2,
      name: "Ishita R.",
      location: "Bengaluru, India",
      rating: 5,
      text: "I ordered the Blush Bunny for my daughter's nursery, and it is the sweetest, softest little thing. Anjali was so helpful with my custom color request, keeping me updated as she worked on it. It will be cherished for years.",
      product: "Blush Bunny (Custom Order)",
    },
    {
      id: 3,
      name: "Meera K.",
      location: "Pune, India",
      rating: 5,
      text: "This Vintage Square Blanket is a work of art. The color harmony (sage, coral, and cocoa) is stunning and fits my living room perfectly. It feels heavy, warm, and holds that beautiful artisan character that you just can't buy in stores.",
      product: "Vintage Square Blanket",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === reviews.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <section className="section-padding reviews-section">
      <div className="container">
        <h2 className="section-title text-serif">Loved by Cozy Lovers</h2>
        <div className="section-subtitle tagline">
          <span className="flourish-heart">♥</span>
          Real reviews from our community
          <span className="flourish-heart">♥</span>
        </div>

        <div className="reviews-carousel-container">
          <button 
            className="carousel-nav-btn touch-target prev-btn" 
            onClick={prevSlide}
            aria-label="Previous review"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="review-active-slide">
            <div className="review-stars">
              {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                <Star key={i} size={16} fill="var(--coral)" color="var(--coral)" className="star-icon" />
              ))}
            </div>

            <blockquote className="review-text text-serif">
              "{reviews[currentIndex].text}"
            </blockquote>

            <div className="review-author text-sans">
              <cite className="author-name">{reviews[currentIndex].name}</cite>
              <span className="author-location">{reviews[currentIndex].location}</span>
            </div>

            <div className="review-product text-sans">
              Verified Purchase: <span className="product-tag">{reviews[currentIndex].product}</span>
            </div>
          </div>

          <button 
            className="carousel-nav-btn touch-target next-btn" 
            onClick={nextSlide}
            aria-label="Next review"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Indicator dots */}
        <div className="carousel-dots">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .reviews-section {
          background-color: var(--cream);
          border-bottom: 1px solid rgba(75, 58, 50, 0.05);
        }

        .reviews-carousel-container {
          position: relative;
          max-width: 800px;
          margin: 0 auto 30px auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--white);
          padding: 60px;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(75, 58, 50, 0.04);
        }

        .review-active-slide {
          text-align: center;
          width: 80%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .review-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 24px;
          justify-content: center;
        }

        .review-text {
          font-size: var(--fs-lg);
          color: var(--cocoa);
          line-height: 1.6;
          font-style: italic;
          margin-bottom: 24px;
        }

        .review-author {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 16px;
        }

        .author-name {
          font-weight: 700;
          font-style: normal;
          color: var(--cocoa);
          font-size: var(--fs-sm);
        }

        .author-location {
          font-size: var(--fs-xs);
          color: var(--cocoa);
          opacity: 0.6;
        }

        .review-product {
          font-size: 11px;
          color: var(--sage);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .product-tag {
          color: var(--cocoa);
          opacity: 0.8;
        }

        /* Carousel Navigation */
        .carousel-nav-btn {
          color: var(--cocoa);
          background-color: var(--cream);
          border-radius: var(--border-radius-round);
          transition: var(--transition-fast);
        }

        .carousel-nav-btn:hover {
          background-color: var(--cocoa);
          color: var(--cream);
          transform: scale(1.05);
        }

        /* Dots */
        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--border-radius-round);
          background-color: rgba(75, 58, 50, 0.2);
          transition: var(--transition-fast);
        }

        .carousel-dot.active {
          background-color: var(--coral);
          width: 24px;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .reviews-carousel-container {
            padding: 40px 20px;
          }

          .review-active-slide {
            width: 100%;
          }

          .review-text {
            font-size: var(--fs-base);
          }

          .prev-btn, .next-btn {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
