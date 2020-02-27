import { Component, OnInit } from '@angular/core';
import { SidebarControlsState } from '../shared/sidebarControls.state';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-summarytable',
  templateUrl: './summarytable.component.html',
  styleUrls: ['./summarytable.component.scss']
})

export class SummarytableComponent implements OnInit {
  @Select(SidebarControlsState.getReportDataFromState) reportData$;
  data: any = null;
  sData: any = null;
  individual: any = null;
  summaryColumns: string[] = ['name', 'avg', 'totalvalue'];
  summaryData: any[] = [];
  ecosystems: any[] = [
    { name: 'airquality', display: 'Air Quality' },
    { name: 'carbon', display: 'Carbon' },
    { name: 'watershed', display: 'Water' },
    { name: 'biodiversity', display: 'Bio-diversity' },
    { name: 'cultural', display: 'Cultural' },
    { name: 'total', display: 'Total' }
  ];

  constructor() { }
  ngOnInit() {
    this.reportData$.subscribe(dt => {
      if (dt !== null) {
        this.data = null;
        this.data = JSON.parse(dt);
        this.sData = this.data.summaryReportResults;
        this.individual = this.data.summaryResults;
        this.summaryData = [];
        this.ecosystems.forEach((eco: any) => {
          const d: any = {
            name: eco.display,
            avg: this.sData[eco.name + '_forestValuePerAcre'],
            totalvalue: this.sData[eco.name + '_totalThousandDollarsPerYear']
          };
          this.summaryData.push(d);
        });
      }
    })
  }
}
