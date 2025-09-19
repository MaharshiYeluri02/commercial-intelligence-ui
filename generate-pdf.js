const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF() {
  console.log('Starting PDF generation...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport for consistent rendering
  await page.setViewport({
    width: 1200,
    height: 800,
    deviceScaleFactor: 2 // Higher DPI for better quality
  });
  
  console.log('Navigating to the application...');
  
  // Navigate to your local development server
  await page.goto('http://localhost:3000/commercial-intelligence-ui', {
    waitUntil: 'networkidle0', // Wait for all network requests to finish
    timeout: 30000
  });
  
  // Wait a bit more for animations to complete
  await page.waitForTimeout(3000);
  
  console.log('Generating PDF...');
  
  // Generate PDF with high quality settings
  const pdfBuffer = await page.pdf({
    path: 'commercial-intelligence-platform.pdf',
    format: 'A4',
    printBackground: true, // Include background colors and images
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    },
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size: 10px; margin: 0 auto; color: #666;">Commercial Intelligence Platform</div>',
    footerTemplate: '<div style="font-size: 10px; margin: 0 auto; color: #666;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
  });
  
  await browser.close();
  
  console.log('✅ PDF generated successfully: commercial-intelligence-platform.pdf');
  console.log('📄 File size:', Math.round(pdfBuffer.length / 1024), 'KB');
}

// Run the PDF generation
generatePDF().catch(error => {
  console.error('❌ Error generating PDF:', error);
  process.exit(1);
});
