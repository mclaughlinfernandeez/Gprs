import { ChangeDetectionStrategy, Component, ElementRef, effect, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Claim, RiskTier } from '../../models/claim.model';

// Use a global d3 instance from the script tag in index.html
declare var d3: any;

@Component({
  selector: 'app-claim-history-chart',
  templateUrl: './claim-history-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ClaimHistoryChartComponent {
  claims = input.required<Claim[]>();
  chartContainer = viewChild<ElementRef>('chartContainer');

  private riskTierColorMap: Record<RiskTier, string> = {
    'Low': '#22c55e',
    'Moderate': '#facc15',
    'High': '#f97316',
    'Critical': '#ef4444',
  };

  constructor() {
    effect(() => {
      const claimsData = this.claims();
      if (claimsData && claimsData.length > 1 && this.chartContainer()) {
        this.drawChart(claimsData);
      }
    });
  }

  private drawChart(data: Claim[]): void {
    const element = this.chartContainer()!.nativeElement;
    d3.select(element).select('svg').remove(); // Clear previous chart
    d3.select('.tooltip').remove(); // Clear previous tooltip

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(element).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, (d: Claim) => d.submissionDate) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
      .attr('class', 'axis-text');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))
      .attr('class', 'axis-text');

    // Style axis
    svg.selectAll('.axis-text path, .axis-text line').attr('stroke', '#4a5568');
    svg.selectAll('.axis-text text').attr('fill', '#a0aec0').style('font-size', '10px');

    // Add the line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#06b6d4') // cyan-500
      .attr('stroke-width', 1.5)
      .attr('d', d3.line()
        .x((d: any) => x(d.submissionDate))
        .y((d: any) => y(d.gprs))
      );

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip absolute z-10 p-2 text-xs text-white bg-gray-900 border border-gray-600 rounded-md shadow-lg pointer-events-none opacity-0')
      .style('transition', 'opacity 0.2s');

    // Add the points
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d: Claim) => x(d.submissionDate))
      .attr('cy', (d: Claim) => y(d.gprs))
      .attr('r', 5)
      .style('fill', (d: Claim) => this.riskTierColorMap[d.riskTier])
      .attr('stroke', '#1f2937') // gray-800
      .attr('stroke-width', 2)
      .on('mouseover', (event: MouseEvent, d: Claim) => {
        tooltip.transition().style('opacity', 1);
        tooltip.html(`
          <strong>Date:</strong> ${d.submissionDate.toLocaleDateString()}<br/>
          <strong>GPRS:</strong> ${d.gprs.toFixed(2)}<br/>
          <strong>Tier:</strong> ${d.riskTier}
        `)
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition().style('opacity', 0);
      });
  }
}
