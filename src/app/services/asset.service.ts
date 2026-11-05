import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset, ApiAsset, AssetInput, AssetStatus, PagedResponse } from '../models/asset.model';
import { COMPANIES, DEVICE_TYPES, STATUSES } from '../data/reference-data';

const STORAGE_KEY = 'it-assets-tracker.assets.v1';

export const STATUS_MAP: Record<string, AssetStatus> = {
  Active: 'فعلي',
  Retired: 'خارج الخدمة',
  'Under Maintenance': 'صيانة',
};
const REVERSE_STATUS_MAP: Record<string, string> = {
  'فعلي': 'Active',
  'خارج الخدمة': 'Retired',
  'صيانة': 'Under Maintenance',
  'جديد': 'Active', 
};

export const COMPANY_MAP: Record<string, string> = {
  ElAmir: 'الأمير',
  ElWagd: 'الوجد',
};
const REVERSE_COMPANY_MAP: Record<string, number> = {
  'الأمير': 1,
  'الوجد': 2,
};

@Injectable({ providedIn: 'root' })
export class AssetService {
  loadSampleData() {
    throw new Error('Method not implemented.');
  }
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://192.168.2.20:7080/api/Assets';

  private readonly _assets = signal<Asset[]>(this.load());
  readonly assets = this._assets.asReadonly();

  loadFromApi(pageNumber = 1, pageSize = 100): void {
    this.http.get<PagedResponse<ApiAsset>>(
      `${this.apiUrl}/GetAllAssets`,
      { params: { pageNumber, pageSize } }
    ).subscribe({
      next: res => {
        const assets = (res.data ?? []).map(x => this.mapFromApi(x));
        this._assets.set(assets);
        this.persist();
        console.log('Assets loaded:', assets);
      },
      error: err => console.error('Failed to load assets:', err)
    });
  }
  addAsset(input: AssetInput): Observable<ApiAsset> {
    const payload = {
      companyId: REVERSE_COMPANY_MAP[input.company], 
      serialNumber: input.serialNumber,
      brand: '', 
      model: input.model,
      status: REVERSE_STATUS_MAP[input.status] ?? input.status,
      notes: input.notes,
    };

    return this.http.post<ApiAsset>(this.apiUrl, payload);
  }

  private mapFromApi(item: ApiAsset): Asset {
    const x = item as ApiAsset & Record<string, any>;

    return {
      id: String(x.id ?? ''),
      company: COMPANY_MAP[x.companyName] ?? x.companyName ?? '',
      deviceType: x['deviceTypeName'] ?? x['deviceType'] ?? x['assetType'] ?? '',
      serialNumber: x.serialNumber ?? '',
      model: [x.brand, x.model].filter(Boolean).join(' '),
      status: STATUS_MAP[x.status] ?? x.status ?? 'جديد',
      assignedTo: x['assignedTo'] ?? x['assignedUserName'] ?? x['employeeName'] ?? '',
      dateAdded: x.addedDate?.split('T')[0] ?? '',
      notes: x.notes ?? '',
    };
  }

  setStatus(id: string, status: AssetStatus): void {
    this._assets.update(list =>
      list.map(a => a.id === id ? { ...a, status } : a)
    );
    this.persist();
  }

  readonly summaryByCompany = computed(() =>
    COMPANIES.map(company => {
      const list = this._assets().filter(a => a.company === company);
      return {
        company,
        total: list.length,
        byType: Object.fromEntries(
          DEVICE_TYPES.map(t => [t, list.filter(a => a.deviceType === t).length])
        ),
        byStatus: Object.fromEntries(
          STATUSES.map(s => [s, list.filter(a => a.status === s).length])
        )
      };
    })
  );

  readonly totals = computed(() => {
    const list = this._assets();

    return {
      total: list.length,
      byType: Object.fromEntries(
        DEVICE_TYPES.map(t => [t, list.filter(a => a.deviceType === t).length])
      ),
      byStatus: Object.fromEntries(
        STATUSES.map(s => [s, list.filter(a => a.status === s).length])
      )
    };
  });

  getById(id: string): Asset | undefined {
    return this._assets().find(a => a.id === id);
  }

  add(input: AssetInput): void {
    this._assets.update(list => [
      { ...input, id: crypto.randomUUID() },
      ...list
    ]);
    this.persist();
  }

  addMany(inputs: AssetInput[]): void {
    this._assets.update(list => [
      ...inputs.map(input => ({ ...input, id: crypto.randomUUID() })),
      ...list
    ]);
    this.persist();
  }

  update(id: string, input: AssetInput): void {
    this._assets.update(list =>
      list.map(a => a.id === id ? { ...input, id } : a)
    );
    this.persist();
  }

  remove(id: string): void {
    this._assets.update(list => list.filter(a => a.id !== id));
    this.persist();
  }

  clearAll(): void {
    this._assets.set([]);
    this.persist();
  }

  uploadExcel(file: File): Observable<unknown> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/import-excel`, formData);
  }

  private load(): Asset[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._assets()));
    } catch {}
  }
}