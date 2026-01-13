
import { jsPDF } from 'jspdf';

/**
 * Converts a base64 image to a PDF blob.
 * @param base64Image The image data URL.
 * @returns A Promise resolving to a Blob representing the PDF.
 */
export async function generatePDF(base64Image: string): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Image;
    img.onload = () => {
      // PDF dimensions (A4 approximately)
      const doc = new jsPDF({
        orientation: img.width > img.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [img.width, img.height]
      });

      doc.addImage(base64Image, 'JPEG', 0, 0, img.width, img.height);
      const pdfOutput = doc.output('blob');
      resolve(pdfOutput);
    };
  });
}
