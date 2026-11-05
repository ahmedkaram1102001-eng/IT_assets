import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AssetService } from '../../services/asset.service';
import { MaintenanceService } from '../../services/maintenance.service';
import { Asset } from '../../models/asset.model';
import { MaintenanceRecord } from '../../models/maintenance.model';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './maintenance.html',
  styleUrl: './maintenance.css',
})
export class Maintenance implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly assetService = inject(AssetService);
  private readonly maintenanceService = inject(MaintenanceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly asset = signal<Asset | null>(null);
  readonly records = signal<MaintenanceRecord[]>([]);
  readonly submitted = signal(false);
  readonly closingId = signal<string | null>(null);

  readonly hasOpenRecord = computed(() =>
    this.records().some((r) => r.returnDate === null)
  );

  readonly openForm = this.fb.nonNullable.group({
    vendorName: ['', Validators.required],
    issueDescription: ['', Validators.required],
    sentDate: [this.today(), Validators.required],
    notes: [''],
  });

  readonly closeForm = this.fb.nonNullable.group({
    returnDate: [this.today(), Validators.required],
    cost: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/assets']);
      return;
    }

    const existing = this.assetService.getById(id);

    if (!existing) {
      this.router.navigate(['/assets']);
      return;
    }

    this.asset.set(existing);
    this.refresh(id);
  }

  private refresh(assetId: string): void {
    this.records.set(
      this.maintenanceService.getForAsset(assetId)
    );
  }

  sendToMaintenance(): void {
    this.submitted.set(true);

    if (this.openForm.invalid) {
      this.openForm.markAllAsTouched();
      return;
    }

    const asset = this.asset();

    if (!asset) {
      return;
    }

    this.maintenanceService.open(
      asset.id,
      this.openForm.getRawValue()
    );

    this.asset.set(
      this.assetService.getById(asset.id) ?? null
    );

    this.refresh(asset.id);

    this.openForm.reset({
      vendorName: '',
      issueDescription: '',
      sentDate: this.today(),
      notes: '',
    });

    this.submitted.set(false);
  }

  startClosing(record: MaintenanceRecord): void {
    this.closingId.set(record.id);

    this.closeForm.reset({
      returnDate: this.today(),
      cost: 0,
    });
  }

  cancelClosing(): void {
    this.closingId.set(null);
  }

  confirmClose(): void {
    if (this.closeForm.invalid) {
      this.closeForm.markAllAsTouched();
      return;
    }

    const id = this.closingId();
    const asset = this.asset();

    if (!id || !asset) {
      return;
    }

    const { returnDate, cost } = this.closeForm.getRawValue();

    this.maintenanceService.close(
      id,
      returnDate,
      cost
    );

    this.asset.set(
      this.assetService.getById(asset.id) ?? null
    );

    this.refresh(asset.id);
    this.closingId.set(null);
  }

  removeRecord(record: MaintenanceRecord): void {
    if (!confirm('متأكد إنك عايز تحذف سجل الصيانة ده؟')) {
      return;
    }

    this.maintenanceService.remove(record.id);

    const asset = this.asset();

    if (asset) {
      this.refresh(asset.id);
    }
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}