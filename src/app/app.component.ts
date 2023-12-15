import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {AppMaterialUiModule} from './app.module';
import {MatDialog} from '@angular/material/dialog';
import {ViewChild,ViewContainerRef} from '@angular/core';
import { CardComponent } from './card/card.component';
import { AddCardComponent } from './add-card/add-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppMaterialUiModule, CardComponent, AddCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {

  //variables to store notes data
  title = 'test';
  notes= 0;
  content: string | undefined;
  name: string | undefined;
  color: string | undefined;
  icons: string[] | undefined;
  categories: string[] | undefined;
  @ViewChild('CardContainer', { read: ViewContainerRef })
  entry!: ViewContainerRef;

  //variable for storing mat-dialog
  constructor(public dialog: MatDialog){}

  //function called when app was initiated
  ngAfterViewInit () {
    //get all notes from localstorage by keys and sort them to be displayed in correct order
    const keys = Object.keys(localStorage).sort((a, b) => parseInt(a) - parseInt(b));
      keys.forEach(data => {
        if(data!="categories" && data!="icons"){ //ignore items from localstorage that are not notes
          this.notes = parseInt(data); //parse key to become int value
          let item = JSON.parse(localStorage.getItem(data) || '{}'); //get all data for note by its index
          this.createNote((item)); //create new note on the page
        }     
      });
  }
  //create note and save it
  createNote(data: any) {
    let token = this.notes.toString(); //index (key) of note
    const componentRef = this.entry.createComponent(CardComponent); //creating new instance of note
    //passing all data to created note
    componentRef.instance.token = token;
    componentRef.instance.name = data.name;
    componentRef.instance.content = data.content;
    componentRef.instance.color = data.color;
    componentRef.instance.icons = data.icons;
    componentRef.instance.categories = data.categories;
    componentRef.instance.viewRef = componentRef;
    
    //save note to localstorage
    localStorage.setItem(token, JSON.stringify(data));
  } 

  //open dialog component to create new note
  openDialog(): void {
    //open dialog component and pass data model to it
    const dialogRef = this.dialog.open(AddCardComponent, {
      data: {name: this.name, content: this.content, color: this.color, icons: this.icons, categories: this.categories},
    });

    //when dialog is closed app receives same data model as above, but with new note information
    dialogRef.afterClosed().subscribe(result => {
      if(result){ //if received data is not empty

        //get all keys (indexes of notes) from storage
        let keys = Object.keys(localStorage);
        keys = keys.filter(item => item !== "categories");
        keys = keys.filter(item => item !== "icons");
        //find biggest index and increase it by 1 (giving new note next index)
        const nextIndex = keys.length > 0 ? Math.max(...keys.map(key => parseInt(key))) + 1 : 1;
        this.notes = nextIndex;

        //create new note from received data
        this.createNote(result);
      } 
    });
}
}
