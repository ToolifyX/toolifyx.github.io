export interface MobileApp {
  id: string;
  name: string;
  description: string;
  packageId: string;
  iconName: string;
  category: string;
  featured?: boolean;
}

export const mobileApps: MobileApp[] = [
  {
    id: 'rollo',
    name: 'ROLLO - Vintage Film Camera',
    description: 'Capture the beauty and magic of old school vintage images with authentic film textures.',
    packageId: 'com.ssolstice.camera',
    iconName: 'Camera',
    category: 'Photography',
    featured: true,
  },
  {
    id: 'filmory',
    name: 'Filmory – Pro Film Camera',
    description: 'A professional-grade camera app designed for enthusiasts of classic film photography.',
    packageId: 'com.ssolstice.vintage.camera.editor',
    iconName: 'Aperture',
    category: 'Photography',
  },
  {
    id: 'dualview',
    name: 'Dual Camera & PiP - DualView',
    description: 'Record from both front and rear cameras simultaneously with Picture-in-Picture mode.',
    packageId: 'com.ssolstice.dualcamera',
    iconName: 'Video',
    category: 'Video',
  },
  {
    id: 'browser10mb',
    name: '10MB Browser – Fast & Clean',
    description: 'A lightweight, ultra-fast web browser without ads or news feeds for a clean experience.',
    packageId: 'com.ssolstice.browser',
    iconName: 'Globe',
    category: 'Productivity',
  },
  {
    id: 'iptvplayer',
    name: 'IPTV+ Player – Live TV',
    description: 'Stream your M3U playlists with ease. Supports Chromecast and high-quality playback.',
    packageId: 'com.ssolstice.iptv',
    iconName: 'Tv',
    category: 'Entertainment',
  },
  {
    id: 'fieldly',
    name: 'Fieldly: GPS Camera, Timestamp',
    description: 'Add location, time, and custom metadata directly to your photos as you take them.',
    packageId: 'com.ssolstice.surveycam',
    iconName: 'MapPin',
    category: 'Utility',
  },
  {
    id: 'privatevault',
    name: 'Private Vault – Hide Photos',
    description: 'Secure your private photos and videos with high-grade encryption and a secret vault.',
    packageId: 'com.ssolstice.vault',
    iconName: 'ShieldLock',
    category: 'Security',
  },
  {
    id: 'cleanium',
    name: 'Cleanium – Smart Phone Cleaner',
    description: 'Optimize your storage by finding and removing junk files and duplicate photos.',
    packageId: 'com.ssolstice.storage.cleanup',
    iconName: 'Trash2',
    category: 'Utility',
  },
  {
    id: 'everlog',
    name: 'EverLog – Event Timeline Log',
    description: 'Keep a precise log of events and create beautiful timelines for your personal or work life.',
    packageId: 'com.ssolstice.time',
    iconName: 'Calendar',
    category: 'Productivity',
  },
  {
    id: 'aurapro',
    name: 'AuraPro – Manual Camera',
    description: 'Unlock full manual control over your camera for the perfect shot every time.',
    packageId: 'com.s2olstice.aurapro',
    iconName: 'Sliders',
    category: 'Photography',
  },
  {
    id: 'fakegps',
    name: 'Fake GPS Location',
    description: 'Simulate or spoof your GPS location with ease for testing or privacy purposes.',
    packageId: 'com.ssolstice.fakegps',
    iconName: 'Navigation',
    category: 'Utility',
  },
];
