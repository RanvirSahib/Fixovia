import re

html_path = r'C:\Fixovia\Fixovia – Verified home repair, at your door.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove Fixovia Mobile pill from hero
# Pattern: <div style="display:inline-flex;align-items:center;gap:8px;background:var(--card);... class="in">\s*<img...</div>\s*<p class="hand in">
hero_pattern = r'<div style="display:inline-flex;align-items:center;gap:8px;background:var\(--card\);[^"]*" class="in">[\s\S]*?</div>\s*<p class="hand in">'
if re.search(hero_pattern, html):
    html = re.sub(hero_pattern, '<p class="hand in">', html)
    print('Removed Fixovia Mobile pill from Hero in standalone HTML')
else:
    print('Hero pill pattern not found via regex, checking manual...')
    start_tag = '<div style="display:inline-flex;align-items:center;gap:8px;background:var(--card);'
    end_tag = '<p class="hand in">Fixed today. Trusted always.</p>'
    s_idx = html.find(start_tag)
    e_idx = html.find(end_tag)
    if s_idx != -1 and e_idx != -1:
        html = html[:s_idx] + end_tag + html[e_idx + len(end_tag):]
        print('Removed Hero pill via manual indices!')

# 2. Revert final CTA card to original clean format
clean_final = '<div class="final rev"><p class="hand">Something broken?</p><h2>Get a verified pro today</h2><p>Book in under two minutes. Pay only after you’ve checked the work.</p><a class="btn" href="#top">Book a pro now</a></div>'

final_start = '<div class="final rev" style="display:flex;align-items:center;'
final_end = 'iOS & Android Ready</div>\n  </div>\n</div>'
f_s = html.find(final_start)
f_e = html.find(final_end)

if f_s != -1 and f_e != -1:
    html = html[:f_s] + clean_final + html[f_e + len(final_end):]
    print('Reverted Final CTA card in standalone HTML!')
else:
    print('Final CTA pattern indices:', f_s, f_e)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
