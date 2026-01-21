/**
 * Gmail Analysis and Management Tool
 *
 * Features:
 * - Analyze email patterns (senders, frequency, time of day)
 * - Bulk unsubscribe from mailing lists
 * - Export email data to CSV
 * - Auto-delete or archive based on criteria
 * - Generate custom reports on inbox statistics
 */

// Configuration
const CONFIG = {
  MAX_THREADS: 500,           // Maximum threads to process per run
  DAYS_TO_ANALYZE: 90,        // Default days to analyze
  BATCH_SIZE: 100,            // Batch size for processing
  REPORT_FOLDER: 'Gmail Reports', // Folder name for reports
};

/**
 * Create menu in Gmail UI
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Gmail Analyzer')
    .addItem('📊 Analyze Email Patterns', 'analyzeEmailPatterns')
    .addItem('📧 Export to CSV', 'exportEmailsToCSV')
    .addItem('🔍 Find Unsubscribe Links', 'findUnsubscribeEmails')
    .addItem('🗑️ Bulk Unsubscribe', 'bulkUnsubscribe')
    .addItem('🗂️ Auto Archive/Delete', 'autoManageEmails')
    .addItem('📈 Generate Reports', 'generateInboxReport')
    .addToUi();
}

// ==================== EMAIL PATTERN ANALYSIS ====================

/**
 * Analyze email patterns: senders, frequency, and time of day
 */
function analyzeEmailPatterns(daysBack = CONFIG.DAYS_TO_ANALYZE) {
  const sheet = getOrCreateSheet('Email Pattern Analysis');

  // Clear existing data
  sheet.clear();

  // Set headers
  const headers = [
    ['Sender Email', 'Sender Name', 'Email Count', 'First Email', 'Last Email',
     'Avg per Week', 'Most Active Hour', 'Most Active Day']
  ];
  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');

  // Get emails from the last N days
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const query = `after:${formatDateForQuery(cutoffDate)}`;
  const threads = GmailApp.search(query, 0, CONFIG.MAX_THREADS);

  Logger.log(`Analyzing ${threads.length} threads...`);

  const senderStats = {};
  const hourStats = {};
  const dayStats = {};

  // Process each thread
  threads.forEach(thread => {
    const messages = thread.getMessages();

    messages.forEach(message => {
      const from = message.getFrom();
      const email = extractEmail(from);
      const name = extractName(from);
      const date = message.getDate();
      const hour = date.getHours();
      const day = getDayName(date.getDay());

      // Initialize sender stats
      if (!senderStats[email]) {
        senderStats[email] = {
          name: name,
          count: 0,
          firstEmail: date,
          lastEmail: date,
          hours: {},
          days: {}
        };
      }

      // Update stats
      senderStats[email].count++;
      if (date < senderStats[email].firstEmail) senderStats[email].firstEmail = date;
      if (date > senderStats[email].lastEmail) senderStats[email].lastEmail = date;

      senderStats[email].hours[hour] = (senderStats[email].hours[hour] || 0) + 1;
      senderStats[email].days[day] = (senderStats[email].days[day] || 0) + 1;
    });
  });

  // Prepare data for sheet
  const data = [];
  Object.keys(senderStats).forEach(email => {
    const stats = senderStats[email];
    const daysDiff = Math.max(1, (stats.lastEmail - stats.firstEmail) / (1000 * 60 * 60 * 24));
    const weeksElapsed = Math.max(1, daysDiff / 7);
    const avgPerWeek = (stats.count / weeksElapsed).toFixed(2);

    const mostActiveHour = Object.keys(stats.hours).reduce((a, b) =>
      stats.hours[a] > stats.hours[b] ? a : b
    );

    const mostActiveDay = Object.keys(stats.days).reduce((a, b) =>
      stats.days[a] > stats.days[b] ? a : b
    );

    data.push([
      email,
      stats.name,
      stats.count,
      stats.firstEmail,
      stats.lastEmail,
      avgPerWeek,
      `${mostActiveHour}:00`,
      mostActiveDay
    ]);
  });

  // Sort by email count (descending)
  data.sort((a, b) => b[2] - a[2]);

  // Write to sheet
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    sheet.autoResizeColumns(1, data[0].length);
  }

  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Analyzed ${data.length} unique senders from ${threads.length} threads`,
    'Analysis Complete',
    5
  );

  return data;
}

// ==================== BULK UNSUBSCRIBE ====================

/**
 * Find all emails with unsubscribe links
 */
function findUnsubscribeEmails(daysBack = CONFIG.DAYS_TO_ANALYZE) {
  const sheet = getOrCreateSheet('Unsubscribe Links');
  sheet.clear();

  const headers = [
    ['Select', 'Sender Email', 'Sender Name', 'Subject', 'Date', 'Unsubscribe Link', 'Thread ID']
  ];
  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers)
    .setFontWeight('bold')
    .setBackground('#ea4335')
    .setFontColor('white');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const query = `after:${formatDateForQuery(cutoffDate)} unsubscribe`;
  const threads = GmailApp.search(query, 0, CONFIG.MAX_THREADS);

  const data = [];

  threads.forEach(thread => {
    const messages = thread.getMessages();
    const latestMessage = messages[messages.length - 1];

    const from = latestMessage.getFrom();
    const email = extractEmail(from);
    const name = extractName(from);
    const subject = latestMessage.getSubject();
    const date = latestMessage.getDate();
    const body = latestMessage.getBody();

    // Extract unsubscribe link
    const unsubLink = extractUnsubscribeLink(body, latestMessage.getRawContent());

    if (unsubLink) {
      data.push([
        false, // Checkbox for selection
        email,
        name,
        subject,
        date,
        unsubLink,
        thread.getId()
      ]);
    }
  });

  // Sort by sender email
  data.sort((a, b) => a[1].localeCompare(b[1]));

  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);

    // Add checkboxes to first column
    sheet.getRange(2, 1, data.length, 1).insertCheckboxes();
    sheet.autoResizeColumns(1, data[0].length);
  }

  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Found ${data.length} emails with unsubscribe links`,
    'Search Complete',
    5
  );

  return data;
}

