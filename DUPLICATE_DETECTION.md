# Duplicate Email Detection Guide

Complete guide for finding and cleaning up duplicate emails in Gmail.

## Overview

The duplicate detection feature helps you:
- Find emails with same subject + sender + similar time
- Identify forwarded email chains
- Detect CC'd/BCC'd duplicates across threads
- Free up Gmail storage space
- Clean up messy inbox

## How It Works

### Detection Methods

#### 1. **Exact Duplicates**
Emails are considered exact duplicates if they have:
- Same sender email address
- Same subject line (normalized)
- Same timestamp (exact second)

**Example:**
```
From: newsletter@company.com
Subject: Weekly Update
Date: Jan 15, 2024 10:00:00 AM

From: newsletter@company.com
Subject: Weekly Update
Date: Jan 15, 2024 10:00:00 AM
```

#### 2. **Near Duplicates**
Emails are considered near duplicates if they have:
- Same sender email address
- Same subject line (normalized)
- Timestamps within 5 minutes (configurable)

**Example:**
```
From: support@service.com
Subject: Your receipt
Date: Jan 15, 2024 10:00:00 AM

From: support@service.com
Subject: Your receipt
Date: Jan 15, 2024 10:03:30 AM
```

#### 3. **Forwarded Chains**
Emails with "Fwd:" or "Fw:" in the subject that have been forwarded multiple times.

**Example:**
```
Subject: Fwd: Important Document
Subject: Fwd: Fwd: Important Document
Subject: Fw: Fwd: Important Document
```

#### 4. **CC'd/BCC'd Duplicates**
Same email sent to you via different methods (To, CC, BCC), appearing in different threads.

**Example:**
```
Thread 1: Email sent directly to you
Thread 2: Same email where you were CC'd
Thread 3: Same email where you were BCC'd
```

## Usage

### Step 1: Find Duplicates

**Menu:** Gmail Analyzer > 🔄 Find Duplicate Emails

1. Click the menu option
2. Wait for analysis (30-60 seconds for 500 emails)
3. Review "Duplicate Emails" sheet

**What happens:**
- Analyzes last 180 days (default)
- Creates groups of duplicate emails
- Marks oldest email in each group as "keep" (unchecked)
- Newer duplicates are checked for deletion by default
- Color-codes groups for easy visualization

### Step 2: Review Duplicates

The "Duplicate Emails" sheet shows:

| Column | Description |
|--------|-------------|
| **Select** | Checkbox - checked = will be deleted/archived |
| **Type** | EXACT, NEAR, FORWARDED, or CC/BCC |
| **Subject** | Original email subject |
| **From Email** | Sender's email address |
| **From Name** | Sender's display name |
| **Date** | When email was received |
| **Size** | Email size (KB/MB) |
| **Message Count** | How many duplicates in this group |
| **Group ID** | Duplicate group identifier |

**Color Coding:**
- Alternating gray/white rows mark different groups
- All emails in a group have the same Group ID

### Step 3: Customize Selection

**Default Behavior:**
- Oldest email in each group is **unchecked** (will be kept)
- All newer emails are **checked** (will be deleted)

**To change:**
- **Keep a different email:** Uncheck it
- **Delete all:** Check all emails in the group
- **Keep all:** Uncheck all emails in the group

**Example:**
```
Group 1 (3 emails):
☐ Email from Jan 15 - Oldest (keep by default)
☑ Email from Jan 15 - Newer duplicate
☑ Email from Jan 16 - Newest duplicate
```

### Step 4: Clean Up

**Menu:** Gmail Analyzer > 🧹 Clean Up Duplicates

1. Click the menu option
2. Confirm you want to proceed
3. Choose action:
   - **YES** = Delete (move to trash)
   - **NO** = Archive
   - **CANCEL** = Stop
4. Wait for cleanup to complete

**Results:**
- Shows count of deleted/archived emails
- Reports any failures
- Keeps unchecked emails safe

## Configuration

### Adjust Time Window

The default time window is 5 minutes (300 seconds). To change:

```javascript
const CONFIG = {
  DUPLICATE_TIME_WINDOW: 300, // Change to desired seconds
};
```

**Examples:**
- `60` = 1 minute (stricter matching)
- `300` = 5 minutes (default)
- `600` = 10 minutes (looser matching)
- `1800` = 30 minutes (very loose)

### Analyze Different Time Period

