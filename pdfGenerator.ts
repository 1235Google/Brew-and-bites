import { jsPDF } from 'jspdf';
import { CartItem, SavedAddress } from '../types';

export interface CompletedOrder {
  orderId: string;
  receiptNumber: string;
  date: string;
  time: string;
  items: Array<{
    id: string;
    name: string;
    emoji: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  gst: number;
  discount: number;
  grandTotal: number;
  couponCode?: string;
  paymentMethod: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  deliveryAddress: {
    name: string;
    houseNumber: string;
    street: string;
    area: string;
    city: string;
    pincode: string;
  } | null;
  deliveryPartner: {
    name: string;
    vehicleType: string;
    vehicleNumber: string;
  } | null;
}

const getQrDataUrl = (data: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve('');
        }
      } catch (e) {
        resolve('');
      }
    };
    img.onerror = () => {
      resolve('');
    };
    // Standard secure QR API
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
  });
};

export const generateReceiptPDF = async (order: CompletedOrder) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Color Palette - Amber/Caramel theme
  const primaryColor = [111, 59, 22]; // #6F3B16
  const secondaryColor = [184, 107, 43]; // #B86B2B
  const textColor = [44, 31, 21]; // #2C1F15
  const grayColor = [100, 116, 139]; // Slate 500

  // Margins & Geometry
  const leftMargin = 15;
  const rightMargin = 195;
  const printableWidth = 180;
  let y = 15;

  // Draw Header Border & Background Accent Bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(leftMargin, y, printableWidth, 3, 'F');
  y += 10;

  // Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Brew & Bites Café', leftMargin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Premium Coffee, Toasted Bites & Desserts', leftMargin, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('DIGITAL RECEIPT', rightMargin, y, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`Receipt: ${order.receiptNumber}`, rightMargin, y + 5, { align: 'right' });

  y += 15;

  // Horizontal separator line
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.line(leftMargin, y, rightMargin, y);
  y += 8;

  // Metadata block (Two columns)
  doc.setFontSize(9);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  // Left Column - Order details
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER DETAILS', leftMargin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order ID: ${order.orderId}`, leftMargin, y + 5);
  doc.text(`Date: ${order.date}`, leftMargin, y + 10);
  doc.text(`Time: ${order.time}`, leftMargin, y + 15);
  doc.text(`Status: Delivered`, leftMargin, y + 20);

  // Right Column - Customer / Delivery details
  doc.setFont('helvetica', 'bold');
  doc.text('DELIVERED TO', 110, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${order.customerName}`, 110, y + 5);
  doc.text(`Email: ${order.customerEmail}`, 110, y + 10);
  if (order.deliveryAddress) {
    const addr = order.deliveryAddress;
    const streetLine = `${addr.houseNumber}, ${addr.street}`;
    const areaLine = `${addr.area}, ${addr.city} - ${addr.pincode}`;
    doc.text(streetLine.substring(0, 45), 110, y + 15);
    doc.text(areaLine.substring(0, 45), 110, y + 20);
  } else {
    doc.text('Bhubaneswar, Odisha, India', 110, y + 15);
  }

  y += 28;

  // Items Table Header
  doc.setFillColor(248, 250, 252); // Soft gray bg
  doc.rect(leftMargin, y, printableWidth, 8, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Items Served', leftMargin + 3, y + 5.5);
  doc.text('Qty', 110, y + 5.5, { align: 'center' });
  doc.text('Unit Price', 145, y + 5.5, { align: 'right' });
  doc.text('Subtotal', rightMargin - 3, y + 5.5, { align: 'right' });

  y += 8;

  // Items Rows
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  
  order.items.forEach((item) => {
    // Add subtle grid line
    doc.setDrawColor(241, 245, 249);
    doc.line(leftMargin, y + 7, rightMargin, y + 7);

    // Render text
    doc.text(`${item.emoji || '✨'} ${item.name}`, leftMargin + 3, y + 4.5);
    doc.text(String(item.quantity), 110, y + 4.5, { align: 'center' });
    doc.text(`₹${item.price.toFixed(2)}`, 145, y + 4.5, { align: 'right' });
    doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, rightMargin - 3, y + 4.5, { align: 'right' });
    
    y += 7.5;
  });

  y += 5;

  // Bottom block: Totals (left) and QR code (right)
  const totalsYStart = y;
  
  // Left: Bill summary breakdown
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);

  doc.text('Item Total:', leftMargin + 3, y);
  doc.text(`₹${order.subtotal.toFixed(2)}`, 65, y, { align: 'right' });

  y += 5;
  doc.text('Delivery Charge:', leftMargin + 3, y);
  doc.text(order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee.toFixed(2)}`, 65, y, { align: 'right' });

  y += 5;
  doc.text('Platform Fee:', leftMargin + 3, y);
  doc.text(`₹${order.platformFee.toFixed(2)}`, 65, y, { align: 'right' });

  y += 5;
  doc.text('GST (9%):', leftMargin + 3, y);
  doc.text(`₹${order.gst.toFixed(2)}`, 65, y, { align: 'right' });

  if (order.discount > 0) {
    y += 5;
    doc.setTextColor(22, 163, 74); // Green
    doc.setFont('helvetica', 'bold');
    doc.text(`Discount (${order.couponCode || 'Promo'}):`, leftMargin + 3, y);
    doc.text(`-₹${order.discount.toFixed(2)}`, 65, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  }

  y += 7;
  // Grand total highlighting
  doc.setFillColor(254, 243, 199); // Warm amber highlight
  doc.rect(leftMargin, y - 4, 55, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('GRAND TOTAL:', leftMargin + 3, y + 0.5);
  doc.text(`₹${order.grandTotal.toFixed(2)}`, 65, y + 0.5, { align: 'right' });

  y += 8;
  doc.setFontSize(8.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Method:', leftMargin + 3, y);
  doc.setFont('helvetica', 'normal');
  doc.text(order.paymentMethod, leftMargin + 30, y);

  y += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status:', leftMargin + 3, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 163, 74); // Green
  doc.text(order.paymentStatus, leftMargin + 30, y);

  // Add courier information
  if (order.deliveryPartner) {
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('DELIVERY PARTNER', leftMargin + 3, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`Rider: ${order.deliveryPartner.name}`, leftMargin + 3, y + 4.5);
    doc.text(`Vehicle: ${order.deliveryPartner.vehicleType} (${order.deliveryPartner.vehicleNumber})`, leftMargin + 3, y + 9);
  }

  // Right Side of Bottom Block: Secure QR Code
  const qrString = `Receipt: ${order.receiptNumber}\nOrder ID: ${order.orderId}\nTotal: INR ${order.grandTotal}\nDate: ${order.date}`;
  const qrBase64 = await getQrDataUrl(qrString);

  const qrX = 145;
  const qrY = totalsYStart - 4;
  const qrSize = 35;

  if (qrBase64) {
    try {
      doc.addImage(qrBase64, 'PNG', qrX, qrY, qrSize, qrSize);
    } catch (e) {
      // Draw standard QR placeholder box
      doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.rect(qrX, qrY, qrSize, qrSize);
      doc.setFontSize(8);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('[ Secure QR Code ]', qrX + qrSize / 2, qrY + qrSize / 2, { align: 'center' });
    }
  } else {
    // Draw offline QR code placeholder
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(qrX, qrY, qrSize, qrSize);
    doc.setFontSize(7.5);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('QR Code Offline', qrX + qrSize / 2, qrY + 15, { align: 'center' });
    doc.setFontSize(6.5);
    doc.text('Verifiable Digital Copy', qrX + qrSize / 2, qrY + 22, { align: 'center' });
  }

  // Draw border around the QR Code block
  doc.setFontSize(8);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.text('Scan for Verification', qrX + qrSize / 2, qrY + qrSize + 4, { align: 'center' });

  // Footer Message at the absolute bottom
  const pageHeight = doc.internal.pageSize.height;
  let footerY = pageHeight - 20;

  doc.setDrawColor(241, 245, 249);
  doc.line(leftMargin, footerY - 5, rightMargin, footerY - 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Thank you for visiting Brew & Bites.', leftMargin + printableWidth / 2, footerY, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('This is an authentic digital receipt. Brew & Bites Café, Patia, Bhubaneswar, Odisha, 751024.', leftMargin + printableWidth / 2, footerY + 5, { align: 'center' });

  // Trigger browser download
  doc.save(`Brew-Bites-Receipt-${order.orderId}.pdf`);
};
