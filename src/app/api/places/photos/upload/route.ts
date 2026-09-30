import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateImageMagicBytes, getDeterministicPhotoPaths } from '@/lib/imageProcessor';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const placeId = formData.get('placeId') as string;
    const caption = (formData.get('caption') as string) || '';
    const attributionName = (formData.get('attributionName') as string) || user.user_metadata?.display_name || 'Community Member';
    const rightsConfirmed = formData.get('rightsConfirmed') === 'true';

    const thumbFile = formData.get('thumb') as File | null;
    const cardFile = formData.get('card') as File | null;
    const mediumFile = formData.get('medium') as File | null;

    if (!placeId || !thumbFile || !cardFile || !mediumFile) {
      return NextResponse.json({ error: 'Missing required files or placeId' }, { status: 400 });
    }

    if (!rightsConfirmed) {
      return NextResponse.json({ error: 'You must confirm ownership/rights to upload photos' }, { status: 400 });
    }

    // Convert thumb file to ArrayBuffer for magic byte validation
    const thumbBuffer = await thumbFile.arrayBuffer();
    const validation = validateImageMagicBytes(thumbBuffer);

    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error || 'Invalid image header' }, { status: 400 });
    }

    const photoId = crypto.randomUUID();
    const paths = getDeterministicPhotoPaths(placeId, photoId, 'webp');

    // Convert all variant files to ArrayBuffers
    const cardBuffer = await cardFile.arrayBuffer();
    const mediumBuffer = await mediumFile.arrayBuffer();

    // Upload WebP variants directly to Supabase Storage place-photos bucket
    // Note: If storage bucket isn't set up yet, fallback to public data URL storage
    const bucketName = 'place-photos';
    let urlThumb = '';
    let urlCard = '';
    let urlMedium = '';

    const uploadOptions = {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    };

    const [thumbRes, cardRes, mediumRes] = await Promise.all([
      supabase.storage.from(bucketName).upload(paths.thumb, thumbBuffer, uploadOptions),
      supabase.storage.from(bucketName).upload(paths.card, cardBuffer, uploadOptions),
      supabase.storage.from(bucketName).upload(paths.medium, mediumBuffer, uploadOptions),
    ]);

    if (!thumbRes.error && !cardRes.error && !mediumRes.error) {
      const getPublicUrl = (path: string) =>
        supabase.storage.from(bucketName).getPublicUrl(path).data.publicUrl;

      urlThumb = getPublicUrl(paths.thumb);
      urlCard = getPublicUrl(paths.card);
      urlMedium = getPublicUrl(paths.medium);
    } else {
      // Storage bucket fallback: convert to base64 WebP data URLs if storage bucket not pre-configured
      const thumbB64 = Buffer.from(thumbBuffer).toString('base64');
      const cardB64 = Buffer.from(cardBuffer).toString('base64');
      const mediumB64 = Buffer.from(mediumBuffer).toString('base64');

      urlThumb = `data:image/webp;base64,${thumbB64}`;
      urlCard = `data:image/webp;base64,${cardB64}`;
      urlMedium = `data:image/webp;base64,${mediumB64}`;
    }

    // Save photo record in place_photos table
    const { data: photoRecord, error: dbError } = await (supabase as any)
      .from('place_photos')
      .insert({
        id: photoId,
        place_id: placeId,
        user_id: user.id,
        url_thumb: urlThumb,
        url_card: urlCard,
        url_medium: urlMedium,
        caption: caption.trim() || null,
        attribution_name: attributionName.trim() || 'Community Member',
        rights_confirmed: true,
        flagged_for_review: false,
      })
      .select('*')
      .single();

    if (dbError || !photoRecord) {
      return NextResponse.json({ error: dbError?.message || 'Failed to save photo record' }, { status: 500 });
    }

    return NextResponse.json({ success: true, photo: photoRecord });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Upload processing error' }, { status: 500 });
  }
}
