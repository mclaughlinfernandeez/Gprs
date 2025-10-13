import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskTier } from '../../models/claim.model';

@Component({
  selector: 'app-score-gauge',
  templateUrl: './score-gauge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ScoreGaugeComponent {
  score = input.required<number>();
  tier = input.required<RiskTier>();

  private readonly radius = 85;
  private readonly circumference = 2 * Math.PI * this.radius;

  gaugeData = computed(() => {
    const scoreValue = this.score();
    const tierValue = this.tier();
    const offset = this.circumference - (scoreValue / 100) * this.circumference;
    
    let colorClass = 'text-gray-400';
    switch (tierValue) {
      case 'Low': colorClass = 'text-low'; break;
      case 'Moderate': colorClass = 'text-moderate'; break;
      case 'High': colorClass = 'text-high'; break;
      case 'Critical': colorClass = 'text-critical'; break;
    }
    
    return {
      offset,
      circumference: this.circumference,
      colorClass,
    };
  });
}
