import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2, has_touch=True, is_mobile=True)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/ecanvasser-site-components/test/trial-demo.html'); await pg.evaluate("document.getElementById('ec-demo').scrollIntoView()"); await pg.wait_for_timeout(1200)
        await pg.click('#d-views [data-show=phone]'); await pg.wait_for_timeout(500)
        print('hint1', await pg.is_visible('#d-vhint'), await pg.inner_text('#d-vhint'))
        await pg.locator('#ec-demo').screenshot(path='/tmp/vh1.png')
        await pg.click('#d-vhint-go'); await pg.wait_for_timeout(400)
        print('after go', await pg.get_attribute('#ec-demo','data-show'), await pg.is_visible('#d-vhint'))
        await pg.click('#d-auto'); await pg.wait_for_timeout(1800); await pg.click('#d-create'); await pg.wait_for_timeout(800)
        await pg.click('#d-views [data-show=web]'); await pg.wait_for_timeout(400)
        print('hint2', await pg.is_visible('#d-vhint'), await pg.inner_text('#d-vhint'))
        await pg.locator('#ec-demo').screenshot(path='/tmp/vh2.png')
        print(errs); await b.close()
asyncio.run(main())
