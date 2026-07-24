/**
 * Central image registry.
 *
 * Photography is served from Unsplash's CDN so the project runs with zero
 * binary assets checked in. Swap any URL here for a `/public` path (e.g.
 * `/images/doctors/amara.jpg`) and every section picks it up automatically.
 * `SmartImage` renders a branded gradient placeholder if a source fails,
 * so the layout never breaks offline.
 */
const CDN = "https://images.unsplash.com";

function photo(id: string, width = 1200, height = 900) {
  return `${CDN}/${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export const images = {
  doctors: {
    cardiology: photo("photo-1622253692010-333f2da6031d", 800, 1000),
    neurology: photo("photo-1612349317150-e413f6a5b16d", 800, 1000),
    pediatrics: photo("photo-1594824476967-48c8b964273f", 800, 1000),
    orthopedics: photo("photo-1637059824899-a441006a6875", 800, 1000),
    oncology: photo("photo-1559839734-2b71ea197ec2", 800, 1000),
    emergency: photo("photo-1607990281513-2c110a25bd8c", 800, 1000),
  },
  tour: {
    reception: photo("photo-1519494026892-80bbd2d6fd0d", 1200, 800),
    icu: photo("photo-1516549655169-df83a0774514", 1200, 800),
    theatre: photo("photo-1631217868264-e5b90bb7e133", 1200, 800),
    rooms: photo("photo-1586773860418-d37222d8fce3", 1200, 800),
    mri: photo("photo-1583911650428-3d0d9e2eff42", 1200, 800),
    laboratory: photo("photo-1579154204601-01588f351e67", 1200, 800),
  },
  gallery: {
    reception: photo("photo-1538108149393-fbbd81895907", 900, 1200),
    icu: photo("photo-1580281658223-9b93f18ae9ae", 900, 700),
    room: photo("photo-1504439468489-c8920d796a29", 900, 700),
    doctors: photo("photo-1576091160399-112ba8d25d1d", 900, 1200),
    theatre: photo("photo-1551190822-a9333d879b1f", 900, 700),
    ambulance: photo("photo-1587351021759-3e566b6af7cc", 900, 700),
  },
  patients: {
    one: photo("photo-1544005313-94ddf0286df2", 300, 300),
    two: photo("photo-1507003211169-0a1dd7228f2d", 300, 300),
    three: photo("photo-1573497019940-1c28c88b4f3e", 300, 300),
    four: photo("photo-1500648767791-00dcc994a43e", 300, 300),
  },
  hero: {
    poster: photo("photo-1519494026892-80bbd2d6fd0d", 1920, 1080),
  },
} as const;

/**
 * Optional hero background video. Drop an MP4 at this path to enable it —
 * the hero falls back to an animated gradient + poster when it is absent.
 */
export const heroVideoSources = [
  { src: "/videos/hero.webm", type: "video/webm" },
  { src: "/videos/hero.mp4", type: "video/mp4" },
];

/**
 * Virtual-tour clips. Same convention as the hero video: drop the files in
 * `public/videos/tour/` and that stop plays inline. When a file is missing the
 * stop silently stays a still photograph, so the section never breaks.
 */
export const tourVideoSources = {
  reception: [{ src: "/videos/tour/reception.mp4", type: "video/mp4" }],
} as const;
