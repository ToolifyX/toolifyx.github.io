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
        maxFiles: 50,
        maxFileSizeMB: 20,
        totalSizeMB: 100,
        maxResolution: 2000,
      };
    case "medium":
      return {
        maxFiles: 100,
        maxFileSizeMB: 50,
        totalSizeMB: 500,
        maxResolution: 4000,
      };
    case "high":
      return {
        maxFiles: 500,
        maxFileSizeMB: 100,
        totalSizeMB: 2000,
        maxResolution: 8000,
      };
    default:
      return {
        maxFiles: 100,
        maxFileSizeMB: 50,
        totalSizeMB: 500,
        maxResolution: 4000,
      };
  }
}
