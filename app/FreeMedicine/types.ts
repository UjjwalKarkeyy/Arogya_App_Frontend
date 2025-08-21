export interface MedicineData {
  medicines: string[];
}

export interface DiseaseMedicines {
  [key: string]: string[];
}

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface HealthCenterData {
  uuid: string;
  name: string;
  coordinates: Coordinates;
  properties: {
    address: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface DocumentPickerAsset {
  name: string;
  size?: number;
  uri: string;
  mimeType?: string;
  type?: string;
  lastModified?: number;
  file?: File;
  output?: FileList | null;
}

export interface DocumentPickerSuccessResult {
  type: 'success';
  name: string;
  size?: number;
  uri: string;
  mimeType?: string;
  lastModified?: number;
  file?: File;
  output?: FileList | null;
  assets: DocumentPickerAsset[];
  canceled: false;
}

export interface DocumentPickerCancelledResult {
  assets: null;
  canceled: true;
}

export type DocumentPickerResult = DocumentPickerSuccessResult | DocumentPickerCancelledResult;

export interface HealthCenter {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  availableMedicines: string[];
  properties: any;
}

// Default export for the module
export default {
  // This empty object serves as the default export
};
