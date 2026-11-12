import asyncio, sys
from playwright.async_api import async_playwright
from PIL import Image
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':1280,'height':900}, device_scale_factor=1.25)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type=='error' and errs.append(m.text))
        reqs=[]; pg.on('request', lambda r: reqs.append(r.url.split('/')[-1]))
        await pg.goto('file:///home/claude/ecanvasser-site-components/test/trial-demo.html'); await pg.wait_for_timeout(600)
        print('before scroll loaded js?', 'trial-demo.js' in reqs)
        await pg.evaluate("document.getElementById('ec-demo').scrollIntoView()"); await pg.wait_for_timeout(1200)
        print('after scroll loaded js?', 'trial-demo.js' in reqs, 'ready', await pg.get_attribute('#ec-demo','data-ready'))
        print('img', [r for r in reqs if r.endswith('.jpg')])
        bx=await pg.locator('#ec-demo').bounding_box(); print('box', bx)
        if '--poster' in sys.argv:
            await pg.locator('#ec-demo').screenshot(path='poster.png')
            im=Image.open('poster.png'); print('poster px', im.size); im.save('dist/img/poster.webp','WEBP',quality=78); im.save('src/trial-demo/img/poster.webp','WEBP',quality=78)
        # quick functional run
        await pg.click('#d-auto'); await pg.wait_for_timeout(1700); await pg.click('#d-create'); await pg.wait_for_timeout(1300)
        await pg.click('.m-list.is-new'); await pg.wait_for_timeout(500); await pg.click('#d-opt'); await pg.wait_for_timeout(1500); await pg.click('#d-start'); await pg.wait_for_timeout(600)
        for i in range(3):
            await pg.click('#d-save'); await pg.wait_for_timeout(500)
        await pg.wait_for_timeout(1500)
        print('done shown', await pg.locator('#d-done.on').count())
        print('errors', errs)
        await b.close()
asyncio.run(main())
