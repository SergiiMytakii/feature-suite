import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
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
  imports: [MatListModule, MatCardModule, DragDropModule, CommonModule],
  
})
export class FeatureItemComponent {

  @Input() feature!: Feature;
  @Input() parentFeature?: Feature;
  @Input() dropLists!: QueryList<CdkDropList>;

  @ViewChildren(CdkDropList) localDropLists!: QueryList<CdkDropList>;

  ngAfterViewInit() {
    this.connectDropLists();
  }

  connectDropLists() {
    console.log('Connecting drop lists');
    const dropListRefs = this.dropLists.toArray().concat(this.localDropLists.toArray());
    dropListRefs.forEach((dropList) => {
      dropList.connectedTo = dropListRefs.filter((dl) => dl !== dropList);
      console.log(
        dropList.id + ' Drop list connected to:',
        dropList.connectedTo.map((dl) => dl.toString())
      );
    });
  }

  dropNested(event: CdkDragDrop<Feature[]>) {
    console.log('Nested Drop event:', event);
    if (event.previousContainer !== event.container) {
      const originalFeature = event.previousContainer.data[event.previousIndex];

      const clonedSubFeature: Feature = {
        ...originalFeature,
        subFeatures: [],
        isActive: false,
        id: Date.now(),
        name: this.feature.name + ' + ' + originalFeature.name
      };

      // Initialize subFeatures if not already done
      this.feature.subFeatures = this.feature.subFeatures || [];
      this.feature.subFeatures.splice(event.currentIndex, 0, clonedSubFeature);
    } else {
      console.log('Nested Drop same container');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  activateSubList(feature: Feature) {
    feature.isActive = !feature.isActive;
    this.deactivateOthers(this.feature.subFeatures || [], feature);
    this.connectDropLists();
  }

  deactivateOthers(features: Feature[], activeFeature: Feature) {
    features.forEach((f) => {
      if (f !== activeFeature) {
        f.isActive = false;
      }
      if (f.subFeatures) {
        this.deactivateOthers(f.subFeatures, activeFeature);
      }
    });
  }
}