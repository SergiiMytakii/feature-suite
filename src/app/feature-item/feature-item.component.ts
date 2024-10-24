import { ChangeDetectorRef, Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { CdkDragDrop, CdkDropList, DragDropModule,  } from '@angular/cdk/drag-drop';
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

  @Input() maxLevel!: number;
  @Input() feature!: Feature;
  @Input() parentFeature?: Feature;
  @Input() dropLists?: QueryList<CdkDropList>;
  @Input() public set connectedDropListsIds(ids: string[]) {
    // console.log('dropLists IDs in ', this.feature.name,  ids);
  }
  @Output() dropEmitter = new EventEmitter<CdkDragDrop<Feature[]>>();
  console = console;
  public allDropListsIds: string[] = [];
 


  dropNested(event: CdkDragDrop<Feature[]>) {
    // console.log('Nested Drop event:', event);
    this.dropEmitter.emit(event);
    }


    deleteFeature(feature: Feature) {
      if (this.parentFeature && this.parentFeature.subFeatures) {
        this.parentFeature.subFeatures = this.parentFeature.subFeatures.filter(f => f.id !== feature.id);
      } 
    }
    getTotalSubfeatures(feature: Feature): number {
      let total = feature.subFeatures?.length ?? 0;
      feature.subFeatures?.forEach(subFeature => {
        total += this.getTotalSubfeatures(subFeature);
      });
      return total;
    }
    getFeaturesBetweenFeatureAndLastSubfeature(feature: Feature, subFeature: Feature): number{
      let total = this.getTotalSubfeatures(feature);
    let totalInSubfeatures = this.getTotalSubfeatures(subFeature);
      total -= totalInSubfeatures;

      if (total === 1 || total === 0 || total === 2) {
        return 1;
      }

      return total - 1;
    }
}