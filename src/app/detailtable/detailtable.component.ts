import { Component, OnInit, Input } from '@angular/core';

interface TableFormat {
  name: string,
  avg: string,
  totalvalue: string
}

@Component({
  selector: 'app-detailtable',
  templateUrl: './detailtable.component.html',
  styleUrls: ['./detailtable.component.scss']
})
export class DetailtableComponent implements OnInit {
  @Input() data: any;

  columnNames:string[] = ['name', 'avg', 'totalvalue'];

  tableData: TableFormat[] = []
  constructor() { }

  ngOnInit(): void {
    console.log(this.data)
    this.tableData =  [{name: 'Urban Forest', avg: this.data.urbanAverageValue, totalvalue: this.data.urbanTotalValue },
    {name: 'Rural Forest', avg: this.data.ruralAverageValue, totalvalue: this.data.ruralTotalValue },
    {name: 'Total', avg: this.data.forestAverageValue, totalvalue: this.data.forestTotalValue }]
  }

}
