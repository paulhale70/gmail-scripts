# Gmail Analyzer Examples

Real-world examples and use cases for the Gmail Analyzer tool.

## Example Auto-Manage Rules

Copy these rules to your "Auto-Manage Rules" sheet for common cleanup scenarios.

### Marketing & Promotions Cleanup

| Gmail Query | Action | Days Old | Enabled |
|------------|--------|----------|---------|
| `category:promotions is:read` | DELETE | 30 | ☐ |
| `category:promotions is:unread older_than:7d` | ARCHIVE | 7 | ☐ |
| `from:marketing@ is:read` | DELETE | 14 | ☐ |
| `subject:"exclusive offer" is:read` | DELETE | 7 | ☐ |

### Social Media Cleanup

| Gmail Query | Action | Days Old | Enabled |
|------------|--------|----------|---------|
| `category:social is:read` | ARCHIVE | 60 | ☐ |
| `from:facebook.com is:read` | DELETE | 30 | ☐ |
| `from:twitter.com is:read` | DELETE | 30 | ☐ |
| `from:linkedin.com is:read` | ARCHIVE | 90 | ☐ |
| `from:instagram.com is:read` | DELETE | 14 | ☐ |

### Newsletter Management

| Gmail Query | Action | Days Old | Enabled |
|------------|--------|----------|---------|
| `subject:newsletter is:read` | DELETE | 30 | ☐ |
| `subject:"daily digest" is:read` | DELETE | 7 | ☐ |
| `subject:"weekly roundup" is:read` | DELETE | 14 | ☐ |
| `from:newsletter@ is:read` | ARCHIVE | 30 | ☐ |

### Automated Notifications

| Gmail Query | Action | Days Old | Enabled |
|------------|--------|----------|---------|
| `from:noreply is:read` | DELETE | 14 | ☐ |
| `from:no-reply is:read` | DELETE | 14 | ☐ |
| `from:donotreply is:read` | DELETE | 14 | ☐ |
| `subject:"password reset" is:read` | DELETE | 7 | ☐ |
| `subject:"verify your email" is:read` | DELETE | 7 | ☐ |

### Large Attachment Cleanup

| Gmail Query | Action | Days Old | Enabled |
|------------|--------|----------|---------|
| `has:attachment larger:10M is:read` | ARCHIVE | 180 | ☐ |
| `has:attachment larger:20M` | ARCHIVE | 365 | ☐ |
| `filename:pdf larger:5M is:read` | ARCHIVE | 90 | ☐ |
| `has:attachment category:promotions` | DELETE | 30 | ☐ |

### Specific Senders

| Gmail Query | Action | Days Old | Enabled |
|------------|--------|----------|---------|
| `from:automated@company.com is:read` | DELETE | 30 | ☐ |
| `from:jira is:read` | ARCHIVE | 60 | ☐ |
| `from:github.com is:read` | ARCHIVE | 90 | ☐ |
| `from:calendar-notification is:read` | DELETE | 14 | ☐ |

## Example Gmail Queries

### Finding Emails by Sender

```
# Emails from a specific domain
from:amazon.com

# Emails from multiple domains
from:amazon.com OR from:ebay.com

# Emails NOT from a domain
-from:spam.com

# Emails from any noreply address
from:noreply OR from:no-reply
```

### Finding Emails by Content

```
# Emails with specific subject
subject:"order confirmation"

# Emails with word in subject or body
"invoice"

# Emails with exact phrase
"reset your password"

# Emails with attachment type
filename:pdf
filename:xlsx
filename:jpg
```

### Finding Emails by Date

```
# Emails newer than date
after:2024/01/01

# Emails older than date
before:2023/12/31

# Emails between dates
after:2024/01/01 before:2024/06/30

# Emails from last X days
newer_than:7d
older_than:30d
```

### Finding Emails by Size

```
# Emails larger than 5MB
larger:5M

# Emails smaller than 1MB
smaller:1M

# Large emails with attachments
larger:10M has:attachment
```

### Finding Emails by Status

