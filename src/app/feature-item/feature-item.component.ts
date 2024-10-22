import { ChangeDetectorRef, Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Feature } from '../models/feature';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-feature-item',
  templateUrl: './feature-item.component.html',
  styleUrls: ['./feature-item.component.css'],
  standalone: true,
  imports: [MatListModule, MatCardModule, DragDropModule, CommonModule, MatIconModule],
  
})
export class FeatureItemComponent {

  @Input() feature!: Feature;
  @Input() parentFeature?: Feature;
  @Input() dropLists?: QueryList<CdkDropList>;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
    this.cdr.detectChanges();
    console.log('Connected drop lists IDs in child:', this.allDropListsIds);
  }
  @Output() dropEmitter = new EventEmitter<CdkDragDrop<Feature[]>>();

  @ViewChildren(CdkDropList) localDropLists!: QueryList<CdkDropList>;
  constructor(private cdr: ChangeDetectorRef) {}

  public allDropListsIds: string[] = [];
  ngAfterViewInit() {
  }


  dropNested(event: CdkDragDrop<Feature[]>) {
    console.log('Nested Drop event:', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const draggedFeature = event.previousContainer.data[event.previousIndex];
      const newSubFeature: Feature = {
        ...draggedFeature,
        id: Date.now().toString(),
        subFeatures: [],
      };
      event.container.data.splice(event.currentIndex, 0, newSubFeature);
    }
    // this.dropEmitter.emit(event);
    this.cdr.detectChanges();}


    deleteFeature(feature: Feature) {
      if (this.parentFeature && this.parentFeature.subFeatures) {
        this.parentFeature.subFeatures = this.parentFeature.subFeatures.filter(f => f.id !== feature.id);
      } 
    }
}