import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddressBookService, Person } from '../services/address-book.service';
import { AddPersonComponent } from '../add-person/add-person.component';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {
  displayedColumns: string[] = ['name', 'address', 'phone', 'email', 'actions'];
  dataSource: Person[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private addressBookService: AddressBookService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchPersons();
  }

  fetchPersons(): void {
    this.isLoading = true;
    this.addressBookService.getAllPersons().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("❌ Error fetching contacts:", err);
        this.errorMessage = "Failed to load contacts!";
        this.isLoading = false;
      }
    });
  }

  openAddPersonDialog(): void {
    const dialogRef = this.dialog.open(AddPersonComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Person added successfully:', result);
        this.fetchPersons();
      }
    });
  }

  editPerson(person: Person): void {
    this.addressBookService.updatePerson(person.id!, person).subscribe({
      next: () => this.fetchPersons(),
      error: (err) => console.error("❌ Error updating contact:", err)
    });
  }

  deletePerson(person: Person): void {
    if (!confirm(`Are you sure you want to delete ${person.name}?`)) return;

    this.addressBookService.deletePerson(person.id!).subscribe({
      next: () => {
        console.log("Contact deleted:", person.name);
        this.fetchPersons();  
      },
      error: (err) => {
        console.error("❌ Error deleting contact:", err);
        alert("Error deleting contact!");
      }
    });
  }
}
