import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2, has_touch=True, is_mobile=True)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/ecanvasser-site-components/test/trial-demo.html'); await pg.evaluate("document.getElementById('ec-demo').scrollIntoView()"); await pg.wait_for_timeout(1200)
        await pg.click('#d-views [data-show=phone]'); await pg.wait_for_timeout(600)
        print('pulse on web tab', await pg.evaluate("document.querySelector('#d-views [data-show=web]').classList.contains('is-next')"))
        await pg.locator('#ec-demo').screenshot(path='/tmp/vh1.png')
        await pg.click('#d-views [data-show=web]'); await pg.wait_for_timeout(300)
        print('cleared', await pg.evaluate("!document.querySelector('#d-views .is-next')"))
        await pg.click('#d-auto'); await pg.wait_for_timeout(1800); await pg.click('#d-create'); await pg.wait_for_timeout(800)
        await pg.click('#d-views [data-show=web]'); await pg.wait_for_timeout(300)
        print('pulse on phone tab', await pg.evaluate("document.querySelector('#d-views [data-show=phone]').classList.contains('is-next')"))
        print(errs); await b.close()
asyncio.run(main())
