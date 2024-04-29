export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export interface UploadResponse {
  url: string
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<UploadResponse>
}
