/**
 * Gmail Analysis and Management Tool
 *
 * Features:
 * - Analyze email patterns (senders, frequency, time of day)
 * - Bulk unsubscribe from mailing lists
 * - Export email data to CSV
 * - Auto-delete or archive based on criteria
 * - Generate custom reports on inbox statistics
 * - Find and clean up duplicate emails
 * - Manage attachments with Drive backup
 * - Visual dashboard with charts
 * - Saved queries and filter builder
 */

// Configuration
const CONFIG = {
  MAX_THREADS: 500,           // Maximum threads to process per run
  DAYS_TO_ANALYZE: 180,       // Default days to analyze (6 months)
  BATCH_SIZE: 100,            // Batch size for processing
  REPORT_FOLDER: 'Gmail Reports', // Folder name for reports
  DUPLICATE_TIME_WINDOW: 300, // Seconds to consider emails as duplicates (5 min)
  SIMILARITY_THRESHOLD: 0.85, // Subject similarity threshold (0-1)
  DRIVE_FOLDER_NAME: 'Gmail Attachments Backup', // Drive folder for backups
  MAX_ATTACHMENT_SIZE: 25,    // Max size in MB for individual backup
  MIN_ATTACHMENT_SIZE: 0.01   // Min size in MB to include (10KB)
};

/**
 * Create menu in Gmail UI
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Gmail Analyzer')
    .addItem('🔄 Refresh All Data', 'refreshAllAnalyses')
    .addSeparator()
    .addItem('📊 Analyze Email Patterns', 'analyzeEmailPatterns')
    .addItem('📧 Export to CSV', 'exportEmailsToCSV')
    .addItem('🔍 Find Unsubscribe Links', 'findUnsubscribeEmails')
    .addItem('🗑️ Bulk Unsubscribe', 'bulkUnsubscribe')
    .addSeparator()
    .addItem('🔄 Find Duplicate Emails', 'findDuplicateEmails')
    .addItem('🧹 Clean Up Duplicates', 'cleanUpDuplicates')
    .addSeparator()
    .addItem('📎 Analyze Attachments', 'analyzeAttachments')
    .addItem('💾 Backup to Drive', 'backupAttachmentsToDrive')
    .addItem('🔍 Find Duplicate Attachments', 'findDuplicateAttachments')
    .addSeparator()
    .addItem('📈 Generate Reports', 'generateInboxReport')
    .addItem('📊 Visual Dashboard', 'createVisualDashboard')
    .addSeparator()
    .addItem('💾 Save Current Query', 'saveQuery')
    .addItem('🔍 Manage Saved Queries', 'manageSavedQueries')
    .addSeparator()
    .addItem('🗂️ Auto Archive/Delete', 'autoManageEmails')
    .addSeparator()
    .addItem('🔧 Test Date Range', 'testDateRange')
    .addToUi();
}

/**
 * Refresh all analysis sheets with latest Gmail data
 * Re-runs all major analyses to update all sheets with current information
 */
function refreshAllAnalyses(daysBack = CONFIG.DAYS_TO_ANALYZE) {
  const ui = SpreadsheetApp.getUi();

  // Confirm with user
  const response = ui.alert(
    'Refresh All Data',
    `This will update all analysis sheets with data from the last ${daysBack} days.\n\n` +
    'The following will be refreshed:\n' +
    '• Email Pattern Analysis\n' +
    '• Visual Dashboard\n' +
    '• Duplicate Emails\n' +
    '• Attachments Analysis\n' +
    '• Inbox Report\n' +
    '• Unsubscribe Links\n\n' +
    'This may take 2-5 minutes. Continue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    SpreadsheetApp.getActive().toast('Refresh cancelled', 'Cancelled', 3);
    return;
  }

  const startTime = new Date();
  let completedCount = 0;
  const totalTasks = 6;

  try {
    // 1. Analyze Email Patterns
    SpreadsheetApp.getActive().toast('Analyzing email patterns...', 'Refreshing (1/6)', -1);
    analyzeEmailPatterns(daysBack);
    completedCount++;

    // 2. Create Visual Dashboard
    SpreadsheetApp.getActive().toast('Creating visual dashboard...', 'Refreshing (2/6)', -1);
    createVisualDashboard(daysBack);
    completedCount++;

    // 3. Find Duplicate Emails
    SpreadsheetApp.getActive().toast('Finding duplicate emails...', 'Refreshing (3/6)', -1);
    findDuplicateEmails(daysBack);
    completedCount++;

    // 4. Analyze Attachments
    SpreadsheetApp.getActive().toast('Analyzing attachments...', 'Refreshing (4/6)', -1);
    analyzeAttachments(daysBack);
    completedCount++;

    // 5. Generate Inbox Report
    SpreadsheetApp.getActive().toast('Generating inbox report...', 'Refreshing (5/6)', -1);
    generateInboxReport(daysBack);
    completedCount++;

    // 6. Find Unsubscribe Links
    SpreadsheetApp.getActive().toast('Finding unsubscribe links...', 'Refreshing (6/6)', -1);
    findUnsubscribeEmails(daysBack);
    completedCount++;

    // Calculate duration
    const endTime = new Date();
    const durationSeconds = Math.round((endTime - startTime) / 1000);
    const durationText = durationSeconds >= 60
      ? `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`
      : `${durationSeconds}s`;

    // Success message
    ui.alert(
      'Refresh Complete! ✅',
      `All ${completedCount} analyses have been updated with the latest data.\n\n` +
      `Time period: Last ${daysBack} days\n` +
      `Duration: ${durationText}\n\n` +
      'All sheets now contain the most current information from your Gmail account.',
      ui.ButtonSet.OK
    );

    SpreadsheetApp.getActive().toast(
      `${completedCount} sheets refreshed in ${durationText}`,
      'Complete ✅',
      5
    );

  } catch (error) {
    // Error handling
    ui.alert(
      'Refresh Error',
      `An error occurred during refresh after completing ${completedCount}/${totalTasks} tasks:\n\n` +
      error.toString() + '\n\n' +
      'Some sheets may have been updated. Please check individual sheets.',
      ui.ButtonSet.OK
    );

    Logger.log(`Refresh error: ${error}`);
    SpreadsheetApp.getActive().toast('Refresh failed - see error dialog', 'Error', 5);
  }
}

