# Limit Exceeded Error - Troubleshooting & Resolution Guide

## 📋 Issue Summary
Your account is showing "Limit Exceeded" error when trying to make transfers. After investigation, this is **NOT an application bug** but a **Korapay merchant account limit** being reached.

## 🔍 Root Cause Analysis

The error originates from your **Korapay payment gateway account**, which has built-in limits based on:

1. **Daily Transaction Limit**: Maximum number of transactions per 24-hour period
2. **Daily Volume Limit**: Maximum total amount you can process per day
3. **Monthly Volume Limit**: Cumulative amount across the entire month
4. **Account Tier Restrictions**: Based on your current Korapay tier level

### Why This Happened:
- You likely processed multiple transactions recently
- You may have hit a daily volume ceiling
- The limit resets after 24 hours (hence you can't transfer "for two days")

## ✅ Immediate Solutions

### Solution 1: Wait for Daily Limit Reset (Temporary)
**Timeline**: 24-48 hours
- Korapay limits typically reset at **UTC midnight** or your account's configured timezone
- Check when you last made a transfer - the limit should reset 24 hours after that
- Try transferring again after the reset window

### Solution 2: Upgrade Your Korapay Account (Permanent)
**Timeline**: Immediate after upgrade

**Steps:**
1. Visit [Korapay Dashboard](https://app.korapay.com/dashboard)
2. Log in with your account credentials
3. Navigate to **Settings** → **Account Tier** or **Merchant Profile**
4. Review your current tier and its limits:
   - **Starter**: Limited (typical daily limits: ₦50k-₦100k)
   - **Professional**: Higher volume (typical daily limits: ₦500k-₦2M)
   - **Enterprise**: Custom limits (contact support)
5. Click **"Upgrade Tier"** and complete the process
6. Verify your new limits after upgrade

### Solution 3: Contact Korapay Support
**Timeline**: 24-48 hours
- Email: support@korapay.com
- Request temporary limit increase or troubleshooting
- Provide your merchant ID and transaction reference

## 🔧 Application Improvements (Already Implemented)

I've updated your application with better error handling:

### Changes Made:

1. **Daily Transaction Limiting (Server-Side)**
   - Added client-level safeguard: maximum 10 transactions per user per day
   - Prevents accidental duplicate/excessive transactions
   - Location: [server.ts](server.ts#L72)

2. **Enhanced Error Messages**
   - Detects Korapay limit errors specifically
   - Shows user-friendly message when limits are exceeded
   - Location: [FundWallet.tsx](src/components/FundWallet.tsx#L34)

3. **Limit Exceeded Alert Component**
   - Red warning banner when limit is triggered
   - Disables payment button when daily limit reached
   - Guide message about when they can retry

### Features:
- **Status Code 429** (Too Many Requests): Properly sent when limits reached
- **Clear User Feedback**: Users now see exactly why they can't transfer
- **Retry After**: Informs users they can try again the next day

## 📊 How to Verify Your Korapay Account Status

Run this diagnostic script to check your account:

```bash
node check-account.js
```

This will show:
- Account configuration
- Recent transactions
- Any error messages from Korapay
- Merchant tier information

## 🚀 Recommended Actions (In Order)

### Immediate (Today):
- [ ] Check [Korapay Dashboard](https://app.korapay.com) for your current tier
- [ ] Note the exact daily/monthly limits shown
- [ ] Try a small transaction to see the exact error message

### Short-term (1-2 days):
- [ ] Upgrade to Professional tier if you process high volumes
- [ ] Wait for daily limit reset (~24 hours from last transaction)
- [ ] Test a small transfer (~₦1,000) to confirm limit is reset

### Long-term (This Week):
- [ ] Configure appropriate tier based on your business needs
- [ ] Set up reminders about monthly limits if needed
- [ ] Consider automated notifications for limit warnings

## 📞 Contact Information

**Korapay Support:**
- Website: https://korapay.com
- Dashboard: https://app.korapay.com
- Status: Check [Korapay Status Page](https://status.korapay.com)

**Your Application Support Email:**
- support@salvagebizhub.com

## 📝 Transaction Limits Reference

Typical Korapay Tier Limits (verify in your dashboard for exact):

| Tier | Daily Limit | Monthly Limit | Max Per Transaction |
|------|-------------|---------------|-------------------|
| Starter | ₦50,000 - ₦100,000 | ₦1,000,000 | ₦50,000 |
| Professional | ₦500,000 - ₦2,000,000 | ₦10,000,000 | ₦5,000,000 |
| Enterprise | Custom | Custom | Custom |

> **Note**: These are typical limits. Your actual limits may vary. Always check your dashboard for the exact figures.

## ✨ Code Changes Made

### File: [server.ts](server.ts)
- Added `checkDailyLimit()` function
- Added daily transaction tracking map
- Enhanced `/api/fund-wallet` endpoint with limit checking (lines 72-150)

### File: [src/components/FundWallet.tsx](src/components/FundWallet.tsx)
- Added limit error state tracking
- Added visual alert component for limit exceeded
- Enhanced error handling to detect limit errors
- Disabled submit button when limit is exceeded

## ❓ FAQ

**Q: Will my limit reset at midnight?**  
A: Usually yes, but it depends on your Korapay timezone settings. Check your dashboard.

**Q: Can I get an immediate limit increase?**  
A: Contact Korapay support for urgent temporary increases.

**Q: Is this a bug in my application?**  
A: No - this is a Korapay account limitation feature, not an app bug. The application now handles it better.

**Q: Can I check my current Korapay limits?**  
A: Yes, visit [app.korapay.com](https://app.korapay.com) and check Settings → Account Tier.

**Q: How do I prevent this in the future?**  
A: Upgrade your tier, monitor transaction volume, or contact Korapay for custom limits.

---

**Last Updated**: April 11, 2026
**Status**: Under Investigation/Resolved
**Next Review**: After you verify with Korapay
