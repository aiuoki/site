import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
head = '''<title>Apuntes de Matemáticas</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=STIX+Two+Text:ital,wght@0,400;0,600;1,400;1,600&family=Young+Serif&display=swap">
<style>''' + open('style.css').read() + '</style>\n'
body = open('body.html').read()
langs = ["es","ca","en","fr","de","it","pt","ro","ru"]
js = 'window.I18N = {};\nwindow.CX = {};\n' + ''.join(open(f'i18n/{l}.js').read() for l in langs if os.path.exists(f'i18n/{l}.js'))
js += open('i18n/nav.js').read() + ''.join(open(f'i18n/cx-{l}.js').read() for l in ['es','en'] if os.path.exists(f'i18n/cx-{l}.js'))
out = head + body + '\n<script>\n' + js + '\n</script>\n<script>\n' + open('main.js').read().replace('/*@@CX@@*/', open('cx.js').read()) + '\n</script>\n'
open('../circulo-trigonometrico.html','w').write(out)
print(len(out))
