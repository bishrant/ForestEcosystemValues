import { Component, OnInit } from '@angular/core';
import { SidebarControlsState } from '../shared/sidebarControls.state';
import { Select, Store } from '@ngxs/store';
import { MapcontrolService } from '../services/mapcontrol.service';
import { ChangeReportData } from '../shared/sidebarControls.actions';

@Component({
  selector: 'app-summarytable',
  templateUrl: './summarytable.component.html',
  styleUrls: ['./summarytable.component.scss']
})

export class SummarytableComponent implements OnInit {
  @Select(SidebarControlsState.getReportDataFromState) reportData$;
  tableBodyVisible = true;
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

  constructor(private mapControl: MapcontrolService, private store: Store) { }
  ngOnInit() {
    this.reportData$.subscribe(dt => {
      if (dt.data !== null) {
        this.tableBodyVisible = true;
        this.data = null;
        this.data = JSON.parse(dt.data);
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
      } else {
        this.data = null;
        this.sData = null;
        this.individual = null;
      }
    });
  }

  closeTable = () => {
    this.store.dispatch(new ChangeReportData(null))
    this.mapControl.filterByCategory('County', null);
    this.mapControl.deactivateControl('');
    this.mapControl.clearGraphics();
    this.mapControl.closeSummaryTable();
    this.mapControl.setSpatialSelectionState('multipoint', false);
    this.mapControl.setSpatialSelectionState('polygon', false);
    this.mapControl.setSpatialSelectionState('multipointDisabled', false);
    this.mapControl.setSpatialSelectionState('polygonDisabled', false);
  }
  toggleTable = () => {
    this.tableBodyVisible = !this.tableBodyVisible;
  }
}