```
# Unread emails
is:unread

# Read emails
is:read

# Starred emails
is:starred

# Important emails
is:important

# Emails in trash
is:trash

# Emails in spam
is:spam
```

### Finding Emails by Category

```
# Promotional emails
category:promotions

# Social media emails
category:social

# Update notifications
category:updates

# Forum emails
category:forums

# Primary emails (inbox)
category:primary
```

### Complex Queries

```
# Unread promotions from last week
category:promotions is:unread newer_than:7d

# Large attachments from specific sender
from:colleague@company.com larger:5M has:attachment

# Old read newsletters
subject:newsletter is:read older_than:30d

# Social media notifications not starred
category:social -is:starred is:read

# Important emails with PDFs
is:important filename:pdf

# Large promotional emails with attachments
category:promotions has:attachment larger:1M

# Old confirmation emails
subject:"order confirmation" OR subject:"receipt" older_than:90d is:read
```

## Duplicate Detection Examples

### Find Exact Duplicates

```javascript
// Default configuration finds duplicates within 5 minutes
findDuplicateEmails(90);

// Stricter matching - within 1 minute
CONFIG.DUPLICATE_TIME_WINDOW = 60;
findDuplicateEmails(90);

// Looser matching - within 30 minutes
CONFIG.DUPLICATE_TIME_WINDOW = 1800;
findDuplicateEmails(90);
```

### Find Duplicates from Specific Sender

```javascript
function findDuplicatesFromDomain(domain, days = 90) {
  // First find all duplicates
  findDuplicateEmails(days);

  // Filter the results
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Duplicate Emails');
  const data = sheet.getDataRange().getValues();

  // Count duplicates from domain
  let count = 0;
  for (let i = 2; i < data.length; i++) {
    if (data[i][3].includes(domain)) {
      count++;
    }
  }

  Logger.log(`Found ${count} duplicates from ${domain}`);
}

// Usage:
findDuplicatesFromDomain('amazon.com', 180);
```

### Auto-Delete All Newsletter Duplicates

```javascript
function cleanupNewsletterDuplicates() {
  findDuplicateEmails(90);

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Duplicate Emails');
  const data = sheet.getDataRange().getValues();

  // Uncheck all, then check only newsletter duplicates
  for (let i = 2; i < data.length; i++) {
    const subject = data[i][2].toLowerCase();
    const isNewsletter = subject.includes('newsletter') ||
                        subject.includes('digest') ||
                        subject.includes('update');

    sheet.getRange(i + 1, 1).setValue(isNewsletter);
  }

  // Now run cleanup
  cleanUpDuplicates();
}
```

## Example Analysis Workflows

### Workflow 1: Monthly Inbox Cleanup

```javascript
// Run at start of each month
function monthlyCleanup() {
  // 1. Analyze last 30 days
  analyzeEmailPatterns(30);

  // 2. Generate monthly report
  generateInboxReport(30);

  // 3. Find new subscriptions
  findUnsubscribeEmails(30);

  // 4. Auto-manage old emails
  autoManageEmails();

  // 5. Export data for records
  exportEmailsToCSV(30);
}
```

### Workflow 2: New Job Email Analysis

```javascript
// Understand email patterns at new job
function analyzeWorkEmails() {
  // Analyze first 90 days
  analyzeEmailPatterns(90);

  // Generate comprehensive report
  generateInboxReport(90);

  // Identify key contacts
  // Check "Email Pattern Analysis" sheet
  // Sort by "Email Count" descending
}
```

### Workflow 3: Subscription Audit

```javascript
// Quarterly subscription cleanup
function auditSubscriptions() {
  // Find all unsubscribe links from last year
  findUnsubscribeEmails(365);

  // Review "Unsubscribe Links" sheet
  // Group by sender domain
  // Decide what to keep vs. unsubscribe
}
```

### Workflow 4: Storage Cleanup

```javascript
// Free up Gmail storage
function cleanupStorage() {
  // Create custom rules in "Auto-Manage Rules":
  // 1. larger:10M older_than:180d → DELETE
  // 2. has:attachment category:promotions → DELETE
  // 3. larger:5M is:read older_than:90d → ARCHIVE

  // Run auto-manage
  autoManageEmails();
}
```

