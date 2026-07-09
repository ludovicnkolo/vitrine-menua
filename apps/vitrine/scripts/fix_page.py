import re

filepath = '/home/kratos-financials-inc/Documents/kratos/site_web/src/app/page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the corrupted line
old = '                 <p className="text-[#141824]/70 font-light te      {/* \u2500\u2500 SECTION 6 : ACTUALIT\u00c9S (3 article cards) \u2500\u2500 */}\n      <section className="relative w-full bg-white section-padding">'
new = '''                 <p className="text-[#141824]/70 font-light text-[1.05rem]">Sur Mesure</p>
              </div>
          </div>

        </div>
      </section>

      {/* \u2500\u2500 SECTION 6 : ACTUALIT\u00c9S (3 article cards) \u2500\u2500 */}
      <section className="relative w-full bg-white section-padding">'''

if old in content:
    content = content.replace(old, new, 1)
    print("Fixed!")
else:
    # Try to find with a substring search
    marker = 'font-light te      {'
    idx = content.find(marker)
    if idx != -1:
        # Find start of line
        line_start = content.rfind('\n', 0, idx) + 1
        # Find end of next line (after section opening)
        next_newline = content.find('\n', content.find('\n', idx) + 1)
        bad_chunk = content[line_start:next_newline]
        print(f"Found bad chunk: {repr(bad_chunk)}")
        good_chunk = '''                 <p className="text-[#141824]/70 font-light text-[1.05rem]">Sur Mesure</p>
              </div>
          </div>

        </div>
      </section>

      {/* \u2500\u2500 SECTION 6 : ACTUALIT\u00c9S (3 article cards) \u2500\u2500 */}
      <section className="relative w-full bg-white section-padding">'''
        content = content[:line_start] + good_chunk + content[next_newline:]
        print("Fixed via fallback!")
    else:
        print("ERROR: marker not found!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Saved.")
