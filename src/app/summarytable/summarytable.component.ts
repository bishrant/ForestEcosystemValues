import { Component, OnInit } from '@angular/core';

export interface TableData {
  name: string,
  avg: string,
  totalvalue: string
}

@Component({
  selector: 'app-summarytable',
  templateUrl: './summarytable.component.html',
  styleUrls: ['./summarytable.component.scss']
})


export class SummarytableComponent implements OnInit {

  rawjson = '{\n"summaryReportResults": {\n"airquality_forestAnnual": "0",\n"airquality_forestValuePerAcre": "0.0",\n"airquality_ruralThousandDollarsPerYear": "-",\n"airquality_totalThousandDollarsPerYear": "0.0",\n"airquality_urbanThousandDollarsPerYear": "0.0",\n"aoiForestAcres": "15,742",\n"aoiRuralAcres": "15,742",\n"aoiUrbanAcres": "0",\n"biodiversity_forestAnnual": "232.0 ",\n"biodiversity_forestValuePerAcre": "232.0",\n"biodiversity_ruralThousandDollarsPerYear": "0.2",\n"biodiversity_totalThousandDollarsPerYear": "0.2",\n"biodiversity_urbanThousandDollarsPerYear": "0.0",\n"carbon_forestAnnual": "88.8 ",\n"carbon_forestValuePerAcre": "88.8",\n"carbon_ruralThousandDollarsPerYear": "0.1",\n"carbon_totalThousandDollarsPerYear": "0.1",\n"carbon_urbanThousandDollarsPerYear": "0.0",\n"cultural_forestAnnual": "899.8 ",\n"cultural_forestValuePerAcre": "899.8",\n"cultural_ruralThousandDollarsPerYear": "0.9",\n"cultural_totalThousandDollarsPerYear": "0.9",\n"cultural_urbanThousandDollarsPerYear": "0.0",\n"total_forestAnnual": "1.5 thousand",\n"total_forestValuePerAcre": "1,476.1",\n"total_ruralThousandDollarsPerYear": "1.5",\n"total_totalThousandDollarsPerYear": "1.5",\n"total_urbanThousandDollarsPerYear": "0.0",\n"watershed_forestAnnual": "255.5 ",\n"watershed_forestValuePerAcre": "255.5",\n"watershed_ruralThousandDollarsPerYear": "0.3",\n"watershed_totalThousandDollarsPerYear": "0.3",\n"watershed_urbanThousandDollarsPerYear": "0.0"\n},\n"summaryResults": [\n{\n"AverageValueUnits": "$/acre/year",\n"TotalValueUnits": "thousand $/year",\n"ecosystemService": "airquality",\n"forestAverageValue": "0.0",\n"forestTotalValue": "0.0",\n"ruralAverageValue": "-",\n"ruralTotalValue": "-",\n"urbanAverageValue": "0.0",\n"urbanTotalValue": "0.0"\n},\n{\n"AverageValueUnits": "$/acre/year",\n"TotalValueUnits": "thousand $/year",\n"ecosystemService": "biodiversity",\n"forestAverageValue": "232.0",\n"forestTotalValue": "0.2",\n"ruralAverageValue": "0.0",\n"ruralTotalValue": "0.2",\n"urbanAverageValue": "0.0",\n"urbanTotalValue": "0.0"\n},\n{\n"AverageValueUnits": "$/acre/year",\n"TotalValueUnits": "thousand $/year",\n"ecosystemService": "carbon",\n"forestAverageValue": "88.8",\n"forestTotalValue": "0.1",\n"ruralAverageValue": "0.0",\n"ruralTotalValue": "0.1",\n"urbanAverageValue": "0.0",\n"urbanTotalValue": "0.0"\n},\n{\n"AverageValueUnits": "$/acre/year",\n"TotalValueUnits": "thousand $/year",\n"ecosystemService": "cultural",\n"forestAverageValue": "899.8",\n"forestTotalValue": "0.9",\n"ruralAverageValue": "0.1",\n"ruralTotalValue": "0.9",\n"urbanAverageValue": "0.0",\n"urbanTotalValue": "0.0"\n},\n{\n"AverageValueUnits": "$/acre/year",\n"TotalValueUnits": "thousand $/year",\n"ecosystemService": "watershed",\n"forestAverageValue": "255.5",\n"forestTotalValue": "0.3",\n"ruralAverageValue": "0.0",\n"ruralTotalValue": "0.3",\n"urbanAverageValue": "0.0",\n"urbanTotalValue": "0.0"\n},\n{\n"AverageValueUnits": "$/acre/year",\n"TotalValueUnits": "thousand $/year",\n"ecosystemService": "total",\n"forestAverageValue": "1,476.1",\n"forestTotalValue": "1.5",\n"ruralAverageValue": "0.1",\n"ruralTotalValue": "1.5",\n"urbanAverageValue": "0.0",\n"urbanTotalValue": "0.0"\n}\n]\n}';
  data: any = JSON.parse(this.rawjson);

  sData = this.data.summaryReportResults;
  individual = this.data.summaryResults;
  summaryColumns: string[] = ['name', 'avg', 'totalvalue'];
  summaryData: TableData[] = [];
  ecosystems: any[] = [
    { name: 'airquality', display: 'Air Quality' },
    { name: 'carbon', display: 'Carbon Sequestration'},
    { name: 'watershed', display: 'Water'},
    { name: 'biodiversity', display: 'Bio-diversity'},
    { name: 'cultural', display: 'Cultural'},
    { name: 'total', display: 'Total'}
  ];
  constructor() { }
  ngOnInit() {
    console.log(this.summaryData)
    this.ecosystems.forEach((eco: any) => {
      const d: any = {
        name: eco.display,
        avg: this.sData[eco.name + '_forestValuePerAcre'],
        totalvalue: this.sData[eco.name + '_totalThousandDollarsPerYear']
      };
      this.summaryData.push(d);
    });
    console.log(this.summaryData);
  }

}
