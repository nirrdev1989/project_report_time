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

   constructor(private http: HttpClient) {

   }

   // GET STUDENTS LIST
   getStudents(): Observable<Student[]> {
      if (this.students) {
         return of(this.students);
      }
      return this.http.get<Student[]>("api/v1/teacher/students")
         .pipe(
            map((result: any) => {
               this.students = result.toJson;
               return result.toJson
            })
         );
   }

}
