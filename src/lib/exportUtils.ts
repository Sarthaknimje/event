import { Student } from './types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Function to convert student data to CSV format
export const convertToCSV = (students: Student[]): string => {
  // Define headers
  const headers = ['Name', 'Email', 'PRN', 'Class', 'Division', 'Role', 'Registered Events'];
  
  // Create CSV content
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const student of students) {
    const values = [
      `"${student.name}"`,
      `"${student.email}"`,
      `"${student.prn}"`,
      `"${student.class}"`,
      `"${student.division}"`,
      `"${student.role}"`,
      `"${student.registeredEvents?.length || 0}"`
    ];
    
    csvRows.push(values.join(','));
  }
  
  // Join all rows with newline character
  return csvRows.join('\n');
};

// Function to trigger CSV download
export const downloadCSV = (csvContent: string, filename: string = 'students-data.csv'): void => {
  // Create a blob with CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create an object URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  
  // Append link to body (required for Firefox)
  document.body.appendChild(link);
  
  // Trigger download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Function to generate PDF using jsPDF
export const generatePDF = (students: Student[]): jsPDF => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('PCCOE Event Management System - Students List', 14, 22);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  // Prepare data for table
  const headers = [['Name', 'Email', 'PRN', 'Class', 'Division', 'Role', 'Registered Events']];
  const data = students.map(student => [
    student.name,
    student.email,
    student.prn,
    student.class,
    student.division,
    student.role,
    student.registeredEvents?.length?.toString() || '0'
  ]);
  
  // Add table
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 35,
    headStyles: {
      fillColor: [0, 74, 173], // Primary color
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 35 }, // Name
      1: { cellWidth: 50 }, // Email
      2: { cellWidth: 25 }, // PRN
      3: { cellWidth: 20 }, // Class
      4: { cellWidth: 15 }, // Division
      5: { cellWidth: 20 }, // Role
      6: { cellWidth: 'auto' }  // Registered Events
    }
  });
  
  // Add pagination
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
    doc.text('PCCOE Event Management System', 14, doc.internal.pageSize.height - 10);
  }
  
  return doc;
};

// Function to trigger PDF download
export const downloadPDF = (students: Student[], filename: string = 'students-data.pdf'): void => {
  try {
    // Generate PDF
    const doc = generatePDF(students);
    
    // Save the PDF
    doc.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}; 