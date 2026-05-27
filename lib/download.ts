import JSZip from "jszip";

export interface DownloadFile {
  name: string;
  blob: Blob;
}

export async function downloadAllAsZip(files: DownloadFile[], zipName: string) {
  if (files.length === 0) {
    console.warn("No files provided for ZIP download");
    return;
  }

  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.name, file.blob);
  });

  try {
    const content = await zip.generateAsync({
      type: "blob",
      compression: "STORE", // No compression for already compressed images
    });

    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = zipName.toLowerCase().endsWith(".zip") ? zipName : `${zipName}.zip`;
    document.body.appendChild(a);
    a.click();

    // Clean up after a delay to ensure browser triggers download
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Failed to generate ZIP:", error);
    alert("Failed to create ZIP file. Please try downloading files individually.");
  }
}
