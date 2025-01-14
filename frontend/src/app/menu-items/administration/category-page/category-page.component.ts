import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ConnectionService } from 'src/app/app-logic/connection.service';
import { Category } from '../../../../../../backend/src/models/category.model';
import { Observable, Subscription, tap } from 'rxjs';
import { ObjectId } from 'mongoose';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css'],
})
export class CategoryPageComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  categories!: MatTableDataSource<Category>;
  category!: Category;

  categoryColumns: 
  string[] = [
    'select', 
    'name', 
    'parentCategory',
    'actions'
  ];
  selection = new SelectionModel<Category>(true, []);
  private subscriptions = new Subscription();
  constructor(
    private categoryService: ConnectionService,
    private router: Router
    ) {}
  
  ngOnInit(): void {
    this.subscriptions.add(
      this.categoryService.getCategoryData().subscribe((result) => {
        if (!result) {
          return;
        }
        this.categories = new MatTableDataSource(result);
        this.categories.sort = this.sort;
        this.categories.paginator = this.paginator;
      })
    );

  }
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.categories.data.length;
    return numSelected == numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.categories.data.forEach((row) => this.selection.select(row));
  }

  onDelete(id: ObjectId) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.categories.data = this.categories.data.filter((category) => category._id !== id);
    });
  }

  onEdit(id: ObjectId) {
    this.router.navigate(['editCategory/' + id]);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