```javascript
// Analyze last 30 days instead of 90
findDuplicateEmails(30);

// Analyze last year
findDuplicateEmails(365);
```

## Common Scenarios

### Scenario 1: Newsletter Duplicates

**Problem:** Newsletter sent multiple times due to email server issues

**Solution:**
1. Run "Find Duplicate Emails"
2. Look for groups with same subject from newsletter sender
3. Keep oldest (usually the intended email)
4. Delete duplicates

### Scenario 2: Forwarded Email Chains

**Problem:** Multiple "Fwd:" versions of same email

**Solution:**
1. Find duplicates with "FORWARDED" type
2. Review which version has the full conversation
3. Keep the complete version
4. Delete partial forwards

### Scenario 3: CC'd Duplicates

**Problem:** Received same email via To, CC, and BCC

**Solution:**
1. Find duplicates with "CC/BCC" type
2. All versions are identical
3. Keep one (usually oldest)
4. Delete rest

### Scenario 4: Receipt Duplicates

**Problem:** E-commerce site sent receipt multiple times

**Solution:**
1. Search for duplicates from store domain
2. Keep one receipt for records
3. Delete extras

### Scenario 5: Storage Cleanup

**Problem:** Running out of Gmail storage

**Solution:**
1. Run duplicate detection
2. Check "Size" column for large duplicates
3. Prioritize deleting large email duplicates
4. Check summary for "Potential savings"

## Advanced Usage

### Find Duplicates from Specific Sender

```javascript
function findDuplicatesFromSender(senderEmail, days = 90) {
  // First find all duplicates
  findDuplicateEmails(days);

  // Then filter the sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Duplicate Emails');
  const data = sheet.getDataRange().getValues();

  // Create new filtered sheet
  const filteredSheet = getOrCreateSheet(`Duplicates: ${senderEmail}`);
  filteredSheet.clear();

  const filteredData = data.filter((row, index) => {
    if (index === 0 || index === 1) return true; // Keep headers and summary
    return row[3] === senderEmail; // Column 4 is From Email
  });

  if (filteredData.length > 2) {
    filteredSheet.getRange(1, 1, filteredData.length, filteredData[0].length)
      .setValues(filteredData);
  }
}

// Usage:
findDuplicatesFromSender('newsletter@company.com', 180);
```

### Export Duplicate Report

```javascript
function exportDuplicateReport() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Duplicate Emails');

  if (!sheet) {
    Logger.log('Run "Find Duplicate Emails" first');
    return;
  }

  // Download via: File > Download > CSV
  Logger.log('Go to: File > Download > Comma Separated Values (.csv)');
}
```

### Bulk Delete All Duplicates

**WARNING:** This deletes ALL duplicates automatically without review!

```javascript
function bulkDeleteAllDuplicates() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Duplicate Emails');

  if (!sheet) {
    Logger.log('Run "Find Duplicate Emails" first');
    return;
  }

  // Check all rows
  const data = sheet.getDataRange().getValues();
  for (let i = 2; i < data.length; i++) {
    sheet.getRange(i + 1, 1).setValue(true); // Check all
  }

  // Run cleanup
  cleanUpDuplicates();
}
```

### Keep Newest Instead of Oldest

By default, the oldest email is kept. To reverse:

```javascript
function keepNewestDuplicates() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Duplicate Emails');

  if (!sheet) {
    Logger.log('Run "Find Duplicate Emails" first');
    return;
  }

  const data = sheet.getDataRange().getValues();
  const groups = {};

  // Group emails by Group ID
  for (let i = 2; i < data.length; i++) {
    const groupId = data[i][10];
    if (!groups[groupId]) groups[groupId] = [];
    groups[groupId].push(i);
  }

  // For each group, uncheck newest, check rest
  Object.values(groups).forEach(rows => {
    rows.forEach((rowIndex, index) => {
      const isNewest = index === rows.length - 1;
      sheet.getRange(rowIndex + 1, 1).setValue(!isNewest);
    });
  });
}
```

## Understanding the Summary

Top of the sheet shows:
```
SUMMARY: 156 duplicates found in 52 groups | Potential savings: 12.4 MB | Oldest email in each group is unchecked by default
```

**Breakdown:**
- **156 duplicates** = Total number of duplicate emails
- **52 groups** = Number of unique email sets
- **12.4 MB savings** = Space you'll free up by deleting checked emails
- **Oldest... unchecked** = Default selection strategy

## Safety Features

