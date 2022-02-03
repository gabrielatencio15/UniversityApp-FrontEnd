import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Student } from 'src/app/models/student';
import { UniversityService } from 'src/app/services/university.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  sucription: Subscription;
  student: Student;
  idStudent = 0;

  constructor(private formBuilder: FormBuilder, private universityService: UniversityService, private toastr: ToastrService) { 
    this.form = this.formBuilder.group({
      idStudent: 0,
      idIdentificationType: ['', [Validators.required]],
      identificationID: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      nameStudent: ['', [Validators.required, Validators.maxLength(30)]],
      secondNameStudent: ['', [ Validators.maxLength(30)]],
      lastNameStudent: ['', [Validators.required, Validators.maxLength(30)]],
      secondLastNameStudent: ['', [Validators.maxLength(30)]],
      genderStudent: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      activeStudent: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.sucription = this.universityService.getStudent$().subscribe(data => {
      console.log(data);
      this.student = data;

      this.form.patchValue({
        idIdentificationType: this.student.idIdentificationType,
        identificationID: this.student.identificationID,
        nameStudent: this.student.nameStudent,
        secondNameStudent: this.student.secondNameStudent,
        lastNameStudent: this.student.lastNameStudent,
        secondLastNameStudent: this.student.secondLastNameStudent,
        genderStudent: this.student.genderStudent,
        birthDate: this.formatDate(new Date(this.student.birthDate)),
        activeStudent: (this.student.activeStudent) ? 1 : 0
      });

      this.idStudent = this.student.idStudent || 0;

    });
  }

  ngOnDestroy(): void {
    this.sucription.unsubscribe();
  }

  @Input()
    maxDateBirth: string = this.formatDate(new Date);

  formatDate(date: Date) 
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

  disableDate()
  {
    return false;
  }

  saveStudent()
  {
    if(this.idStudent === 0 || this.idStudent === undefined)
    {
      this.addStudent();
    }
    else
    {
      this.editStudent()
    }

    
  }

  addStudent()
  {
    const student: Student = {
      idIdentificationType: parseInt(this.form.get('idIdentificationType')?.value),
      identificationID: this.form.get('identificationID')?.value,
      nameStudent: this.form.get('nameStudent')?.value,
      secondNameStudent: this.form.get('secondNameStudent')?.value,
      lastNameStudent: this.form.get('lastNameStudent')?.value,
      secondLastNameStudent: this.form.get('secondLastNameStudent')?.value,
      genderStudent: parseInt(this.form.get('genderStudent')?.value),
      birthDate: this.form.get('birthDate')?.value,
      activeStudent: (this.form.get('activeStudent')?.value == 1 ? true : false)
    }

    this.universityService.saveStudent(student).subscribe(data => {
    
      this.toastr.success("The student information has been successfully added!"),
      {
        tapToDismiss: true
      };
      this.universityService.getStudent();
      this.form.reset();
    }
    ,err => {
      this.toastr.error("The type of identification and number already exist!"),
      {
        tapToDismiss: true
      };
    });
  }

  editStudent()
  {
    const student: Student = {
      idStudent: this.student.idStudent,
      idIdentificationType: parseInt(this.form.get('idIdentificationType')?.value),
      identificationID: this.form.get('identificationID')?.value,
      nameStudent: this.form.get('nameStudent')?.value,
      secondNameStudent: this.form.get('secondNameStudent')?.value,
      lastNameStudent: this.form.get('lastNameStudent')?.value,
      secondLastNameStudent: this.form.get('secondLastNameStudent')?.value,
      genderStudent: parseInt(this.form.get('genderStudent')?.value),
      birthDate: this.form.get('birthDate')?.value,
      activeStudent: (this.form.get('activeStudent')?.value == 1 ? true : false)
    }
    this.universityService.updateStudent(this.idStudent, student).subscribe(data => {
      this.toastr.info("The student information has been successfully updated!"),
      {
        tapToDismiss: true
      };
      this.universityService.getStudent();
      this.form.reset();
      this.idStudent = 0;
    });
  }

}