## Example Custom Functions

### Analyze Specific Domain

```javascript
function analyzeDomain(domain, days = 90) {
  const sheet = getOrCreateSheet(`Analysis: ${domain}`);
  sheet.clear();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const query = `from:${domain} after:${formatDateForQuery(cutoffDate)}`;
  const threads = GmailApp.search(query, 0, 500);

  // Process and analyze...
  Logger.log(`Found ${threads.length} emails from ${domain}`);
}

// Usage:
analyzeDomain('amazon.com', 180);
```

### Find Emails with Specific Attachment

```javascript
function findAttachmentType(fileType, days = 90) {
  const sheet = getOrCreateSheet(`Attachments: ${fileType}`);
  sheet.clear();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const query = `filename:${fileType} after:${formatDateForQuery(cutoffDate)}`;
  const threads = GmailApp.search(query, 0, 500);

  // Process and list...
  Logger.log(`Found ${threads.length} emails with .${fileType} attachments`);
}

// Usage:
findAttachmentType('pdf', 30);
findAttachmentType('xlsx', 60);
```

### Clean Specific Sender

```javascript
function cleanupSender(senderEmail, action = 'ARCHIVE', daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const query = `from:${senderEmail} before:${formatDateForQuery(cutoffDate)} is:read`;
  const threads = GmailApp.search(query, 0, 100);

  let count = 0;
  threads.forEach(thread => {
    if (action === 'ARCHIVE') {
      thread.moveToArchive();
    } else if (action === 'DELETE') {
      thread.moveToTrash();
    }
    count++;
  });

  Logger.log(`${action}d ${count} emails from ${senderEmail}`);
}

// Usage:
cleanupSender('notifications@facebook.com', 'DELETE', 30);
cleanupSender('updates@linkedin.com', 'ARCHIVE', 60);
```

### Export Specific Category

```javascript
function exportCategory(category, days = 30) {
  const sheet = getOrCreateSheet(`Export: ${category}`);
  sheet.clear();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const query = `category:${category} after:${formatDateForQuery(cutoffDate)}`;
  const threads = GmailApp.search(query, 0, 500);

  // Export to sheet...
  Logger.log(`Exported ${threads.length} ${category} emails`);
}

// Usage:
exportCategory('promotions', 30);
exportCategory('social', 60);
```

## Visual Dashboard Examples

### Create Monthly Dashboard Comparison

```javascript
function compareMonthlyDashboards() {
  // Create dashboard for this month
  createVisualDashboard(30);
  const thisMonth = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Visual Dashboard');
  thisMonth.setName('Dashboard - This Month');

  // Create dashboard for last month (days 31-60)
  // Note: You'd need to modify query for specific date range
  createVisualDashboard(60);
  const lastTwoMonths = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Visual Dashboard');
  lastTwoMonths.setName('Dashboard - Last 2 Months');

  Logger.log('Created comparative dashboards');
}
```

### Weekly Dashboard with Email Alert

```javascript
function weeklyDashboardWithAlert() {
  // Create dashboard for last 7 days
  createVisualDashboard(7);

  // Send email to yourself
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const url = ss.getUrl();

  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: '📊 Your Weekly Email Dashboard is Ready',
    body: `Your weekly email dashboard has been generated!\n\nView it here: ${url}\n\nKey stats are available in the Visual Dashboard sheet.`
  });

  Logger.log('Weekly dashboard created and email sent');
}

// Set up a weekly trigger for this function:
// Extensions > Apps Script > Triggers > Add Trigger
// Function: weeklyDashboardWithAlert
// Event: Time-driven, Week timer, Every Monday at 9am
```

### Dashboard for Specific Project

