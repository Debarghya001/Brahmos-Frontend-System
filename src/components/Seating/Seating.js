import React, { useState } from 'react';
import '../Seating/Seating.css';
import { useNavigate } from 'react-router-dom';
const Seating = ({ totalSeats = 0, soldSeats = [], onClose, busid,boardingPoint,droppingPoint,totalFare, bookingDate }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate=useNavigate();

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else if (selectedSeats.length < 3) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleProceedBooking = () => {
      if (selectedSeats.length === 0) {
          alert('Please select at least one seat.');
          return;
      }
  
      
      navigate('/booking-confirmation', {
          state: {
              busid,
              seatnumber: selectedSeats,
              bookingDate,
              totalFare: totalFare * selectedSeats.length,
              boardingPoint: boardingPoint,
              droppingPoint: droppingPoint,
          },
      });
  };
  

  const renderSeats = () => {
    const seats = [];
    const halfSeats = Math.ceil(totalSeats / 2);  // totalSeats should always be a number

    for (let i = 1; i <= halfSeats; i++) {
      const isSold = soldSeats.includes(i);  // Ensure soldSeats is always an array
      const isSelected = Array.isArray(selectedSeats) && selectedSeats.includes(i);
      let seatClass = 'seat';

      if (isSold) {
        seatClass += ' sold';
      } else if (isSelected) {
        seatClass += ' selected';
      }

      seats.push(
        <div
          key={i}
          className={seatClass}
          onClick={() => !isSold && handleSeatClick(i)}
        >
          {i}
        </div>
      );
    }

    for (let i = halfSeats + 1; i <= totalSeats; i++) {
      const isSold = soldSeats.includes(i);
      const isSelected = Array.isArray(selectedSeats) && selectedSeats.includes(i);
      let seatClass = 'seat';

      if (isSold) {
        seatClass += ' sold';
      } else if (isSelected) {
        seatClass += ' selected';
      }

      seats.push(
        <div
          key={i}
          className={seatClass}
          onClick={() => !isSold && handleSeatClick(i)}
        >
          {i}
        </div>
      );
    }

    return <div className="seats-grid">{seats}</div>;
  };

  return (
    <>
      <div className="overlay" onClick={onClose}></div> {/* Add an overlay */}
      <div className="seating-layout">
        <h2 className='seating-heading'>Select Your Seats</h2>
        <div className="seats-container">{renderSeats()}</div>
        <div className="button-container">
          <button id='seating-button' onClick={onClose}>Close</button>
          <button className="proceed-button" id='seating-button' onClick={handleProceedBooking}>
            Proceed Booking
          </button>
        </div>
      </div>
    </>
  );
};


export default Seating;
