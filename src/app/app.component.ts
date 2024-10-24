import {
  Component,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { FeatureItemComponent } from './feature-item/feature-item.component';
import { Feature } from './models/feature';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    MatListModule,
    MatCardModule,
    DragDropModule,
    CommonModule,
    FeatureItemComponent,
  ],
})
export class AppComponent  {
  public get connectedDropListsIds(): string[] {
    return this.getIdsRecursive(this.rootFeature).reverse();
  }

  rootFeature: Feature = {
    id: '0',
    name: 'Feature',
    subFeatures: [],
    level: 0,
  };
 basicFeatures: Feature[] = [
    { id: '1', name: 'Feature 1', level: 0 },
    { id: '2', name: 'Feature 2', level: 0 },
    { id: '3', name: 'Feature 3', level: 0 },
    { id: '4', name: 'Feature 4', level: 0 },
    { id: '5', name: 'Feature 5', level: 0 },
    { id: '6', name: 'Feature 6', level: 0 },
    { id: '7', name: 'Feature 7', level: 0 },
    { id: '8', name: 'Feature 8', level: 0 },
    { id: '9', name: 'Feature 9', level: 0 },
    { id: '10', name: 'Feature 10', level: 0 },
    { id: '11', name: 'Feature 11', level: 0 },
    { id: '12', name: 'Feature 12', level: 0 },
    { id: '13', name: 'Feature 13', level: 0 },
    { id: '14', name: 'Feature 14', level: 0 },
    { id: '15', name: 'Feature 15', level: 0 },
    { id: '16', name: 'Feature 16', level: 0 },
    { id: '17', name: 'Feature 17', level: 0 },
    { id: '18', name: 'Feature 18', level: 0 },
    { id: '19', name: 'Feature 19', level: 0 },
    { id: '20', name: 'Feature 20', level: 0 },
    { id: '21', name: 'Feature 21', level: 0 },
    { id: '22', name: 'Feature 22', level: 0 },
    { id: '23', name: 'Feature 23', level: 0 },
    { id: '24', name: 'Feature 24', level: 0 },
    { id: '25', name: 'Feature 25', level: 0 },
  ];
  maxLevel = 4;

  drop(event: CdkDragDrop<Feature[]>, parentFeature: Feature) {
    if (event.previousContainer === event.container) {
      // console.log(event.previousContainer);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const draggedFeature = event.previousContainer.data[event.previousIndex];
      // console.log('Dragged feature:', draggedFeature);
      
      // prevent to go over the max level of nested features
      const nestedLevels = calculateNestedLevels(this.rootFeature);
      //uncoment later
      // if (nestedLevels > this.maxLevel) {
      //   alert('Maximum level reached');
      //   return;
      // }

      //if it is basic feature, create a copy of it. If not , just move it.
      if (this.basicFeatures.map((f) => f.id).includes(draggedFeature.id)) {
        const newSubFeature: Feature = {
          ...draggedFeature,
          id: Date.now().toString(),
          subFeatures: [],

          level: nestedLevels,
        };
        //  event.container.data.push(newSubFeature);

        this.addFeatureToParent(
          event.container.id,
          newSubFeature
        );
        // console.log( this.rootFeature);
  
        
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  }

// helper method to find and add the feature to the correct parent
private addFeatureToParent(
  parentFeatureId: string, 
  newFeature: Feature
): boolean {
  // Check if the parent is the root feature
  if (this.rootFeature.id === parentFeatureId) {
    if (!this.rootFeature.subFeatures) {
      this.rootFeature.subFeatures = [];
    }
    this.rootFeature.subFeatures.push(newFeature);
    return true;
  }

  // Recursive function to search through the feature tree
  const findAndAddToParent = (feature: Feature): boolean => {
    if (!feature.subFeatures) {
      return false;
    }

    // Check if current feature is the parent we're looking for
    if (feature.id === parentFeatureId) {
      feature.subFeatures.push(newFeature);
        newFeature.name = feature.name + ' + ' + newFeature.name.substring(7);
      return true;
    }

    // Search through subfeatures
    for (const subFeature of feature.subFeatures) {
      if (findAndAddToParent(subFeature)) {
        return true;
      }
    }

    return false;
  };

  return findAndAddToParent(this.rootFeature);
}


  private getIdsRecursive(feature: Feature): string[] {
    let ids = [feature.id];
    if (!feature.subFeatures) return ids;
    feature.subFeatures.forEach((subFeature) => {
      ids = ids.concat(this.getIdsRecursive(subFeature));
    });
    return ids;
  }
}

function calculateNestedLevels(rootFeature: Feature): number {
  if (!rootFeature.subFeatures || rootFeature.subFeatures.length === 0) {
    return 0;
  }
  let maxDepth = 0;
  for (const subFeature of rootFeature.subFeatures) {
    const subDepth = calculateNestedLevels(subFeature);
    maxDepth = Math.max(maxDepth, subDepth);
  }
  return maxDepth + 1;
}
