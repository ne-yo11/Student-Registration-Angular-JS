import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Course } from './course.model';


@Injectable({
  providedIn: 'root'
})
export class CourselistService {

  url: string = environment.apiBaseUrl + '/course/list'

  list:Course[] = []
  constructor(private http: HttpClient) { }

  refreshList(){
    this.http.get(this.url)
    .subscribe({
      next: res=>{
        this.list = res as Course[];
      },
      error:err => {console.log(err)}
    })
  }
}
