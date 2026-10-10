import os

directory = "src/app/[lang]"

for root, dirs, files in os.walk(directory):
    for file in files:
        if file == "page.tsx":
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            new_content = content.replace("|| '${SITE_URL}'", "|| 'https://menuaconsulting.com'")
            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Fixed {filepath}")
