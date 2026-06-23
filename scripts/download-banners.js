/**
 * 下载首页轮播图（从 Lorem Picsum / Unsplash 免费图源）
 * 尺寸：750x350，适配微信小程序轮播
 */
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

const BANNER_DIR = path.join(__dirname, '..', 'static', 'images', 'banner')

// 使用 loremflickr.com - 每次随机返回对应主题的图片，不重定向
const BANNERS = [
  {
    name: 'banner1.png',
    // 乡村风光 (rural village countryside)
    urls: [
      'https://loremflickr.com/750/350/village,countryside,rural',
      'https://picsum.photos/750/350?random=1',
    ]
  },
  {
    name: 'banner2.png',
    // 农田丰收 (farm harvest agriculture)
    urls: [
      'https://loremflickr.com/750/350/farm,harvest,agriculture',
      'https://picsum.photos/750/350?random=2',
    ]
  },
  {
    name: 'banner3.png',
    // 自然山水 (nature landscape mountain)
    urls: [
      'https://loremflickr.com/750/350/nature,landscape,mountain,green',
      'https://picsum.photos/750/350?random=3',
    ]
  },
]

/**
 * 下载文件，自动跟随重定向
 */
function download(url, dest, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http

    const doRequest = (currentUrl, redirectCount) => {
      if (redirectCount > maxRedirects) {
        return reject(new Error('Too many redirects'))
      }

      const req = protocol.get(currentUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        // 处理重定向
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // 释放当前响应
          res.resume()
          const redirectUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, currentUrl).href
          return doRequest(redirectUrl, redirectCount + 1)
        }

        if (res.statusCode !== 200) {
          res.resume()
          return reject(new Error(`HTTP ${res.statusCode} for ${currentUrl}`))
        }

        const chunks = []
        res.on('data', (d) => chunks.push(d))
        res.on('end', () => {
          const buf = Buffer.concat(chunks)

          // 检验是否为有效图片
          if (buf.length < 1000) {
            return reject(new Error(`Image too small: ${buf.length} bytes`))
          }

          fs.writeFileSync(dest, buf)
          resolve({ name: path.basename(dest), size: buf.length })
        })
      })

      req.on('error', reject)
      req.setTimeout(15000, () => {
        req.destroy()
        reject(new Error('Request timeout'))
      })
    }

    doRequest(url, 0)
  })
}

async function main() {
  if (!fs.existsSync(BANNER_DIR)) {
    fs.mkdirSync(BANNER_DIR, { recursive: true })
  }

  for (const banner of BANNERS) {
    let success = false
    for (const url of banner.urls) {
      try {
        const result = await download(url, path.join(BANNER_DIR, banner.name))
        console.log(`✅ ${result.name}\t${(result.size / 1024).toFixed(0)} KB\t(${url.split('?')[0]})`)
        success = true
        break
      } catch (e) {
        console.log(`⏳ ${banner.name}: 尝试 ${url} 失败 - ${e.message}`)
      }
    }
    if (!success) {
      console.log(`❌ ${banner.name}: 所有源均失败`)
    }
  }

  console.log('\n下载完毕！')
}

main().catch(console.error)
