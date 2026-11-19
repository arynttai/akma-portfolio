import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => { await page.goto('/', {waitUntil: 'networkidle'}) })

test('home says who, where and has the main actions', async ({page}) => {
  await expect(page.getByRole('heading', {level: 1})).toHaveText(/Akmaral\s+Aryntay/)
  await expect(page.locator('.role')).toContainText('Software engineer in Astana')
  await expect(page.locator('.now')).toContainText('Freedom Cloud Holding')
  await expect(page.getByRole('link', {name: 'Explore my work'})).toHaveAttribute('href', '#projects')
})

test('navigation has the five sections and every anchor resolves', async ({page, isMobile}) => {
  if (isMobile) await page.getByRole('button', {name: 'Open menu'}).click()
  for (const name of ['Home', 'Projects', 'Experience', 'About', 'Contact']) await expect(page.locator('.nav-links').getByRole('link', {name, exact: true})).toBeVisible()
  const missing = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')]
    .map(a => a.getAttribute('href')!.slice(1)).filter(id => id && !id.startsWith('project-') && !document.getElementById(id)))
  expect(missing).toEqual([])
})

test('no horizontal overflow, no broken images', async ({page}) => {
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) } })
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0)
  const broken = await page.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src))
  expect(broken).toEqual([])
})

test('every project card opens a sheet with real screens and closes again', async ({page}) => {
  const cards = page.locator('.tile-btn')
  const n = await cards.count()
  expect(n).toBe(7)
  for (let i = 0; i < n; i++) {
    await cards.nth(i).click()
    const dialog = page.locator('dialog.sheet-dialog[open]')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('.gallery-main img')).toBeVisible()
    await expect(dialog.locator('.prov')).toContainText('—')
    await page.keyboard.press('Escape')
    await expect(page.locator('dialog.sheet-dialog[open]')).toHaveCount(0)
  }
})

test('deep link opens a project and live links point to the product', async ({page}) => {
  await page.goto('/#project-djailay')
  const dialog = page.locator('dialog.sheet-dialog[open]')
  await expect(dialog.getByRole('heading', {name: 'Digital Jailay'})).toBeVisible()
  await expect(dialog.getByRole('link', {name: 'djailay.astel.kz'})).toHaveAttribute('href', 'https://djailay.astel.kz')
  await dialog.getByRole('tab', {name: /Grazing heatmap/}).click()
  await expect(dialog.locator('.gallery-main img')).toHaveAttribute('src', /djailay-heatmap/)
})

test('attendance demo inside the sheet refuses a wrong PIN', async ({page}) => {
  await page.goto('/#project-attendance')
  const flow = page.locator('dialog[open] .attendance-flow')
  await flow.getByRole('button', {name: 'Open lesson as teacher'}).click()
  const pin = (await flow.locator('.pin-line b').textContent())!.trim()
  await flow.getByRole('button', {name: 'Scan as student'}).click()
  await flow.getByLabel('Enter the 4-digit PIN').fill(pin === '0000' ? '1111' : '0000')
  await flow.getByRole('button', {name: 'Confirm'}).click()
  await expect(flow.getByText('Wrong PIN')).toBeVisible()
  await flow.getByLabel('Enter the 4-digit PIN').fill(pin)
  await flow.getByRole('button', {name: 'Confirm'}).click()
  await expect(flow.getByText('Present.')).toBeVisible()
})

test('myroom sheet loads the 3D room or a fallback', async ({page}) => {
  await page.goto('/#project-myroom')
  await expect(page.locator('dialog[open]').locator('.room-hint, .room-status:has-text("not available")')).toBeVisible({timeout: 15_000})
})

test('mini akma reacts and the CV opens', async ({page, request}) => {
  await page.getByRole('button', {name: 'Say hi to Mini Akma'}).click()
  await expect(page.locator('.bubble')).not.toHaveText(/^Hi! I’m Mini Akma/)
  for (let i = 0; i < 5; i++) await page.getByRole('button', {name: 'Say hi to Mini Akma'}).click()
  await expect(page.locator('.bubble')).toContainText('Soul Camp')
  await expect(page.locator('#contact').getByRole('link', {name: /Telegram/})).toHaveAttribute('href', 'https://t.me/sindugahvon')
  const cv = await request.get('/Akmaral_Aryntay_CV.pdf')
  expect(cv.status()).toBe(200)
  expect(cv.headers()['content-type']).toContain('pdf')
})

test('theme toggle switches and remembers', async ({page}) => {
  const btn = page.locator('.theme-btn')
  const before = await page.evaluate(() => document.documentElement.dataset.theme)
  await btn.click()
  const after = await page.evaluate(() => document.documentElement.dataset.theme)
  expect(after).not.toBe(before)
  await page.reload({waitUntil: 'networkidle'})
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(after)
})

test('freedom badge and education order', async ({page}) => {
  await expect(page.locator('.badge')).toContainText('Freedom Cloud Holding Ltd.')
  await expect(page.locator('.edu li').first()).toContainText('2022 — 2025')
  await expect(page.getByText('NovaLife')).toHaveCount(0)
})

test('experience shows company vs my products', async ({page}) => {
  const exp = page.locator('#experience')
  await expect(exp.getByText('Company directions — not my work')).toBeVisible()
  await exp.getByRole('tab', {name: 'Reporter'}).click()
  await expect(exp.locator('.sat-card')).toContainText('Ops console')
  await exp.locator('.job-head').nth(1).click()
  await expect(exp.locator('.job').nth(1).locator('.job-body')).toBeVisible()
})

test('no borrowed widgets, clean timeline', async ({page}) => {
  for (const sel of ['.ticker', '.fresh', '.finder', '.clock', '.plans', '.camera-bar', '.hud']) await expect(page.locator(sel)).toHaveCount(0)
  await expect(page.locator('.job-org').first()).toHaveText('Freedom Cloud Holding Ltd.')
  await expect(page.locator('.job-org img')).toHaveCount(0)
})
