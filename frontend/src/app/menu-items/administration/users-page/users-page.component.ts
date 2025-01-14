import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ConnectionService } from 'src/app/app-logic/connection.service';

import { Observable, Subscription, tap } from 'rxjs';
import { ObjectId } from 'mongoose';
import { User } from '../../../../../../backend/src/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
})
export class UsersPageComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  users!: MatTableDataSource<User>;
  user!: User;

  userColumns: string[] = [
    'select',
    'id',
    'firstname',
    'lastname',
    'phoneNumber',
    'email',
    'actions',
  ];
  selection = new SelectionModel<User>(true, []);
  private subscriptions = new Subscription();
  constructor(
    private userService: ConnectionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.userService.getUsersFromBackend().subscribe((result) => {
        if (!result) {
          return;
        } 
        this.users = new MatTableDataSource(result);
        this.users.paginator = this.paginator;
        this.users.sort = this.sort;
      })
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.users.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.users.data.forEach((row) => this.selection.select(row));
  }

  onDelete(id: ObjectId) {
    this.userService.deleteUser(id).subscribe(() => {
      this.users.data = this.users.data.filter((item) => item._id !== id);
    });
  }

  onEdit(id: ObjectId) {
    this.router.navigate(['editUser/' + id]);
  }
  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
