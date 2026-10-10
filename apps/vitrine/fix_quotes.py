import os
import re

directory = "src/app/[lang]"

for root, dirs, files in os.walk(directory):
    for file in files:
        if file == "page.tsx":
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            # Fix strings starting with `${SITE_URL} that end with ' or "
            # It looks like `${SITE_URL}/something' or `${SITE_URL}/something"
            content = re.sub(r'(`\$\{SITE_URL\}[^`\'"]*)([\'"])', r'\1`', content)
            
            with open(filepath, 'w') as f:
                f.write(content)
            # print(f"Fixed quotes in {filepath}")
