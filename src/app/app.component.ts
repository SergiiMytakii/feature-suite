import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor and other common directives
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';  // Import Material module
import { DragDropModule } from '@angular/cdk/drag-drop';  // Import CDK DragDrop module
import { MatListModule } from '@angular/material/list';
interface Feature {
  name: string;
  subFeatures?: Feature[]; // Each feature can have sub-features
  isActive?: boolean;      // Track active feature for dynamic drop zones
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    MatListModule,       
    MatCardModule,        
    DragDropModule,   
    CommonModule  

  ],
})
export class AppComponent {
  features: Feature[] = [
    { name: 'Feature 1' },
    { name: 'Feature 2' },
    { name: 'Feature 3' },
    { name: 'Feature 4' },
    { name: 'Feature 5' },
  ];

  selectedFeatures: Feature[]  = [];

  drop(event: CdkDragDrop<Feature[]>, targetList: Feature[]) {
    if (event.previousContainer === event.container) {
      moveItemInArray(targetList, event.previousIndex, event.currentIndex);
    } else {
      const clonedFeature = { ...event.previousContainer.data[event.previousIndex] };
      targetList.splice(event.currentIndex, 0, clonedFeature);
    }
  }

  // Handle clicking on a feature to activate the nested drop area
  activateSubList(feature: Feature) {
    // Toggle the clicked feature's active status
    feature.isActive = !feature.isActive;

    // Deactivate all other features
    this.deactivateOthers(this.selectedFeatures, feature);
  }

  // Deactivate all other features' active states except the clicked one
  deactivateOthers(features: Feature[], activeFeature: Feature) {
    features.forEach((f) => {
      if (f !== activeFeature) {
        f.isActive = false;
      }

      // If there are sub-features, recursively deactivate them too
      if (f.subFeatures) {
        this.deactivateOthers(f.subFeatures, activeFeature);
      }
    });
  }

  // Add a new sublist (draggable container) to a feature
  addSubFeature(feature: Feature) {
    if (!feature.subFeatures) {
      feature.subFeatures = [];
    }
    feature.subFeatures.push({ name: `Sub-feature ${feature.subFeatures.length + 1}` });
  }
}