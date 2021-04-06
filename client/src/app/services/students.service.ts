import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Student } from '../interfaces/Student';

@Injectable({
   providedIn: 'root'
})
export class StudentsService {

   private students: Student[]
   private baseUrl: string
   constructor(private http: HttpClient) {
      this.baseUrl = 'api/v1/teacher'
   }

   // GET STUDENTS LIST
   getStudents(): Observable<Student[]> {
      if (this.students) {
         return of(this.students);
      }
      return this.http.get<Student[]>(`${this.baseUrl}/students`)
         .pipe(
            map((result: any) => {
               this.students = result.toJson;
               return result.toJson
            })
         );
   }

}