/**
 * Refresh all analyses with custom time period
 * Prompts user for number of days to analyze
 */
function refreshAllAnalysesCustom() {
  const ui = SpreadsheetApp.getUi();

  const response = ui.prompt(
    'Custom Refresh Period',
    'How many days back should we analyze?\n\n' +
    '(Default: 180 days, Max recommended: 365 days)',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const daysBack = parseInt(response.getResponseText());

  if (isNaN(daysBack) || daysBack < 1 || daysBack > 365) {
    ui.alert(
      'Invalid Input',
      'Please enter a number between 1 and 365.',
      ui.ButtonSet.OK
    );
    return;
  }

  refreshAllAnalyses(daysBack);
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

// ==================== DUPLICATE EMAIL DETECTION ====================

/**
 * Find duplicate emails based on multiple criteria
 */
function findDuplicateEmails(daysBack = CONFIG.DAYS_TO_ANALYZE) {
  const sheet = getOrCreateSheet('Duplicate Emails');
  sheet.clear();

  const headers = [
    ['Select', 'Type', 'Subject', 'From Email', 'From Name', 'Date', 'Size',
     'Message Count', 'Thread ID', 'Message IDs', 'Group ID']
  ];
  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers)
    .setFontWeight('bold')
    .setBackground('#9c27b0')
    .setFontColor('white');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const query = `after:${formatDateForQuery(cutoffDate)}`;
  const threads = GmailApp.search(query, 0, CONFIG.MAX_THREADS);

  Logger.log(`Analyzing ${threads.length} threads for duplicates...`);

  // Build email index for duplicate detection
  const emailIndex = {};
  const duplicateGroups = [];
  let groupId = 1;

  threads.forEach(thread => {
    const messages = thread.getMessages();

    messages.forEach(message => {
      const from = message.getFrom();
      const email = extractEmail(from);
      const name = extractName(from);
      const subject = normalizeSubject(message.getSubject());
      const date = message.getDate();
      const messageId = message.getId();

      // Create index key for exact duplicates
      const exactKey = `${email}|${subject}|${Math.floor(date.getTime() / 1000)}`;

      // Create index key for near duplicates (same subject+sender, close time)
      const timeWindow = Math.floor(date.getTime() / (1000 * CONFIG.DUPLICATE_TIME_WINDOW));
      const nearKey = `${email}|${subject}|${timeWindow}`;

      if (!emailIndex[exactKey]) {
        emailIndex[exactKey] = [];
      }
      if (!emailIndex[nearKey]) {
        emailIndex[nearKey] = [];
      }

      emailIndex[exactKey].push({
        type: 'EXACT',
        subject: message.getSubject(),
        from: email,
        name: name,
        date: date,
        size: message.getBody().length,
        threadId: thread.getId(),
        messageId: messageId,
        key: exactKey
      });

      emailIndex[nearKey].push({
        type: 'NEAR',
        subject: message.getSubject(),
        from: email,
        name: name,
        date: date,
        size: message.getBody().length,
        threadId: thread.getId(),
        messageId: messageId,
        key: nearKey
      });
    });
  });

  // Find duplicates and group them
  const processedKeys = new Set();

  Object.keys(emailIndex).forEach(key => {
    const messages = emailIndex[key];

    if (messages.length > 1 && !processedKeys.has(key)) {
      processedKeys.add(key);

      // Sort by date (oldest first)
      messages.sort((a, b) => a.date - b.date);

      // Determine duplicate type
      const type = messages[0].type;
      let duplicateType = type;

      // Check for forwarded chains
      if (messages[0].subject.toLowerCase().includes('fwd:') ||
          messages[0].subject.toLowerCase().includes('fw:')) {
        duplicateType = 'FORWARDED';
      }

      // Check for CC'd duplicates (different thread IDs but same content)
      const uniqueThreads = new Set(messages.map(m => m.threadId));
      if (uniqueThreads.size > 1) {
        duplicateType = 'CC/BCC';
      }

      duplicateGroups.push({
        groupId: groupId++,
        type: duplicateType,
        messages: messages
      });
    }
  });

  // Prepare data for sheet
  const data = [];

  duplicateGroups.forEach(group => {
    group.messages.forEach((msg, index) => {
      const isKeep = index === 0; // Keep oldest by default

      data.push([
        !isKeep, // Select for deletion (uncheck oldest to keep it)
        group.type,
        msg.subject,
        msg.from,
        msg.name,
        msg.date,
        formatBytes(msg.size),
        group.messages.length,
        msg.threadId,
        msg.messageId,
        group.groupId
      ]);
    });
  });

  // Sort by group ID and date
  data.sort((a, b) => {
    if (a[10] !== b[10]) return a[10] - b[10]; // Group ID
    return a[5] - b[5]; // Date
  });

  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    sheet.getRange(2, 1, data.length, 1).insertCheckboxes();

    // Color-code by group for easier visualization
    for (let i = 0; i < data.length; i++) {
      const groupId = data[i][10];
      const color = groupId % 2 === 0 ? '#f3f3f3' : '#ffffff';
      sheet.getRange(i + 2, 1, 1, data[0].length).setBackground(color);
    }

    sheet.autoResizeColumns(1, data[0].length);
  }

  const totalDuplicates = data.length;
  const uniqueGroups = duplicateGroups.length;
  const potentialSavings = data.reduce((sum, row) => sum + parseSizeToBytes(row[6]), 0);

  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Found ${totalDuplicates} duplicate emails in ${uniqueGroups} groups. Potential space savings: ${formatBytes(potentialSavings)}`,
    'Duplicate Detection Complete',
    10
  );

  // Add summary at the top
  sheet.insertRowBefore(1);
  sheet.getRange(1, 1, 1, 6).merge()
    .setValue(`SUMMARY: ${totalDuplicates} duplicates found in ${uniqueGroups} groups | Potential savings: ${formatBytes(potentialSavings)} | Oldest email in each group is unchecked by default`)
    .setBackground('#9c27b0')
    .setFontColor('white')
    .setFontWeight('bold');

  return duplicateGroups;
}

/**
 * Clean up duplicate emails based on user selection
 */
function cleanUpDuplicates() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Duplicate Emails');

  if (!sheet) {
    SpreadsheetApp.getUi().alert('Please run "Find Duplicate Emails" first!');
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Confirm Cleanup',
    'This will delete all SELECTED duplicate emails. Emails that are UNCHECKED will be kept. Continue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    ui.alert('Cleanup cancelled.');
    return;
  }

  const data = sheet.getDataRange().getValues();
  let deleteCount = 0;
  let archiveCount = 0;
  let failCount = 0;
  const processedThreads = new Set();

  // Ask user for action preference
  const actionResponse = ui.alert(
    'Choose Action',
    'What would you like to do with selected duplicates?',
    ui.ButtonSet.YES_NO_CANCEL
  );

  let action = 'DELETE';
  if (actionResponse === ui.Button.YES) {
    action = 'DELETE';
  } else if (actionResponse === ui.Button.NO) {
    action = 'ARCHIVE';
  } else {
    ui.alert('Cleanup cancelled.');
    return;
  }

  // Start from row 3 (skip header and summary)
  for (let i = 2; i < data.length; i++) {
    const isSelected = data[i][0];

    if (isSelected === true) {
      const threadId = data[i][8];

      // Skip if already processed
      if (processedThreads.has(threadId)) {
        continue;
      }

      try {
        const thread = GmailApp.getThreadById(threadId);

        if (thread) {
          if (action === 'DELETE') {
            thread.moveToTrash();
            deleteCount++;
          } else if (action === 'ARCHIVE') {
            thread.moveToArchive();
            archiveCount++;
          }
          processedThreads.add(threadId);
        }
      } catch (e) {
        Logger.log(`Error processing thread ${threadId}: ${e}`);
        failCount++;
      }
    }
  }

  let message = '';
  if (action === 'DELETE') {
    message = `Deleted ${deleteCount} duplicate emails.`;
  } else {
    message = `Archived ${archiveCount} duplicate emails.`;
  }

  if (failCount > 0) {
    message += ` Failed to process ${failCount} emails.`;
  }

  SpreadsheetApp.getActiveSpreadsheet().toast(message, 'Cleanup Complete', 5);
}

/**
 * Normalize subject line for duplicate detection
 */
function normalizeSubject(subject) {
  if (!subject) return '';

  return subject
    .replace(/^(Re:\s*)+/gi, '')      // Remove Re:
    .replace(/^(Fwd?:\s*)+/gi, '')    // Remove Fwd:/Fw:
    .replace(/\s+/g, ' ')             // Normalize whitespace
    .trim()
    .toLowerCase();
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Parse size string back to bytes
 */
function parseSizeToBytes(sizeStr) {
  if (!sizeStr) return 0;

  const match = sizeStr.match(/^([\d.]+)\s*(\w+)$/);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2];

  const multipliers = {
    'Bytes': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024
  };

  return Math.round(value * (multipliers[unit] || 1));
}

// ==================== ATTACHMENT MANAGEMENT ====================

/**
 * Analyze all attachments in inbox
 */
function analyzeAttachments(daysBack = CONFIG.DAYS_TO_ANALYZE) {
  const sheet = getOrCreateSheet('Attachment Analysis');
  sheet.clear();

  const headers = [
    ['Select', 'Filename', 'Type', 'Size', 'Sender Email', 'Sender Name',
     'Subject', 'Date', 'Thread ID', 'Message ID', 'Hash']
  ];
  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers)
    .setFontWeight('bold')
    .setBackground('#ff6f00')
    .setFontColor('white');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const query = `has:attachment after:${formatDateForQuery(cutoffDate)}`;
  const threads = GmailApp.search(query, 0, CONFIG.MAX_THREADS);

  Logger.log(`Analyzing attachments from ${threads.length} threads...`);

  const data = [];
  let totalSize = 0;
  const fileTypes = {};
  const senderStats = {};

  threads.forEach(thread => {
    const messages = thread.getMessages();

    messages.forEach(message => {
      const attachments = message.getAttachments();

      if (attachments.length === 0) return;

      const from = message.getFrom();
      const email = extractEmail(from);
      const name = extractName(from);
      const subject = message.getSubject();
      const date = message.getDate();

      attachments.forEach(attachment => {
        const filename = attachment.getName();
        const size = attachment.getSize();
        const sizeInMB = size / (1024 * 1024);

        // Skip very small files
        if (sizeInMB < CONFIG.MIN_ATTACHMENT_SIZE) return;

        const contentType = attachment.getContentType();
        const extension = getFileExtension(filename);
        const hash = getAttachmentHash(attachment);

        totalSize += size;

        // Track file types
        fileTypes[extension] = (fileTypes[extension] || 0) + 1;

        // Track sender stats
        if (!senderStats[email]) {
          senderStats[email] = { count: 0, totalSize: 0 };
        }
        senderStats[email].count++;
        senderStats[email].totalSize += size;

        data.push([
          false, // Checkbox for selection
          filename,
          extension,
          formatBytes(size),
          email,
          name,
          subject,
          date,
          thread.getId(),
          message.getId(),
          hash
        ]);
      });
    });
  });

  // Sort by size (largest first)
  data.sort((a, b) => parseSizeToBytes(b[3]) - parseSizeToBytes(a[3]));

  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    sheet.getRange(2, 1, data.length, 1).insertCheckboxes();
    sheet.autoResizeColumns(1, data[0].length);
  }

  // Add summary
  sheet.insertRowBefore(1);
  const summary = `SUMMARY: ${data.length} attachments found | Total size: ${formatBytes(totalSize)} | Types: ${Object.keys(fileTypes).length}`;
  sheet.getRange(1, 1, 1, 6).merge()
    .setValue(summary)
    .setBackground('#ff6f00')
    .setFontColor('white')
    .setFontWeight('bold');

  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Found ${data.length} attachments totaling ${formatBytes(totalSize)}`,
    'Attachment Analysis Complete',
    5
  );

  return data;
}

