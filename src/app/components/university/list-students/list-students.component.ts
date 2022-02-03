import { Component, OnInit } from '@angular/core';
import { UniversityService } from 'src/app/services/university.service';
import { ToastrService } from 'ngx-toastr';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-list-students',
  templateUrl: './list-students.component.html',
  styleUrls: ['./list-students.component.css']
})
export class ListStudentsComponent implements OnInit {

  constructor(public universityService: UniversityService, public toastr: ToastrService) { }

  ngOnInit(): void {

    this.universityService.getStudent();
  }

  formatDate(date: string) 
  {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  deleteStudent(idStudent: number)
  {
    if(confirm("Are you sure you want to delete this student?"))
    {
      this.universityService.deleteStudent(idStudent).subscribe(data => {
        this.universityService.getStudent();

        this.toastr.warning("The student has been deleted!"),
        {
          tapToDismiss: true
        };
      });
    }
  }

  editStudent(student: Student)
  {
    this.universityService.update(student);
  }

}
