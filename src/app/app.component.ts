import { Component, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { FeatureItemComponent } from './feature-item/feature-item.component';
import { Feature } from './models/feature';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [MatListModule, MatCardModule, DragDropModule, CommonModule, FeatureItemComponent],
})
export class AppComponent implements AfterViewInit {
  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;
  public get connectedDropListsIds(): string[] {
    return this.getIdsRecursive( this.rootFeature).reverse();
  }

  ngAfterViewInit() {
    this.getIdsRecursive( this.rootFeature).reverse();
  }

  rootFeature: Feature = { id: '0', name: 'Feature', subFeatures: [] , level: 0};
  features: Feature[] = [
    { id: '1', name: 'Feature 1', level: 0 },
    { id:' 2', name: 'Feature 2' , level: 0},
    { id: '3', name: 'Feature 3' , level: 0},
    { id: '4', name: 'Feature 4' , level: 0},
    { id: '5', name: 'Feature 5' , level: 0},
  ];
  maxLevel = 3;
  

  drop( event: CdkDragDrop<Feature[]>, parentFeature: Feature ) {
    console.log('Drop event:', event);
    // event.container.element.nativeElement.classList.remove('active');
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const draggedFeature = event.previousContainer.data[event.previousIndex];
      const nestedLevels = calculateNestedLevels(this.rootFeature);
      console.log('nestedLevels: ',  nestedLevels);
      if (nestedLevels >= this.maxLevel) {
        alert('Maximum level reached');
        return;
      }
      const newSubFeature: Feature = {
        ...draggedFeature,
        id: Date.now().toString(),
        subFeatures: [],
        name: parentFeature.name + ' + ' + draggedFeature.name.substring(7),
        level: nestedLevels,
      };
      event.container.data.splice(event.currentIndex, 0, newSubFeature);
    }
  }
  private getIdsRecursive(feature: Feature): string[] {
    let ids = [feature.id];
    if (!feature.subFeatures) return ids;
    feature.subFeatures.forEach((subFeature) => { ids = ids.concat(this.getIdsRecursive(subFeature)) });
    return ids;
  }
  
}

function calculateNestedLevels(rootFeature: Feature): number {
  if (!rootFeature.subFeatures || rootFeature.subFeatures.length === 0) {
    return 0
  }
  
  let maxDepth = 0
  for (const subFeature of rootFeature.subFeatures) {
    const subDepth = calculateNestedLevels(subFeature)
    maxDepth = Math.max(maxDepth, subDepth)
  }
  
  return maxDepth + 1
}
