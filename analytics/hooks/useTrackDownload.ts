import { analytics } from '../core/AnalyticsManager';

export const useTrackDownload = () => {
  return {
    trackDownload: (toolId: string, fileName: string, fileSize: number) => {
      analytics.track('download', {
        tool_id: toolId,
        file_extension: fileName.split('.').pop()?.toLowerCase(),
        file_size: fileSize,
      });
    }
  };
};
