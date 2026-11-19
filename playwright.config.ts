import {defineConfig, devices} from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {baseURL: 'http://127.0.0.1:4173', channel: process.env.PW_CHANNEL || 'chrome'},
  webServer: {command: 'npm run preview', url: 'http://127.0.0.1:4173', reuseExistingServer: true, timeout: 60_000},
  projects: [
    {name: 'desktop', use: {viewport: {width: 1440, height: 900}}},
    {name: 'mobile', use: {...devices['Pixel 7'], channel: process.env.PW_CHANNEL || 'chrome'}}
  ]
})