### 1. Default Selection
- Oldest email kept by default (likely the original)
- Prevents accidental deletion of important emails

### 2. Confirmation Dialog
- Asks for confirmation before deleting
- Shows what action will be taken
- Allows cancellation

### 3. Archive Option
- Can archive instead of delete
- Easy to recover if needed
- Safer for first-time users

### 4. Visual Grouping
- Color-coded groups
- Easy to see which emails are related
- Prevents confusion

### 5. Detailed Logging
- Logs all operations
- View > Logs to see what happened
- Helps troubleshoot issues

## Tips & Best Practices

### 1. Start Small
- Test with 30 days first
- Review results carefully
- Gradually increase to 90+ days

### 2. Review Before Deleting
- Check each group manually
- Verify you're keeping the right version
- Look for important information in newer emails

### 3. Archive First
- Use Archive instead of Delete initially
- Verify everything is correct
- Then empty archive if needed

### 4. Watch for False Positives
- Automated responses may look like duplicates
- Order confirmations vs. shipping confirmations
- Similar but different emails

### 5. Regular Cleanup
- Run monthly to prevent buildup
- Create a trigger for automation
- Monitor storage savings

### 6. Backup Important Emails
- Export important threads to CSV first
- Use Gmail's export feature for backup
- Don't delete emails you might need

### 7. Check Trash Before Emptying
- Review deleted emails
- Gmail keeps trash for 30 days
- Recover if you made a mistake

## Troubleshooting

### No Duplicates Found

**Possible causes:**
- You don't have duplicates (good!)
- Time window too strict
- Looking at wrong date range

**Solutions:**
- Increase `DUPLICATE_TIME_WINDOW`
- Analyze longer time period
- Check different email categories

### Too Many False Positives

**Possible causes:**
- Time window too loose
- Different emails with similar subjects

**Solutions:**
- Decrease `DUPLICATE_TIME_WINDOW`
- Manually review and uncheck
- Filter by sender first

### Script Timeout

**Possible causes:**
- Analyzing too many emails
- Large inbox

**Solutions:**
- Reduce `MAX_THREADS` (e.g., to 200)
- Analyze shorter time periods
- Run multiple times for different periods

### Emails Not Deleting

**Possible causes:**
- Emails already deleted
- Permission issues
- Thread no longer exists

**Solutions:**
- Check View > Logs for errors
- Verify thread IDs are valid
- Re-run duplicate detection

## Performance Notes

### Processing Time

| Emails Analyzed | Approximate Time |
|----------------|------------------|
| 100 emails | 10-15 seconds |
| 500 emails | 30-60 seconds |
| 1000 emails | 1-2 minutes |
| 2000+ emails | May timeout |

### Memory Usage

Large inboxes may hit memory limits:
- Reduce `MAX_THREADS`
- Process in smaller batches
- Analyze specific senders/labels

### Storage Savings

Typical savings vary:
- **Light duplicates** (5-10%): ~100-500 MB
- **Moderate duplicates** (10-20%): ~500 MB - 2 GB
- **Heavy duplicates** (20%+): 2+ GB

## Examples

### Example 1: Clean Up Newsletter Duplicates

```javascript
// 1. Find duplicates
findDuplicateEmails(90);

// 2. Open "Duplicate Emails" sheet
// 3. Filter by sender (manually or use script)
// 4. Review groups
// 5. Run "Clean Up Duplicates"
// 6. Choose DELETE
```

### Example 2: Archive Old Forwarded Emails

```javascript
// 1. Find duplicates
findDuplicateEmails(180);

// 2. Open "Duplicate Emails" sheet
// 3. Filter rows where Type = "FORWARDED"
// 4. Select all forwarded duplicates
// 5. Run "Clean Up Duplicates"
// 6. Choose ARCHIVE
```

### Example 3: Monthly Automated Cleanup

```javascript
// Create trigger: Extensions > Apps Script > Triggers
// Function: monthlyDuplicateCleanup
// Event: Time-driven, Month timer

function monthlyDuplicateCleanup() {
  // Find duplicates from last 30 days
  findDuplicateEmails(30);

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Duplicate Emails');

  // Auto-delete all checked duplicates
  cleanUpDuplicates();

  // Send email report
  const summary = sheet.getRange(1, 1).getValue();
  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: 'Gmail Duplicate Cleanup Report',
    body: summary
  });
}
```

---

**Clean up your inbox and free up space!** 🧹✨
