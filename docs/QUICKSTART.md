# Quick Start Guide

Get started with Gmail Analyzer in 5 minutes!

## Setup (5 minutes)

### 1. Create Google Sheet
- Go to [sheets.google.com](https://sheets.google.com)
- Click **Blank** to create new sheet
- Name it "My Gmail Analyzer"

### 2. Add Script
- Click **Extensions** → **Apps Script**
- Delete existing code
- Open `GmailAnalyzer.gs` from this repo
- Copy ALL the code
- Paste into Apps Script editor
- Click **Save** (💾 icon)

### 3. Authorize
- Click **Run** → Select **testAnalyzer**
- Click **Review Permissions**
- Choose your Google account
- Click **Advanced** → **Go to Gmail Analyzer (unsafe)**
- Click **Allow**
- Wait for test to complete

### 4. Access Menu
- Close and reopen your Google Sheet
- Look for **Gmail Analyzer** menu at top

## First Tasks

### Task 1: See Who Emails You Most
1. Click **Gmail Analyzer** → **📊 Analyze Email Patterns**
2. Wait 30-60 seconds
3. View "Email Pattern Analysis" sheet
4. Sort by "Email Count" column to see top senders

### Task 2: Find Subscriptions
1. Click **Gmail Analyzer** → **🔍 Find Unsubscribe Links**
2. Wait for search to complete
3. View "Unsubscribe Links" sheet
4. See all your newsletter subscriptions!

### Task 3: Export Your Data
1. Click **Gmail Analyzer** → **📧 Export to CSV**
2. Wait for export to complete
3. Click **File** → **Download** → **Comma Separated Values (.csv)**
4. Open in Excel or import into your favorite tool

### Task 4: Get Inbox Stats
1. Click **Gmail Analyzer** → **📈 Generate Reports**
2. Wait for report generation
3. View "Inbox Statistics" sheet
4. See when you receive most emails!

### Task 5: Find Duplicate Emails
1. Click **Gmail Analyzer** → **🔄 Find Duplicate Emails**
2. Wait for analysis to complete
3. View "Duplicate Emails" sheet
4. See storage space you can reclaim!

### Task 6: Manage Attachments
1. Click **Gmail Analyzer** → **📎 Analyze Attachments**
2. Wait for analysis (may take 1-2 minutes)
3. View "Attachment Analysis" sheet
4. See what's using your storage!

### Task 7: Visual Dashboard
1. Click **Gmail Analyzer** → **📊 Visual Dashboard**
2. Wait for dashboard creation (30-60 seconds)
3. View "Visual Dashboard" sheet
4. See beautiful charts and graphs!

### Task 8: Save a Query
1. Click **Gmail Analyzer** → **💾 Save Current Query**
2. Enter name: "Unread This Week"
3. Enter query: `is:unread newer_than:7d`
4. Add description (optional)
5. Query saved for future use!

### Task 9: Refresh All Data
1. Run some analyses first (Tasks 1-7)
2. Wait a few days for new emails
3. Click **Gmail Analyzer** → **🔄 Refresh All Data**
4. Confirm the refresh
5. All 6 sheets updated with latest data!

## Common Scenarios

### Scenario 1: "I want to unsubscribe from 50+ newsletters"

```
1. Gmail Analyzer → Find Unsubscribe Links
2. Open "Unsubscribe Links" sheet
3. Check boxes next to unwanted subscriptions
4. Gmail Analyzer → Bulk Unsubscribe
5. View → Logs to see unsubscribe URLs
6. Visit each URL to complete unsubscription
```

### Scenario 2: "Auto-delete old promotional emails"

```
1. Gmail Analyzer → Auto Archive/Delete (first time creates rules)
2. Open "Auto-Manage Rules" sheet
3. Find row: "category:promotions is:read"
4. Check the "Enabled" box
5. Adjust days if needed (default: 30)
6. Gmail Analyzer → Auto Archive/Delete (to run)
```

### Scenario 3: "Analyze last 6 months of email"

```
1. Extensions → Apps Script
2. Find function: analyzeEmailPatterns
3. Change: analyzeEmailPatterns(daysBack = CONFIG.DAYS_TO_ANALYZE)
   To: analyzeEmailPatterns(daysBack = 180)
4. Click Save
5. Back to sheet: Gmail Analyzer → Analyze Email Patterns
```

### Scenario 4: "Clean up duplicate emails"

```
1. Gmail Analyzer → Find Duplicate Emails
2. Wait for analysis (30-60 seconds)
3. Open "Duplicate Emails" sheet
4. Review groups (oldest in each group unchecked by default)
5. Adjust checkboxes if needed
6. Gmail Analyzer → Clean Up Duplicates
7. Choose DELETE or ARCHIVE
```

### Scenario 5: "Backup important attachments"

```
1. Gmail Analyzer → Analyze Attachments
2. Wait for analysis
3. Open "Attachment Analysis" sheet
4. Check boxes next to important files
5. Gmail Analyzer → Backup to Drive
6. Confirm backup
7. Find files in Drive > Gmail Attachments Backup
```

### Scenario 6: "Daily automatic cleanup"

```
1. Extensions → Apps Script
2. Click Triggers (clock icon on left)
3. Click "+ Add Trigger"
4. Function: autoManageEmails
5. Event source: Time-driven
6. Type: Day timer
7. Time: Select preferred time
8. Click Save
9. Make sure rules are enabled in "Auto-Manage Rules" sheet!
```

### Scenario 7: "Weekly automatic refresh"

```
1. Extensions → Apps Script
2. Click Triggers (clock icon on left)
3. Click "+ Add Trigger"
4. Function: refreshAllAnalyses
5. Event source: Time-driven
6. Type: Week timer
7. Day: Every Monday
8. Time: 8am to 9am
9. Click Save
10. Every Monday your data auto-refreshes!
```

## Pro Tips

### Faster Analysis
- Reduce days: Analyze 30 days instead of 90
- Use specific queries: Focus on specific labels or senders
- Process in batches: Run multiple smaller analyses

### Better Organization
- Create custom auto-manage rules for your common cleanup tasks
- Use Gmail labels, then analyze by label
- Export monthly for long-term tracking

### Finding Specific Emails

Use Gmail query syntax in auto-manage rules:

```
Find all Amazon order confirmations:
from:amazon.com subject:order

Find all large PDFs:
has:attachment filename:pdf larger:5M

Find old social media notifications:
from:facebook.com OR from:twitter.com is:read

Find newsletters:
subject:newsletter OR subject:digest
```

### Scheduling Tips

Good functions to schedule:
- **Daily:** `autoManageEmails()` - Keep inbox clean
- **Weekly:** `refreshAllAnalyses()` - Update all data sheets automatically
- **Monthly:** `generateInboxReport()` - Review detailed stats

## Troubleshooting

### "Nothing happens when I click menu"
→ Check View → Logs for errors
→ Reauthorize: Run testAnalyzer again

### "Only processed 500 emails"
→ This is the safety limit (MAX_THREADS)
→ Run multiple times or increase in CONFIG

### "Authorization required again"
→ Normal after script updates
→ Just reauthorize following Step 3

### "Script timeout"
→ Analyzing too much data
→ Reduce DAYS_TO_ANALYZE or MAX_THREADS

## Next Steps

1. **Customize rules** - Edit "Auto-Manage Rules" for your needs
2. **Schedule automation** - Set up daily/weekly triggers
3. **Export regularly** - Back up important data to CSV
4. **Review patterns** - Check monthly who's emailing you
5. **Share insights** - Export stats to share with team

## Need More Help?

- Read full README.md for detailed documentation
- Check script comments for implementation details
- Review Gmail query syntax in README

---

**You're all set! Start analyzing your inbox!** 🚀
