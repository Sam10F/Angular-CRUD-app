import { Component, OnInit } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { Activity } from 'src/app/shared/models/activity.model';

@Component({
  selector: 'app-activity-search',
  templateUrl: './activity-search.component.html',
  styleUrls: ['./activity-search.component.css']
})
export class ActivitySearchComponent implements OnInit {

  activities$: Observable<Activity[]>;
  private searchTerms = new Subject<string>();

  constructor(private activityService: ActivityService) { }

  ngOnInit(): void {
    this.activities$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.activityService.searchActivities(term)),
    );
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

}
