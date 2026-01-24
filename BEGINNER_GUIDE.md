# Gmail Analyzer - Complete Beginner's Guide

A step-by-step guide for complete beginners to install and use the Gmail Analyzer tool. No prior experience with GitHub or coding required!

## What You'll Need

- A Google Account (Gmail)
- A web browser (Chrome, Firefox, Safari, or Edge)
- 10-15 minutes

That's it! Everything is free.

## Table of Contents

1. [What is GitHub?](#what-is-github)
2. [Getting the Code](#getting-the-code)
3. [Setting Up Google Sheets](#setting-up-google-sheets)
4. [Installing the Script](#installing-the-script)
5. [First Time Setup](#first-time-setup)
6. [Using the Tool](#using-the-tool)
7. [Common Issues](#common-issues)

---

## What is GitHub?

**GitHub** is a website where people share code and projects. Think of it like Google Drive for programmers. You don't need to understand how it works - you just need to copy the code from there!

**You do NOT need to:**
- Create a GitHub account
- Install anything on your computer
- Know how to code
- Use command line or terminal

---

## Getting the Code

### Step 1: Open the GitHub Repository

1. Go to this link: `https://github.com/paulhale70/Gmail-Scripts`
2. You'll see a page with files and folders

### Step 2: Find the Script File

1. Look for a file called **`GmailAnalyzer.gs`**
2. Click on it to open it
3. You'll see a lot of code - don't worry, you don't need to understand it!

### Step 3: Copy the Code

**Method 1: Copy Button (Easiest)**
1. Look for a "Copy" button near the top-right of the code
2. Click it - the code is now copied!

**Method 2: Manual Copy**
1. Click anywhere in the code
2. Press `Ctrl+A` (Windows) or `Cmd+A` (Mac) to select all
3. Press `Ctrl+C` (Windows) or `Cmd+C` (Mac) to copy
4. You should see all the text highlighted in blue

**Tip:** Keep this browser tab open - you'll paste this code soon!

---

## Setting Up Google Sheets

### Step 1: Create a New Google Sheet

1. Open a new browser tab
2. Go to [sheets.google.com](https://sheets.google.com)
3. Click the **+ Blank** button (big plus sign with "Blank" under it)
4. A new spreadsheet will open

### Step 2: Name Your Sheet

1. Click on "Untitled spreadsheet" at the top left
2. Type a name like: **"My Gmail Analyzer"**
3. Press Enter

**Your sheet is now ready!**

---

## Installing the Script

### Step 1: Open Apps Script Editor

1. In your Google Sheet, look at the top menu
2. Click **Extensions** (in the menu bar)
3. Click **Apps Script** from the dropdown menu
4. A new tab will open - this is the script editor

**What you'll see:**
- A code editor window with some sample code
- It might say `function myFunction() { }` or similar

### Step 2: Delete the Sample Code

1. In the code editor, you'll see some existing code
2. Select all of it:
   - Click anywhere in the code
   - Press `Ctrl+A` (Windows) or `Cmd+A` (Mac)
3. Press `Delete` or `Backspace`
4. The code area should now be completely empty

### Step 3: Paste the Gmail Analyzer Code

1. Remember the code you copied from GitHub?
2. Click in the empty code editor
3. Paste the code:
   - Press `Ctrl+V` (Windows) or `Cmd+V` (Mac)
4. You should now see lots of code in the editor

### Step 4: Save the Script

1. Look for the **Save** icon (💾 floppy disk) at the top
2. Click it
3. A dialog might appear asking for a project name
4. Type: **"Gmail Analyzer"**
5. Click **OK**

**Success!** The script is now saved.

---

## First Time Setup

Now you need to give the script permission to access your Gmail account. This is normal and safe - you're giving permission to YOUR OWN script, not to someone else.

### Step 1: Run the Test Function

1. In the Apps Script editor, look for a dropdown that says **"Select function"**
2. Click it and select **`testAnalyzer`**
3. Click the **Run** button (▶️ play icon)

### Step 2: Review Permissions

You'll see a dialog that says **"Authorization required"**

1. Click **Review Permissions**
2. A new window opens showing your Google accounts
3. Choose the Google account you want to analyze

### Step 3: Grant Access

You'll see a warning screen that says "Google hasn't verified this app"

**This is normal!** Google shows this warning because YOU created this script.

1. Click **Advanced** (small text at the bottom)
2. Click **Go to Gmail Analyzer (unsafe)** - it's safe, it's YOUR script!
3. You'll see a list of permissions
4. Click **Allow**

**What permissions does it need?**
- View and manage your Gmail messages (to analyze them)
- See your spreadsheet (to write results)

### Step 4: Wait for Test to Complete

1. The script will run a quick test
2. You'll see "Execution started" at the bottom
3. Wait 10-30 seconds
4. You'll see "Execution completed"

**Done!** The script now has permission.

---

## Using the Tool

### Step 1: Close and Reopen Your Sheet

1. Go back to your Google Sheet tab (My Gmail Analyzer)
2. Close the tab completely
3. Go to [sheets.google.com](https://sheets.google.com)
4. Open "My Gmail Analyzer" again

### Step 2: Find the New Menu

At the top of your sheet, you should now see a new menu called **"Gmail Analyzer"**

**Don't see it?**
- Wait 10 seconds and refresh the page
- If still not there, see [Common Issues](#menu-not-appearing) below

### Step 3: Try Your First Analysis

1. Click **Gmail Analyzer** in the menu
2. Click **📊 Analyze Email Patterns**
3. Wait 30-60 seconds
4. A new sheet tab will appear called "Email Pattern Analysis"
5. You'll see a list of who emails you the most!

**Congratulations! You've successfully installed and used the tool!** 🎉

---

## What Can You Do Now?

### Quick Actions

| What You Want | What to Click |
|---------------|---------------|
| See who emails me the most | **Gmail Analyzer** > 📊 Analyze Email Patterns |
| Export emails to Excel | **Gmail Analyzer** > 📧 Export to CSV |
| Find newsletters to unsubscribe | **Gmail Analyzer** > 🔍 Find Unsubscribe Links |
| Find duplicate emails | **Gmail Analyzer** > 🔄 Find Duplicate Emails |
| Get inbox statistics | **Gmail Analyzer** > 📈 Generate Reports |
| See visual charts and graphs | **Gmail Analyzer** > 📊 Visual Dashboard |
| Save frequent searches | **Gmail Analyzer** > 💾 Save Current Query |
| Manage attachments | **Gmail Analyzer** > 📎 Analyze Attachments |

### Learn More

- **Quick Start Guide:** Read `QUICKSTART.md` for common tasks
- **Full Manual:** Read `README.md` for complete documentation
- **Visual Dashboard & Queries:** Read `VISUAL_DASHBOARD.md` for charts and saved searches
- **Duplicate Cleanup:** Read `DUPLICATE_DETECTION.md` for duplicate email guide
- **Attachment Management:** Read `ATTACHMENT_MANAGER.md` for attachment features
- **Advanced Examples:** Read `EXAMPLES.md` for custom scripts

---

## Common Issues

### Menu Not Appearing

**Problem:** I don't see "Gmail Analyzer" in the menu after reopening the sheet.

**Solutions:**
1. Refresh the page (press F5 or Ctrl+R)
2. Close the tab completely and reopen from sheets.google.com
3. Wait 30 seconds - sometimes it takes time to load
4. Make sure you saved the script (Apps Script editor > 💾 Save)

**Still not working?**
1. Go to **Extensions** > **Apps Script**
2. Look for the function dropdown (says "Select function")
3. Select **`onOpen`**
4. Click **Run** (▶️)
5. Go back to your sheet and refresh

### Authorization Error

**Problem:** I keep seeing "Authorization required" even after granting permissions.

**Solutions:**
1. Go to **Extensions** > **Apps Script**
2. Click **Run** > Select **`testAnalyzer`** > Click **Run**
3. Follow the authorization steps again
4. Make sure you click "Allow" at the end

### Nothing Happens When I Click Menu

**Problem:** I click a menu item but nothing happens.

**Check:**
1. Look at the top-right of your sheet for a loading indicator
2. Wait 30-60 seconds - some operations take time
3. Check for any popup or dialog that might be hidden
4. Try with a different menu option

**View Errors:**
1. Go to **Extensions** > **Apps Script**
2. Click **View** > **Logs** or **Executions**
3. See if there are any error messages

### "Script Timeout" Error

**Problem:** I see "Exceeded maximum execution time" error.

**Solutions:**
1. This means you have a lot of emails!
2. Try analyzing fewer days:
   - Go to **Extensions** > **Apps Script**
   - Find the line: `DAYS_TO_ANALYZE: 90`
   - Change `90` to `30`
   - Save and try again
3. Or reduce `MAX_THREADS` from `500` to `200`

### No Emails Found

**Problem:** The analysis shows 0 emails or very few.

**Check:**
1. Make sure you're using the correct Google account
2. Check that you have emails in your inbox
3. Try changing the time period (see Script Timeout solutions above)

### Can't Copy Code from GitHub

**Problem:** I can't select or copy the code from GitHub.

**Alternative Method:**
1. On the GitHub page, look for a **"Raw"** button
2. Click it - you'll see plain text
3. Press `Ctrl+A` (Windows) or `Cmd+A` (Mac)
4. Press `Ctrl+C` (Windows) or `Cmd+C` (Mac)
5. Now paste into Apps Script

### Script Disabled

**Problem:** I see "This script has been disabled by the administrator"

**Cause:** Your organization's Google Workspace administrator has disabled custom scripts.

**Solutions:**
1. Contact your IT administrator
2. Or use a personal Gmail account instead of work email

---

## Privacy & Security

### Is This Safe?

**YES!** Here's why:

1. **You own the code** - It's running in YOUR Google account
2. **No external servers** - Data never leaves your Google account
3. **Open source** - Anyone can review the code on GitHub
4. **Revokable** - You can remove permissions anytime

### What Data Does It Access?

The script can:
- ✅ Read your Gmail messages (to analyze them)
- ✅ Write to your Google Sheet (to show results)

The script does NOT:
- ❌ Send your data anywhere
- ❌ Delete emails (unless you explicitly choose to)
- ❌ Send emails on your behalf
- ❌ Share your data with anyone

### How to Revoke Access

If you want to remove the script's permissions:

1. Go to [myaccount.google.com/permissions](https://myaccount.google.com/permissions)
2. Find "Gmail Analyzer"
3. Click **Remove Access**

---

## Getting Help

### Where to Get Support

1. **Read the docs first:**
   - `QUICKSTART.md` - Quick 5-minute guide
   - `README.md` - Full documentation
   - This file - Installation help

2. **Check common issues** (above)

3. **Look at logs:**
   - Extensions > Apps Script
   - View > Logs
   - See what errors appear

4. **Report issues:**
   - Go to the GitHub repository
   - Click "Issues" tab
   - Describe your problem

### Information to Include When Asking for Help

If you need help, include:
1. What you were trying to do
2. What happened instead
3. Any error messages you saw
4. Your browser name (Chrome, Firefox, etc.)
5. Screenshot if possible

---

## Next Steps

Now that you've installed the tool, here's what to do:

### Day 1: Explore
- ✅ Run "Analyze Email Patterns"
- ✅ Run "Generate Reports"
- ✅ See who emails you the most

### Day 2: Clean Up
- ✅ Run "Find Unsubscribe Links"
- ✅ Run "Find Duplicate Emails"
- ✅ Review what you can clean up

### Day 3: Take Action
- ✅ Unsubscribe from unwanted emails
- ✅ Clean up duplicate emails
- ✅ Set up auto-manage rules

### Week 2: Automate
- ✅ Read `EXAMPLES.md` for automation ideas
- ✅ Set up scheduled cleanup (optional)
- ✅ Export data for analysis

---

## Video Tutorial (Coming Soon)

We're working on a video tutorial! Check the GitHub repository for updates.

---

## Glossary

**Terms you might see:**

- **Apps Script** - Google's programming tool built into Google Sheets
- **Function** - A piece of code that does something specific
- **Repository** (or "Repo") - A folder of files on GitHub
- **Script** - A program that automates tasks
- **Sheet/Tab** - The different pages in your Google Spreadsheet
- **Thread** - A conversation in Gmail (original email + replies)
- **Query** - A search term used to find emails

---

## Congratulations!

You've successfully:
- ✅ Found and copied code from GitHub
- ✅ Created a Google Sheet
- ✅ Installed the Gmail Analyzer script
- ✅ Granted permissions
- ✅ Run your first analysis

**You're now ready to take control of your inbox!** 📧✨

---

## Quick Reference Card

**Copy this for easy access:**

```
1. Open: sheets.google.com
2. Open: "My Gmail Analyzer"
3. Click: Gmail Analyzer menu
4. Choose action:
   📊 Analyze Patterns
   📧 Export CSV
   🔍 Find Unsubscribe
   🔄 Find Duplicates
   📈 Reports
5. Wait for results
6. Review new sheet tab
```

**Need help?** See "Common Issues" section above!

---

**Happy Email Managing!** 🎉