/**
 * Backup selected attachments to Google Drive
 */
function backupAttachmentsToDrive() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Attachment Analysis');

  if (!sheet) {
    SpreadsheetApp.getUi().alert('Please run "Analyze Attachments" first!');
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Backup to Drive',
    'This will backup all SELECTED attachments to Google Drive. Continue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  // Get or create Drive folder
  const folder = getOrCreateDriveFolder(CONFIG.DRIVE_FOLDER_NAME);

  const data = sheet.getDataRange().getValues();
  let backupCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  let totalSize = 0;

  // Start from row 3 (skip summary and header)
  for (let i = 2; i < data.length; i++) {
    const isSelected = data[i][0];

    if (isSelected === true) {
      const filename = data[i][1];
      const size = parseSizeToBytes(data[i][3]);
      const messageId = data[i][9];

      // Skip if too large
      if (size > CONFIG.MAX_ATTACHMENT_SIZE * 1024 * 1024) {
        Logger.log(`Skipping ${filename} - too large (${formatBytes(size)})`);
        skipCount++;
        continue;
      }

      try {
        // Get the message and attachment
        const message = GmailApp.getMessageById(messageId);
        if (!message) {
          errorCount++;
          continue;
        }

        const attachments = message.getAttachments();
        const attachment = attachments.find(a => a.getName() === filename);

        if (attachment) {
          // Create subfolder by sender
          const senderEmail = data[i][4];
          const senderFolder = getOrCreateDriveFolder(senderEmail, folder);

          // Check if file already exists
          const existingFiles = senderFolder.getFilesByName(filename);
          if (existingFiles.hasNext()) {
            // File exists, add timestamp
            const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
            const newFilename = `${timestamp}_${filename}`;
            senderFolder.createFile(attachment).setName(newFilename);
          } else {
            senderFolder.createFile(attachment);
          }

          backupCount++;
          totalSize += size;
          Logger.log(`Backed up: ${filename} (${formatBytes(size)})`);
        }
      } catch (e) {
        Logger.log(`Error backing up ${filename}: ${e}`);
        errorCount++;
      }
    }
  }

  let message = `Backed up ${backupCount} files (${formatBytes(totalSize)})`;
  if (skipCount > 0) message += `\nSkipped ${skipCount} (too large)`;
  if (errorCount > 0) message += `\nFailed ${errorCount}`;
  message += `\n\nLocation: Drive > ${CONFIG.DRIVE_FOLDER_NAME}`;

  ui.alert('Backup Complete', message, ui.ButtonSet.OK);
}

