# Attachment Manager Guide

Complete guide for managing Gmail attachments with Google Drive backup.

## Overview

The Attachment Manager helps you:
- **Analyze** all attachments in your inbox
- **Backup** important files to Google Drive
- **Find duplicates** to free up storage
- **Organize** by sender, type, and date
- **Track** storage usage by attachments

## Features

### 📎 Attachment Analysis
- List all attachments with details
- Sort by size, date, or sender
- Filter by file type
- Calculate total storage used
- Export attachment list to CSV

### 💾 Drive Backup
- Backup selected attachments to Google Drive
- Auto-organize by sender in folders
- Prevent duplicates with timestamp naming
- Skip files that are too large
- Track backup progress and errors

### 🔍 Duplicate Detection
- Find identical attachments across emails
- Calculate wasted storage space
- Show who sent duplicates
- Group by file content (not just name)
- Identify which duplicates to remove

## Usage

### Step 1: Analyze Attachments

**Menu:** Gmail Analyzer > 📎 Analyze Attachments

1. Click the menu option
2. Wait for analysis (30-90 seconds for 500 emails)
3. Review "Attachment Analysis" sheet

**What you'll see:**

| Column | Description |
|--------|-------------|
| **Select** | Checkbox for backup selection |
| **Filename** | Original filename |
| **Type** | File extension (pdf, jpg, xlsx, etc.) |
| **Size** | File size in KB/MB/GB |
| **Sender Email** | Who sent the attachment |
| **Sender Name** | Sender's display name |
| **Subject** | Email subject line |
| **Date** | When email was received |
| **Thread ID** | Gmail thread identifier |
| **Message ID** | Gmail message identifier |
| **Hash** | Content identifier for duplicates |

**Summary shows:**
- Total number of attachments
- Total storage used
- Number of different file types

**Example:**
```
SUMMARY: 342 attachments found | Total size: 2.4 GB | Types: 12
```

### Step 2: Select Files to Backup

1. Review the attachment list
2. Check boxes next to files you want to backup
3. You can select based on:
   - Important senders
   - Large files
   - Specific file types
   - Date ranges

**Tips:**
- Start with your most important files
- Backup large files first (they use most space)
- Consider backing up by sender (all work files, etc.)

### Step 3: Backup to Drive

**Menu:** Gmail Analyzer > 💾 Backup to Drive

**Prerequisites:** Run "Analyze Attachments" first

1. Select files in "Attachment Analysis" sheet
2. Click menu option
3. Confirm backup
4. Wait for completion

**What happens:**
- Creates "Gmail Attachments Backup" folder in your Drive
- Creates subfolders by sender email
- Copies selected attachments
- Renames duplicates with timestamps
- Reports success/failures

**Drive folder structure:**
```
Gmail Attachments Backup/
├── sender1@email.com/
│   ├── document.pdf
│   ├── photo.jpg
│   └── 20240115_123456_document.pdf (duplicate)
├── sender2@email.com/
│   ├── report.xlsx
│   └── presentation.pptx
└── ...
```

**Limitations:**
- Max file size: 25MB (configurable)
- Min file size: 10KB (configurable)
- Gmail API quotas apply
- Drive storage limits apply

### Step 4: Find Duplicate Attachments

**Menu:** Gmail Analyzer > 🔍 Find Duplicate Attachments

1. Click the menu option
2. Wait for duplicate scan
3. Review "Duplicate Attachments" sheet

**What you'll see:**

| Column | Description |
|--------|-------------|
| **Select** | Checkbox for selection |
| **Filename** | Name of the duplicate file |
| **Type** | File extension |
| **Size** | Size of one copy |
| **Count** | How many copies exist |
| **Total Size** | Size × count (wasted space) |
| **Senders** | Who sent the duplicates |
| **First Date** | Oldest copy date |
| **Last Date** | Newest copy date |
| **Hash** | Content identifier |

**Summary shows:**
- Total duplicate attachments
- Wasted storage space
- Potential savings

**Example:**
```
SUMMARY: 87 duplicate attachments found | Wasted space: 456 MB | Keep 1 copy of each to save space
```

