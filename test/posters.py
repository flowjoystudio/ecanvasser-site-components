# Generates the loader's still images from the built demo: npm run build && python3 test/posters.py
import asyncio
from playwright.async_api import async_playwright
from PIL import Image
URL='file:///home/claude/ecanvasser-site-components/test/trial-demo.html'
async def shot(p, w, h, scale, out):
    b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
    pg = await b.new_page(viewport={'width':w,'height':h}, device_scale_factor=scale)
    await pg.goto(URL); await pg.evaluate("document.getElementById('ec-demo').scrollIntoView()"); await pg.wait_for_timeout(1500)
    await pg.locator('#ec-demo').screenshot(path='/tmp/poster.png')
    im=Image.open('/tmp/poster.png').convert('RGB')
    for d in ['dist/img/','src/trial-demo/img/']: im.save(d+out,'WEBP',quality=76)
    print(out, im.size)
    await b.close()
async def main():
    async with async_playwright() as p:
        await shot(p,1280,900,1.25,'poster.webp')
        await shot(p,390,844,2,'poster-mobile.webp')
asyncio.run(main())