/**
 * Find duplicate attachments based on content hash
 */
function findDuplicateAttachments(daysBack = CONFIG.DAYS_TO_ANALYZE) {
  const sheet = getOrCreateSheet('Duplicate Attachments');
  sheet.clear();

  const headers = [
    ['Select', 'Filename', 'Type', 'Size', 'Count', 'Total Size',
     'Senders', 'First Date', 'Last Date', 'Hash']
  ];
  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers)
    .setFontWeight('bold')
    .setBackground('#e91e63')
    .setFontColor('white');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const query = `has:attachment after:${formatDateForQuery(cutoffDate)}`;
  const threads = GmailApp.search(query, 0, CONFIG.MAX_THREADS);

  Logger.log(`Scanning for duplicate attachments in ${threads.length} threads...`);

  const attachmentIndex = {};

  threads.forEach(thread => {
    const messages = thread.getMessages();

    messages.forEach(message => {
      const attachments = message.getAttachments();

      if (attachments.length === 0) return;

      const from = message.getFrom();
      const email = extractEmail(from);
      const date = message.getDate();

      attachments.forEach(attachment => {
        const filename = attachment.getName();
        const size = attachment.getSize();
        const hash = getAttachmentHash(attachment);

        if (!attachmentIndex[hash]) {
          attachmentIndex[hash] = {
            filename: filename,
            type: getFileExtension(filename),
            size: size,
            count: 0,
            senders: new Set(),
            dates: []
          };
        }

        attachmentIndex[hash].count++;
        attachmentIndex[hash].senders.add(email);
        attachmentIndex[hash].dates.push(date);
      });
    });
  });

  // Find duplicates (count > 1)
  const data = [];
  let totalWaste = 0;

  Object.keys(attachmentIndex).forEach(hash => {
    const att = attachmentIndex[hash];

    if (att.count > 1) {
      const totalSize = att.size * att.count;
      const wastedSize = att.size * (att.count - 1);
      totalWaste += wastedSize;

      att.dates.sort((a, b) => a - b);
      const firstDate = att.dates[0];
      const lastDate = att.dates[att.dates.length - 1];

      data.push([
        false, // Checkbox
        att.filename,
        att.type,
        formatBytes(att.size),
        att.count,
        formatBytes(totalSize),
        Array.from(att.senders).join(', '),
        firstDate,
        lastDate,
        hash
      ]);
    }
  });

  // Sort by total size (largest waste first)
  data.sort((a, b) => parseSizeToBytes(b[5]) - parseSizeToBytes(a[5]));

  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    sheet.getRange(2, 1, data.length, 1).insertCheckboxes();
    sheet.autoResizeColumns(1, data[0].length);
  }

  // Add summary
  sheet.insertRowBefore(1);
  const summary = `SUMMARY: ${data.length} duplicate attachments found | Wasted space: ${formatBytes(totalWaste)} | Keep 1 copy of each to save space`;
  sheet.getRange(1, 1, 1, 6).merge()
    .setValue(summary)
    .setBackground('#e91e63')
    .setFontColor('white')
    .setFontWeight('bold');

  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Found ${data.length} duplicate attachments wasting ${formatBytes(totalWaste)}`,
    'Duplicate Detection Complete',
    5
  );

  return data;
}

/**
 * Get or create a Drive folder
 */
function getOrCreateDriveFolder(folderName, parentFolder = null) {
  const parent = parentFolder || DriveApp.getRootFolder();

  // Check if folder exists
  const folders = parent.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }

  // Create new folder
  return parent.createFolder(folderName);
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename) {
  if (!filename) return 'unknown';

  const parts = filename.split('.');
  if (parts.length < 2) return 'no-ext';

  return parts[parts.length - 1].toLowerCase();
}

/**
 * Generate a simple hash for attachment content
 */
function getAttachmentHash(attachment) {
  // Use filename + size as a simple hash
  // For better duplicate detection, we could use content hash
  // but that requires reading the entire file which is slow
  const name = attachment.getName();
  const size = attachment.getSize();
  const type = attachment.getContentType();

  return `${name}|${size}|${type}`;
}

// ==================== VISUAL DASHBOARD ====================

/**
 * Create visual dashboard with charts
 */
function createVisualDashboard(daysBack = CONFIG.DAYS_TO_ANALYZE) {
  const sheet = getOrCreateSheet('Visual Dashboard');
  sheet.clear();

  // Title
  sheet.getRange('A1').setValue('VISUAL DASHBOARD')
    .setFontSize(18)
    .setFontWeight('bold')
    .setFontColor('#1a73e8');

  sheet.getRange('A2').setValue(`Generated: ${new Date()} | Last ${daysBack} days`)
    .setFontStyle('italic')
    .setFontColor('#5f6368');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const query = `after:${formatDateForQuery(cutoffDate)}`;
  const threads = GmailApp.search(query, 0, CONFIG.MAX_THREADS);

  Logger.log(`Creating dashboard from ${threads.length} threads...`);

  // Collect data for charts
  const senderCounts = {};
  const domainCounts = {};
  const hourCounts = Array(24).fill(0);
  const dayCounts = {};
  const labelCounts = {};
  const categoryCounts = {};
  let totalMessages = 0;
  let totalUnread = 0;
  let totalWithAttachments = 0;
  let attachmentSize = 0;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  days.forEach(day => dayCounts[day] = 0);

  threads.forEach(thread => {
    const messages = thread.getMessages();
    totalMessages += messages.length;
    if (thread.isUnread()) totalUnread++;

    // Labels
    thread.getLabels().forEach(label => {
      const labelName = label.getName();
      labelCounts[labelName] = (labelCounts[labelName] || 0) + 1;
    });

    messages.forEach(message => {
      const from = message.getFrom();
      const email = extractEmail(from);
      const domain = email.split('@')[1] || 'unknown';
      const date = message.getDate();
      const hour = date.getHours();
      const day = days[date.getDay()];

      // Count senders
      senderCounts[email] = (senderCounts[email] || 0) + 1;
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;

      // Time distribution
      hourCounts[hour]++;
      dayCounts[day]++;

      // Attachments
      const attachments = message.getAttachments();
      if (attachments.length > 0) {
        totalWithAttachments++;
        attachments.forEach(att => {
          attachmentSize += att.getSize();
        });
      }
    });
  });

  // === CHART 1: Top 10 Senders (Pie Chart) ===
  let row = 4;
  sheet.getRange(row, 1).setValue('Top 10 Senders')
    .setFontSize(14)
    .setFontWeight('bold')
    .setFontColor('#1a73e8');
  row += 1;

  const topSenders = Object.entries(senderCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  sheet.getRange(row, 1, 1, 2).setValues([['Sender', 'Count']])
    .setFontWeight('bold')
    .setBackground('#e8f0fe');
  row++;

  if (topSenders.length > 0) {
    sheet.getRange(row, 1, topSenders.length, 2).setValues(topSenders);

    // Create pie chart
    const chartRange = sheet.getRange(row - 1, 1, topSenders.length + 1, 2);
    const chart1 = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(chartRange)
      .setPosition(row - 1, 4, 0, 0)
      .setOption('title', 'Top 10 Email Senders')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('legend', {position: 'right'})
      .build();
    sheet.insertChart(chart1);

    row += topSenders.length + 2;
  }

  // === CHART 2: Email Distribution by Hour (Column Chart) ===
  sheet.getRange(row, 1).setValue('Emails by Hour of Day')
    .setFontSize(14)
    .setFontWeight('bold')
    .setFontColor('#1a73e8');
  row += 1;

  sheet.getRange(row, 1, 1, 2).setValues([['Hour', 'Emails']])
    .setFontWeight('bold')
    .setBackground('#e8f0fe');
  row++;

  const hourData = hourCounts.map((count, hour) => [`${hour}:00`, count]);
  sheet.getRange(row, 1, hourData.length, 2).setValues(hourData);

  const chartRange2 = sheet.getRange(row - 1, 1, hourData.length + 1, 2);
  const chart2 = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(chartRange2)
    .setPosition(row - 1, 4, 0, 0)
    .setOption('title', 'Email Distribution by Hour')
    .setOption('width', 600)
    .setOption('height', 300)
    .setOption('legend', {position: 'none'})
    .setOption('hAxis', {title: 'Hour of Day'})
    .setOption('vAxis', {title: 'Number of Emails'})
    .setOption('colors', ['#1a73e8'])
    .build();
  sheet.insertChart(chart2);

  row += hourData.length + 2;

  // === CHART 3: Email Distribution by Day (Bar Chart) ===
  sheet.getRange(row, 1).setValue('Emails by Day of Week')
    .setFontSize(14)
    .setFontWeight('bold')
    .setFontColor('#1a73e8');
  row += 1;

  sheet.getRange(row, 1, 1, 2).setValues([['Day', 'Emails']])
    .setFontWeight('bold')
    .setBackground('#e8f0fe');
  row++;

  const dayData = days.map(day => [day, dayCounts[day]]);
  sheet.getRange(row, 1, dayData.length, 2).setValues(dayData);

  const chartRange3 = sheet.getRange(row - 1, 1, dayData.length + 1, 2);
  const chart3 = sheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(chartRange3)
    .setPosition(row - 1, 4, 0, 0)
    .setOption('title', 'Email Distribution by Day of Week')
    .setOption('width', 500)
    .setOption('height', 300)
    .setOption('legend', {position: 'none'})
    .setOption('hAxis', {title: 'Number of Emails'})
    .setOption('colors', ['#34a853'])
    .build();
  sheet.insertChart(chart3);

  row += dayData.length + 2;

  // === CHART 4: Top Domains (Bar Chart) ===
  sheet.getRange(row, 1).setValue('Top 10 Sender Domains')
    .setFontSize(14)
    .setFontWeight('bold')
    .setFontColor('#1a73e8');
  row += 1;

  const topDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  sheet.getRange(row, 1, 1, 2).setValues([['Domain', 'Emails']])
    .setFontWeight('bold')
    .setBackground('#e8f0fe');
  row++;

  if (topDomains.length > 0) {
    sheet.getRange(row, 1, topDomains.length, 2).setValues(topDomains);

    const chartRange4 = sheet.getRange(row - 1, 1, topDomains.length + 1, 2);
    const chart4 = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(chartRange4)
      .setPosition(row - 1, 4, 0, 0)
      .setOption('title', 'Top 10 Sender Domains')
      .setOption('width', 500)
      .setOption('height', 350)
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'Number of Emails'})
      .setOption('colors', ['#fbbc04'])
      .build();
    sheet.insertChart(chart4);

    row += topDomains.length + 2;
  }

  // === Summary Stats (Card-style) ===
  const summaryRow = 4;
  const summaryCol = 10;

  sheet.getRange(summaryRow, summaryCol).setValue('SUMMARY STATISTICS')
    .setFontSize(12)
    .setFontWeight('bold')
    .setBackground('#1a73e8')
    .setFontColor('white');

  const summaryData = [
    ['Total Threads', threads.length],
    ['Total Messages', totalMessages],
    ['Unread', totalUnread],
    ['Read', threads.length - totalUnread],
    ['With Attachments', totalWithAttachments],
    ['Attachment Size', formatBytes(attachmentSize)],
    ['Avg Msgs/Thread', (totalMessages / threads.length).toFixed(2)],
    ['Unique Senders', Object.keys(senderCounts).length],
    ['Unique Domains', Object.keys(domainCounts).length]
  ];

  sheet.getRange(summaryRow + 1, summaryCol, summaryData.length, 2)
    .setValues(summaryData)
    .setBorder(true, true, true, true, true, true);

  sheet.getRange(summaryRow + 1, summaryCol, summaryData.length, 1)
    .setFontWeight('bold')
    .setBackground('#f1f3f4');

  sheet.autoResizeColumns(1, 2);
  sheet.autoResizeColumns(summaryCol, 2);

  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Visual dashboard created with 4 charts and summary statistics!',
    'Dashboard Complete',
    5
  );
}

// ==================== SAVED QUERIES / FILTER BUILDER ====================

/**
 * Save current query for later use
 */
function saveQuery() {
  const ui = SpreadsheetApp.getUi();

  // Get query details from user
  const nameResponse = ui.prompt(
    'Save Query',
    'Enter a name for this query:',
    ui.ButtonSet.OK_CANCEL
  );

  if (nameResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const queryName = nameResponse.getResponseText();
  if (!queryName) {
    ui.alert('Query name cannot be empty!');
    return;
  }

  const queryResponse = ui.prompt(
    'Save Query',
    'Enter Gmail search query (e.g., "from:example.com is:unread"):',
    ui.ButtonSet.OK_CANCEL
  );

  if (queryResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const query = queryResponse.getResponseText();
  if (!query) {
    ui.alert('Query cannot be empty!');
    return;
  }

  const descResponse = ui.prompt(
    'Save Query',
    'Enter description (optional):',
    ui.ButtonSet.OK_CANCEL
  );

  const description = descResponse.getSelectedButton() === ui.Button.OK
    ? descResponse.getResponseText()
    : '';

  // Save to sheet
  const sheet = getOrCreateSheet('Saved Queries');

  // Initialize headers if needed
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 5).setValues([['Select', 'Name', 'Query', 'Description', 'Created']])
      .setFontWeight('bold')
      .setBackground('#9c27b0')
      .setFontColor('white');
  }

  // Add new query
  const newRow = sheet.getLastRow() + 1;
  sheet.getRange(newRow, 1, 1, 5).setValues([[
    false,
    queryName,
    query,
    description,
    new Date()
  ]]);

  sheet.getRange(newRow, 1).insertCheckboxes();
  sheet.autoResizeColumns(1, 5);

  ui.alert('Query saved successfully!');
}

/**
 * Manage saved queries - run, edit, delete
 */
function manageSavedQueries() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Saved Queries');

  if (!sheet || sheet.getLastRow() <= 1) {
    SpreadsheetApp.getUi().alert('No saved queries found. Use "Save Current Query" to create one!');
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Manage Saved Queries',
    'What would you like to do?\n\n' +
    'YES = Run selected queries\n' +
    'NO = Delete selected queries\n' +
    'CANCEL = Cancel',
    ui.ButtonSet.YES_NO_CANCEL
  );

  if (response === ui.Button.CANCEL) {
    return;
  }

  const data = sheet.getDataRange().getValues();
  let actionCount = 0;

  if (response === ui.Button.YES) {
    // Run selected queries
    const resultsSheet = getOrCreateSheet('Query Results');
    resultsSheet.clear();

    resultsSheet.getRange(1, 1).setValue('QUERY RESULTS')
      .setFontSize(16)
      .setFontWeight('bold');

    let resultRow = 3;

    for (let i = 1; i < data.length; i++) {
      const isSelected = data[i][0];

      if (isSelected === true) {
        const queryName = data[i][1];
        const query = data[i][2];

        try {
          const threads = GmailApp.search(query, 0, 100);

          // Write results
          resultsSheet.getRange(resultRow, 1).setValue(`Query: ${queryName}`)
            .setFontWeight('bold')
            .setBackground('#f1f3f4');
          resultRow++;

          resultsSheet.getRange(resultRow, 1).setValue(`Search: ${query}`)
            .setFontStyle('italic');
          resultRow++;

          resultsSheet.getRange(resultRow, 1).setValue(`Found: ${threads.length} threads`);
          resultRow++;

          if (threads.length > 0) {
            // Headers
            resultsSheet.getRange(resultRow, 1, 1, 5).setValues([
              ['Subject', 'From', 'Date', 'Labels', 'Thread ID']
            ]).setFontWeight('bold').setBackground('#e8f0fe');
            resultRow++;

            // Thread data
            const threadData = threads.map(thread => {
              const messages = thread.getMessages();
              const firstMsg = messages[0];
              return [
                firstMsg.getSubject(),
                extractEmail(firstMsg.getFrom()),
                firstMsg.getDate(),
                thread.getLabels().map(l => l.getName()).join(', '),
                thread.getId()
              ];
            });

            resultsSheet.getRange(resultRow, 1, threadData.length, 5).setValues(threadData);
            resultRow += threadData.length + 2;
          } else {
            resultRow += 1;
          }

          actionCount++;
        } catch (e) {
          Logger.log(`Error running query "${queryName}": ${e}`);
        }
      }
    }

    if (actionCount > 0) {
      resultsSheet.autoResizeColumns(1, 5);
      ui.alert(`Ran ${actionCount} queries. Check "Query Results" sheet!`);
    } else {
      ui.alert('No queries selected!');
    }

  } else if (response === ui.Button.NO) {
    // Delete selected queries
    for (let i = data.length - 1; i >= 1; i--) {
      const isSelected = data[i][0];

      if (isSelected === true) {
        sheet.deleteRow(i + 1);
        actionCount++;
      }
    }

    ui.alert(`Deleted ${actionCount} queries.`);
  }
}

/**
 * Create query template library
 */
function createQueryTemplates() {
  const sheet = getOrCreateSheet('Query Templates');
  sheet.clear();

  sheet.getRange(1, 1).setValue('GMAIL QUERY TEMPLATES')
    .setFontSize(16)
    .setFontWeight('bold');

  sheet.getRange(2, 1).setValue('Click "Copy" to use a template, then customize it')
    .setFontStyle('italic');

  const headers = [['Category', 'Template Name', 'Query', 'Description', 'Copy']];
  sheet.getRange(4, 1, 1, headers[0].length).setValues(headers)
    .setFontWeight('bold')
    .setBackground('#9c27b0')
    .setFontColor('white');

  const templates = [
    // Unread emails
    ['Unread', 'All Unread', 'is:unread', 'All unread emails'],
    ['Unread', 'Unread from Person', 'is:unread from:EMAIL', 'Replace EMAIL with sender'],
    ['Unread', 'Old Unread', 'is:unread older_than:30d', 'Unread emails older than 30 days'],

    // By sender
    ['Sender', 'From Specific Person', 'from:example@email.com', 'Replace with actual email'],
    ['Sender', 'From Domain', 'from:@domain.com', 'All emails from a domain'],
    ['Sender', 'NOT from Person', '-from:example@email.com', 'Exclude specific sender'],

    // By date
    ['Date', 'After Date', 'after:2024/01/01', 'Emails after specific date'],
    ['Date', 'Before Date', 'before:2024/12/31', 'Emails before specific date'],
    ['Date', 'Date Range', 'after:2024/01/01 before:2024/12/31', 'Between two dates'],
    ['Date', 'Last 7 Days', 'newer_than:7d', 'Emails from last week'],
    ['Date', 'Older than 30 Days', 'older_than:30d', 'Emails older than 30 days'],

    // Attachments
    ['Attachments', 'Has Any Attachment', 'has:attachment', 'Emails with attachments'],
    ['Attachments', 'Large Files', 'has:attachment larger:10M', 'Attachments over 10MB'],
    ['Attachments', 'Specific File Type', 'filename:pdf', 'PDFs only'],
    ['Attachments', 'Multiple Types', 'filename:pdf OR filename:docx', 'PDFs or Word docs'],

    // Categories
    ['Category', 'Promotions', 'category:promotions', 'Promotional emails'],
    ['Category', 'Social', 'category:social', 'Social media emails'],
    ['Category', 'Updates', 'category:updates', 'Update emails'],
    ['Category', 'Forums', 'category:forums', 'Forum emails'],

    // Status
    ['Status', 'Starred', 'is:starred', 'Starred emails'],
    ['Status', 'Important', 'is:important', 'Important emails'],
    ['Status', 'Read', 'is:read', 'Read emails'],

    // Content
    ['Content', 'Subject Contains', 'subject:"keyword"', 'Subject contains keyword'],
    ['Content', 'Body Contains', 'keyword', 'Body contains keyword'],
    ['Content', 'Exact Phrase', '"exact phrase"', 'Exact phrase match'],

    // Combined
    ['Combined', 'Old Read Promotions', 'category:promotions is:read older_than:30d', 'Old promotional emails'],
    ['Combined', 'Large Unread Attachments', 'is:unread has:attachment larger:5M', 'Unread emails with large files'],
    ['Combined', 'Work Emails This Week', 'from:@company.com newer_than:7d', 'Recent work emails'],
  ];

  sheet.getRange(5, 1, templates.length, 4).setValues(templates);

  // Add copy buttons (checkboxes for simplicity)
  sheet.getRange(5, 5, templates.length, 1).insertCheckboxes();

  sheet.autoResizeColumns(1, 5);
  sheet.setFrozenRows(4);

  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Query templates created! Select a template and copy the query.',
    'Templates Ready',
    5
  );
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
 * Test function to diagnose date range issues
 * Shows configuration values and calculated dates
 */
function testDateRange() {
  const ui = SpreadsheetApp.getUi();

  SpreadsheetApp.getActive().toast('Running diagnostics...', 'Please wait', 5);

  // Get current configuration
  const daysBack = CONFIG.DAYS_TO_ANALYZE;
  const today = new Date();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  // Format for Gmail query
  const queryDate = formatDateForQuery(cutoffDate);
  const query = `after:${queryDate}`;

  // Test the query with different limits
  const sample10 = GmailApp.search(query, 0, 10);
  const sample100 = GmailApp.search(query, 0, 100);
  const fullLimit = GmailApp.search(query, 0, CONFIG.MAX_THREADS);

  // Build diagnostic message
  const message =
    `CONFIGURATION CHECK:\n\n` +
    `DAYS_TO_ANALYZE: ${daysBack} days\n` +
    `MAX_THREADS: ${CONFIG.MAX_THREADS}\n\n` +
    `TODAY'S DATE:\n${today.toLocaleDateString()} ${today.toLocaleTimeString()}\n\n` +
    `CUTOFF DATE (${daysBack} days ago):\n${cutoffDate.toLocaleDateString()} ${cutoffDate.toLocaleTimeString()}\n\n` +
    `GMAIL QUERY: ${query}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `RESULTS FOUND:\n` +
    `• First 10: ${sample10.length} threads\n` +
    `• First 100: ${sample100.length} threads\n` +
    `• First ${CONFIG.MAX_THREADS}: ${fullLimit.length} threads\n\n` +
    `TOTAL AVAILABLE: ${fullLimit.length} threads will be analyzed\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    (fullLimit.length < 50 ?
      `⚠️ LOW THREAD COUNT!\n` +
      `Only ${fullLimit.length} threads found in ${daysBack} days.\n\n` +
      `Possible reasons:\n` +
      `1. Light inbox usage (normal for some users)\n` +
      `2. Wrong Gmail account connected\n` +
      `3. Emails archived/deleted\n` +
      `4. Check Gmail web to verify email count\n\n` :
      `✅ HEALTHY THREAD COUNT\n` +
      `Found ${fullLimit.length} threads - analysis will work well!\n\n`
    ) +
    `A detailed report has been created in the\n"Thread Count Report" sheet.\n\n` +
    `If this doesn't look right:\n` +
    `1. Verify you're using the correct Gmail account\n` +
    `2. Check your Gmail web interface\n` +
    `3. Increase MAX_THREADS if needed\n` +
    `4. Try a different time period`;

  // Show dialog
  ui.alert('Date Range Diagnostic', message, ui.ButtonSet.OK);

  // Also log to console
  Logger.log('=== DATE RANGE DIAGNOSTIC ===');
  Logger.log(`DAYS_TO_ANALYZE: ${daysBack}`);
  Logger.log(`MAX_THREADS: ${CONFIG.MAX_THREADS}`);
  Logger.log(`Today: ${today}`);
  Logger.log(`Cutoff: ${cutoffDate}`);
  Logger.log(`Query: ${query}`);
  Logger.log(`Sample 10: ${sample10.length} threads`);
  Logger.log(`Sample 100: ${sample100.length} threads`);
  Logger.log(`Full limit (${CONFIG.MAX_THREADS}): ${fullLimit.length} threads`);

  // Log first few thread dates for verification
  Logger.log('\n=== SAMPLE THREAD DATES ===');
  fullLimit.slice(0, 10).forEach((thread, index) => {
    Logger.log(`Thread ${index + 1}: ${thread.getLastMessageDate()} - ${thread.getFirstMessageSubject()}`);
  });

  // Create a detailed report sheet
  createThreadCountReport(query, fullLimit, daysBack);
}

