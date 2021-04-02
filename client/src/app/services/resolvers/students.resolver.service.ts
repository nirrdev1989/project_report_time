import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Student } from 'src/app/interfaces/Student';
import { LoaderService } from '../loader.service';
import { StudentsService } from '../students.service';


@Injectable({
   providedIn: 'root'
})
export class StudentsResolverService implements Resolve<Student[]> {

   constructor(private studentsService: StudentsService, private loaderService: LoaderService) { }

   resolve(): Observable<Student[]> {
      return this.studentsService.getStudents()
         .pipe(
            tap(() => this.loaderService.setStatus(false))
         )
   }
}