/**
 * Bulk unsubscribe from selected emails
 */
function bulkUnsubscribe() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Unsubscribe Links');

  if (!sheet) {
    SpreadsheetApp.getUi().alert('Please run "Find Unsubscribe Links" first!');
    return;
  }

  const data = sheet.getDataRange().getValues();
  let unsubscribeCount = 0;
  let archiveCount = 0;

  for (let i = 1; i < data.length; i++) {
    const isSelected = data[i][0];

    if (isSelected === true) {
      const unsubLink = data[i][5];
      const threadId = data[i][6];
      const senderEmail = data[i][1];

      // Log the unsubscribe link for manual processing
      Logger.log(`Unsubscribe link for ${senderEmail}: ${unsubLink}`);
      unsubscribeCount++;

      // Archive the thread
      try {
        const thread = GmailApp.getThreadById(threadId);
        if (thread) {
          thread.moveToArchive();
          archiveCount++;
        }
      } catch (e) {
        Logger.log(`Error archiving thread ${threadId}: ${e}`);
      }
    }
  }

  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Found ${unsubscribeCount} unsubscribe links (logged). Archived ${archiveCount} threads.`,
    'Unsubscribe Process Complete',
    10
  );
}

// ==================== CSV EXPORT ====================

/**
 * Export email data to CSV format
 */
function exportEmailsToCSV(daysBack = CONFIG.DAYS_TO_ANALYZE) {
  const sheet = getOrCreateSheet('Email Export');
  sheet.clear();

  const headers = [
    ['Date', 'Time', 'From Email', 'From Name', 'To', 'Subject', 'Labels',
     'Is Read', 'Has Attachments', 'Thread ID', 'Message ID']
  ];
  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers)
    .setFontWeight('bold')
    .setBackground('#34a853')
    .setFontColor('white');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const query = `after:${formatDateForQuery(cutoffDate)}`;
  const threads = GmailApp.search(query, 0, CONFIG.MAX_THREADS);

  const data = [];

  threads.forEach(thread => {
    const messages = thread.getMessages();
    const labels = thread.getLabels().map(l => l.getName()).join(', ');

    messages.forEach(message => {
      const date = message.getDate();
      const from = message.getFrom();
      const email = extractEmail(from);
      const name = extractName(from);

      data.push([
        Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
        Utilities.formatDate(date, Session.getScriptTimeZone(), 'HH:mm:ss'),
        email,
        name,
        message.getTo(),
        message.getSubject(),
        labels,
        !message.isUnread(),
        message.getAttachments().length > 0,
        thread.getId(),
        message.getId()
      ]);
    });
  });

  // Sort by date (newest first)
  data.sort((a, b) => new Date(b[0] + ' ' + b[1]) - new Date(a[0] + ' ' + a[1]));

  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    sheet.autoResizeColumns(1, data[0].length);
  }

  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Exported ${data.length} emails. Download as CSV: File > Download > CSV`,
    'Export Complete',
    10
  );

  return data;
}

