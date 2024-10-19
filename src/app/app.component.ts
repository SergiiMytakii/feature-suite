import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';

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
  imports: [MatListModule, MatCardModule, DragDropModule, CommonModule],
})
export class AppComponent {
  features: Feature[] = [
    { id: 1, name: 'Feature 1' },
    { id: 2, name: 'Feature 2' },
    { id: 3, name: 'Feature 3' },
    { id: 4, name: 'Feature 4' },
    { id: 5, name: 'Feature 5' },
  ];

  selectedFeatures: Feature[] = [];

  // Handle top-level drops
  drop(event: CdkDragDrop<Feature[]>) {
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

  // Handle nested drops inside sub-feature containers
  dropNested(event: CdkDragDrop<Feature[]>, parentFeature: Feature) {
    
    if (event.previousContainer !== event.container) {
      console.log('Nested Drop event:');
      const originalFeature = event.previousContainer.data[event.previousIndex];

      const clonedSubFeature: Feature = {
        ...originalFeature,
        subFeatures: [],
        isActive: false,
        id: Date.now(),
      };

      parentFeature.subFeatures = parentFeature.subFeatures || [];
      parentFeature.subFeatures.splice(event.currentIndex, 0, clonedSubFeature);
    } else {
      console.log('Nested Drop same container');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  // Activate the sub-feature list for a feature
  activateSubList(feature: Feature) {
    feature.isActive = !feature.isActive;
    this.deactivateOthers(this.selectedFeatures, feature);
  }

  // Deactivate other features
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
  addSubFeature(feature: Feature) {
    if (!feature.subFeatures) {
      feature.subFeatures = [];
    }
    feature.subFeatures.push({
      name: `Sub-feature ${feature.subFeatures.length + 1}`,
      id: Date.now(),
    });
  }
}
