import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailtable',
  templateUrl: './detailtable.component.html',
  styleUrls: ['./detailtable.component.scss']
})
export class DetailtableComponent implements OnInit {
  @Input() data: any;
  columnNames:string[] = ['name', 'avg', 'totalvalue'];
  tableData: any[] = []
  constructor() { }
  ngOnInit(): void {
    this.tableData =  [{name: 'Urban Forest', avg: this.data.urbanAverageValue, totalvalue: this.data.urbanTotalValue },
    {name: 'Rural Forest', avg: this.data.ruralAverageValue, totalvalue: this.data.ruralTotalValue },
    {name: 'Total', avg: this.data.forestAverageValue, totalvalue: this.data.forestTotalValue }]
  }

}
