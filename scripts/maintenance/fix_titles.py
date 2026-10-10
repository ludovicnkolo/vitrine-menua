import os, glob

def replace_in_files(directory):
    for filepath in glob.iglob(directory + '/**/*.tsx', recursive=True):
        if not os.path.isfile(filepath): continue
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        orig_content = content
        
        # Replace specific known titles
        content = content.replace("Operational Back and Middle Office Outsourcing", "Operational Back & Middle Office Outsourcing")
        content = content.replace("Operational back and middle office", "Operational back & middle office")
        content = content.replace("BACK AND MIDDLE OFFICE", "BACK & MIDDLE OFFICE")
        content = content.replace("Back and middle office specialization", "Back & middle office specialization")
        
        if content != orig_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
                print(f"Updated {filepath}")

replace_in_files('/home/kratos-financials-inc/Documents/kratos/site_web/apps/vitrine/src')
