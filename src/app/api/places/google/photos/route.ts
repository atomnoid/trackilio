import { NextRequest, NextResponse } from 'next/server';
import { getGooglePlacePhotoUri, getGooglePlacePhotoBuffer } from '@/services/googlePlaces';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId') || searchParams.get('googlePlaceId');
  const indexStr = searchParams.get('index') ?? '0';
  const maxWidthStr = searchParams.get('maxWidth') ?? '1200';
  const redirect = searchParams.get('redirect') === 'true';

  if (!placeId || placeId.trim().length === 0) {
    return NextResponse.json({ error: 'placeId is required' }, { status: 400 });
  }

  const index = parseInt(indexStr, 10);
  if (isNaN(index) || index < 0 || index > 2) {
    return NextResponse.json({ error: 'index must be between 0 and 2' }, { status: 400 });
  }

  const maxWidth = parseInt(maxWidthStr, 10);
  const validMaxWidth = isNaN(maxWidth) || maxWidth <= 0 ? 1200 : Math.min(maxWidth, 1600);

  if (redirect) {
    const result = await getGooglePlacePhotoUri(placeId, index, validMaxWidth);
    if (!result.photoUri) {
      return NextResponse.json(
        { error: result.error || 'Photo not found' },
        { status: result.statusCode || 404 }
      );
    }
    const response = NextResponse.redirect(result.photoUri, { status: 307 });
    response.headers.set('Cache-Control', 'private, max-age=3600, no-transform');
    return response;
  }

  // Default mode: Fetch & stream actual image bytes directly (prevents CORS / cross-origin CDN redirect issues)
  const imgResult = await getGooglePlacePhotoBuffer(placeId, index, validMaxWidth);

  if (!imgResult.buffer) {
    return NextResponse.json(
      { error: imgResult.error || 'Photo binary not found' },
      { status: imgResult.statusCode || 404 }
    );
  }

  return new NextResponse(imgResult.buffer, {
    status: 200,
    headers: {
      'Content-Type': imgResult.contentType || 'image/jpeg',
      'Cache-Control': 'private, max-age=3600, no-transform',
    },
  });
}
