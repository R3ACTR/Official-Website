import type { APIRoute, ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
const favicons: any[] = [];

export const GET: APIRoute = async () => {
  const icons: any[] = [];

  const manifest = {
    short_name: 'ScrewFast',
    name: 'ScrewFast',
    icons,
    display: 'minimal-ui',
    id: '/',
    start_url: '/',
    theme_color: '#FFEDD5',
    background_color: '#262626',
  };

  return new Response(JSON.stringify(manifest));
};
