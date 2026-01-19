import { jsPDF } from "jspdf";
import { autoTable } from 'jspdf-autotable';
import { robotoBold, robotoRegular } from "../constants/fonts";
import type { StudentReport } from "@/models/StudentReport";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

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
    let y = margin;
    const lineGap = 7;
    const sectionGap = 9;

    const nextLine = (gap = lineGap) => {
      y += gap;
      return y;
    };

    const drawSectionTitle = (title: string) => {
      doc.setFontSize(16);
      doc.text(title, margin, y);

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      nextLine(2);
      doc.line(margin, y, pageWidth - margin, y);
      
      nextLine(6);
    };

    doc.addFileToVFS("Roboto-Regular.ttf", robotoRegular);
    doc.addFont("Roboto-Regular.ttf", "roboto", "normal");

    doc.addFileToVFS("Roboto-Bold.ttf", robotoBold);
    doc.addFont("Roboto-Bold.ttf", "roboto", "bold");

    // Logo
    const canvas = await this.loadSvgToCanvas("/logo_class_register.svg");
    doc.addImage(canvas, "PNG", margin, margin, 10, 10);
    doc.setFont("roboto", "bold");
    doc.setFontSize(24);
    doc.text("Class register", 22, y + 8);
    nextLine(20);

    // Header
    doc.setFont("roboto", "bold");
    doc.setFontSize(20);
    doc.text("Student report", margin, y);

    // Date
    doc.setFont("Roboto", "normal");
    doc.setFontSize(16);
    const date = new Date().toISOString().slice(0, 10);
    doc.text(`${date}`, pageWidth - margin, y, { align: "right" });

    nextLine(sectionGap);

    // Personal data
    drawSectionTitle("Personal data");

    doc.setFontSize(12);
    doc.text(`Name: ${report.student.name}`, margin, y);
    nextLine();
    doc.text(`Surname: ${report.student.surname}`, margin, y);
    nextLine();
    doc.text(`Gender: ${report.student.gender}`, margin, y);
    nextLine(sectionGap);

    // Pass rate
    drawSectionTitle("Pass rate");
    doc.setFontSize(12);
    doc.text(`Passed: ${report.passRate.passed}`, margin, y);
    nextLine();
    doc.text(`Failed: ${report.passRate.failed}`, margin, y);
    nextLine();
    doc.text(`Not taken: ${report.passRate.notTakenOptional}`, margin, y);
    nextLine();
    doc.text(`Not taken - Mandatory: ${report.passRate.notTakenMandatory}`, margin, y);
    nextLine(sectionGap);

    // Performance
    drawSectionTitle("Performance");

    // Final grade
    doc.setFontSize(12);
    doc.text(`Final grade: ${report.finalGrade.name}`, margin, y);
    nextLine(6);
    doc.setFontSize(10);
    doc.text(`${report.gradesStats.lowerValue}% students has lower or equal grade`, margin, y);
    nextLine(6);
    // Weighted average
    doc.setFontSize(12);
    doc.text(`Weighted average: ${report.individualPerformance.weightedAverage}`, margin, y);
    nextLine(6);
    doc.setFontSize(10);
    doc.text(`Class: ${report.classPerformace.weightedAverage}`, margin, y);
    nextLine(6);
    // Median
    doc.setFontSize(12);
    doc.text(`Median: ${report.individualPerformance.median}`, margin, y);
    nextLine(6);
    doc.setFontSize(10);
    doc.text(`Class: ${report.classPerformace.median}`, margin, y);
    nextLine(6);
    // Standard Deviatation
    doc.setFontSize(12);
    doc.text(`Standard Deviatation: ${report.individualPerformance.standardDeviation}`, margin, y);
    nextLine(6);
    doc.setFontSize(10);
    doc.text(`Class: ${report.classPerformace.standardDeviation}`, margin, y);
    nextLine(6);
    // Max
    doc.setFontSize(12);
    doc.text(`Max: ${report.individualPerformance.max}`, margin, y);
    nextLine(6);
    doc.setFontSize(10);
    doc.text(`Class: ${report.classPerformace.max}`, margin, y);
    nextLine(6);
    // Min
    doc.setFontSize(12);
    doc.text(`Min: ${report.individualPerformance.min}`, margin, y);
    nextLine(6);
    doc.setFontSize(10);
    doc.text(`Class: ${report.classPerformace.min}`, margin, y);
    nextLine(sectionGap);

    // Results
    drawSectionTitle("Results");

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
      startY: y,
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

    y = (doc.lastAutoTable?.finalY ?? y) + sectionGap;

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