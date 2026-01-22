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
