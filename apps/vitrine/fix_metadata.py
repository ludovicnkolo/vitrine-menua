import os
import re

directory = "src/app/[lang]"

for root, dirs, files in os.walk(directory):
    for file in files:
        if file == "page.tsx":
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            if "export const metadata: Metadata = {" in content:
                # Add SITE_URL if not exists
                if "const SITE_URL =" not in content:
                    content = content.replace("export const metadata: Metadata = {", "const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';\n\nexport async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {\n  const { lang } = await params;\n  return {\n    metadataBase: new URL(SITE_URL),")
                else:
                    content = content.replace("export const metadata: Metadata = {", "export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {\n  const { lang } = await params;\n  return {\n    metadataBase: new URL(SITE_URL),")

                # Replace hardcoded https://menuaconsulting.com with SITE_URL
                content = content.replace("'https://menuaconsulting.com/", "`${SITE_URL}/")
                content = content.replace("\"https://menuaconsulting.com/", "`${SITE_URL}/")
                content = content.replace("https://menuaconsulting.com", "${SITE_URL}")

                # Replace trailing '};' or '};' at the end of metadata
                # This is tricky because there could be other '};'. 
                # We can just rely on the fact that metadata is the last thing before the component.
                # Actually, replacing the exact '};' that closes metadata is needed.
                # Let's find the component export
                component_match = re.search(r'export default (async )?function', content)
                if component_match:
                    idx = component_match.start()
                    # The metadata closing is likely the last '};' before the component export
                    last_brace = content.rfind('};', 0, idx)
                    if last_brace != -1:
                        content = content[:last_brace] + '  };\n}' + content[last_brace+2:]
                
                with open(filepath, 'w') as f:
                    f.write(content)
                print(f"Fixed {filepath}")
