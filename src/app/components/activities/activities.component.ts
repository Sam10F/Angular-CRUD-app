import { Component, OnInit } from '@angular/core';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { MessageService } from 'src/app/services/message/message.service';
import { Activity } from 'src/app/shared/models/activity.model';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {    

  selectedActivity: Activity;
  activities: Activity[];

  constructor(private activityService: ActivityService,
  private messageService: MessageService) { }

  ngOnInit(): void {
    this.getActivities();
  }

  getActivities(): void { 
    this.activityService.getActivities()
      .subscribe(activities => this.activities = activities); 
  }

  add(title: string): void {
    title = title.trim();
    if (!title) { return; }
    this.activityService.addActivity({ title } as Activity)
      .subscribe(activity => {
        this.activities.push(activity);
      });
  }

  delete(activity: Activity): void {
    this.activities = this.activities.filter(a => a !== activity);
    this.activityService.deleteActivity(activity).subscribe();
  }
}
