export function getGoogleMapsEmbedUrl(location: string) {
    const encodedLocation = encodeURIComponent(location);
  
    return `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
  }
