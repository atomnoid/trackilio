export interface GoogleAuthorAttribution {
  displayName: string;
  uri?: string;
  photoUri?: string;
}

export interface GooglePlacePhotoRaw {
  name: string;
  widthPx?: number;
  heightPx?: number;
  authorAttributions?: GoogleAuthorAttribution[];
}

export interface GooglePlaceDetailsResponse {
  id?: string;
  photos?: GooglePlacePhotoRaw[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

export interface GooglePhotoMeta {
  index: number;
  widthPx?: number;
  heightPx?: number;
  authorAttributions: GoogleAuthorAttribution[];
}

export interface GooglePlacePhotosMetaResult {
  success: boolean;
  googlePlaceId: string;
  photos: GooglePhotoMeta[];
  error?: string;
  statusCode?: number;
}