```javascript
function projectEmailDashboard(projectName) {
  const sheet = getOrCreateSheet(`Dashboard - ${projectName}`);
  sheet.clear();

  // Customize query for project emails
  const query = `subject:"${projectName}" OR label:${projectName}`;
  const threads = GmailApp.search(query, 0, 500);

  // Create custom analysis
  const senderMap = new Map();
  threads.forEach(thread => {
    const messages = thread.getMessages();
    messages.forEach(msg => {
      const sender = msg.getFrom();
      senderMap.set(sender, (senderMap.get(sender) || 0) + 1);
    });
  });

  // Write to sheet and create chart
  sheet.getRange(1, 1, 1, 2).setValues([['Sender', 'Email Count']]);
  let row = 2;
  senderMap.forEach((count, sender) => {
    sheet.getRange(row, 1, 1, 2).setValues([[sender, count]]);
    row++;
  });

  // Add pie chart
  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(sheet.getRange(1, 1, row - 1, 2))
    .setPosition(1, 4, 0, 0)
    .setOption('title', `${projectName} - Email Distribution`)
    .setOption('width', 500)
    .setOption('height', 300)
    .build();

  sheet.insertChart(chart);

  Logger.log(`Dashboard created for ${projectName}`);
}

// Usage:
projectEmailDashboard('Project Alpha');
projectEmailDashboard('Client ABC');
```

## Saved Query Examples

### Save Common Work Queries

```javascript
function setupWorkQueries() {
  // Create saved queries sheet if needed
  const sheet = getOrCreateSheet('Saved Queries');

  const queries = [
    ['Urgent Work Emails', 'is:unread from:@company.com subject:(urgent OR important)', 'Unread urgent work emails'],
    ['This Week Team', 'from:@company.com newer_than:7d', 'All team emails from this week'],
    ['Boss Communications', 'from:boss@company.com OR to:boss@company.com', 'All emails with my boss'],
    ['Project Alpha', 'subject:"Project Alpha" OR label:project-alpha', 'Project Alpha related emails'],
    ['Unread Reports', 'subject:report is:unread', 'Unread reports waiting for review']
  ];

  // Write header if needed
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 5).setValues([['Run?', 'Query Name', 'Gmail Query', 'Description', 'Last Run']]);
  }

  // Add queries
  const startRow = sheet.getLastRow() + 1;
  queries.forEach((query, index) => {
    sheet.getRange(startRow + index, 2, 1, 3).setValues([[query[0], query[1], query[2]]]);
  });

  Logger.log(`Added ${queries.length} work queries`);
}
```

### Save Personal/Cleanup Queries

```javascript
function setupCleanupQueries() {
  const sheet = getOrCreateSheet('Saved Queries');

  const queries = [
    ['Old Promotions', 'category:promotions is:read older_than:30d', 'Promotional emails to delete'],
    ['Old Social Media', 'category:social is:read older_than:60d', 'Social notifications to archive'],
    ['Large Old Emails', 'larger:10M older_than:180d', 'Large emails to clean up'],
    ['Newsletter Cleanup', 'subject:newsletter is:read older_than:30d', 'Old newsletters to delete'],
    ['Unread Year Ago', 'is:unread older_than:365d', 'Really old unread emails']
  ];

  const startRow = sheet.getLastRow() + 1;
  queries.forEach((query, index) => {
    sheet.getRange(startRow + index, 2, 1, 3).setValues([[query[0], query[1], query[2]]]);
  });

  Logger.log(`Added ${queries.length} cleanup queries`);
}
```

### Batch Run Multiple Queries

```javascript
function runMultipleQueries(queryNames) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Saved Queries');

  if (!sheet) {
    Logger.log('No saved queries found');
    return;
  }

  const data = sheet.getDataRange().getValues();
  const resultsSheet = getOrCreateSheet('Query Results');
  resultsSheet.clear();

  // Header
  resultsSheet.getRange(1, 1, 1, 6).setValues([
    ['Query Name', 'Thread ID', 'Subject', 'From', 'Date', 'Labels']
  ]);

  let resultRow = 2;

  // Run each specified query
  for (let i = 1; i < data.length; i++) {
    const queryName = data[i][1];

    if (queryNames.includes(queryName)) {
      const query = data[i][2];

      try {
        const threads = GmailApp.search(query, 0, 100);

        threads.forEach(thread => {
          const firstMsg = thread.getMessages()[0];
          resultsSheet.getRange(resultRow, 1, 1, 6).setValues([[
            queryName,
            thread.getId(),
            thread.getFirstMessageSubject(),
            firstMsg.getFrom(),
            thread.getLastMessageDate(),
            thread.getLabels().map(l => l.getName()).join(', ')
          ]]);
          resultRow++;
        });

        // Update last run date
        sheet.getRange(i + 1, 5).setValue(new Date());

      } catch (e) {
        Logger.log(`Error running query "${queryName}": ${e}`);
      }
    }
  }

  Logger.log(`Ran ${queryNames.length} queries, found ${resultRow - 2} results`);
}

// Usage:
runMultipleQueries(['Urgent Work Emails', 'Boss Communications', 'Project Alpha']);
```

