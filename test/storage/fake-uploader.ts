import {
  Uploader,
  UploadParams,
  UploadResponse,
} from '@/domain/forum/application/storage/uploader'
import { randomUUID } from 'node:crypto'

interface File {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public files: File[] = []

  async upload({ fileName }: UploadParams): Promise<UploadResponse> {
    const url = randomUUID()
    this.files.push({
      fileName,
      url,
    })
    return { url }
  }
}
