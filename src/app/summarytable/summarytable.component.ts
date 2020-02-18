import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  // rawjson = '{\n"summaryReportResults": {\n"airquality_forestAnnual": "0",\n"airquality_forestValuePerAcre": "0.0",\n"airquality_ruralThousandDollarsPerYear": "-",\n"airquality_totalThousandDollarsPerYear": "0.0",\n"airquality_urbanThousandDollarsPerYear": "0.0",\n"aoiForestAcres": "15,742",\n"aoiRuralAcres": "15,742",\n"aoiUrbanAcres": "0",\n"biodiversity_forestAnnual": "232.0 ",\n"biodiversity_forestValuePerAcre": "232.0",\n"biodiversity_ruralThousandDollarsPerYear": "0.2",\n"biodiversity_totalThousandDollarsPerYear": "0.2",\n"biodiversity_urbanThousandDollarsPerYear": "0.0",\n"carbon_forestAnnual": "88.8 ",\n"carbon_forestValuePerAcre": "88.8",\n"carbon_ruralThousandDollarsPerYear": "0.1",\n"carbon_totalThousandDollarsPerYear": "0.1",\n"carbon_urbanThousandDollarsPerYear": "0.0",\n"cultural_forestAnnual": "899.8 ",\n"cultural_forestValuePerAcre": "899.8",\n"cultural_ruralThousandDollarsPerYear": "0.9",\n"cultural_totalThousandDollarsPerYear": "0.9",\n"cultural_urbanThousandDollarsPerYear": "0.0",\n"total_forestAnnual": "1.5 thousand",\n"total_forestValuePerAcre": "1,476.1",\n"total_ruralThousandDollarsPerYear": "1.5",\n"total_totalThousandDollarsPerYear": "1.5",\n"total_urbanThousandDollarsPerYear": "0.0",\n"watershed_forestAnnual": "255.5 ",\n"watershed_forestValuePerAcre": "255.5",\n"watershed_ruralThousandDollarsPerYear": "0.3",\n"watershed_totalThousandDollarsPerYear": "0.3",\n"watershed_urbanThousandDollarsPerYear": "0.0"\n},\n"summaryResults": [\n{\n"AverageValueUnits": "$/acre/year",\n"TotalValueUnits": "thousand $/year",\n"ecosystemService": "airquality",\n"forestAverageValue": "0.0",\n"forestTotalValue": "0.0",\n"ruralAverageValue": "-",\n"ruralTotalValue": "-",\n"urbanAverageValue": "0.0",\n"urbanTotalValue": "0.0"\n},\n{\n"AverageValueUnits": "$/acre/year",\n"TotalValueUnits": "thousand $/year",\n"ecosystemService": "biodiversity",\n"forestAverageValue": "232.0",\n"forestTotalValue": "0.2",\n"ruralAverageValue": "0.0",\n"ruralTotalValue": "0.2",\n"urbanAverageValue": "0.0",\n"urbanTotalValue": "0.0"\n},\n{\n"AverageValueUnits": "$/acre/year",\n"TotalValueUnits": "thousand $/year",\n"ecosystemService": "carbon",\n"forestAverageValue": "88.8",\n"forestTotalValue": "0.1",\n"ruralAverageValue": "0.0",\n"ruralTotalValue": "0.1",\n"urbanAverageValue": "0.0",\n"urbanTotalValue": "0.0"\n},\n{\n"AverageValueUnits": "$/acre/year",\n"TotalValueUnits": "thousand $/year",\n"ecosystemService": "cultural",\n"forestAverageValue": "899.8",\n"forestTotalValue": "0.9",\n"ruralAverageValue": "0.1",\n"ruralTotalValue": "0.9",\n"urbanAverageValue": "0.0",\n"urbanTotalValue": "0.0"\n},\n{\n"AverageValueUnits": "$/acre/year",\n"TotalValueUnits": "thousand $/year",\n"ecosystemService": "watershed",\n"forestAverageValue": "255.5",\n"forestTotalValue": "0.3",\n"ruralAverageValue": "0.0",\n"ruralTotalValue": "0.3",\n"urbanAverageValue": "0.0",\n"urbanTotalValue": "0.0"\n},\n{\n"AverageValueUnits": "$/acre/year",\n"TotalValueUnits": "thousand $/year",\n"ecosystemService": "total",\n"forestAverageValue": "1,476.1",\n"forestTotalValue": "1.5",\n"ruralAverageValue": "0.1",\n"ruralTotalValue": "1.5",\n"urbanAverageValue": "0.0",\n"urbanTotalValue": "0.0"\n}\n]\n}';
  // data: any = JSON.parse(this.rawjson);

  data: any = {"summaryReportResults":{"airquality_forestAnnual":"0","airquality_forestValuePerAcre":"0.0","airquality_ruralThousandDollarsPerYear":"-","airquality_totalThousandDollarsPerYear":"0.0","airquality_urbanThousandDollarsPerYear":"0.0000","aoiForestAcres":"228,617","aoiRuralAcres":"228,617","aoiUrbanAcres":"0","biodiversity_forestAnnual":"55.0 million","biodiversity_forestValuePerAcre":"240.5","biodiversity_ruralThousandDollarsPerYear":"54,992.1","biodiversity_totalThousandDollarsPerYear":"54,992.1","biodiversity_urbanThousandDollarsPerYear":"0.0000","carbon_forestAnnual":"22.6 million","carbon_forestValuePerAcre":"98.8","carbon_ruralThousandDollarsPerYear":"22,595.0","carbon_totalThousandDollarsPerYear":"22,595.0","carbon_urbanThousandDollarsPerYear":"0.0000","cultural_forestAnnual":"260.0 million","cultural_forestValuePerAcre":"1,137.2","cultural_ruralThousandDollarsPerYear":"259,984.6","cultural_totalThousandDollarsPerYear":"259,984.6","cultural_urbanThousandDollarsPerYear":"0.0000","total_forestAnnual":"469.7 million","total_forestValuePerAcre":"2,054.4","total_ruralThousandDollarsPerYear":"469,674.0","total_totalThousandDollarsPerYear":"469,674.0","total_urbanThousandDollarsPerYear":"0.0000","watershed_forestAnnual":"132.1 million","watershed_forestValuePerAcre":"577.8","watershed_ruralThousandDollarsPerYear":"132,102.3","watershed_totalThousandDollarsPerYear":"132,102.3","watershed_urbanThousandDollarsPerYear":"0.0000"},"summaryResults":[{"AverageValueUnits":"$/acre/year","TotalValueUnits":"thousand $/year","ecosystemService":"airquality","forestAverageValue":"0.0","forestTotalValue":"0.0","ruralAverageValue":"-","ruralTotalValue":"-","urbanAverageValue":"0.0","urbanTotalValue":"0.0000"},{"AverageValueUnits":"$/acre/year","TotalValueUnits":"thousand $/year","ecosystemService":"biodiversity","forestAverageValue":"240.5","forestTotalValue":"54,992.1","ruralAverageValue":"240.5","ruralTotalValue":"54,992.1","urbanAverageValue":"0.0","urbanTotalValue":"0.0000"},{"AverageValueUnits":"$/acre/year","TotalValueUnits":"thousand $/year","ecosystemService":"carbon","forestAverageValue":"98.8","forestTotalValue":"22,595.0","ruralAverageValue":"98.8","ruralTotalValue":"22,595.0","urbanAverageValue":"0.0","urbanTotalValue":"0.0000"},{"AverageValueUnits":"$/acre/year","TotalValueUnits":"thousand $/year","ecosystemService":"cultural","forestAverageValue":"1,137.2","forestTotalValue":"259,984.6","ruralAverageValue":"1,137.2","ruralTotalValue":"259,984.6","urbanAverageValue":"0.0","urbanTotalValue":"0.0000"},{"AverageValueUnits":"$/acre/year","TotalValueUnits":"thousand $/year","ecosystemService":"watershed","forestAverageValue":"577.8","forestTotalValue":"132,102.3","ruralAverageValue":"577.8","ruralTotalValue":"132,102.3","urbanAverageValue":"0.0","urbanTotalValue":"0.0000"},{"AverageValueUnits":"$/acre/year","TotalValueUnits":"thousand $/year","ecosystemService":"total","forestAverageValue":"2,054.4","forestTotalValue":"469,674.0","ruralAverageValue":"2,054.4","ruralTotalValue":"469,674.0","urbanAverageValue":"0.0","urbanTotalValue":"0.0000"}]};
  sData = this.data.summaryReportResults;
  individual = this.data.summaryResults;
  summaryColumns: string[] = ['name', 'avg', 'totalvalue'];
  summaryData: any[] = [];
  ecosystems: any[] = [
    { name: 'airquality', display: 'Air Quality' },
    { name: 'carbon', display: 'Carbon Sequestration'},
    { name: 'watershed', display: 'Water'},
    { name: 'biodiversity', display: 'Bio-diversity'},
    { name: 'cultural', display: 'Cultural'},
    { name: 'total', display: 'Total'}
  ];
  
  constructor(private http: HttpClient) { }
  ngOnInit() {
    this.ecosystems.forEach((eco: any) => {
      const d: any = {
        name: eco.display,
        avg: this.sData[eco.name + '_forestValuePerAcre'],
        totalvalue: this.sData[eco.name + '_totalThousandDollarsPerYear'] 
      };
      this.summaryData.push(d);
    });


  }

  

}
