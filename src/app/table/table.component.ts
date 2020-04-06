import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  loading: boolean;

  dataSource = [];
  meta = [];
  uniqueKeys = [];
  clonedRowJSON;

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.api.get('body').subscribe(response => {
      this.uniqueKeys = this.getAllUniqueKeys(response.data);
      this.initTable(response);
    });
  }

  initTable(response) {
    this.dataSource = response.data;
    this.meta = response.meta;
    this.loading = false;
  }

  getAllUniqueKeys(data) {
    return data.map(item => Object.keys(item))
      .flat()
      .filter((v, i, a) => a.indexOf(v) === i);
  }

  isDate(val) {
    const date = (new Date(val)).getTime();
    return val && val.toString().length > 9 && date > 0;
  }

  isEmpty(val) {
    return !!!(val && val.toString().length);
  }

  formatDate(val) {
    const date: any = new Date(val);
    return `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`;
  }

  addRow() {
    const newRow = this.uniqueKeys.reduce((obj, key) => {
      return {...obj, [key]: ''};
    }, {});
    this.dataSource.push(newRow);
  }

  deleteRow(index) {
    this.dataSource.splice(index, 1);
  }

  cloneRow(val) {
    this.clonedRowJSON = JSON.stringify(val);
  }

  save(val) {
    if (this.clonedRowJSON !== JSON.stringify(val)) {
      const result = confirm('would you like to save changes ?');
      if (result) {
        const body = {
            ...this.meta,
            result: [
              ...this.dataSource
            ]
        };
        this.api.put(body).subscribe();
      }
    }
  }

}
