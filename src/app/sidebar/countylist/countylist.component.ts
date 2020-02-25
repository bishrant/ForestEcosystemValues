import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MapcontrolService } from 'src/app/services/mapcontrol.service';

@Component({
  selector: 'app-countylist',
  templateUrl: './countylist.component.html',
  styleUrls: ['./countylist.component.scss']
})
export class CountylistComponent implements OnInit {
  counties = ['Anderson', 'Andrews', 'Angelina', 'Aransas', 'Archer', 'Armstrong', 'Atascosa', 'Austin', 'Bailey', 'Bandera', 'Bastrop', 'Baylor', 'Bee', 'Bell', 'Bexar', 'Blanco', 'Borden', 'Bosque', 'Bowie', 'Brazoria', 'Brazos', 'Brewster', 'Briscoe', 'Brooks', 'Brown', 'Burleson', 'Burnet', 'Caldwell', 'Calhoun', 'Callahan', 'Cameron', 'Camp', 'Carson', 'Cass', 'Castro', 'Chambers', 'Cherokee', 'Childress', 'Clay', 'Cochran', 'Coke', 'Coleman', 'Collin', 'Collingsworth', 'Colorado', 'Comal', 'Comanche', 'Concho', 'Cooke', 'Coryell', 'Cottle', 'Crane', 'Crockett', 'Crosby', 'Culberson', 'Dallam', 'Dallas', 'Dawson', 'DeWitt', 'Deaf Smith', 'Delta', 'Denton', 'Dickens', 'Dimmit', 'Donley', 'Duval', 'Eastland', 'Ector', 'Edwards', 'El Paso', 'Ellis', 'Erath', 'Falls', 'Fannin', 'Fayette', 'Fisher', 'Floyd', 'Foard', 'Fort Bend', 'Franklin', 'Freestone', 'Frio', 'Gaines', 'Galveston', 'Garza', 'Gillespie', 'Glasscock', 'Goliad', 'Gonzales', 'Gray', 'Grayson', 'Gregg', 'Grimes', 'Guadalupe', 'Hale', 'Hall', 'Hamilton', 'Hansford', 'Hardeman', 'Hardin', 'Harris', 'Harrison', 'Hartley', 'Haskell', 'Hays', 'Hemphill', 'Henderson', 'Hidalgo', 'Hill', 'Hockley', 'Hood', 'Hopkins', 'Houston', 'Howard', 'Hudspeth', 'Hunt', 'Hutchinson', 'Irion', 'Jack', 'Jackson', 'Jasper', 'Jeff Davis', 'Jefferson', 'Jim Hogg', 'Jim Wells', 'Johnson', 'Jones', 'Karnes', 'Kaufman', 'Kendall', 'Kenedy', 'Kent', 'Kerr', 'Kimble', 'King', 'Kinney', 'Kleberg', 'Knox', 'La Salle', 'Lamar', 'Lamb', 'Lampasas', 'Lavaca', 'Lee', 'Leon', 'Liberty', 'Limestone', 'Lipscomb', 'Live Oak', 'Llano', 'Loving', 'Lubbock', 'Lynn', 'Madison', 'Marion', 'Martin', 'Mason', 'Matagorda', 'Maverick', 'McCulloch', 'McLennan', 'McMullen', 'Medina', 'Menard', 'Midland', 'Milam', 'Mills', 'Mitchell', 'Montague', 'Montgomery', 'Moore', 'Morris', 'Motley', 'Nacogdoches', 'Navarro', 'Newton', 'Nolan', 'Nueces', 'Ochiltree', 'Oldham', 'Orange', 'Palo Pinto', 'Panola', 'Parker', 'Parmer', 'Pecos', 'Polk', 'Potter', 'Presidio', 'Rains', 'Randall', 'Reagan', 'Real', 'Red River', 'Reeves', 'Refugio', 'Roberts', 'Robertson', 'Rockwall', 'Runnels', 'Rusk', 'Sabine', 'San Augustine', 'San Jacinto', 'San Patricio', 'San Saba', 'Schleicher', 'Scurry', 'Shackelford', 'Shelby', 'Sherman', 'Smith', 'Somervell', 'Starr', 'Stephens', 'Sterling', 'Stonewall', 'Sutton', 'Swisher', 'Tarrant', 'Taylor', 'Terrell', 'Terry', 'Throckmorton', 'Titus', 'Tom Green', 'Travis', 'Trinity', 'Tyler', 'Upshur', 'Upton', 'Uvalde', 'Val Verde', 'Van Zandt', 'Victoria', 'Walker', 'Waller', 'Ward', 'Washington', 'Webb', 'Wharton', 'Wheeler', 'Wichita', 'Wilbarger', 'Willacy', 'Williamson', 'Wilson', 'Winkler', 'Wise', 'Wood', 'Yoakum', 'Young', 'Zapata', 'Zavala']
  urbanAreas = ['Center', 'Winnsboro', 'Seminole', 'Brackettville', 'Atlanta', 'Venus', 'Burkburnett', 'Rusk', 'Mount Vernon', 'Woodcreek', 'Daingerfield', 'McGregor', 'Bowie', 'Mexia', 'Sonora', 'Denver City', 'Houston', 'Mescalero Park', 'Mathis', 'Pleasanton', 'College Station--Bryan', 'Diboll', 'Madisonville', 'Sweetwater', 'Brazoria', 'Athens', 'Post', 'Borger', 'Lufkin', 'Ingleside--Aransas Pass', 'Decatur', 'Karnes City', 'Floydada', 'Killeen', 'Navasota', 'Port Isabel--Laguna Heights', 'Tyler', 'Alice', 'Needville', 'Silsbee', 'Lago Vista', 'Pecan Acres', 'McKinney', 'San Angelo', 'Edna', 'Liberty', 'Texarkana', 'Boerne', 'Pilot Point', 'New Boston', 'Longview', 'Colorado City', 'Bartlett', 'Electra', 'Pampa', 'Malakoff', 'Coleman', 'Crystal City', 'Hamilton', 'Springtown', 'Rio Bravo--El Cenizo', 'Hooks', 'Lake Conroe Eastshore', 'Brady', 'Dumas', 'Belterra', 'Livingston', 'Justin', 'Mineral Wells', 'Cactus', 'Poteet', 'Smithville', 'West Tawakoni', 'Cleveland', 'Sunrise Shores', 'Deerwood', 'Whitesboro', 'Gainesville', 'Mount Pleasant', 'Nocona', 'Breckenridge', 'Graham', 'San Antonio', 'Raymondville', 'Denton--Lewisville', 'Luling', 'Gilmer', 'Clarksville', 'Groesbeck', 'Rio Grande City--Roma', 'Eagle Pass', 'Rockport', 'Dayton', 'Shallowater', 'Sweeny', 'Brookshire', 'Stamford', 'Odem', 'Comfort', 'Canadian', 'Carthage', 'Abernathy', 'Sherman', 'Bridgeport', 'Henderson', 'Lamesa', 'Gun Barrel City', 'Canyon', 'Pecan Plantation', 'Hillsboro', 'Cameron', 'Aubrey', 'Carrizo Springs', 'Beeville', 'Canyon Lake', 'Iowa Park', 'Refugio', 'Midland', 'Dilley', 'Granite Shoals', 'Aledo', 'Del Rio', 'Ballinger', 'Conroe--The Woodlands', 'Kingsland', 'Lake Conroe Westshore', 'Taylor', 'Hallsville', 'Crane', 'Canton', 'Corpus Christi', 'Sinton', 'Jasper', 'Trinity', 'Gonzales', 'Huntsville', 'Rockdale', 'La Grange', 'Lampasas', 'San Saba', 'Terrell', 'Waco', 'Kaufman', 'Hebbronville', 'Plainview', 'Amarillo', 'Corsicana', 'Slaton', 'Lindale--Hideaway', 'Texas City', 'Yoakum', 'Grand Saline', 'Denton Southwest', 'Elgin', 'San Marcos', 'Jones Creek', 'Eagle Lake', 'El Paso', 'Woodville', 'Bellville', 'Manor', 'Kermit', 'Fairfield', 'Gatesville', 'Lockhart', 'Llano', 'Paloma Creek South--Paloma Creek', 'Brenham', 'Brownfield', 'Friona', 'Harlingen', 'Fredericksburg', 'Presidio', 'Brownsville', 'Highland Oaks', 'Pittsburg', 'McAllen', 'Winters', 'Kilgore', 'Paris', 'Fabens', 'Hondo', 'Teague', 'Nacogdoches', 'Quitman', 'Hempstead', 'Magnolia', 'Sullivan City', 'Sealy', 'Wharton', 'Floresville', 'Fort Stockton', 'Austin', 'Granbury', 'Kerrville', 'Horseshoe Bay', 'Pearsall', 'Bonham', 'Galveston', 'Onalaska', 'Haskell', 'Port Arthur', 'Pecos', 'Levelland', 'Dimmitt', 'Olney', 'Kingsville', 'Vernon', 'Spearman', 'Eastland', 'Elroy', 'Brownwood', 'Tornillo', 'Homesteads Addition', 'Castroville', 'Zapata--Medina', 'Ennis', 'Dublin', 'Snyder', 'Taft', 'Sanger', 'Farmersville', 'Rio Hondo', 'Grangerland', 'Port Lavaca', 'Anna', 'Ozona', 'Prairie View', 'Wichita Falls', 'Bastrop', 'Falfurrias', 'Mineola', 'Kenedy', 'Sulphur Springs', 'San Diego', 'Odessa', 'Columbus', 'Fritch', 'Abilene', 'Weston Lakes', 'Marble Falls', 'Clifton', 'Junction', 'Lytle', 'Bishop', 'Schulenburg', 'Burnet', 'Devine', 'Marlin', 'Tahoka', 'Giddings', 'Muleshoe', 'Van', 'Palacios', 'Forney', 'Big Spring', 'Andrews', 'Alpine', 'Cisco', 'Cuero', 'Winnie', 'El Campo', 'West', 'Comanche', 'Perryton', 'West Columbia', 'Emerald Bay', 'Jacksboro', 'Cleburne', 'Seguin', 'Hearne', 'Big Lake', 'Palestine', 'Wills Point', 'Victoria', 'Cotulla', 'Dalhart', 'Childress', 'Krum', 'Beaumont', 'Monahans', 'Temple', 'Commerce', 'Hereford', 'Uvalde', 'Robstown', 'Crockett', 'Stephenville', 'Lubbock', 'Weatherford', 'Jacksonville', 'Lake Conroe Northshore', 'Clyde', 'Caldwell', 'Marshall', 'Lake Jackson--Angleton', 'Mont Belvieu', 'Laredo', 'Tulia', 'Premont', 'Littlefield', 'Henrietta', 'Bay City', 'Dallas--Fort Worth--Arlington', 'Alvarado', 'Greenville'].sort();
  filteredCounties: Observable<string[]>;
  filteredUrban: Observable<string[]>;
  frmGroup: FormGroup;
  countyName: any;
  urbanName: any;