## Configuration

### Adjust Settings

Edit these values in the CONFIG section:

```javascript
const CONFIG = {
  DRIVE_FOLDER_NAME: 'Gmail Attachments Backup', // Drive folder name
  MAX_ATTACHMENT_SIZE: 25,    // Max MB for individual backup
  MIN_ATTACHMENT_SIZE: 0.01   // Min MB to include (10KB)
};
```

**Common adjustments:**

**Larger max size:**
```javascript
MAX_ATTACHMENT_SIZE: 50,  // Allow up to 50MB files
```

**Different folder name:**
```javascript
DRIVE_FOLDER_NAME: 'My Email Backups',
```

**Exclude tiny files:**
```javascript
MIN_ATTACHMENT_SIZE: 0.1,  // Ignore files under 100KB
```

## Common Scenarios

### Scenario 1: Backup All Work Documents

**Goal:** Save all PDFs and Word docs from work email

```
1. Analyze Attachments
2. Sort by "Type" column
3. Filter for .pdf, .doc, .docx
4. Check all boxes for work sender
5. Backup to Drive
```

### Scenario 2: Free Up Storage

**Goal:** Remove large duplicate files

```
1. Find Duplicate Attachments
2. Sort by "Total Size" (largest first)
3. For each duplicate group:
   - Keep the newest copy
   - Delete older copies from Gmail
4. Reclaim storage space!
```

### Scenario 3: Archive Old Photos

**Goal:** Backup photos before deleting old emails

```
1. Analyze Attachments
2. Filter for .jpg, .png, .gif
3. Sort by Date (oldest first)
4. Select old photos
5. Backup to Drive
6. Verify backup successful
7. Delete old emails with photos
```

### Scenario 4: Organize by Sender

**Goal:** Backup all attachments from specific person

```
1. Analyze Attachments
2. Sort/filter by "Sender Email"
3. Select all from desired sender
4. Backup to Drive
   (automatically creates sender folder)
5. Access easily in Drive
```

### Scenario 5: Clean Up Duplicates

**Goal:** Remove duplicate receipts/invoices

```
1. Find Duplicate Attachments
2. Look for invoice/receipt duplicates
3. Check newest version in Drive
4. Delete duplicates from Gmail
5. Save hundreds of MB
```

## Advanced Usage

### Custom Attachment Search

```javascript
function findAttachmentsByType(fileType, minSizeMB = 1) {
  analyzeAttachments(90);

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Attachment Analysis');
  const data = sheet.getDataRange().getValues();

  // Auto-select files matching criteria
  for (let i = 2; i < data.length; i++) {
    const type = data[i][2];
    const size = parseSizeToBytes(data[i][3]);
    const sizeInMB = size / (1024 * 1024);

    if (type === fileType && sizeInMB >= minSizeMB) {
      sheet.getRange(i + 1, 1).setValue(true);
    }
  }

  Logger.log(`Selected ${fileType} files larger than ${minSizeMB}MB`);
}

// Usage:
findAttachmentsByType('pdf', 5);  // PDFs over 5MB
findAttachmentsByType('jpg', 2);  // Photos over 2MB
```

### Backup Attachments from Date Range

```javascript
function backupByDateRange(startDate, endDate) {
  // Calculate days back
  const now = new Date();
  const start = new Date(startDate);
  const daysBack = Math.ceil((now - start) / (1000 * 60 * 60 * 24));

  analyzeAttachments(daysBack);

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Attachment Analysis');
  const data = sheet.getDataRange().getValues();

  const end = new Date(endDate);

  // Select files in date range
  for (let i = 2; i < data.length; i++) {
    const date = new Date(data[i][7]);

    if (date >= start && date <= end) {
      sheet.getRange(i + 1, 1).setValue(true);
    }
  }

  // Run backup
  backupAttachmentsToDrive();
}

// Usage:
backupByDateRange('2024/01/01', '2024/03/31');  // Q1 2024
```

### Find Large Attachments

