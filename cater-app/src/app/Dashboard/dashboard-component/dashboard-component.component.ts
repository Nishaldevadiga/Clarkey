import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-component',
  templateUrl: './dashboard-component.component.html',
  styleUrl: './dashboard-component.component.css',
  standalone:false
})
export class DashboardComponentComponent {

  scheduledTime: any; // <-- Changed from @Input()
  roomName: string = '';     // Optional: Room name for context

  
  currentTime: string = ''; // To display current time for reference

  constructor(private router: Router) {

    // Retrieve the state data in the constructor
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.scheduledTime = state['data']; // Access "hello"
      console.log('State data in constructor:', state);
    }
  }

  ngOnInit() {

    if (!this.scheduledTime && history.state.data) {
      this.scheduledTime = history.state.data;
      console.log('State data from history:', history.state);
    }
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras.state;
    // Update current time on initialization
    this.updateCurrentTime();
    // Optionally, update current time every minute
    setInterval(() => this.updateCurrentTime(), 60000);
  }

  // Helper method to get and format current time
  updateCurrentTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  }
}
