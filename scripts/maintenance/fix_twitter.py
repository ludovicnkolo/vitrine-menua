import os, glob, re

def add_twitter_to_en_pages(directory):
    for filepath in glob.iglob(directory + '/**/page.tsx', recursive=True):
        if not os.path.isfile(filepath): continue
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        orig_content = content
        
        # Check if twitter is already present
        if 'twitter:' in content:
            continue
            
        # Extract openGraph title and description to use for twitter
        og_match = re.search(r'openGraph:\s*{([^}]+)}', content)
        if og_match:
            og_content = og_match.group(1)
            title_match = re.search(r'title:\s*("[^"]+")', og_content)
            desc_match = re.search(r'description:\s*("[^"]+")', og_content)
            
            if title_match and desc_match:
                title = title_match.group(1)
                desc = desc_match.group(1)
                
                twitter_block = f""",
  twitter: {{
    card: 'summary_large_image',
    title: {title},
    description: {desc},
  }}"""
                # Insert after openGraph block
                content = re.sub(r'(openGraph:\s*{[^}]+})', r'\1' + twitter_block, content)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                    print(f"Added twitter to {filepath}")

add_twitter_to_en_pages('/home/kratos-financials-inc/Documents/kratos/site_web/apps/vitrine/src/app/en')
