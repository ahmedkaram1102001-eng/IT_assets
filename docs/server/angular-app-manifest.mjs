
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/IT_assets/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/IT_assets/login",
    "route": "/IT_assets"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-KWROBYU6.js",
      "chunk-YNX3NJWK.js"
    ],
    "route": "/IT_assets/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FJ7TKXAF.js"
    ],
    "route": "/IT_assets/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FJ7TKXAF.js"
    ],
    "route": "/IT_assets/assets"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FJ7TKXAF.js"
    ],
    "route": "/IT_assets/assets/new"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-FJ7TKXAF.js"
    ],
    "route": "/IT_assets/assets/*/edit"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-FJ7TKXAF.js"
    ],
    "route": "/IT_assets/assets/*/maintenance"
  },
  {
    "renderMode": 2,
    "redirectTo": "/IT_assets/login",
    "route": "/IT_assets/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 18905, hash: 'c040257efec83228c514fc6ba5a5573dff728831add52bbf7d941c1d09aa1695', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 6018, hash: 'ef26551a513ee178b70a02d3c194ff48242ff1cbb7769c530ad9cda19c3e98ef', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 339, hash: '30b57a71505861a2d6f720c86e1112be22905482b9c2432090b027e0182dc941', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'assets/new/index.html': {size: 348, hash: '1bf65b3491d66b12cef35d7211bab0f9d916c3c80ca9364e983547e266fd1b6e', text: () => import('./assets-chunks/assets_new_index_html.mjs').then(m => m.default)},
    'assets/index.html': {size: 330, hash: '346b86d9c35b306a4432d3ba2994cee90e2c0b8b5a3a76c98b296a988873aee4', text: () => import('./assets-chunks/assets_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 29053, hash: '7633a6b580fce0791a5172cc0efe2e5d4accbc298cb77337350315c4c68efd68', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-MKX2XEMA.css': {size: 332227, hash: 'Ctjp3pwBQ4Q', text: () => import('./assets-chunks/styles-MKX2XEMA_css.mjs').then(m => m.default)}
  },
};
