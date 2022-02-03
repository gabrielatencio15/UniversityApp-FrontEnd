import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  myAppUrl = 'https://localhost:9313/';
  myApiUrl = 'api/Student/';
  limitDateForBirthInput = '';
  listStudents: Student[];

  private updateForm = new BehaviorSubject<Student>({} as any);


  constructor(private http: HttpClient) { }

  saveStudent(student: Student): Observable<Student>
  {
    return this.http.post<Student>(this.myAppUrl + this.myApiUrl, student);
  }

  deleteStudent(idStudent: number): Observable<Student>
  {
    return this.http.delete<Student>(this.myAppUrl + this.myApiUrl + idStudent)
  }

  getStudent()
  {
    return this.http.get(this.myAppUrl + this.myApiUrl).subscribe(data => {
     this.listStudents = data as Student[];
    });           
  }

  updateStudent(idStudent: number, student: Student): Observable<Student>
  {
    return this.http.put<Student>(this.myAppUrl + this.myApiUrl + idStudent, student);
  }

  update(student: Student)
  {
    this.updateForm.next(student);
  }

  getStudent$(): Observable<Student>
  {
    return this.updateForm.asObservable();
  }
}
