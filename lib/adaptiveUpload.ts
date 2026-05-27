export type DeviceProfile = "low" | "medium" | "high";

export interface UploadLimits {
  maxFiles: number;
  maxFileSizeMB: number;
  totalSizeMB: number;
  maxResolution: number;
}

export function detectDeviceProfile(): DeviceProfile {
  if (typeof window === "undefined") return "medium";

  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua);

  // deviceMemory is an experimental feature in Chrome
  const memory = (navigator as any).deviceMemory || 4;
  const width = window.innerWidth;

  if (isMobile || memory <= 2 || width < 768) {
    return "low";
  } else if (memory <= 4 || width < 1280) {
    return "medium";
  } else {
    return "high";
  }
}

export function getUploadLimits(): UploadLimits {
  const profile = detectDeviceProfile();

  switch (profile) {
    case "low":
      return {
        maxFiles: 4,
        maxFileSizeMB: 5,
        totalSizeMB: 15,
        maxResolution: 1600,
      };
    case "medium":
      return {
        maxFiles: 8,
        maxFileSizeMB: 10,
        totalSizeMB: 40,
        maxResolution: 2500,
      };
    case "high":
      return {
        maxFiles: 12,
        maxFileSizeMB: 15,
        totalSizeMB: 60,
        maxResolution: 3000,
      };
    default:
      return {
        maxFiles: 8,
        maxFileSizeMB: 10,
        totalSizeMB: 40,
        maxResolution: 2500,
      };
  }
}
