import { jsPDF } from "jspdf";
import { autoTable } from 'jspdf-autotable';
import { robotoBold, robotoRegular } from "../constants/fonts";
import type { StudentReport } from "@/models/StudentReport";

class PdfService {
  private async loadSvgToCanvas(src: string): Promise<HTMLCanvasElement> {
    const img = new Image();
    img.src = src;

    await img.decode();

    const scale = 12;
    const canvas = document.createElement("canvas");
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);

    return canvas;
  }

  async generateStudentReportPDF (report: StudentReport) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    doc.addFileToVFS("Roboto-Regular.ttf", robotoRegular);
    doc.addFont("Roboto-Regular.ttf", "roboto", "normal");

    doc.addFileToVFS("Roboto-Bold.ttf", robotoBold);
    doc.addFont("Roboto-Bold.ttf", "roboto", "bold");

    // Logo
    const canvas = await this.loadSvgToCanvas("/logo_class_register.svg");
    doc.addImage(canvas, "PNG", margin, margin, 10, 10);
    doc.setFont("roboto", "bold");
    doc.setFontSize(24);
    doc.text("Class register", 22, 18);

    // Header
    doc.setFont("roboto", "bold");
    doc.setFontSize(20);
    doc.text("Student report", margin, 30);

    // Date
    doc.setFont("Roboto", "normal");
    doc.setFontSize(16);
    const date = new Date().toISOString().slice(0, 10);
    doc.text(`${date}`, pageWidth - margin, 30, { align: "right" });

    // // Personal data
    doc.setFontSize(16);
    doc.text("Personal data", margin, 40);

    // // Line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, 42, pageWidth - margin, 42);

    doc.setFontSize(12);
    doc.text(`Name: ${report.student.name}`, margin, 48);
    doc.text(`Surname: ${report.student.surname}`, margin, 55);
    doc.text(`Gender: ${report.student.gender}`, margin, 62);

    // // Performance
    doc.setFontSize(16);
    doc.text("Performance", margin, 72);

    // // Line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, 74, pageWidth - margin, 74);

    // Final grade
    doc.setFontSize(12);
    doc.text(`Final grade: ${report.finalGrade.name}`, margin, 80);

    doc.setFontSize(10);
    doc.text(`${report.gradesStats.lowerValue}% students has lower or equal grade`, margin, 86);

    // Weighted average
    doc.setFontSize(12);
    doc.text(`Weighted average: ${report.individualPerformance.weightedAverage}`, margin, 92);

    doc.setFontSize(10);
    doc.text(`Class: ${report.classPerformace.weightedAverage}`, margin, 98);

    // Median
    doc.setFontSize(12);
    doc.text(`Median: ${report.individualPerformance.median}`, margin, 104);

    doc.setFontSize(10);
    doc.text(`Class: ${report.classPerformace.median}`, margin, 110);

    // Standard Deviatation
    doc.setFontSize(12);
    doc.text(`Standard Deviatation: ${report.individualPerformance.standardDeviation}`, margin, 116);

    doc.setFontSize(10);
    doc.text(`Class: ${report.classPerformace.standardDeviation}`, margin, 122);

    // Max
    doc.setFontSize(12);
    doc.text(`Max: ${report.individualPerformance.max}`, margin, 128);

    doc.setFontSize(10);
    doc.text(`Class: ${report.classPerformace.max}`, margin, 134);

    // Min
    doc.setFontSize(12);
    doc.text(`Min: ${report.individualPerformance.min}`, margin, 140);

    doc.setFontSize(10);
    doc.text(`Class: ${report.classPerformace.min}`, margin, 146);

    // Results
    doc.setFontSize(16);
    doc.text("Results", margin, 154);

    // Line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, 156, pageWidth - margin, 156);

    // Results - Table
    const headers = [["Test", "Score", "Normalized score (%)","Max points","Status"]];
    const data = report.results.map(r => [
      r.testName,
      r.points,
      `${r.percentage}%`,
      r.maxPoints,
      r.status ? "Passed" : "Failed"
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 160,
      margin: { top: margin, left: margin, bottom: margin, right: margin },
      styles: {
        font: "roboto",
        fontSize: 12,
        halign: "center",
        valign: "middle",
        cellPadding: 3,
        fillColor: 255,
        textColor: 0,
      },
      headStyles: {
        fillColor: [40, 40, 40],
        textColor: 255,
        halign: "center",
        valign: "middle",
      },
      bodyStyles: {
        fillColor: 255,
        textColor: 0,
        halign: "center",
        valign: "middle",
      },
    });


    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i); 
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const pageWidth = doc.internal.pageSize.getWidth();

      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 5, {
        align: "center",
      });
    }

    window.open(doc.output("bloburl"));
  };
}

export const pdfService = new PdfService();