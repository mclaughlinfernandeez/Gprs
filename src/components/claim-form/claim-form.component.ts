import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ClaimFormComponent {
  isProcessing = input.required<boolean>();
  @Output() claimSubmit = new EventEmitter<any>();

  private fb = inject(FormBuilder);

  claimForm = this.fb.group({
    claimantId: [`USER-${Math.floor(1000 + Math.random() * 9000)}`, [Validators.required, Validators.pattern('^USER-[0-9]{4}$')]],
    geneticMarkers: [2500, [Validators.required, Validators.min(100), Validators.max(5000)]],
    phenotypicScoreInput: [65, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  onSubmit() {
    if (this.claimForm.valid) {
      this.claimSubmit.emit(this.claimForm.value);
    }
  }
}
