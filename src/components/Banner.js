import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import "./Banner.css";

const Banner = () => {
  return (
    <Carousel
      autoPlay
      interval={3000}
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      showArrows={true}
      swipeable={true}
    >
      <div className="carousel-item">
        <img src={require('../component_photos/image1.jpg')} alt="Health 1" />
        <div className="banner-text">
          <h2>Welcome to JoshMach Pharmacy</h2>
          <p>
            Your Trusted Partner in Health and Wellness<br/>
            We provide top-quality pharmaceutical products and personalized care to support your well-being.
          </p>
          <button>SHOP NOW</button>
        </div>
      </div>
      <div className="carousel-item">
        <img src={require('../component_photos/image2.jpg')} alt="Health 2" />
        <div className="banner-text">
          <h2>Experience Personalized Service</h2>
          <p>
            Your Health is Our Priority<br/>
            Our team is dedicated to providing expert guidance and the care you deserve.
          </p>
          <button>SHOP NOW</button>
        </div>
      </div>
      <div className="carousel-item">
        <img src={require('../component_photos/image3.jpg')} alt="Health 3" />
        <div className="banner-text">
          <h2>Door to Door Delivery</h2>
          <p>
            Convenience at Your Fingertips<br/>
            We offer reliable door-to-door delivery services, ensuring your health essentials reach you on time.
          </p>
          <button>ORDER NOW</button>
        </div>
      </div>
    </Carousel>
  );
};

export default Banner;