### Auto-Run Queries Daily

```javascript
function dailyQueryCheck() {
  // Run specific queries every day
  const queriesToRun = [
    'Urgent Work Emails',
    'Unread Reports',
    'Boss Communications'
  ];

  runMultipleQueries(queriesToRun);

  // Email summary if there are results
  const resultsSheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Query Results');

  if (resultsSheet && resultsSheet.getLastRow() > 1) {
    const count = resultsSheet.getLastRow() - 1;
    const url = SpreadsheetApp.getActiveSpreadsheet().getUrl();

    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: `Daily Email Check: ${count} items need attention`,
      body: `Your daily query check found ${count} emails requiring attention.\n\nView results: ${url}`
    });
  }
}

// Set up daily trigger:
// Extensions > Apps Script > Triggers > Add Trigger
// Function: dailyQueryCheck
// Event: Time-driven, Day timer, 8am to 9am
```

## Refresh Examples

### Refresh All Data (Built-in)

```javascript
// Refresh with default 90 days
refreshAllAnalyses();

// Refresh with custom time period
refreshAllAnalyses(30);  // Last 30 days
refreshAllAnalyses(180); // Last 6 months

// Use the custom prompt version
refreshAllAnalysesCustom(); // Prompts user for days
```

### Schedule Weekly Refresh

```javascript
// Set up a weekly trigger:
// 1. Extensions > Apps Script > Triggers (clock icon)
// 2. Add Trigger
// 3. Function: refreshAllAnalyses
// 4. Event: Time-driven > Week timer > Every Monday > 8am to 9am

// Or create custom scheduled refresh:
function weeklyRefresh() {
  // Refresh last 7 days of data
  refreshAllAnalyses(7);

  // Send notification email
  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: '✅ Weekly Gmail Analysis Complete',
    body: 'Your Gmail analysis has been refreshed with the latest data.\n\nView it here: ' +
          SpreadsheetApp.getActiveSpreadsheet().getUrl()
  });
}
```

### Monthly Comprehensive Refresh

```javascript
function monthlyFullRefresh() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Refresh all analyses for full 90 days
  refreshAllAnalyses(90);

  // Create a backup export
  exportEmailsToCSV(90);

  // Rename export sheet with date
  const exportSheet = ss.getSheetByName('Email Export');
  const today = new Date();
  const monthName = Utilities.formatDate(today, Session.getScriptTimeZone(), 'MMMM yyyy');
  exportSheet.setName(`Export - ${monthName}`);

  Logger.log(`Monthly refresh complete for ${monthName}`);
}

// Schedule this for the 1st of each month:
// Trigger: Time-driven > Month timer > 1st day > 9am to 10am
```

### Selective Refresh (Custom)

```javascript
function refreshDashboardOnly() {
  // Just refresh the visual elements
  createVisualDashboard(CONFIG.DAYS_TO_ANALYZE);
  generateInboxReport(CONFIG.DAYS_TO_ANALYZE);

  SpreadsheetApp.getActive().toast('Dashboard refreshed', 'Complete', 3);
}

function refreshDataOnly() {
  // Just refresh the data analyses
  analyzeEmailPatterns(CONFIG.DAYS_TO_ANALYZE);
  findDuplicateEmails(CONFIG.DAYS_TO_ANALYZE);
  analyzeAttachments(CONFIG.DAYS_TO_ANALYZE);

  SpreadsheetApp.getActive().toast('Data refreshed', 'Complete', 3);
}
```

