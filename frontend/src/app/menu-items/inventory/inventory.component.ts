import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ConnectionService } from 'src/app/app-logic/connection.service';
import { ObjectId } from 'mongoose';
import { Router } from '@angular/router';
import { InventoryItem } from '../../../../../backend/src/models/inventoryItem.model';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  inventoryItems!: MatTableDataSource<InventoryItem>;

  inventoryColumns: string[] = [
    'select',
    'id',
    'name',
    'description',
    'user',
    'location',
    'inventoryNumber',
    'addedDate',
    'modifiedDate',
    'actions',
  ];
  selection = new SelectionModel<InventoryItem>(true, []);
  private subscriptions = new Subscription();
  constructor(
    private inventoryList: ConnectionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.inventoryList.getInventoryData().subscribe((result) => {
        if (!result) {
          return;
        }
        this.inventoryItems = new MatTableDataSource(result);
        this.inventoryItems.sort = this.sort;
        this.inventoryItems.paginator = this.paginator;
      })
    )
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.inventoryItems.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.inventoryItems.data.forEach((row: InventoryItem) =>
          this.selection.select(row)
        );
  }

  onEdit(id: ObjectId) {
    this.router.navigate(['edit/' + id]);
  }
  onDelete(id: ObjectId) {
    this.inventoryList.deleteItem(id).subscribe(() => {
      this.inventoryItems.data = this.inventoryItems.data.filter((item) => item._id !== id);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