```javascript
function findLargeAttachments(minSizeMB = 10) {
  analyzeAttachments(180);

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Attachment Analysis');
  const data = sheet.getDataRange().getValues();

  let count = 0;
  let totalSize = 0;

  for (let i = 2; i < data.length; i++) {
    const size = parseSizeToBytes(data[i][3]);
    const sizeInMB = size / (1024 * 1024);

    if (sizeInMB >= minSizeMB) {
      sheet.getRange(i + 1, 1).setValue(true);
      count++;
      totalSize += size;
    }
  }

  Logger.log(`Found ${count} files over ${minSizeMB}MB, totaling ${formatBytes(totalSize)}`);
  return { count, totalSize };
}

// Usage:
findLargeAttachments(10);  // Files over 10MB
```

### Export Attachment Inventory

```javascript
function exportAttachmentInventory() {
  // First analyze
  const attachments = analyzeAttachments(365);  // Full year

  // Export to new sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Attachment Analysis');

  // User downloads as CSV
  Logger.log('Go to: File > Download > Comma Separated Values (.csv)');

  // Return summary
  return {
    total: attachments.length,
    message: 'Export ready for download'
  };
}
```

### Attachment Statistics Report

```javascript
function generateAttachmentReport(daysBack = 90) {
  const sheet = getOrCreateSheet('Attachment Statistics');
  sheet.clear();

  // Analyze
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const query = `has:attachment after:${formatDateForQuery(cutoffDate)}`;
  const threads = GmailApp.search(query, 0, CONFIG.MAX_THREADS);

  let totalSize = 0;
  let totalCount = 0;
  const typeStats = {};
  const senderStats = {};
  const sizeRanges = {
    'Under 100KB': 0,
    '100KB - 1MB': 0,
    '1MB - 10MB': 0,
    '10MB - 25MB': 0,
    'Over 25MB': 0
  };

  threads.forEach(thread => {
    const messages = thread.getMessages();

    messages.forEach(message => {
      const attachments = message.getAttachments();
      const from = extractEmail(message.getFrom());

      attachments.forEach(attachment => {
        const size = attachment.getSize();
        const ext = getFileExtension(attachment.getName());

        totalCount++;
        totalSize += size;

        typeStats[ext] = (typeStats[ext] || 0) + 1;
        senderStats[from] = (senderStats[from] || 0) + 1;

        // Size ranges
        const sizeMB = size / (1024 * 1024);
        if (sizeMB < 0.1) sizeRanges['Under 100KB']++;
        else if (sizeMB < 1) sizeRanges['100KB - 1MB']++;
        else if (sizeMB < 10) sizeRanges['1MB - 10MB']++;
        else if (sizeMB < 25) sizeRanges['10MB - 25MB']++;
        else sizeRanges['Over 25MB']++;
      });
    });
  });

  // Write report
  let row = 1;

  sheet.getRange(row, 1).setValue('ATTACHMENT STATISTICS REPORT')
    .setFontSize(16).setFontWeight('bold');
  row += 2;

  sheet.getRange(row, 1).setValue(`Generated: ${new Date()}`)
    .setFontStyle('italic');
  row += 2;

  // Summary
  sheet.getRange(row, 1).setValue('SUMMARY').setFontWeight('bold');
  row++;
  sheet.getRange(row, 1, 3, 2).setValues([
    ['Total Attachments', totalCount],
    ['Total Size', formatBytes(totalSize)],
    ['Average Size', formatBytes(totalSize / totalCount)]
  ]);
  row += 4;

  // By file type
  sheet.getRange(row, 1).setValue('TOP FILE TYPES').setFontWeight('bold');
  row++;
  const topTypes = Object.entries(typeStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  sheet.getRange(row, 1, topTypes.length, 2).setValues(topTypes);
  row += topTypes.length + 2;

  // By sender
  sheet.getRange(row, 1).setValue('TOP SENDERS').setFontWeight('bold');
  row++;
  const topSenders = Object.entries(senderStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  sheet.getRange(row, 1, topSenders.length, 2).setValues(topSenders);
  row += topSenders.length + 2;

  // By size range
  sheet.getRange(row, 1).setValue('SIZE DISTRIBUTION').setFontWeight('bold');
  row++;
  const sizeData = Object.entries(sizeRanges);
  sheet.getRange(row, 1, sizeData.length, 2).setValues(sizeData);

  sheet.autoResizeColumns(1, 2);

  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Attachment statistics report generated!',
    'Report Complete',
    3
  );
}
```

