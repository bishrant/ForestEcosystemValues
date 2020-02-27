import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailtable',
  templateUrl: './detailtable.component.html',
  styleUrls: ['./detailtable.component.scss']
})
export class DetailtableComponent implements OnInit {
  private _data: any = null;
  @Input() set data(value: any) {
    this._data = value;
    if (value !== null) {
      this.createReport(this._data);
    }
  };
  columnNames: string[] = ['name', 'avg', 'totalvalue'];
  tableData: any[] = []

  createReport = (data) => {
    this.tableData = [
      { name: 'Urban Forest', avg: data.urbanAverageValue, totalvalue: data.urbanTotalValue },
      { name: 'Rural Forest', avg: data.ruralAverageValue, totalvalue: data.ruralTotalValue },
      { name: 'Total', avg: data.forestAverageValue, totalvalue: data.forestTotalValue }
    ]
  }
  constructor() { }
  ngOnInit(): void { }
}
