import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AssetService } from '../../services/asset.service';
import { COMPANIES, DEVICE_TYPES, STATUS_LABELS, STATUSES } from '../../data/reference-data';
import { AssetInput } from '../../models/asset.model';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './asset-form.component.html',
  styleUrl: './asset-form.component.css',
})
export class AssetFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly assetService = inject(AssetService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly companies = COMPANIES;
  readonly deviceTypes = DEVICE_TYPES;
  readonly statuses = STATUSES;
  readonly statusLabels = STATUS_LABELS;

  readonly editingId = signal<string | null>(null);
  readonly submitted = signal(false);
  readonly isSaving = signal(false);
  readonly saveError = signal<string | null>(null);

  readonly selectedFile = signal<File | null>(null);
  readonly isUploading = signal(false);
  readonly uploadError = signal<string | null>(null);
  readonly uploadSuccess = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    company: ['', Validators.required],
    deviceType: ['', Validators.required],
    serialNumber: ['', [Validators.required, Validators.minLength(2)]],
    model: [''],
    status: ['', Validators.required],
    assignedTo: [''],
    dateAdded: [this.today()],
    notes: [''],
  });

  get isEditMode(): boolean {
    return this.editingId() !== null;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    const existing = this.assetService.getById(id);
    if (!existing) {
      this.router.navigate(['/assets']);
      return;
    }

    this.editingId.set(id);
    this.form.patchValue(existing);
  }

  save(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue() as AssetInput;
    const id = this.editingId();

    if (id) {
      // TODO: نظبط PUT حقيقي على الـ API هنا لاحقًا
      this.assetService.update(id, value);
      this.router.navigate(['/assets']);
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(null);

    this.assetService.addAsset(value).subscribe({
      next: () => {
        this.isSaving.set(false);
        // نعيد تحميل القائمة من السيرفر عشان تفضل متزامنة مع الداتابيز
        this.assetService.loadFromApi();
        this.router.navigate(['/assets']);
      },
      error: (err: unknown) => {
        this.isSaving.set(false);
        this.saveError.set('حصل خطأ أثناء حفظ الجهاز، حاول تاني');
        console.error('Failed to add asset:', err);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadError.set(null);
    this.uploadSuccess.set(null);
    this.selectedFile.set(file);
    input.value = '';
  }

  confirmUpload(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);
    this.uploadError.set(null);

    this.assetService.uploadExcel(file).subscribe({
      next: () => {
        this.uploadSuccess.set('تم رفع الملف وإرسال البيانات بنجاح');
        this.isUploading.set(false);
        this.selectedFile.set(null);
      },
      error: () => {
        this.uploadError.set('حصل خطأ أثناء رفع الملف، حاول تاني');
        this.isUploading.set(false);
      },
    });
  }

  cancelUpload(): void {
    this.selectedFile.set(null);
    this.uploadError.set(null);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}