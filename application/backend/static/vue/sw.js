if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,o)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let l={};const t=e=>i(e,r),c={module:{uri:r},exports:l,require:t};s[r]=Promise.all(n.map((e=>c[e]||t(e)))).then((e=>(o(...e),l)))}}define(["./workbox-4c320e2c"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/main-b39m4_ab.js",revision:null},{url:"assets/main-C-4lz5e6.css",revision:null},{url:"assets/main-jNyonoCm.js",revision:null},{url:"assets/main-X117GY0U.js",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"fonts/fonts.css",revision:"e55a178fd30bc4c1d57cf541cac75b73"},{url:"index.html",revision:"969633f1d6d966e343ee1edebe30f04e"},{url:"img/favicon.ico",revision:"0e852ad15083f42c178c7934b0cada1a"},{url:"img/logo-square-180.png",revision:"755fda277e9beabd6125c106e50aa0c0"},{url:"manifest.webmanifest",revision:"a0071ac06ed2bc37021df81c00f5aed5"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
