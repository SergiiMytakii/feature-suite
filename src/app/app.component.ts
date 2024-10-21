import { Component, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { FeatureItemComponent } from './feature-item/feature-item.component';

interface Feature {
  id: number;
  name: string;
  subFeatures?: Feature[];
  isActive?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [MatListModule, MatCardModule, DragDropModule, CommonModule, FeatureItemComponent],
})
export class AppComponent implements AfterViewInit {
  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;

  ngAfterViewInit() {
    this.connectDropLists();
  }

  connectDropLists() {
    const dropListRefs = this.dropLists.toArray();
    dropListRefs.forEach((dropList) => {
      dropList.connectedTo = dropListRefs.filter((dl) => dl !== dropList);
      console.log(dropList.id + ' Drop list connected to:', dropList.connectedTo
        .filter((dl): dl is CdkDropList => typeof dl !== 'string')
        .map((dl) => dl.id));
    });
  }

  features: Feature[] = [
    { id: 1, name: 'Feature 1' },
    { id: 2, name: 'Feature 2' },
    { id: 3, name: 'Feature 3' },
    { id: 4, name: 'Feature 4' },
    { id: 5, name: 'Feature 5' },
  ];

  selectedFeatures: Feature[] = [];

  drop(event: CdkDragDrop<Feature[]>) {
    for (const feature of this.selectedFeatures){
      if (this.thereAreActiveFeatures(feature)){
        console.log('there are active features');
        return;

      }
    }
    // this.connectDropLists() ;
    console.log('Drop event:', event);

    if (event.previousContainer !== event.container) {
      const originalFeature = event.previousContainer.data[event.previousIndex];

      const clonedFeature: Feature = {
        ...originalFeature,
        subFeatures: [],
        isActive: false,
        id: Date.now(),
      };

      this.selectedFeatures.splice(event.currentIndex, 0, clonedFeature);
    } else {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }
  deleteFeature(feature: Feature) {
    const index = this.selectedFeatures.indexOf(feature);
    if (index !== -1) {
      this.selectedFeatures.splice(index, 1);
    }
  }
  thereAreActiveFeatures(feature : Feature) : boolean{
    if (feature.isActive) {
      return true;
    } else if (feature.subFeatures) {
      for (const subFeature of feature.subFeatures) {
        if (this.thereAreActiveFeatures(subFeature)) {
          return true;
        }
      }
    }

    return false;
  }
  
}