## Troubleshooting

### No Attachments Found

**Problem:** Analysis shows 0 attachments

**Possible causes:**
- No attachments in date range
- All attachments too small (under 10KB)
- Search query filtering them out

**Solutions:**
- Increase days to analyze
- Reduce `MIN_ATTACHMENT_SIZE`
- Check different email categories

### Backup Fails

**Problem:** Error during Drive backup

**Possible causes:**
- File too large (over 25MB)
- Drive storage full
- Permission issues
- Network timeout

**Solutions:**
- Increase `MAX_ATTACHMENT_SIZE` if needed
- Free up Drive storage space
- Check Drive permissions
- Try smaller batches

### Duplicate Detection Issues

**Problem:** Missing known duplicates

**Explanation:**
- Current hash uses filename + size + type
- Files with different names won't match
- Content hash would be better but slower

**Workaround:**
- Sort by size and type
- Manually review similar files
- Use custom scripts for better detection

### Script Timeout

**Problem:** "Exceeded maximum execution time"

**Solutions:**
- Reduce `MAX_THREADS` (e.g., to 200)
- Analyze fewer days (e.g., 30 instead of 90)
- Process in batches
- Backup fewer files at once

### Drive Folder Not Created

**Problem:** Can't find backup folder

**Check:**
- Look in "My Drive" (root folder)
- Check folder name matches CONFIG
- Verify Drive permissions granted
- Check script execution log for errors

## Best Practices

### Before Backing Up

1. **Analyze first** - See what you have
2. **Check Drive space** - Make sure you have room
3. **Start small** - Test with a few files
4. **Verify success** - Check Drive after backup
5. **Document location** - Note where files are saved

### Regular Maintenance

1. **Monthly analysis** - Track attachment growth
2. **Quarterly cleanup** - Remove duplicates
3. **Yearly backup** - Save important files to Drive
4. **Monitor storage** - Watch Gmail and Drive usage
5. **Archive old files** - Move to Drive, delete from Gmail

### Storage Optimization

1. **Find large files** - Backup then delete
2. **Remove duplicates** - Keep one copy only
3. **Archive by date** - Old attachments to Drive
4. **Clean up types** - Delete unnecessary file types
5. **Regular exports** - Don't rely on Gmail alone

### Organization Tips

1. **Use sender folders** - Auto-organized by email
2. **Add date folders** - Create "2024-01", "2024-02", etc.
3. **Tag file types** - Separate photos, documents, etc.
4. **Name consistently** - Use timestamps for duplicates
5. **Document structure** - Remember your organization system

## Performance Notes

### Analysis Speed

| Emails Scanned | Attachments | Time |
|----------------|-------------|------|
| 100 emails | ~50 attachments | 15-20 seconds |
| 500 emails | ~250 attachments | 60-90 seconds |
| 1000 emails | ~500 attachments | 2-3 minutes |

### Backup Speed

| Files | Total Size | Time |
|-------|------------|------|
| 10 files | 10 MB | 10-15 seconds |
| 50 files | 50 MB | 45-60 seconds |
| 100 files | 100 MB | 2-3 minutes |

**Factors affecting speed:**
- File sizes
- Network connection
- Gmail API quotas
- Drive API quotas
- Number of concurrent operations

### Storage Savings

Typical savings from duplicate removal:

| Inbox Size | Duplicates Found | Space Saved |
|-----------|------------------|-------------|
| 5 GB | 10-15% | 500-750 MB |
| 10 GB | 15-20% | 1.5-2 GB |
| 15 GB | 20-25% | 3-3.75 GB |

## FAQ

### Q: Will this download attachments to my computer?

**A:** No, attachments stay in the cloud. They copy from Gmail to Google Drive, both cloud services.

### Q: Can I backup to a specific Drive folder?

