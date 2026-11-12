import asyncio, sys
from playwright.async_api import async_playwright
URL='file:///home/claude/ecanvasser-site-components/test/trial-demo.html'
async def run(p, w, h, tag):
    b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
    pg = await b.new_page(viewport={'width':w,'height':h}, device_scale_factor=2, has_touch=w<700, is_mobile=w<700)
    errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.goto(URL); await pg.evaluate("document.getElementById('ec-demo').scrollIntoView()"); await pg.wait_for_timeout(1200)
    el=pg.locator('#ec-demo')
    await el.screenshot(path=f'/tmp/r_{tag}_1.png')
    await pg.click('#d-auto'); await pg.wait_for_timeout(1800)
    await el.screenshot(path=f'/tmp/r_{tag}_2.png')
    await pg.click('#d-create'); await pg.wait_for_timeout(1400)
    await el.screenshot(path=f'/tmp/r_{tag}_3.png')
    await pg.click('.m-list.is-new'); await pg.wait_for_timeout(500); await pg.click('#d-opt'); await pg.wait_for_timeout(1600)
    await el.screenshot(path=f'/tmp/r_{tag}_4.png')
    await pg.click('#d-start'); await pg.wait_for_timeout(700)
    await pg.locator('.o-tile').nth(3).click(); await pg.wait_for_timeout(400); await pg.click('#d-save'); await pg.wait_for_timeout(600)
    await el.screenshot(path=f'/tmp/r_{tag}_5.png')
    await pg.click('#d-save'); await pg.wait_for_timeout(500); await pg.click('#d-save'); await pg.wait_for_timeout(2000)
    await el.screenshot(path=f'/tmp/r_{tag}_6.png')
    print(tag, 'errors', errs, 'narrow', await pg.evaluate("document.getElementById('ec-demo').classList.contains('is-narrow')"))
    await b.close()
async def main():
    async with async_playwright() as p:
        for w,h,t in [(1280,900,'d'),(1024,800,'t'),(768,1024,'tp'),(390,844,'m')]:
            if len(sys.argv)>1 and t not in sys.argv[1:]: continue
            await run(p,w,h,t)
asyncio.run(main())
