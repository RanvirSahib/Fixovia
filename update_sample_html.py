import base64
import os

with open(r'C:\Fixovia\frontend\public\shield-verified.png', 'rb') as f:
    shield_b64 = 'data:image/png;base64,' + base64.b64encode(f.read()).decode('utf-8')

with open(r'C:\Fixovia\frontend\public\brand-app-icon.png', 'rb') as f:
    icon_b64 = 'data:image/png;base64,' + base64.b64encode(f.read()).decode('utf-8')

html_path = r'C:\Fixovia\Fixovia – Verified home repair, at your door.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Enhance .rev styling with noticeable, beautiful load-as-you-scroll animations
old_rev = '''.rev{opacity:0;transform:translateY(34px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}
.rev.show{opacity:1;transform:none}
.rev.show:nth-child(2){transition-delay:.1s}.rev.show:nth-child(3){transition-delay:.2s}.rev.show:nth-child(4){transition-delay:.3s}'''

new_rev = '''.rev {
  opacity: 0;
  transform: translateY(45px);
  filter: blur(4px);
  transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.75s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.75s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform, filter;
}
.rev.rev-left { transform: translateX(-40px) translateY(20px); }
.rev.rev-right { transform: translateX(40px) translateY(20px); }
.rev.rev-scale { transform: scale(0.92) translateY(30px); }
.rev.show {
  opacity: 1;
  transform: translateY(0) translateX(0) scale(1);
  filter: blur(0);
}
.grid4 .rev.show:nth-child(1), .stlist .rev.show:nth-child(1), .tr .rev.show:nth-child(1), .rv .rev.show:nth-child(1) { transition-delay: 0.08s; }
.grid4 .rev.show:nth-child(2), .stlist .rev.show:nth-child(2), .tr .rev.show:nth-child(2), .rv .rev.show:nth-child(2) { transition-delay: 0.22s; }
.grid4 .rev.show:nth-child(3), .stlist .rev.show:nth-child(3), .tr .rev.show:nth-child(3), .rv .rev.show:nth-child(3) { transition-delay: 0.36s; }
.grid4 .rev.show:nth-child(4), .stlist .rev.show:nth-child(4) { transition-delay: 0.50s; }'''

if old_rev in html:
    html = html.replace(old_rev, new_rev)
    print('Updated .rev in sample HTML')
else:
    print('Warning: old_rev pattern not found in html')

# Add shield badge in the Cover section header if not present
old_cover_head = '<div class="head rev"><p class="hand">The Fixovia Cover</p><h2>If something goes wrong, we’re on the hook</h2></div>'
new_cover_head = f'''<div class="head rev" style="display:flex;align-items:flex-start;justify-content:space-between;gap:24px;flex-wrap:wrap">
<div>
  <div style="display:inline-flex;align-items:center;gap:8px;background:var(--tealsoft);color:var(--teal);padding:6px 14px;border-radius:999px;margin-bottom:12px;font-weight:700;font-size:0.85rem">
    <img src="{shield_b64}" alt="Shield" style="width:18px;height:22px" />
    <span>OFFICIAL VERIFICATION EMBLEM</span>
  </div>
  <p class="hand">The Fixovia Cover</p>
  <h2>If something goes wrong, we’re on the hook</h2>
</div>
<img src="{shield_b64}" alt="Fixovia Verified Shield" class="rev rev-scale" style="width:96px;height:auto;filter:drop-shadow(0 12px 24px rgba(13,86,203,0.25));align-self:center;" />
</div>'''

if old_cover_head in html:
    html = html.replace(old_cover_head, new_cover_head)
    print('Embedded Verified Shield into Fixovia Cover in sample HTML')

# Add app icon on phone mockup
old_phone = '<div class="phone rev"><small>Your safety PIN</small>'
new_phone = f'''<div class="phone rev"><div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
  <img src="{icon_b64}" alt="App Icon" style="width:34px;height:34px;border-radius:9px;box-shadow:0 4px 10px rgba(13,86,203,0.3)" />
  <div>
    <div style="font-size:0.82rem;font-weight:700;color:var(--ink);line-height:1.2">Fixovia Customer App</div>
    <div style="font-size:0.7rem;color:var(--mute)">Verified Dispatch #FX-4827</div>
  </div>
</div><small>Your safety PIN</small>'''

if old_phone in html:
    html = html.replace(old_phone, new_phone)
    print('Embedded App Icon into Safety PIN phone mockup')

# Add verified mark to trust chips in hero
old_chips = '<div class="chips in"><b>Starts at ₹199</b>'
new_chips = f'<div class="chips in"><b><img src="{shield_b64}" alt="Verified" style="width:14px;height:17px;vertical-align:middle;margin-right:6px" />Verified Pros Only</b><b>Starts at ₹199</b>'
if old_chips in html:
    html = html.replace(old_chips, new_chips)
    print('Embedded Verified Shield in Hero trust chips')

# Add favicon link if not present
if '<link rel="icon"' not in html:
    html = html.replace('<head>', f'<head>\n<link rel="icon" type="image/png" href="{icon_b64}" />')
    print('Added favicon link to sample HTML')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print('Sample HTML updated successfully!')
