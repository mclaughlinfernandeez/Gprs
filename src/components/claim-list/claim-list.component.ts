// FIX: Use the 'output' function instead of the '@Output' decorator and 'EventEmitter'.
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Claim, RiskTier } from '../../models/claim.model';

@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ClaimListComponent {
  claims = input.required<Claim[]>();
  // FIX: Use the 'output' function for component outputs, which is a better practice in modern Angular.
  claimSelected = output<Claim>();

  tierColorClass = computed(() => {
    return (tier: RiskTier) => {
      switch (tier) {
        case 'Low': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'Moderate': return 'bg-yellow-400/20 text-yellow-200 border-yellow-400/30';
        case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        case 'Critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-300';
      }
    };
  });

  selectClaim(claim: Claim) {
    this.claimSelected.emit(claim);
  }
}