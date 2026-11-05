import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AssetService } from '../../services/asset.service';
import { DEVICE_TYPES, STATUS_LABELS, STATUSES } from '../../data/reference-data';
import { AssetStatus, DeviceType } from '../../models/asset.model';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly assetService = inject(AssetService);
  readonly totals = this.assetService.totals;
  readonly summary = this.assetService.summaryByCompany;
  readonly deviceTypes = DEVICE_TYPES;
  readonly statuses = STATUSES;
  readonly statusLabels = STATUS_LABELS;

  readonly isEmpty = computed(() => this.assetService.assets().length === 0);

  readonly maxCompanyTotal = computed(() => {
    const values = this.summary().map((s) => s.total);
    return Math.max(1, ...values);
  });

  barWidth(total: number): string {
    return `${Math.round((total / this.maxCompanyTotal()) * 100)}%`;
  }
  loadSampleData(): void {
    this.assetService.loadSampleData();
  }
  clearAll(): void {
    const ok = confirm('هيتم حذف كل الأجهزة المسجلة نهائيًا من هذا المتصفح. متأكد؟');
    if (ok) {
      this.assetService.clearAll();
    }
  }

  trackByCompany(_: number, row: { company: string }): string {
    return row.company;
  }

  trackByType(_: number, type: DeviceType): string {
    return type;
  }

  trackByStatus(_: number, status: AssetStatus): string {
    return status;
  }
}
