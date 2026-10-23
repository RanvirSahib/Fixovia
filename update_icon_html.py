import base64

with open(r'C:\Fixovia\frontend\public\fixovia-app-icon.png', 'rb') as f:
    app_icon_b64 = 'data:image/png;base64,' + base64.b64encode(f.read()).decode('utf-8')

html_path = r'C:\Fixovia\Fixovia – Verified home repair, at your door.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update hero with floating mobile badge
old_hero_hand = '<p class="hand in">Fixed today. Trusted always.</p>'
new_hero_hand = f'''<div style="display:inline-flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--line);padding:5px 14px 5px 6px;border-radius:999px;margin-bottom:16px;box-shadow:var(--shadow);" class="in">
  <img src="{app_icon_b64}" alt="Fixovia App" style="width:26px;height:26px;border-radius:7px;" />
  <span style="font-size:0.82rem;font-weight:700;color:var(--ink);">Fixovia Mobile</span>
  <span style="font-size:0.72rem;background:var(--tealsoft);color:var(--teal);padding:2px 8px;border-radius:999px;font-weight:700;">Verified & Protected</span>
</div>
<p class="hand in">Fixed today. Trusted always.</p>'''

if old_hero_hand in html:
    html = html.replace(old_hero_hand, new_hero_hand, 1)
    print('Added mobile badge to Hero in standalone HTML')

# 2. Update phone mockup header with new app icon
old_phone_img = 'alt="App Icon"'
if old_phone_img in html:
    # replace the previous app icon src with this new high-res icon
    import re
    html = re.sub(r'<img src="data:image/png;base64,[^"]+" alt="App Icon"', f'<img src="{app_icon_b64}" alt="Fixovia App"', html)
    print('Updated phone mockup app icon in standalone HTML')

# 3. Update Final CTA card
old_final = '<div class="final rev"><p class="hand">Something broken?</p><h2>Get a verified pro today</h2><p>Book in under two minutes. Pay only after you’ve checked the work.</p><a class="btn" href="#top">Book a pro now</a></div>'
new_final = f'''<div class="final rev" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:30px;text-align:left;padding:48px 44px">
  <div style="max-width:580px">
    <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.18);backdrop-filter:blur(8px);padding:6px 14px;border-radius:999px;margin-bottom:14px;color:#fff;font-size:0.82rem;font-weight:700">
      <img src="{app_icon_b64}" alt="App" style="width:22px;height:22px;border-radius:6px" />
      <span>EXPERIENCE FIXOVIA ON MOBILE</span>
    </div>
    <p class="hand" style="color:#fed7aa">Something broken?</p>
    <h2 style="color:#fff">Get a verified pro today</h2>
    <p style="color:rgba(255,255,255,0.9);margin:14px 0 24px">Book in under two minutes. Pay only after you’ve checked the work.</p>
    <div style="display:flex;gap:14px;flex-wrap:wrap">
      <a class="btn" style="background:#fff;color:var(--coral2);font-weight:800" href="#top">Book a pro now</a>
    </div>
  </div>
  <div style="text-align:center;flex-shrink:0">
    <img src="{app_icon_b64}" alt="Fixovia Mobile App" style="width:110px;height:110px;border-radius:26px;box-shadow:0 20px 40px rgba(0,0,0,0.35);border:3px solid rgba(255,255,255,0.25);transition:transform 0.4s ease;cursor:pointer" />
    <div style="margin-top:12px;color:#fff;font-size:0.85rem;font-weight:700">Fixovia Customer App</div>
    <div style="color:rgba(255,255,255,0.7);font-size:0.75rem">iOS & Android Ready</div>
  </div>
</div>'''

if old_final in html:
    html = html.replace(old_final, new_final)
    print('Updated final CTA in standalone HTML')

# 4. Update favicon href
import re
html = re.sub(r'<link rel="icon" type="image/png" href="[^"]+" />', f'<link rel="icon" type="image/png" href="{app_icon_b64}" />', html)
print('Updated favicon in standalone HTML')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print('Standalone HTML updated with uploaded icon!')
