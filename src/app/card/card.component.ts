import { Component, ComponentRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppMaterialUiModule} from '../app.module';
import { MatDialog} from '@angular/material/dialog';
import { AddCardComponent } from '../add-card/add-card.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, AppMaterialUiModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  //note data
  @Input() token!: string;
  @Input() content!: string;
  @Input() name!: string;
  @Input() color!: string;
  @Input() icons!: string[];
  @Input() categories!: string[];
  @Input() viewRef!: ComponentRef<CardComponent>;
  constructor(public dialog: MatDialog) {}

  //open dialog to edit note
  openDialog(): void {
    //open dialog component and pass note data to it
    const dialogRef = this.dialog.open(AddCardComponent, {
      data: {name: this.name, content: this.content, color: this.color, icons: this.icons, categories: this.categories},
    });

    //afted dialog closed recieve new edited data for note
    dialogRef.afterClosed().subscribe(result => {
      //save received data to note
      if(result){ 
        this.name = result.name;
        this.content = result.content;
        this.color = result.color;
        this.icons = result.icons;
        this.categories = result.categories;
        //save updated note to localstorage
        localStorage.setItem(this.token, JSON.stringify(result));
      }
      
    });
}
//delete note from localstorage by its key (index)
  delete(): void{
    localStorage.removeItem(this.token);
    this.viewRef.destroy();
  }

  //check if icon is url of just prebuilt mat-icon
  isImageUrl(icon: string): boolean {
    return icon.startsWith('http') || icon.startsWith('https');
  }
}
