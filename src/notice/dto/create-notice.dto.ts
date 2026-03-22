export class CreateNoticeDto {
  title: string;
  description: string;
  isPublic?: any; // To handle boolean via form-data strings
  fileUrl?: string;
}
