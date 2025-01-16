import { FileTypes } from '../enums/file-types.enum';

export interface UploadFile {
  name: string;
  path: string;
  type: FileTypes;
  mimeType: string;
  size: number;
}
