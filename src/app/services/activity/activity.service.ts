import { Injectable } from '@angular/core';
import {pipe, Observable,  of} from 'rxjs';
import { ACTIVITIES } from '../../shared/mocks/mock-activities';
import { Activity } from '../../shared/models/activity.model';
import { MessageService } from '../message/message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private activitiesUrl = 'api/activities';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
  ) { }

  getActivities(): Observable<Activity[]> { 
    return this.http.get<Activity[]>(this.activitiesUrl).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Activity[]>('getActivities', []))
    )
  }
  

  getActivity(id: number): Observable<Activity> { 
    const url = `${this.activitiesUrl}/${id}`;
    return this.http.get<Activity>(url).pipe(
      tap(_ => this.log(`fetched activity id=${id}`)),
      catchError(this.handleError<Activity>(`getHero id=${id}`))
    );
  }

  updateActivity(activity: Activity): Observable<any> {
    return this.http.put(this.activitiesUrl, activity, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${activity.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.activitiesUrl, activity, this.httpOptions).pipe(
      tap((newActivity: Activity) => this.log(`added hero w/ id=${newActivity.id}`)),
      catchError(this.handleError<Activity>('addActivity'))
    );
  }

  deleteActivity(activity: Activity | number): Observable<Activity> {
    const id = typeof activity === 'number' ? activity : activity.id;
    const url = `${this.activitiesUrl}/${id}`;

    return this.http.delete<Activity>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Activity>('deleteHero'))
    );
  }

  searchActivities(term: string): Observable<Activity[]> {
    if (!term.trim()) {
      // if not search term, return empty activity array.
      return of([]);
    }
    return this.http.get<Activity[]>(`${this.activitiesUrl}/?title=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Activity[]>('searchHeroes', []))
    );
  }

  private log(message: string) {
    this.messageService.add(`ActivityService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
