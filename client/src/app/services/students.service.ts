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
      console.log(this.students)
      if (this.students) {
         return of(this.students);
      }
      return this.http.get<Student[]>("api/teacher/students")
         .pipe(
            map((result: any) => {
               console.log(alert(JSON.stringify(result)))
               this.students = result.toJson;
               return result.toJson
            })
         );
   }

}
