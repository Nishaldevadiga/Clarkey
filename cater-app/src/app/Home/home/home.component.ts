import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  rooms = [
    { name: 'Goddard 203A', capacity: 5, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 305', capacity: 5, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 317', capacity: 10, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 402 (Prouty)', capacity: 10, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 410', capacity: 3, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 411', capacity: 2, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 412', capacity: 2, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 413', capacity: 1, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 414', capacity: 2, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 415', capacity: 1, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 416', capacity: 1, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 417', capacity: 1, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 433', capacity: 1, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 440A', capacity: 1, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] },
    { name: 'Goddard 442A', capacity: 1, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE'] }
  ];

  // Define the time slots
  timeSlots = [
    '2:00pm', '3:00pm', '4:00pm', '5:00pm', '6:00pm', '7:00pm',
    '8:00pm', '9:00pm', '10:00pm', '11:00pm', '12:00am', '1:00am'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  // Function to parse time string (e.g., "2:00pm") into a Date object
  parseTime(timeSlot: string, date: Date): Date {
    const scheduledDate = new Date(date); // Copy the current date
    const time = timeSlot.toLowerCase(); // Convert to lowercase for easier parsing
    let hours = parseInt(time.split(':')[0], 10); // Extract hours
    const isPM = time.includes('pm');
    const isAM = time.includes('am');

    
    if (isPM && hours !== 12) {
      hours += 12; 
    } else if (isAM && hours === 12) {
      hours = 0; // Midnight
    } else if (time === '12:00am') {
      hours = 0;
    } else if (time === '1:00am') {
      hours = 1;
    }

    scheduledDate.setHours(hours, 0, 0, 0); 
    return scheduledDate;
  }

  // Function to handle booking
  bookRoom(roomName: string, timeSlot: string) {
    const currentTime = new Date(); // Get the current time
    const scheduledDate = this.parseTime(timeSlot, currentTime); // Parse the scheduled time

    // If the scheduled time is before the current time (e.g., booking for 12:00am or 1:00am the next day),
    // we assume it's for the next day (March 24, 2025)
    if (scheduledDate.getHours() < 2) {
      scheduledDate.setDate(scheduledDate.getDate() + 1); // Move to the next day
    }

    // Calculate the time difference in hours
    const timeDifferenceMs = scheduledDate.getTime() - currentTime.getTime();
    const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60); // Convert milliseconds to hours

    const bookingData = {
      room: roomName,
      time: timeDifferenceHours 
    };

    // Send API request to the booking endpoint
    this.http.post('http://127.0.0.1:5000/submit-booking', bookingData).subscribe(
      (response) => {
        console.log('Booking successful:', response);
        alert(`Successfully booked ${roomName} at ${timeSlot} (${timeDifferenceHours.toFixed(2)} hours from now)`);
        const room = this.rooms.find(r => r.name === roomName);
        if (room) {
          const timeIndex = this.timeSlots.indexOf(timeSlot);
          room.availability[timeIndex] = 'YOUR_BOOKING';
        }
      },
      (error) => {
        console.error('Booking failed:', error);
        alert('Failed to book the room. Please try again.');
      }
    );
  }
}