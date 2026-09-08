import re

html_file = r'c:\Users\ajaya\Desktop\AJAY\Projects\TerraVoxel\docs\archives\temp_stitch\code.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
if body_match:
    jsx = body_match.group(1)
else:
    jsx = content

jsx = jsx.replace('class="', 'className="')
jsx = jsx.replace('for="', 'htmlFor="')
jsx = jsx.replace('tabindex=', 'tabIndex=')
jsx = jsx.replace('viewbox="', 'viewBox="')
jsx = jsx.replace('<lineargradient', '<linearGradient')
jsx = jsx.replace('</lineargradient>', '</linearGradient>')

svg_attrs = [
    'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'fill-rule', 'clip-rule',
    'fill-opacity', 'stop-color', 'stop-opacity', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset'
]
for attr in svg_attrs:
    camel = ''.join(word.capitalize() if i > 0 else word for i, word in enumerate(attr.split('-')))
    jsx = jsx.replace(f'{attr}="', f'{camel}="')

jsx = re.sub(r'<(input|img|br|hr|path|polygon|circle|rect|line|ellipse|polyline)\b([^>]*?)(?<!/)>', r'<\1\2 />', jsx)
jsx = re.sub(r'</(input|img|br|hr|path|polygon|circle|rect|line|ellipse|polyline)\b>', '', jsx)
jsx = re.sub(r'<!--.*?-->', '', jsx, flags=re.DOTALL)
jsx = re.sub(r'style="[^"]*"', '', jsx)

react_code = 'import React from "react";\n\nexport default function Scene3DPage() {\n  return (\n    <div className="bg-alabaster text-slatePrimary font-sans antialiased overflow-hidden select-none h-screen w-screen flex flex-col">\n      ' + jsx + '\n    </div>\n  );\n}\n'

with open(r'c:\Users\ajaya\Desktop\AJAY\Projects\TerraVoxel\frontend\src\pages\Scene3DPage.jsx', 'w', encoding='utf-8') as f:
    f.write(react_code)

print('Component generated successfully.')
