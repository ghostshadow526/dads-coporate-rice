#!/bin/bash
# Quick Diagnosis Script for Limit Exceeded Error

echo "======================================"
echo "KORAPAY LIMIT EXCEEDED - QUICK FIX"
echo "======================================"
echo ""

echo "1️⃣ Check Your Korapay Account Dashboard:"
echo "   🔗 https://app.korapay.com/dashboard"
echo "   📊 Look for: Settings → Account Tier or Merchant Profile"
echo "   📝 Note down your:"
echo "      - Daily Transaction Limit"
echo "      - Daily Volume Limit" 
echo "      - Monthly Volume Limit"
echo ""

echo "2️⃣ Check Your Current Transactions:"
echo "   Recent transactions in the last 24 hours:"
node -e "
const now = Date.now();
const oneDayAgo = now - (24 * 60 * 60 * 1000);
console.log('   ⏰ Current time: ' + new Date(now).toLocaleString());
console.log('   ⏰ One day ago: ' + new Date(oneDayAgo).toLocaleString());
console.log('   ✅ If you made transfers in this window, wait until after');
console.log('      the time marker to retry');
"
echo ""

echo "3️⃣ Options to Resolve:"
echo ""
echo "   Option A - Wait (FREE, takes 24-48 hours)"
echo "   ---"
echo "   ⏳ Wait for the daily limit reset"
echo "   ⏳ Typically resets at UTC midnight or your configured timezone"
echo "   ✅ Try again: Tomorrow after your last transaction time"
echo ""

echo "   Option B - Upgrade (PAID, immediate)"
echo "   ---"  
echo "   💳 Go to: https://app.korapay.com/settings/tier"
echo "   📈 Upgrade from Starter → Professional tier"
echo "   ✅ Increases limits by 5-20x"
echo "   📊 Typical Professional tier: ₦500k-₦2M daily"
echo ""

echo "   Option C - Contact Support (FREE, takes 24-48 hours)"
echo "   ---"
echo "   📧 Email: support@korapay.com"
echo "   📋 Message template:"
echo "      Subject: Request Daily Limit Increase"
echo "      Body: Hi, I've hit my daily transaction limit."
echo "            Merchant ID: [your ID]"
echo "            Requested daily limit: ₦500,000"
echo ""

echo "======================================"
echo "✨ Application Updates"
echo "======================================"
echo "✅ Better error messages when limit is exceeded"
echo "✅ Daily transaction safeguard (max 10/day)"
echo "✅ Red warning banner in fund wallet form"
echo "✅ Clear next steps for users"
echo ""

echo "📄 For more details, see: LIMIT_EXCEEDED_FIX.md"
echo ""
