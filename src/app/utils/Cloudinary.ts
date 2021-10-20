import CloudinaryInstance, { UploadApiResponse } from 'cloudinary';
import Streamifier from 'streamifier';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME, PUBLIC_UPLOAD_PATH } from 'utils/config';

export interface UploadParams {
  name: string|number
  folder?: string|number
  format?: string
}

const Cloudinary = CloudinaryInstance.v2;
const cloudPath = 'quran-machine';

Cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

export const getVersesPath = (surah: number|string, ayat: number|string, format = 'png') =>
  `${PUBLIC_UPLOAD_PATH}/verses/${surah}/${ayat}.${format}`;

export const uploadFromBuffer = (buffer: Buffer, options: UploadParams): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const uploadStream = Cloudinary.uploader.upload_stream(
      {
        folder: `${cloudPath}/${options.folder || ''}`,
        public_id: `${options.name}`,
        format: options.format || 'png',
        overwrite: true
      },
      (error: Error, result: UploadApiResponse) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    Streamifier.createReadStream(buffer).pipe(uploadStream);
  });

export default Cloudinary;