## Combined Workflow Examples

### Workflow 5: Complete Inbox Analysis with Visuals

```javascript
function completeInboxAnalysis() {
  // Just use the built-in refresh function!
  refreshAllAnalyses(90);

  // Or do it manually:
  // 1. Analyze patterns
  analyzeEmailPatterns(90);

  // 2. Create visual dashboard
  createVisualDashboard(90);

  // 3. Find duplicates
  findDuplicateEmails(90);

  // 4. Analyze attachments
  analyzeAttachments(90);

  // 5. Generate report
  generateInboxReport(90);

  // 6. Export to CSV
  exportEmailsToCSV(90);

  Logger.log('Complete analysis finished');
}
```

### Workflow 6: Smart Cleanup with Saved Queries

```javascript
function smartCleanup() {
  // 1. Run cleanup queries to identify emails
  runMultipleQueries([
    'Old Promotions',
    'Old Social Media',
    'Newsletter Cleanup'
  ]);

  // 2. Review results
  const resultsSheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Query Results');

  Logger.log(`Found ${resultsSheet.getLastRow() - 1} emails to review`);

  // 3. User reviews and then runs auto-manage
  // (Manual step - user checks results before proceeding)

  Logger.log('Review Query Results sheet, then run auto-manage to cleanup');
}
```

### Workflow 7: Weekly Team Dashboard

```javascript
function weeklyTeamDashboard() {
  // Create dashboard for team emails
  const query = 'from:@company.com newer_than:7d';
  const threads = GmailApp.search(query, 0, 500);

  // Create custom dashboard
  const sheet = getOrCreateSheet('Team Dashboard - Weekly');
  sheet.clear();

  // Analysis
  const stats = {
    total: threads.length,
    unread: threads.filter(t => t.isUnread()).length,
    starred: threads.filter(t => t.hasStarredMessages()).length
  };

  // Write summary
  sheet.getRange(1, 1, 3, 2).setValues([
    ['Total Team Emails', stats.total],
    ['Unread', stats.unread],
    ['Starred', stats.starred]
  ]);

  // Create full visual dashboard too
  createVisualDashboard(7);

  Logger.log('Weekly team dashboard created');
}
```

## Tips for Custom Rules

### 1. Test Before Enabling
- Create rule with `Enabled = false`
- Manually run Gmail search with the query
- Verify results match expectations
- Then enable the rule

### 2. Start Conservative
- Begin with longer time periods (90+ days)
- Use ARCHIVE instead of DELETE initially
- Gradually reduce days as confidence grows

### 3. Use Multiple Criteria
- Combine `is:read` with other filters
- Avoid deleting unread emails accidentally
- Use `-is:starred` to protect important emails

### 4. Monitor Results
- Check Trash after running auto-manage
- Review what was deleted/archived
- Adjust rules based on mistakes

### 5. Backup Important Data
- Export to CSV before major cleanups
- Keep archives of important emails
- Consider Gmail's import/export features

## Performance Tips

### For Large Inboxes (10,000+ emails)

```javascript
// Reduce scope
const CONFIG = {
  MAX_THREADS: 200,      // Lower from 500
  DAYS_TO_ANALYZE: 30,   // Lower from 90
  BATCH_SIZE: 50,        // Lower from 100
};

// Or analyze in chunks
analyzeEmailPatterns(30);  // Last month
analyzeEmailPatterns(60);  // Month before
analyzeEmailPatterns(90);  // Three months ago
```

### For Faster Execution

```javascript
// Use more specific queries
"from:specific@email.com after:2024/01/01"

// Instead of broad queries
"after:2024/01/01"
```

### For Better Organization

```javascript
// Create separate sheets for different analyses
analyzeEmailPatterns(30);  // Creates "Email Pattern Analysis"
// Rename to "Analysis - January 2024"
// Run again for next period
```

---

**Copy these examples and customize for your needs!** 🎯
