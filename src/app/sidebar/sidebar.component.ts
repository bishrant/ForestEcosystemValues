import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { MapcontrolService } from "../services/mapcontrol.service";
import { HttpClient } from "@angular/common/http";
import { Store, Select } from "@ngxs/store";
import { getReportValues, createPNGForReport } from "../esrimap/ReportServices";
import { ChangeReportData } from "../shared/sidebarControls.actions";
import { SidebarControlsState } from "../shared/sidebarControls.state";
import { TourService } from "ngx-tour-md-menu";
import { dummyReportData } from "../esrimap/Variables";
import { ZipService } from "../services/zip.service";
import { ZipEntry, ZipTask } from "../services/zip.interface";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @Select(SidebarControlsState.getReportDataFromState) reportData$;
  @ViewChild("fileInput") fileInput;
  @ViewChild("accordion") sidePanels;
  @Output() printingCompleted = new EventEmitter<any>();
  pdfLink = "";
  reportData: any;
  printBtnEnabled = false;
  reportEnabled = false;
  file: File | null = null;
  fileUploadError = "";
  panelOpenState = false;
  activeControl: string;
  mapGraphics: any[] = [];
  spatialSelectionState = {
    multipoint: false,
    multipointDisabled: false,
    polygon: false,
    polygonDisabled: false,
  };
  shapefileControlState = {
    start: true,
    cancel: null,
  };
  step = 0;
  constructor(
    private mapControl: MapcontrolService,
    private http: HttpClient,
    private store: Store,
    public tourService: TourService,
    private zipService: ZipService
  ) {}

  ngOnInit() {
    this.mapControl.graphicsLayerStatus$.subscribe((gLayer: any) => {
      this.mapGraphics = gLayer.graphics;
      this.reportEnabled = this.mapGraphics.length > 0;
    });

    this.mapControl.spatialSelectionState$.subscribe((state: any) => {
      this.spatialSelectionState = state;
    });

    this.reportData$.subscribe((dt) => {
      if (dt.data !== null) {
        this.printBtnEnabled = true;
      } else {
        if (this.printBtnEnabled) {
          this.printBtnEnabled = false;
        }
      }
      this.reportData = dt.data;
    });
    this.tourService.stepShow$.subscribe((step: any) => {
      if (step.anchorId === "generateStatisticsBtn") {
        this.store.dispatch(new ChangeReportData(dummyReportData));
      }
    });

    this.store.dispatch(new ChangeReportData(dummyReportData));

    this.tourService.start$.subscribe(() => {
      this.sidePanels.openAll();
    });
    this.tourService.end$.subscribe(() => {
      this.sidePanels.closeAll();
      this.store.dispatch(new ChangeReportData(null));
    });

    this.mapControl.closeSummaryTable$.subscribe(() => {
      this.reportEnabled = false;
      this.removeShapeFile();
    });
  }

  onControlChange = (evt: any) => {
    this.reportEnabled = false;
    this.removeShapeFile();
    this.mapControl.changeControl(evt);
  };

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  startTour = () => this.mapControl.startTour();

  generateStatistics = () => {
    this.mapControl.setAppBusyIndicator(true);
    getReportValues(this.mapGraphics).then((v) => {
      this.store.dispatch(new ChangeReportData(v));
      this.mapControl.setAppBusyIndicator(false);
    });
  };

  startSpatialSelection = (controlName: string, action: string) => {
    if (action === "clear") {
      this.reportEnabled = false;
      this.store.dispatch(new ChangeReportData(null));
    }
    this.mapControl.startSpatialSelection(controlName, action);
  };

  generateReport = () => {
    this.mapControl.setAppBusyIndicator(true);
    createPNGForReport(this.mapGraphics).then((_mapURL) => {
      const body = JSON.stringify({
        mapURL: _mapURL,
        stats: this.reportData,
      });
      const reportSubscription = this.http
        .post(
          "https://txfipdev.tfs.tamu.edu/forestecosystemvalues/api/createreport",
          body,
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .subscribe((dd: any) => {
          this.pdfLink = dd.fileName;
          this.mapControl.setAppBusyIndicator(false);
          this.printingCompleted.emit({
            type: "Generate Report",
            message: "Successfully created PDF report for the selected area.",
            url: dd.fileName,
          });
        });
      reportSubscription.add(() => this.mapControl.setAppBusyIndicator(false));
    });
  };

  generateGraphicsFromSHP = (file: File) => {
    const form = new FormData();
    const publishParams: any = {
      targetSR: { wkid: 102100 },
      maxRecordCount: 1000,
      enforceInputFileSizeLimit: true,
      enforceOutputJsonSizeLimit: true,
    };
    publishParams.generalize = false;
    publishParams.reducePrecision = false;
    publishParams.numberOfDigitsAfterDecimal = 0;
    form.append("publishParameters", JSON.stringify(publishParams));
    form.append("filetype", "shapefile");
    form.append("f", "json");
    form.append("file", file);

    this.http
      .post(
        "https://www.arcgis.com/sharing/rest/content/features/generate",
        form
      )
      .subscribe(
        (result: any) => {
          if (typeof result.error !== "undefined") {
            this.fileUploadError = "Error parsing shapefile.";
          } else {
            this.fileUploadError = "";
            const features = [];
            result.featureCollection.layers.forEach((layer) => {
              const type = layer.layerDefinition.geometryType;
              if (type === "esriGeometryPolygon") {
                layer.featureSet.features.forEach((feature) => {
                  features.push(feature);
                });
              }
            });
            if (features.length > 0) {
              this.shapefileControlState = { start: false, cancel: true };
              this.mapControl.shapefileUploaded(features);
            } else {
              this.fileUploadError = "Error parsing shapefile. Please make sure the zipped file consists valid polygon geometry.";
            }
          }
        },
        (e) => {
          this.fileUploadError = "Error parsing shapefile.";
        }
      );
  };

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
    this.zipService.getEntries(this.file).subscribe((entries) => {
      const mmpAreaPolygons = entries.filter(
        (e) => e.filename.toLowerCase().indexOf("shp_areas.zip") > -1
      );
      if (mmpAreaPolygons.length > 0) {
        const createFile: ZipTask = this.zipService.getData(mmpAreaPolygons[0]);
        console.log(createFile);
        createFile.data.subscribe((blob) => {
          console.log("prog ", blob);
          this.file = new File([blob], mmpAreaPolygons[0].filename, {
            lastModified: Date.now(),
          });
          console.log(this.file);
          this.generateGraphicsFromSHP(this.file);
        });
      } else {
        this.generateGraphicsFromSHP(this.file);
      }
    });
  }

  removeShapeFile = () => {
    this.store.dispatch(new ChangeReportData(null));
    this.shapefileControlState = { start: true, cancel: false };
    this.mapControl.clearGraphics();
  };
}
