// FIX: Use the 'output' function instead of the '@Output' decorator and 'EventEmitter'.
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneticMarkersService } from '../../services/genetic-markers.service';
import { GeneticMarker } from '../../models/genetic-marker.model';
import { NewClaimData } from '../../models/claim.model';

@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ClaimFormComponent implements OnInit {
  isProcessing = input.required<boolean>();
  // FIX: Use the 'output' function for component outputs, which is a better practice in modern Angular.
  claimSubmit = output<NewClaimData>();

  private fb = inject(FormBuilder);
  private geneticMarkersService = inject(GeneticMarkersService);
  
  availableMarkers: GeneticMarker[] = [];

  claimForm = this.fb.group({
    claimantId: [`USER-${Math.floor(1000 + Math.random() * 9000)}`, [Validators.required, Validators.pattern('^USER-[0-9]{4}$')]],
    geneticMarkers: this.fb.array([], [Validators.required]),
    phenotypicScoreInput: [65, [Validators.required, Validators.min(0), Validators.max(100)]],
  });
  
  ngOnInit() {
    this.availableMarkers = this.geneticMarkersService.getMarkers();
    this.addMarkerCheckboxes();
  }

  get markersFormArray() {
    return this.claimForm.controls.geneticMarkers as FormArray;
  }

  private addMarkerCheckboxes() {
    this.availableMarkers.forEach(() => this.markersFormArray.push(new FormControl(false)));
  }

  onSubmit() {
    if (this.claimForm.valid) {
      const selectedMarkers = this.claimForm.value.geneticMarkers
        ?.map((checked, i) => checked ? this.availableMarkers[i].rsId : null)
        .filter(value => value !== null) as string[];

      const submissionData: NewClaimData = {
        claimantId: this.claimForm.value.claimantId ?? '',
        phenotypicScoreInput: this.claimForm.value.phenotypicScoreInput ?? 0,
        geneticMarkers: selectedMarkers,
      };
      
      if (submissionData.geneticMarkers.length > 0) {
        this.claimSubmit.emit(submissionData);
      } else {
        // Show an error to select at least one marker
        this.claimForm.controls.geneticMarkers.setErrors({ 'required': true });
      }
    }
  }
}