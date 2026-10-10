import os, glob, re

def replace_in_files(directory):
    for filepath in glob.iglob(directory + '/**/*.tsx', recursive=True):
        if not os.path.isfile(filepath): continue
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        orig_content = content
        
        # Replace 'organization' with 'organisation' and 'Organization' with 'Organisation'
        content = content.replace("organization", "organisation")
        content = content.replace("Organization", "Organisation")
        
        # Titles - use "back & middle office" for English. It says: "Utiliser « back & middle office » dans les titres et « back and middle office » dans les phrases courantes."
        # Actually, let's just replace all "back and middle-office" with "back and middle office".
        content = content.replace("back and middle-office", "back and middle office")
        
        if content != orig_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
                print(f"Updated {filepath}")

    for filepath in glob.iglob(directory + '/**/*.ts', recursive=True):
        if not os.path.isfile(filepath): continue
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        orig_content = content
        
        content = content.replace("organization", "organisation")
        content = content.replace("Organization", "Organisation")
        content = content.replace("back and middle-office", "back and middle office")
        
        if content != orig_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
                print(f"Updated {filepath}")

replace_in_files('/home/kratos-financials-inc/Documents/kratos/site_web/apps/vitrine/src')