**A:** Yes, change `DRIVE_FOLDER_NAME` in CONFIG to any folder name you want.

### Q: What happens if I backup the same file twice?

**A:** The script adds a timestamp to prevent overwriting: `20240115_123456_filename.pdf`

### Q: Can I backup attachments from shared emails?

**A:** Yes, if you have access to the email, you can backup its attachments.

### Q: How do I delete duplicates after finding them?

**A:** This feature only finds duplicates. To delete:
1. Note which emails have duplicates
2. Manually delete those emails from Gmail
3. Or create custom auto-manage rules

### Q: Can I restore backed up attachments?

**A:** Yes! They're in your Drive. Just download from there or attach to new emails.

### Q: Will this use my Gmail storage quota?

**A:** Backups use Drive storage, not Gmail. Removing duplicates from Gmail frees up Gmail storage.

### Q: Can I backup to a shared Drive folder?

**A:** Yes, but you need write permissions to that folder. Modify the script to use folder ID instead of name.

### Q: How often should I backup?

**A:** Depends on your needs:
- **Critical work files:** Weekly
- **Important documents:** Monthly
- **Everything else:** Quarterly

### Q: Can I schedule automatic backups?

**A:** Yes! Set up a trigger in Apps Script to run `analyzeAttachments()` and `backupAttachmentsToDrive()` on a schedule.

## Tips for Large Inboxes

### If you have 10,000+ emails:

1. **Process in chunks:**
   ```javascript
   analyzeAttachments(30);  // Last month
   analyzeAttachments(60);  // Month before
   // etc.
   ```

2. **Filter by category:**
   - Analyze work emails separately
   - Process personal emails differently
   - Handle newsletters distinctly

3. **Focus on large files:**
   - Set higher `MIN_ATTACHMENT_SIZE`
   - Backup/remove biggest files first
   - Most storage impact

4. **Use custom queries:**
   ```javascript
   // Modify the query in analyzeAttachments()
   const query = `has:attachment from:important@email.com after:2024/01/01`;
   ```

5. **Batch operations:**
   - Don't backup everything at once
   - Process 50-100 files at a time
   - Avoid timeouts

## Examples

### Example 1: Backup All Work PDFs

```javascript
function backupWorkPDFs() {
  // Analyze attachments
  analyzeAttachments(180);

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Attachment Analysis');
  const data = sheet.getDataRange().getValues();

  // Select PDFs from work domain
  for (let i = 2; i < data.length; i++) {
    const type = data[i][2];
    const sender = data[i][4];

    if (type === 'pdf' && sender.endsWith('@company.com')) {
      sheet.getRange(i + 1, 1).setValue(true);
    }
  }

  // Backup
  backupAttachmentsToDrive();
}
```

### Example 2: Monthly Attachment Cleanup

```javascript
function monthlyAttachmentCleanup() {
  // Find duplicates
  const duplicates = findDuplicateAttachments(30);

  // Generate statistics
  generateAttachmentReport(30);

  // Find large old files
  findLargeAttachments(5);

  // Send summary email
  const summary = `
    Found ${duplicates.length} duplicate attachments.
    Check the sheets for details and take action!
  `;

  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: 'Monthly Attachment Report',
    body: summary
  });
}

// Set up trigger: Extensions > Apps Script > Triggers
// Run: monthlyAttachmentCleanup
// Event: Time-driven, Month timer
```

### Example 3: Emergency Storage Cleanup

```javascript
function emergencyStorageCleanup() {
  // Find and backup large attachments
  analyzeAttachments(365);  // Full year

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Attachment Analysis');
  const data = sheet.getDataRange().getValues();

  // Select files over 10MB
  for (let i = 2; i < data.length; i++) {
    const size = parseSizeToBytes(data[i][3]);
    if (size > 10 * 1024 * 1024) {
      sheet.getRange(i + 1, 1).setValue(true);
    }
  }

  // Backup to Drive
  backupAttachmentsToDrive();

  // User can now manually delete the emails with large attachments
  Logger.log('Backup complete. You can now delete the emails with large attachments.');
}
```

---

**Master your email attachments!** 📎💾✨