// ==================== AUTO DELETE/ARCHIVE ====================

/**
 * Auto-delete or archive based on multiple criteria
 */
function autoManageEmails() {
  const ui = SpreadsheetApp.getUi();

  // Get criteria from user or use predefined rules
  const sheet = getOrCreateSheet('Auto-Manage Rules');

  // Check if rules exist
  let rules = [];
  if (sheet.getLastRow() > 1) {
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
    rules = data.map(row => ({
      query: row[0],
      action: row[1],
      days: row[2],
      enabled: row[3]
    }));
  } else {
    // Create default rules
    setupDefaultRules(sheet);
    ui.alert('Default rules created! Please review and enable them in the "Auto-Manage Rules" sheet.');
    return;
  }

  let processedCount = 0;
  let deletedCount = 0;
  let archivedCount = 0;

  rules.forEach(rule => {
    if (!rule.enabled) return;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - rule.days);

    const query = `${rule.query} before:${formatDateForQuery(cutoffDate)}`;
    const threads = GmailApp.search(query, 0, CONFIG.BATCH_SIZE);

    threads.forEach(thread => {
      processedCount++;

      if (rule.action === 'DELETE') {
        thread.moveToTrash();
        deletedCount++;
      } else if (rule.action === 'ARCHIVE') {
        thread.moveToArchive();
        archivedCount++;
      }
    });
  });

  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Processed ${processedCount} threads: ${deletedCount} deleted, ${archivedCount} archived`,
    'Auto-Manage Complete',
    5
  );
}

/**
 * Setup default auto-manage rules
 */
function setupDefaultRules(sheet) {
  sheet.clear();

  const headers = [['Gmail Query', 'Action', 'Days Old', 'Enabled']];
  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers)
    .setFontWeight('bold')
    .setBackground('#fbbc04')
    .setFontColor('white');

  const defaultRules = [
    ['category:promotions is:read', 'DELETE', 30, false],
    ['category:social is:read', 'ARCHIVE', 60, false],
    ['category:updates is:read', 'ARCHIVE', 90, false],
    ['is:read has:attachment larger:10M', 'ARCHIVE', 180, false],
    ['from:noreply is:read', 'DELETE', 14, false],
    ['subject:"newsletter" is:read', 'DELETE', 30, false],
  ];

  sheet.getRange(2, 1, defaultRules.length, defaultRules[0].length).setValues(defaultRules);
  sheet.getRange(2, 4, defaultRules.length, 1).insertCheckboxes();
  sheet.autoResizeColumns(1, 4);
}

// ==================== CUSTOM REPORTS ====================

/**
 * Generate comprehensive inbox statistics report
 */
function generateInboxReport(daysBack = CONFIG.DAYS_TO_ANALYZE) {
  const sheet = getOrCreateSheet('Inbox Statistics');
  sheet.clear();

  // Title
  sheet.getRange('A1').setValue('GMAIL INBOX STATISTICS REPORT')
    .setFontSize(16)
    .setFontWeight('bold');

  sheet.getRange('A2').setValue(`Generated: ${new Date()}`)
    .setFontStyle('italic');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const query = `after:${formatDateForQuery(cutoffDate)}`;
  const threads = GmailApp.search(query, 0, CONFIG.MAX_THREADS);

  let totalMessages = 0;
  let totalUnread = 0;
  let totalWithAttachments = 0;
  const categoryCounts = {};
  const labelCounts = {};
  const hourDistribution = Array(24).fill(0);
  const dayDistribution = {};
  const domainCounts = {};

  threads.forEach(thread => {
    const messages = thread.getMessages();
    totalMessages += messages.length;

    if (thread.isUnread()) totalUnread++;

    messages.forEach(message => {
      if (message.getAttachments().length > 0) totalWithAttachments++;

      const date = message.getDate();
      const hour = date.getHours();
      const day = getDayName(date.getDay());

      hourDistribution[hour]++;
      dayDistribution[day] = (dayDistribution[day] || 0) + 1;

      const from = message.getFrom();
      const email = extractEmail(from);
      const domain = email.split('@')[1] || 'unknown';
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });

    const labels = thread.getLabels();
    labels.forEach(label => {
      const labelName = label.getName();
      labelCounts[labelName] = (labelCounts[labelName] || 0) + 1;
    });
  });

  // Summary Statistics
  let row = 4;
  sheet.getRange(row, 1).setValue('SUMMARY STATISTICS').setFontWeight('bold').setFontSize(14);
  row += 2;

  const summaryData = [
    ['Total Threads', threads.length],
    ['Total Messages', totalMessages],
    ['Unread Threads', totalUnread],
    ['Read Threads', threads.length - totalUnread],
    ['Threads with Attachments', totalWithAttachments],
    ['Average Messages per Thread', (totalMessages / threads.length).toFixed(2)],
    ['Unread Percentage', `${((totalUnread / threads.length) * 100).toFixed(1)}%`]
  ];

  sheet.getRange(row, 1, summaryData.length, 2).setValues(summaryData);
  sheet.getRange(row, 1, summaryData.length, 1).setFontWeight('bold');
  row += summaryData.length + 2;

  // Top Domains
  sheet.getRange(row, 1).setValue('TOP 10 SENDER DOMAINS').setFontWeight('bold').setFontSize(14);
  row += 1;
  sheet.getRange(row, 1, 1, 2).setValues([['Domain', 'Count']])
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');
  row += 1;

  const topDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (topDomains.length > 0) {
    sheet.getRange(row, 1, topDomains.length, 2).setValues(topDomains);
    row += topDomains.length + 2;
  }

  // Email Distribution by Hour
  sheet.getRange(row, 1).setValue('EMAIL DISTRIBUTION BY HOUR').setFontWeight('bold').setFontSize(14);
  row += 1;
  sheet.getRange(row, 1, 1, 2).setValues([['Hour', 'Count']])
    .setFontWeight('bold')
    .setBackground('#34a853')
    .setFontColor('white');
  row += 1;

  const hourData = hourDistribution.map((count, hour) => [`${hour}:00`, count]);
  sheet.getRange(row, 1, hourData.length, 2).setValues(hourData);
  row += hourData.length + 2;

  // Email Distribution by Day
  sheet.getRange(row, 1).setValue('EMAIL DISTRIBUTION BY DAY').setFontWeight('bold').setFontSize(14);
  row += 1;
  sheet.getRange(row, 1, 1, 2).setValues([['Day', 'Count']])
    .setFontWeight('bold')
    .setBackground('#ea4335')
    .setFontColor('white');
  row += 1;

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayData = daysOrder.map(day => [day, dayDistribution[day] || 0]);
  sheet.getRange(row, 1, dayData.length, 2).setValues(dayData);
  row += dayData.length + 2;

  // Top Labels
  if (Object.keys(labelCounts).length > 0) {
    sheet.getRange(row, 1).setValue('TOP 10 LABELS').setFontWeight('bold').setFontSize(14);
    row += 1;
    sheet.getRange(row, 1, 1, 2).setValues([['Label', 'Thread Count']])
      .setFontWeight('bold')
      .setBackground('#fbbc04')
      .setFontColor('white');
    row += 1;

    const topLabels = Object.entries(labelCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    sheet.getRange(row, 1, topLabels.length, 2).setValues(topLabels);
  }

  sheet.autoResizeColumns(1, 2);

  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Inbox statistics report generated successfully!',
    'Report Complete',
    5
  );
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get or create a sheet with the given name
 */
function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  return sheet;
}

/**
 * Format date for Gmail query
 */
function formatDateForQuery(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
}

/**
 * Extract email address from "Name <email@domain.com>" format
 */
function extractEmail(fromString) {
  const match = fromString.match(/<(.+?)>/);
  return match ? match[1] : fromString;
}

/**
 * Extract name from "Name <email@domain.com>" format
 */
function extractName(fromString) {
  const match = fromString.match(/^(.+?)\s*</);
  return match ? match[1].replace(/"/g, '') : extractEmail(fromString);
}

/**
 * Get day name from day number
 */
function getDayName(dayNum) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNum];
}

/**
 * Extract unsubscribe link from email body and headers
 */
function extractUnsubscribeLink(body, rawContent) {
  // Try to find unsubscribe link in body
  const patterns = [
    /<a[^>]+href=["']([^"']*unsubscribe[^"']*)["']/i,
    /https?:\/\/[^\s<>"]+unsubscribe[^\s<>"]*/i,
    /<a[^>]+href=["']([^"']*opt-out[^"']*)["']/i,
    /List-Unsubscribe:\s*<([^>]+)>/i
  ];

  for (let pattern of patterns) {
    const match = body.match(pattern) || rawContent.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }

  return 'Not found';
}

/**
 * Test function to run a quick analysis
 */
function testAnalyzer() {
  Logger.log('Testing Gmail Analyzer...');

  // Test with last 7 days
  const patterns = analyzeEmailPatterns(7);
  Logger.log(`Found ${patterns.length} unique senders`);

  // Generate quick report
  generateInboxReport(7);
  Logger.log('Test complete!');
}
