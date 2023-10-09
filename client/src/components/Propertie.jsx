import React, { useState, useRef, useEffect } from 'react';
import '../Style/Propertie.css';
import Image from '../assets/Images/BbackgroundPicture.jpg';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Propertie({ location, rating, price, images, onClickFunction }) {
    const containerRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);


    const scrollToNext = () => {
        const containerWidth = containerRef.current.offsetWidth;
        const maxScroll = containerRef.current.scrollWidth - containerWidth;
        let newPosition = Math.min(scrollPosition + containerWidth, maxScroll);

        // Round newPosition to the nearest multiple of containerWidth
        newPosition = Math.round(newPosition / containerWidth) * containerWidth;

        setScrollPosition(newPosition);
        containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    };

    const scrollToPrev = () => {
        const containerWidth = containerRef.current.offsetWidth;
        let newPosition = Math.max(scrollPosition - containerWidth, 0);

        // Round newPosition to the nearest multiple of containerWidth
        newPosition = Math.round(newPosition / containerWidth) * containerWidth;

        setScrollPosition(newPosition);
        containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    };




    const numImages = 3;
    const dots = Array.from({ length: numImages }, (_, index) => index);

    const isAtStart = scrollPosition === 0;
    const isAtEnd =
        containerRef.current &&
        scrollPosition >= containerRef.current.scrollWidth - containerRef.current.offsetWidth;



    function handlePropertyClick(propertyData) {
        // Navigate to the PropertiePage and pass the property data as state
        navigate(`/PropertiePage/${propertyData.hostName}`, { state: { propertyData } });
    }

    return (
        <div className='wrapper'>
            <div className="propertie-card-wrapper">

                <div className="propertie-card" ref={containerRef}>
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={`http://localhost:5000/uploads/${image}`} // Adjust the path accordingly
                            alt={`Property Image ${index + 1}`}
                            onClick={onClickFunction}
                        />
                    ))}
                </div>

                {/* {!isAtStart && (
                    <button className="prev-button" onClick={scrollToPrev}>
                        &lt;
                    </button>
                )}
                {!isAtEnd && (
                    <button className="next-button" onClick={scrollToNext}>
                        &gt;
                    </button>
                )} */}


                <button className="prev-button" onClick={scrollToPrev}>
                    &lt;
                </button>


                <button className="next-button" onClick={scrollToNext}>
                    &gt;
                </button>


                <div className="dot-indicators-wrapper">
                    <div className="dot-indicators">
                        {dots.map((dotIndex) => (
                            <div
                                key={dotIndex}
                                className={`dot ${activeIndex === dotIndex ? 'active' : ''}`}
                                onClick={() => {
                                    const newPosition = dotIndex * containerRef.current.offsetWidth;
                                    setScrollPosition(newPosition);
                                    setActiveIndex(dotIndex);
                                    containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className='propertieInfo'>
                <div>{location}</div>
                <div>
                    <div>
                        <span>{rating}</span>
                    </div>
                </div>
                <span className='price'>{price} CAD per night</span>
            </div>
        </div>
    );
}
