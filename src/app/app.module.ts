import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatBadgeModule} from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatChipsModule} from '@angular/material/chips';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms'; 
const UI_MODULES = [
  MatDialogModule,
  MatListModule,
  MatTooltipModule,
  MatButtonModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatMenuModule,
  MatIconModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatToolbarModule,
  MatSidenavModule,
  MatTableModule,
  MatCheckboxModule,
  MatCardModule,
  LayoutModule,
  MatGridListModule,
  MatExpansionModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatPaginatorModule,
  MatSortModule,
  MatSlideToggleModule,
  MatRadioModule,
  MatChipsModule,
  ScrollingModule,
  MatBadgeModule,
  FormsModule,
];
@NgModule({
  declarations: [],
  imports: UI_MODULES, exports: UI_MODULES
})
export class AppMaterialUiModule { }