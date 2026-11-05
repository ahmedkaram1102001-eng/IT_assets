import { Injectable, inject } from '@angular/core';
import { AssetService } from './asset.service';
import {
  MaintenanceInput,
  MaintenanceRecord,
} from '../models/maintenance.model';

const STORAGE_KEY = 'it-assets-tracker.maintenance.v1';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly assetService = inject(AssetService);
  private records = this.load();

  getForAsset(assetId: string): MaintenanceRecord[] {
    return this.records.filter((record) => record.assetId === assetId);
  }

  open(assetId: string, input: MaintenanceInput): void {
    const record: MaintenanceRecord = {
      ...input,
      id: crypto.randomUUID(),
      assetId,
      returnDate: null,
      cost: null,
    };

    this.records = [record, ...this.records];
    this.persist();
    this.assetService.setStatus(assetId, 'صيانة');
  }

  close(id: string, returnDate: string, cost: number): void {
    const record = this.records.find((item) => item.id === id);

    if (!record || record.returnDate !== null) {
      return;
    }

    this.records = this.records.map((item) =>
      item.id === id ? { ...item, returnDate, cost } : item,
    );
    this.persist();
    this.assetService.setStatus(record.assetId, 'فعلي');
  }

  remove(id: string): void {
    const record = this.records.find((item) => item.id === id);

    if (!record) {
      return;
    }

    this.records = this.records.filter((item) => item.id !== id);
    this.persist();

    if (record.returnDate === null) {
      this.assetService.setStatus(record.assetId, 'فعلي');
    }
  }

  private load(): MaintenanceRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as MaintenanceRecord[]) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
    } catch {
      // Data remains available in memory when localStorage is unavailable.
    }
  }
}
