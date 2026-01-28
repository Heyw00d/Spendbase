// ============================================
// SPENDBASE GOOGLE APPS SCRIPT
// Handles: Email signups, Advertise inquiries, List Card submissions
// ============================================

// CONFIG - Update these
const HENRY_EMAIL = 'henry@yourdomain.com'; // Your email for notifications
const FROM_NAME = 'Spendbase';

// Sheet names (will be created as tabs)
const SHEETS = {
  subscribers: 'Subscribers',
  advertise: 'Advertise Inquiries', 
  listings: 'Card Listings'
};

// Handle POST requests from forms
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const type = data.type; // 'subscribe', 'advertise', or 'listing'
    
    let result;
    switch(type) {
      case 'subscribe':
        result = handleSubscribe(data);
        break;
      case 'advertise':
        result = handleAdvertise(data);
        break;
      case 'listing':
        result = handleListing(data);
        break;
      default:
        throw new Error('Unknown form type: ' + type);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: result }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle OPTIONS for CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Spendbase API active' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// SUBSCRIBE - Newsletter signup
// ============================================
function handleSubscribe(data) {
  const sheet = getOrCreateSheet(SHEETS.subscribers, ['Email', 'Name', 'Country', 'Monthly Spend', 'Timestamp', 'Source']);
  
  // Add to sheet
  sheet.appendRow([
    data.email,
    data.name || '',
    data.country || '',
    data.monthlySpend || '',
    new Date().toISOString(),
    data.source || 'website'
  ]);
  
  // Send welcome email
  sendWelcomeEmail(data.email, data.name);
  
  return 'Subscribed successfully';
}

// ============================================
// ADVERTISE - Advertising inquiry
// ============================================
function handleAdvertise(data) {
  const sheet = getOrCreateSheet(SHEETS.advertise, ['Contact Name', 'Email', 'Company', 'Country', 'Phone', 'Budget', 'Message', 'Timestamp']);
  
  // Add to sheet
  sheet.appendRow([
    data.contactName,
    data.email,
    data.company,
    data.country || '',
    data.phone || '',
    data.budget || '',
    data.message || '',
    new Date().toISOString()
  ]);
  
  // Notify Henry
  sendAdvertiseNotification(data);
  
  return 'Inquiry submitted';
}

// ============================================
// LISTING - Card listing submission
// ============================================
function handleListing(data) {
  const sheet = getOrCreateSheet(SHEETS.listings, ['Card Name', 'Company', 'Contact Name', 'Email', 'Website', 'Network', 'Regions', 'Cashback', 'Custody', 'Description', 'Timestamp']);
  
  // Add to sheet
  sheet.appendRow([
    data.cardName,
    data.companyName,
    data.contactName,
    data.email,
    data.website || '',
    data.network || '',
    data.regions || '',
    data.cashback || '',
    data.custody || '',
    data.description || '',
    new Date().toISOString()
  ]);
  
  // Notify Henry
  sendListingNotification(data);
  
  return 'Listing submitted';
}

// ============================================
// EMAIL TEMPLATES
// ============================================

function sendWelcomeEmail(email, name) {
  const firstName = name ? name.split(' ')[0] : 'there';
  
  const subject = "You're on the list";
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 20px; }
    .header { border-bottom: 2px solid #84cc16; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #84cc16; }
    h1 { font-size: 28px; margin: 0 0 20px 0; }
    p { margin: 0 0 16px 0; color: #374151; }
    .highlight { color: #84cc16; font-weight: 600; }
    .cta { display: inline-block; background: #84cc16; color: #1a1a1a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; color: #374151; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Spendbase</div>
    </div>
    
    <h1>Hey ${firstName}!</h1>
    
    <p>Thanks for signing up for early access.</p>
    
    <p>We're building the <span class="highlight">best way to compare crypto cards</span> — cashback rates, fees, Trustpilot scores, the works. No fluff, no sponsored rankings.</p>
    
    <p>You'll hear from us when:</p>
    <ul>
      <li>We launch new features</li>
      <li>We find killer card deals</li>
      <li>Something's actually worth your time</li>
    </ul>
    
    <a href="https://spendbase.cards" class="cta">Check out Spendbase →</a>
    
    <p style="margin-top: 30px;"><strong>Quick question:</strong> What crypto card do you use today (if any)? Just hit reply — I read every response.</p>
    
    <div class="footer">
      <p>— Henry @ Spendbase</p>
      <p style="font-size: 12px; color: #9ca3af;">You're receiving this because you signed up at spendbase.cards. <a href="https://spendbase.cards/unsubscribe" style="color: #6b7280;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`;

  const plainBody = `Hey ${firstName}!

Thanks for signing up for Spendbase early access.

We're building the best way to compare crypto cards — cashback rates, fees, Trustpilot scores, the works. No fluff.

You'll hear from us when:
- We launch new features
- We find killer card deals  
- Something's actually worth your time

Check it out: https://spendbase.cards

Quick question: What crypto card do you use today (if any)? Just hit reply — I read every response.

— Henry @ Spendbase`;

  GmailApp.sendEmail(email, subject, plainBody, {
    htmlBody: htmlBody,
    name: FROM_NAME,
    replyTo: HENRY_EMAIL
  });
}

function sendAdvertiseNotification(data) {
  const subject = `[Spendbase] New Advertising Inquiry: ${data.company}`;
  
  const body = `New advertising inquiry from Spendbase:

Contact: ${data.contactName}
Email: ${data.email}
Company: ${data.company}
Country: ${data.country || 'Not specified'}
Phone: ${data.phone || 'Not provided'}
Budget: ${data.budget || 'Not specified'}

Message:
${data.message || 'No message provided'}

---
Submitted: ${new Date().toLocaleString()}
View all inquiries: [Google Sheet link]`;

  GmailApp.sendEmail(HENRY_EMAIL, subject, body, {
    name: 'Spendbase Notifications'
  });
}

function sendListingNotification(data) {
  const subject = `[Spendbase] New Card Listing: ${data.cardName}`;
  
  const body = `New card listing submission:

Card: ${data.cardName}
Company: ${data.companyName}
Contact: ${data.contactName}
Email: ${data.email}
Website: ${data.website || 'Not provided'}

Details:
- Network: ${data.network || 'Not specified'}
- Regions: ${data.regions || 'Not specified'}
- Cashback: ${data.cashback || 'Not specified'}
- Custody: ${data.custody || 'Not specified'}

Description:
${data.description || 'No description provided'}

---
Submitted: ${new Date().toLocaleString()}`;

  GmailApp.sendEmail(HENRY_EMAIL, subject, body, {
    name: 'Spendbase Notifications'
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getOrCreateSheet(sheetName, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  
  return sheet;
}

// Test function - run this first to authorize permissions
function testSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Sheet name: ' + ss.getName());
  Logger.log('Setup complete! Deploy as web app next.');
}