/**
 * Create detailed thread count report in a new sheet
 */
function createThreadCountReport(query, threads, daysBack) {
  const sheet = getOrCreateSheet('Thread Count Report');
  sheet.clear();

  // Header
  sheet.getRange('A1').setValue('THREAD COUNT DIAGNOSTIC REPORT')
    .setFontSize(14)
    .setFontWeight('bold');

  sheet.getRange('A2').setValue(`Generated: ${new Date()}`)
    .setFontStyle('italic');

  // Configuration
  let row = 4;
  sheet.getRange(row, 1, 1, 2).setValues([['Configuration', 'Value']])
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');

  row++;
  const configData = [
    ['DAYS_TO_ANALYZE', CONFIG.DAYS_TO_ANALYZE],
    ['MAX_THREADS', CONFIG.MAX_THREADS],
    ['Gmail Query', query],
    ['Threads Found', threads.length],
    ['', ''],
    ['Status', threads.length < 50 ? '⚠️ LOW COUNT' : '✅ HEALTHY COUNT']
  ];
  sheet.getRange(row, 1, configData.length, 2).setValues(configData);

  // Color code status
  if (threads.length < 50) {
    sheet.getRange(row + 5, 2).setBackground('#fce8e6');
  } else {
    sheet.getRange(row + 5, 2).setBackground('#d9ead3');
  }

  row += configData.length + 2;

  // Thread samples
  sheet.getRange(row, 1, 1, 4).setValues([['#', 'Date', 'Subject', 'From']])
    .setFontWeight('bold')
    .setBackground('#34a853')
    .setFontColor('white');

  row++;

  const sampleSize = Math.min(20, threads.length);
  if (sampleSize > 0) {
    for (let i = 0; i < sampleSize; i++) {
      const thread = threads[i];
      const firstMsg = thread.getMessages()[0];
      sheet.getRange(row + i, 1, 1, 4).setValues([[
        i + 1,
        thread.getLastMessageDate(),
        thread.getFirstMessageSubject().substring(0, 50),
        firstMsg.getFrom().substring(0, 40)
      ]]);
    }
  } else {
    sheet.getRange(row, 1).setValue('No threads found!')
      .setFontColor('#cc0000')
      .setFontWeight('bold');
  }

  sheet.autoResizeColumns(1, 4);

  SpreadsheetApp.getActive().toast(
    `Found ${threads.length} threads. Check "Thread Count Report" sheet for details.`,
    'Diagnostic Complete',
    8
  );
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
