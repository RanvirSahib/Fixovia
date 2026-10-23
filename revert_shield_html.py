html_path = r'C:\Fixovia\Fixovia – Verified home repair, at your door.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

replacement = '<div class="head rev"><p class="hand">The Fixovia Cover</p><h2>If something goes wrong, we’re on the hook</h2></div>'

start_tag = '<div class="head rev" style="display:flex;align-items:flex-start;justify-content:space-between;gap:24px;flex-wrap:wrap">'
end_tag = 'alt="Fixovia Verified Shield" class="rev rev-scale" style="width:96px;height:auto;filter:drop-shadow(0 12px 24px rgba(13,86,203,0.25));align-self:center;" />\n</div>'

s_idx = html.find(start_tag)
e_idx = html.find(end_tag)

if s_idx != -1 and e_idx != -1:
    html = html[:s_idx] + replacement + html[e_idx + len(end_tag):]
    print('Successfully removed shield from Cover section in HTML!')
else:
    print('Indices not found:', s_idx, e_idx)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
