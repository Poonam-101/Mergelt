
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log("Selected files:", selectedFiles);
    setFiles(selectedFiles);
  };

  const mergePDFs = async () => {
    console.log("Merge button clicked");
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfFile = await mergedPdf.save();
      console.log("Merged PDF size:", mergedPdfFile.byteLength);
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("PDF merge error:", error);
      alert("An error occurred while merging the PDFs: " + error.message);
    }
  };

  return (
    <div className="container">
      <h1>Mergelt - Merge Your PDFs with Ease</h1>
      <input type="file" multiple accept="application/pdf" onChange={handleFileChange} />
      <button onClick={mergePDFs}>Merge PDFs</button>
    </div>
  );
}

export default App;