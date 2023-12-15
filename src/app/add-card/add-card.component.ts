import { Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTreeNestedDataSource, MatTreeModule  } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import {AppMaterialUiModule} from '../app.module';
import {AddCategoryComponent} from '../add-category/add-category.component';
interface CategoryNode {
  name: string;
  children?: CategoryNode[];
}
@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [CommonModule, AppMaterialUiModule, FormsModule, MatTreeModule],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.css'
})
export class AddCardComponent {
  @Input() color!: string;
  //color variants
  chips = [
    { name: 'Red', color: 'rgb(200, 117, 117)', selected: false },
    { name: 'Blue', color: 'rgb(117, 200, 200)', selected: false },
    { name: 'Green', color: 'rgb(134, 200, 117)', selected: false },
    { name: 'Yellow', color: 'rgb(200, 193, 117)', selected: false },
    { name: 'Purple', color: 'rgb(129, 117, 200)', selected: false },
    { name: 'Grey', color: 'initial', selected: true },
  ];
  //notes categories
  categories=[
    {
      name: 'Daily',
      children: [
        { name: 'Work' },
        { name: 'School', children: [{ name: 'Math' }, { name: 'English' }, { name: 'Biology' },] },
        { name: 'Hospital' },
        { name: 'Shop' },
      ],
    },
    { 
      name: 'Food', 
      children: [
        {name: 'Bread'},
        { name: 'Eggs' },
        { name: 'Milk' },
      ]
    },
    {
      name: 'Other',
      children: [
        {name: 'Pets'},
        { name: 'Art' },
        { name: 'Family' },
      ]
    }
  ];
  //find selected color for note
  selectedChip = (this.data.color ? this.chips.find(chip => chip.color === this.data.color) : this.chips[5]);
  pageIcons!: string[];
  //notes icons
  noteIcons = ['add', 'edit', 'delete', 'save', 'note', 'description', 'visibility', 'archive', 'alarm', 'bookmark', 'code', 'build', 'brush', 'camera', 'cloud', 'desktop_windows', 'dns', 'email', 'event', 'favorite', 'grade', 'home', 'inbox', 'loyalty', 'music_note', 'pets', 'question_answer', 'receipt', 'shopping_cart', 'thumb_up', 'watch_later'];
  iconLink!: string;
  page = 0;
  selectedIcons: string[] = [];
  selectedCategories: string[] = [];

  //mat-tree controls for categories tree
  treeControl = new NestedTreeControl<CategoryNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryNode>();

  constructor( 
    public dialogRef: MatDialogRef<AddCardComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) { } 
  
    //when dialog is initiated
    ngOnInit() {
      //if some icons or categories were passed then mark them as selected for notes
      if(this.data.icons!=undefined) this.selectedIcons = this.data.icons;
      if(this.data.categories!=undefined) this.selectedCategories = this.data.categories;

      //get first icon set to display in icons table (where user choose icons for note)
      this.getData({pageIndex: this.page, pageSize: 15});

      //get categories and icons from localstorage, if it is possible, otherwise use prebuilt icons and categories
      if(localStorage.getItem("categories")!==null)
        this.categories = JSON.parse(localStorage.getItem("categories") || '{}');     
      if(localStorage.getItem("icons")!==null)
        this.noteIcons = JSON.parse(localStorage.getItem("icons") || '{}');  
      this.dataSource.data = this.categories;
    }

    //if tree node has children nodes
    hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;

    //close dialog on cancel
  onCancel(): void { 
    this.dialogRef.close(); 
  } 

  //when user changes color for note save new color to data
  changeColor(color: string): void{
    this.data.color = color;
  }

  //add new user icon by link
  addIcon(){
    this.noteIcons.push(this.iconLink); //save link to array
    this.iconLink = "";
    this.getData({pageIndex: this.page, pageSize: 15}); //update icon table
    localStorage.setItem("icons", JSON.stringify(this.noteIcons)); //save new array of icons to storage
  }

  //remove user icons from icons array
  removeIcon(){
    //find icons to remove (url icons from selected icons)
    let remove =  this.selectedIcons.filter(icon => this.isImageUrl(icon)); 
    //remove this icons from selected icons list
    this.selectedIcons = this.selectedIcons.filter(icon => !this.isImageUrl(icon));
    //remove this icons from list of all icons
    this.noteIcons = this.noteIcons.filter(icon => !remove.includes(icon));
    this.data.icons = this.selectedIcons; //update selected icons for note
    localStorage.setItem("icons", JSON.stringify(this.noteIcons)); //save new icons array to storage

    //get all notes from storage, and delete icons that were removed, then save updated notes
    const keys = Object.keys(localStorage);
      keys.forEach(data => {
        if(data!="categories" && data!="icons"){
          let item = JSON.parse(localStorage.getItem(data) || '{}');
          item.icons = item.icons.filter((icon: string) => !remove.includes(icon));
          localStorage.setItem(data, JSON.stringify(item));
        }     
      });

      //update icons table
    this.getData({ pageIndex: this.page, pageSize: 15 });
  }

