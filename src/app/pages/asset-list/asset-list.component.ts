import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../services/asset.service';
import { COMPANIES, DEVICE_TYPES, STATUS_LABELS, STATUSES } from '../../data/reference-data';
import { Asset } from '../../models/asset.model';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [RouterLink, FormsModule, StatusBadgeComponent],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.css'
})
export class AssetListComponent implements OnInit {
  private readonly assetService = inject(AssetService);
  readonly companies = COMPANIES;
  readonly deviceTypes = DEVICE_TYPES;
  readonly statuses = STATUSES;
  readonly statusLabels = STATUS_LABELS;
  readonly search = signal('');
  readonly companyFilter = signal('');
  readonly typeFilter = signal('');
  readonly statusFilter = signal('');
  ngOnInit(): void {
    this.assetService.loadFromApi(1, 100);
  }
  readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();

    return this.assetService.assets()
      .filter(a => !this.companyFilter() || a.company === this.companyFilter())
      .filter(a => !this.typeFilter() || a.deviceType === this.typeFilter())
      .filter(a => !this.statusFilter() || a.status === this.statusFilter())
      .filter(a => !q ||
        a.serialNumber?.toLowerCase().includes(q) ||
        a.model?.toLowerCase().includes(q) ||
        a.assignedTo?.toLowerCase().includes(q)
      );
  });
  readonly resultCount = computed(() => this.filtered().length);
  readonly totalCount = computed(() => this.assetService.assets().length);
  clearFilters(): void {
    this.search.set('');
    this.companyFilter.set('');
    this.typeFilter.set('');
    this.statusFilter.set('');
  }
  
  remove(asset: Asset): void {
    if (confirm(`متأكد إنك عايز تحذف الجهاز "${asset.serialNumber}"؟`)) {
      this.assetService.remove(asset.id);
    }
  }
}