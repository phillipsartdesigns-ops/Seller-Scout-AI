with open('/tmp/app.js') as f:
    text = f.read()

import re
quotes = re.findall(r'`([^`\n]{6,250})`', text)
print(f"Total backtick strings: {len(quotes)}")
matches = []
for s in quotes:
    if any(w in s.lower() for w in ['scout', 'budget', 'marketplace', 'profit', 'product', 'margin', 'tier', 'plan', 'price', 'trial', 'stripe', 'sell', 'opportunity', 'listing', 'supplier', 'roi', 'category', 'amazon', 'shopify', 'etsy', 'ebay', 'lead', 'analytics']):
        matches.append(s)

print(f"Matched backtick strings: {len(matches)}")
for s in matches[:60]:
    print('-', s)
