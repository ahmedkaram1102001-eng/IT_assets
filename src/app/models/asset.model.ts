export type DeviceType = '' | 'لاب توب' | 'تليفون';
export type AssetStatus = 'جديد' | 'فعلي' | 'صيانة' | 'خارج الخدمة';

export interface Asset {
  id: string;
  company: string;
  deviceType: DeviceType;
  serialNumber: string;
  model: string;
  status: AssetStatus;
  assignedTo: string;
  dateAdded: string; 
  notes: string;
}

export interface ApiAsset {
  id: number;
  companyId: number;
  companyName: string;
  serialNumber: string;
  brand: string;
  model: string;
  status: 'Active' | 'Retired' | 'Under Maintenance';
  addedDate: string;
  notes: string;
  updatedDate: string;
  updatedBy: string;  
  deletedDate: string;
  deletedBy: string | null;
  activeAssignmentCount: number;
  maintenanceCount: number;
}

export interface PagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  data: T[];
}

export type AssetInput = Omit<Asset, 'id'>;
