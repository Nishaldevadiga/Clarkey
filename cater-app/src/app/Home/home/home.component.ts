import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ShowValue = false;

  rooms = [
    { name: 'Goddard 203A', capacity: 5, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'AVAILABLE'] },
    { name: 'Goddard 305', capacity: 5, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'AVAILABLE'] },
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
    { name: 'Goddard 442A', capacity: 1, availability: ['AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'UNAVAILABLE', 'AVAILABLE'] }
  ];

  timeSlots = [
    '2:00pm', '3:00pm', '4:00pm', '5:00pm', '6:00pm', '7:00pm',
    '8:00pm', '9:00pm', '10:00pm', '11:00pm', '12:00am', '1:00am'
  ];

  private weatherApiKey = '1a338dd65c8f42c681f6ada24f28104a';
  private weatherApiUrl = 'https://api.weatherbit.io/v2.0/forecast/hourly';
  private latitude = 42.2523;
  private longitude = -71.8235;
  private weatherData: any = null;

  private readonly router = inject(Router);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchWeatherData();
  }

  fetchWeatherData(): void {
    const url = `${this.weatherApiUrl}?lat=${this.latitude}&lon=${this.longitude}&key=${this.weatherApiKey}&hours=24&units=I`;
    this.http.get(url).subscribe(
      (response: any) => {
        this.weatherData = response;
      },
      (error) => {
        console.error('Failed to fetch weather data:', error);
        alert('Failed to fetch weather data. Please try again later.');
      }
    );
  }

  parseTime(timeSlot: string, date: Date): Date {
    const scheduledDate = new Date(date);
    const time = timeSlot.toLowerCase();
    let hours = parseInt(time.split(':')[0], 10);
    const isPM = time.includes('pm');
    const isAM = time.includes('am');

    if (isPM && hours !== 12) {
      hours += 12;
    } else if (isAM && hours === 12) {
      hours = 0;
    } else if (time === '12:00am') {
      hours = 0;
    } else if (time === '1:00am') {
      hours = 1;
    }

    scheduledDate.setHours(hours, 0, 0, 0);
    return scheduledDate;
  }

  getTemperatureForTime(scheduledTime: Date): number | null {
    if (!this.weatherData?.data) return null;

    const scheduledTimestamp = Math.floor(scheduledTime.getTime() / 1000);
    const closestHour = this.weatherData.data.reduce((prev: any, curr: any) => {
      const currTimestamp = new Date(curr.datetime).getTime() / 1000;
      const prevTimestamp = new Date(prev.datetime).getTime() / 1000;
      return Math.abs(currTimestamp - scheduledTimestamp) < Math.abs(prevTimestamp - scheduledTimestamp) ? curr : prev;
    });

    return closestHour?.temp || null;
  }

  convertTo24Hour(timeSlot: string): string {
    const time = timeSlot.toLowerCase();
    let hours = parseInt(time.split(':')[0], 10);
    const isPM = time.includes('pm');
    const isAM = time.includes('am');

    if (isPM && hours !== 12) {
      hours += 12;
    } else if (isAM && hours === 12) {
      hours = 0;
    } else if (time === '12:00am') {
      hours = 0;
    } else if (time === '1:00am') {
      hours = 1;
    }

    return `${hours.toString().padStart(2, '0')}:00`;
  }

  // New method to check if a time slot is in the past
  isTimeSlotPast(timeSlot: string): boolean {
    const now = new Date();
    const slotDate = this.parseTime(timeSlot, now);

    // Adjust for times after midnight (e.g., 12:00am, 1:00am) to be on the next day if needed
    if (slotDate.getHours() < 2 && now.getHours() >= 2) {
      slotDate.setDate(slotDate.getDate() + 1);
    }

    return slotDate.getTime() < now.getTime();
  }

  bookRoom(roomName: string, timeSlot: string) {
    const currentTime = new Date();
    const scheduledDate = this.parseTime(timeSlot, currentTime);

    if (scheduledDate.getHours() < 2) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    const timeDifferenceMs = scheduledDate.getTime() - currentTime.getTime();
    const timeDifferenceMinutes = parseFloat((timeDifferenceMs / (1000 * 60)).toFixed(4));

    const temperature = this.getTemperatureForTime(scheduledDate);

    if (temperature === null) {
      alert('Temperature data is not available. Please try again later.');
      return;
    }

    const bookingData = {
      room: roomName,
      diff_time: timeDifferenceMinutes,
      temperature: temperature,
      book_time: this.convertTo24Hour(timeSlot)
    };

    this.http.post('http://127.0.0.1:5000/submit-booking', bookingData).subscribe(
      (response: any) => {
        console.log('Booking successful:', response);

        const now = new Date();
        const calculatedTimeAdjustment = response['calculated_time_adjustment'] || 0;
        const adjustedTime = new Date(now.getTime() + calculatedTimeAdjustment * 60000);
        const hours = adjustedTime.getHours().toString().padStart(2, '0');
        const minutes = adjustedTime.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;

        this.router.navigate(['/dashboard'], {
          state: { 
            data: formattedTime
          }
        });

        alert(`Successfully booked ${roomName} at ${timeSlot} (${timeDifferenceMinutes.toFixed(4)} minutes from now). Temperature: ${temperature}°F`);
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