  //toggle mat-chip selection
  selectChip(chip: any){
    this.selectedChip = chip;
    chip.selected = !chip.selected;
  }

  //get icons for specific page of icons table
  getData(obj: { pageIndex: any; pageSize: any; }) {
    this.page = obj.pageIndex;
    let startingIndex=obj.pageIndex * obj.pageSize;
        //get 15 icons from icons array for specific page
        this.pageIcons =  (this.noteIcons.slice(startingIndex, startingIndex + 15)) as string[];
        while(this.pageIcons.length < 15) this.pageIcons.push("");
  }

  //toggle icon selection
  toggleIconSelection(icon: string): void {
    const index = this.selectedIcons.indexOf(icon); //check if icon user tries to select is alredy selected
    if (index === -1) { //if not selected - make it selected
      this.selectedIcons.push(icon);
    } else { //if already selected then deselect
      this.selectedIcons.splice(index, 1);
    }
    this.data.icons = this.selectedIcons; //save selected icons for note
  }
  //same as icon toggle selection
  toggleCategorySelection(category: string): void {
    const index = this.selectedCategories.indexOf(category);
  
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.data.categories = this.selectedCategories;
  }
  //check if icon is in selected icons
  isSelectedIcon(icon: string): boolean {
    return this.selectedIcons.includes(icon);
  }
  //check if category is selected
  isSelectedCategory(category: string): boolean {
    return this.selectedCategories.includes(category);
  }
  //check if icon is url or just prebuilt mat-icon
  isImageUrl(icon: string): boolean {
    return icon.startsWith('http') || icon.startsWith('https');
  }

  //open dialog to add new subcategory
  openAddSubcategoryDialog(parentNode: CategoryNode): void {
    //open dialog component
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '300px',
      data: {category: undefined}
    });
  
    //when dialog closed receive new subcategory name
    dialogRef.afterClosed().subscribe((newSubcategory: string) => {
      if (newSubcategory) { //if name is not empty
        this.addNewSubcategory(parentNode, newSubcategory); //call add subcategory method
      }
    });
  }
  
  //add new subcategory
  addNewSubcategory(parentNode: CategoryNode, newSubcategory: string): void {
    if (!parentNode.children) { //if parent node doesnt have children nodes yet add empty array
      parentNode.children = [];
    }
  
    //add new subcategory to parent
    parentNode.children.push({ name: newSubcategory });
    this.treeControl.expand(parentNode); //expand updated tree branch

    //update tree data, so changes wiil be immediately displayed on page
    let data = this.dataSource.data;
    this.dataSource.data = [];
    this.dataSource.data = data;

    //save categories to localstorage
    localStorage.setItem("categories", JSON.stringify(this.categories));
  }

  //remove category and its subcetories from tree
  removeCategory(category: CategoryNode): void {
    //recursive function to remove category
    const removeCategoryRecursive = (node: CategoryNode, nodes: CategoryNode[]): void => {
      const index = nodes.findIndex(cat => cat === node); //try to find node in currect tree level
  
      if (index !== -1) { //if node was found on current level
        nodes.splice(index, 1); 
        //deselect removed category
        if(this.selectedCategories.includes(node.name)) this.toggleCategorySelection(node.name);
        removeChildren(node); //remove all child nodes
      } else { //if node wasnt found
        nodes.forEach(childNode => { //search for node in all child nodes
          if (childNode.children) { 
            removeCategoryRecursive(node, childNode.children);
          }
        });
      }
    };
    
    //remove alll child nodes recurcively
    const removeChildren = (node: CategoryNode): void => {
      //deselect category
      if(this.selectedCategories.includes(node.name)) this.toggleCategorySelection(node.name);
      node.children?.forEach(child =>{ //for each child category remove it from all notes
        const keys = Object.keys(localStorage);
        keys.forEach(data => {
          if(data!="categories" && data!="icons"){
            let item = JSON.parse(localStorage.getItem(data) || '{}');
            item.categories = item.categories.filter((cat: string) => cat!==child.name);
            localStorage.setItem(data, JSON.stringify(item));
          }     
        });
        //remove child categories for all children
        removeChildren(child);
      })
    }

    //call function to remove category
    removeCategoryRecursive(category, this.categories);
    //save updated categories to localstorage
    localStorage.setItem("categories", JSON.stringify(this.categories));
  
    //update tree data
      let data = this.dataSource.data;
      this.dataSource.data = [];
      this.dataSource.data = data;

      //remove category from all notes
      const keys = Object.keys(localStorage);
      keys.forEach(data => {
        if(data!="categories" && data!="icons"){
          let item = JSON.parse(localStorage.getItem(data) || '{}');
          item.categories = item.categories.filter((cat: string) => cat!==category.name);
          localStorage.setItem(data, JSON.stringify(item));
        }     
      });
    }
  
  
}
