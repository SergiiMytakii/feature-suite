import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface Feature {
  id: number;
  name: string;
  subFeatures?: Feature[];
  isActive?: boolean;
}

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
  @Input() dropLists!: QueryList<CdkDropList>;
  @Output() deleteFeatureEvent = new EventEmitter<Feature>();

  @ViewChildren(CdkDropList) localDropLists!: QueryList<CdkDropList>;

  ngAfterViewInit() {
    this.connectDropLists();
  }

  connectDropLists() {
    console.log('Connecting drop lists for feature:', this.feature.name);
    const dropListRefs = this.dropLists.toArray().concat(this.localDropLists.toArray());
    dropListRefs.forEach((dropList) => {
      dropList.connectedTo = dropListRefs.filter((dl) => dl !== dropList);
      console.log(dropList.id + ' Drop list connected to:', dropList.connectedTo
        .filter((dl): dl is CdkDropList => typeof dl !== 'string')
        .map((dl) => dl.id));
    });
  }

  dropNested(event: CdkDragDrop<Feature[]>, feature: Feature) {
    if (!feature.isActive) {
      return;
    }
    console.log('Nested Drop event:', event);
    if (event.previousContainer !== event.container) {
      const originalFeature = event.previousContainer.data[event.previousIndex];

      const clonedSubFeature: Feature = {
        ...originalFeature,
        subFeatures: [],
        isActive: false,
        id: Date.now(),
        name: this.feature.name + ' + ' + originalFeature.name.substring(7),
      };

      // Initialize subFeatures if not already done
      this.feature.subFeatures = this.feature.subFeatures || [];
      this.feature.subFeatures.splice(event.currentIndex, 0, clonedSubFeature);
    } else {
      console.log('Nested Drop same container');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }
  setActive(isActive: boolean,) {
    this.feature.isActive = isActive;
    this.deactivateOthers(this.feature.subFeatures || [], );
    this.connectDropLists();
  }
  


  deactivateOthers(features: Feature[], ) {
    if (this.parentFeature) {
      this.parentFeature.isActive = false;
    }
    features.forEach((f) => {
    
        f.isActive = false;
      
      if (f.subFeatures) {
        this.deactivateOthers(f.subFeatures,);
      }
    });
  }

  deleteFeature(feature: Feature) {
    if (this.parentFeature && this.parentFeature.subFeatures) {
      this.parentFeature.subFeatures = this.parentFeature.subFeatures.filter(f => f.id !== feature.id);
    } else {
      this.deleteFeatureEvent.emit(feature);
    }
  }
}