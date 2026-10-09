import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface QuoteInput {
  reference: string;
  date?: string;
  customer: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
  };
  items: Array<{ name: string; qty: number; price: number; sku?: string }>;
  total: number;
}

function formatZAR(n: number) {
  if (!n || n <= 0) return "On request";
  return "R " + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export async function buildQuotePdf(quote: QuoteInput) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(11, 58, 111);
  doc.rect(0, 0, pageW, 110, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("LilMed", 40, 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(15, 181, 176);
  doc.text("Medical · Laboratory · Dental Supplies", 40, 80);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("info@lilmed.co.za  ·  South Africa", 40, 96);

  // Quote meta box (right side)
  doc.setDrawColor(15, 181, 176);
  doc.setLineWidth(1);
  doc.roundedRect(pageW - 210, 32, 170, 68, 8, 8);
  doc.setFontSize(9);
  doc.setTextColor(15, 181, 176);
  doc.text("QUOTATION", pageW - 200, 50);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Ref: ${quote.reference}`, pageW - 200, 68);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const date = new Date(quote.date || Date.now()).toLocaleDateString("en-ZA");
  doc.text(`Date: ${date}`, pageW - 200, 84);

  // Customer block
  const c = quote.customer;
  doc.setTextColor(11, 58, 111);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Prepared for", 40, 140);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(45, 45, 45);
  const lines = [
    c.name ? c.name : null,
    c.company ? c.company : null,
    c.email ? c.email : null,
    c.phone ? c.phone : null,
  ].filter(Boolean) as string[];
  lines.forEach((l, i) => doc.text(l, 40, 156 + i * 14));

  const startY = 156 + lines.length * 14 + 20;

  autoTable(doc, {
    startY,
    head: [["#", "Item", "SKU", "Qty", "Unit price", "Subtotal"]],
    body: quote.items.map((i, ix) => [
      String(ix + 1),
      i.name,
      i.sku || "-",
      String(i.qty),
      formatZAR(i.price),
      formatZAR(i.price * i.qty),
    ]),
    styles: { font: "helvetica", fontSize: 10, cellPadding: 8, textColor: [30, 30, 30] },
    headStyles: { fillColor: [11, 58, 111], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [243, 248, 251] },
    columnStyles: {
      0: { cellWidth: 30, halign: "center" },
      3: { halign: "center", cellWidth: 40 },
      4: { halign: "right", cellWidth: 80 },
      5: { halign: "right", cellWidth: 90 },
    },
    margin: { left: 40, right: 40 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY ?? startY + 40;

  // Total box
  doc.setFillColor(11, 58, 111);
  doc.roundedRect(pageW - 240, finalY + 16, 200, 52, 6, 6, "F");
  doc.setTextColor(15, 181, 176);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Estimated total (excl. VAT)", pageW - 226, finalY + 34);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(formatZAR(quote.total), pageW - 226, finalY + 58);

  if (c.notes) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 58, 111);
    doc.setFontSize(11);
    doc.text("Notes", 40, finalY + 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(c.notes, 40, finalY + 56, { maxWidth: pageW - 300 });
  }

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(9);
  doc.text(
    "This quotation is valid for 14 days. Prices exclude VAT and delivery unless otherwise stated. Items marked 'On request' will be priced by our team.",
    40,
    finalY + 120,
    { maxWidth: pageW - 80 },
  );
  doc.setTextColor(15, 181, 176);
  doc.setFont("helvetica", "bold");
  doc.text("LilMed  ·  Proudly South African", 40, finalY + 150);

  return doc;
}

export async function downloadQuote(quote: QuoteInput) {
  const doc = await buildQuotePdf(quote);
  const filename = `LilMed-Quote-${quote.reference}.pdf`;
  const blob = doc.output("blob");
  const pdfBlob =
    blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" });
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 500);
}
