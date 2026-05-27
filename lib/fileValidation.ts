export interface FileValidationLimits {
  maxFiles: number;
  maxFileSizeMB: number;
  totalSizeMB: number;
  allowedTypes: string[];
}

export interface InvalidFile {
  file: File;
  reason: "Too large" | "Unsupported format" | "Exceeds total size" | "Limit exceeded";
}

export interface ValidationResult {
  validFiles: File[];
  invalidFiles: InvalidFile[];
}

export function validateFiles(
  newFiles: File[],
  existingFiles: File[],
  limits: FileValidationLimits
): ValidationResult {
  const validFiles: File[] = [];
  const invalidFiles: InvalidFile[] = [];

  let currentTotalSize = existingFiles.reduce((acc, f) => acc + f.size, 0);
  const maxTotalSizeBytes = limits.totalSizeMB * 1024 * 1024;
  const maxFileSizeBytes = limits.maxFileSizeMB * 1024 * 1024;

  for (const file of newFiles) {
    // 1. Check File Count Limit
    if (existingFiles.length + validFiles.length >= limits.maxFiles) {
      invalidFiles.push({ file, reason: "Limit exceeded" });
      continue;
    }

    // 2. Check File Type
    const isAllowedType = limits.allowedTypes.some(type => {
        if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type || file.name.toLowerCase().endsWith(type.toLowerCase());
    });

    if (!isAllowedType) {
      invalidFiles.push({ file, reason: "Unsupported format" });
      continue;
    }

    // 3. Check Individual File Size
    if (file.size > maxFileSizeBytes) {
      invalidFiles.push({ file, reason: "Too large" });
      continue;
    }

    // 4. Check Total Size Limit
    if (currentTotalSize + file.size > maxTotalSizeBytes) {
      invalidFiles.push({ file, reason: "Exceeds total size" });
      continue;
    }

    validFiles.push(file);
    currentTotalSize += file.size;
  }

  return { validFiles, invalidFiles };
}