  private _filter(value: string, category: string): string[] {
    const filterValue = value.toLowerCase();
    return (category === 'county' ? this.counties: this.urbanAreas).filter(c => c.toLowerCase().indexOf(filterValue) === 0);
  }

  // onCountySelected = (evt: any) => {
  //   this.frmGroup.get('Urban').setValue('');
  //   this.mapControl.applyUrbanFilter(null);
  //   this.mapControl.applyCountyFilter(evt.option.value);
  // }

  // onUrbanSelected = (evt: any) => {
  //   this.frmGroup.get('County').setValue('');
  //   this.mapControl.applyCountyFilter(null);
  //   this.mapControl.applyUrbanFilter(evt.option.value);
  // }

  onDropDownSelected = (category: string, evt: any) => {
    if (category === 'Urban' && this.frmGroup.get('County').value !== '') {
      this.frmGroup.get('County').setValue('');
    }
    if (category === 'County' && this.frmGroup.get('Urban').value !== '') {
      this.frmGroup.get('Urban').setValue('');
    }
    this.mapControl.filterByCategory(category, evt.option.value);
  }

  clearInput = (category: string) => {
    this.frmGroup.get(category).setValue('');
    this.mapControl.filterByCategory(category, null);
  }
  constructor(private fb: FormBuilder, private mapControl: MapcontrolService) {
    this.frmGroup = this.fb.group({
      County: null,
      Urban: null
    })
   }

  ngOnInit() {
    this.filteredCounties = this.frmGroup.get('County').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, 'county'))
    );
    this.filteredUrban= this.frmGroup.get('Urban').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, 'urban'))
    );
  }

}
