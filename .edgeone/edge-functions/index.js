
      let global = globalThis;
      globalThis.global = globalThis;

      if (typeof global.navigator === 'undefined') {
        global.navigator = {
          userAgent: 'edge-runtime',
          language: 'en-US',
          languages: ['en-US'],
        };
      } else {
        if (typeof global.navigator.language === 'undefined') {
          global.navigator.language = 'en-US';
        }
        if (!global.navigator.languages || global.navigator.languages.length === 0) {
          global.navigator.languages = [global.navigator.language];
        }
        if (typeof global.navigator.userAgent === 'undefined') {
          global.navigator.userAgent = 'edge-runtime';
        }
      }

      class MessageChannel {
        constructor() {
          this.port1 = new MessagePort();
          this.port2 = new MessagePort();
        }
      }
      class MessagePort {
        constructor() {
          this.onmessage = null;
        }
        postMessage(data) {
          if (this.onmessage) {
            setTimeout(() => this.onmessage({ data }), 0);
          }
        }
      }
      global.MessageChannel = MessageChannel;

      // if ((typeof globalThis.fetch === 'undefined' || typeof globalThis.Headers === 'undefined' || typeof globalThis.Request === 'undefined' || typeof globalThis.Response === 'undefined') && typeof require !== 'undefined') {
      //   try {
      //     const undici = require('undici');
      //     if (undici.fetch && !globalThis.fetch) {
      //       globalThis.fetch = undici.fetch;
      //     }
      //     if (undici.Headers && typeof globalThis.Headers === 'undefined') {
      //       globalThis.Headers = undici.Headers;
      //     }
      //     if (undici.Request && typeof globalThis.Request === 'undefined') {
      //       globalThis.Request = undici.Request;
      //     }
      //     if (undici.Response && typeof globalThis.Response === 'undefined') {
      //       globalThis.Response = undici.Response;
      //     }
      //   } catch (polyfillError) {
      //     console.warn('Edge middleware polyfill failed:', polyfillError && polyfillError.message ? polyfillError.message : polyfillError);
      //   }
      // }

      '__MIDDLEWARE_BUNDLE_CODE__'

      function recreateRequest(request, overrides = {}) {
        const cloned = typeof request.clone === 'function' ? request.clone() : request;
        const headers = new Headers(cloned.headers);

        if (overrides.headerPatches) {
          Object.keys(overrides.headerPatches).forEach((key) => {
            const value = overrides.headerPatches[key];
            if (value === null || typeof value === 'undefined') {
              headers.delete(key);
            } else {
              headers.set(key, value);
            }
          });
        }

        if (overrides.headers) {
          const extraHeaders = new Headers(overrides.headers);
          extraHeaders.forEach((value, key) => headers.set(key, value));
        }

        const url = overrides.url || cloned.url;
        const method = overrides.method || cloned.method || 'GET';
        const canHaveBody = method && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD';
        const body = overrides.body !== undefined ? overrides.body : canHaveBody ? cloned.body : undefined;

        // 如果rewrite传入的是完整URL（第三方地址），需要更新host
        if (overrides.url) {
          try {
            const newUrl = new URL(overrides.url, cloned.url);
            // 只有当新URL是绝对路径（包含协议和host）时才更新host
            if (overrides.url.startsWith('http://') || overrides.url.startsWith('https://')) {
              headers.set('host', newUrl.host);
            }
            // 相对路径时保持原有host不变
          } catch (e) {
            // URL解析失败时保持原有host
          }
        }

        const init = {
          method,
          headers,
          redirect: cloned.redirect,
          credentials: cloned.credentials,
          cache: cloned.cache,
          mode: cloned.mode,
          referrer: cloned.referrer,
          referrerPolicy: cloned.referrerPolicy,
          integrity: cloned.integrity,
          keepalive: cloned.keepalive,
          signal: cloned.signal,
        };

        if (canHaveBody && body !== undefined) {
          init.body = body;
        }

        if ('duplex' in cloned) {
          init.duplex = cloned.duplex;
        }

        return new Request(url, init);

      }

      

      async function handleRequest(context){
        let routeParams = {};
        let pagesFunctionResponse = null;
        let request = context.request;
        const waitUntil = context.waitUntil;
        let urlInfo = new URL(request.url);
        const eo = request.eo || {};

        const normalizePathname = () => {
          if (urlInfo.pathname !== '/' && urlInfo.pathname.endsWith('/')) {
            urlInfo.pathname = urlInfo.pathname.slice(0, -1);
          }
        };

        function getSuffix(pathname = '') {
          // Use a regular expression to extract the file extension from the URL
          const suffix = pathname.match(/.([^.]+)$/);
          // If an extension is found, return it, otherwise return an empty string
          return suffix ? '.' + suffix[1] : null;
        }

        normalizePathname();

        let matchedFunc = false;

        
        const runEdgeFunctions = () => {
          
          if(!matchedFunc && '/helloworld-edge' === urlInfo.pathname) {
            matchedFunc = true;
              (() => {
  // edge-functions/helloworld-edge/index.js
  function onRequest(context) {
    const json = JSON.stringify({
      "code": 0,
      "message": "Hello World"
    });
    return new Response(json, {
      headers: {
        "content-type": "application/json",
        "x-edgefunctions": "Welcome to use EdgeOne Pages Functions."
      }
    });
  }

        pagesFunctionResponse = onRequest;
      })();
          }
        
        };
      

        let middlewareResponseHeaders = null;
        
        // 走到这里说明：
        // 1. 没有中间件响应（middlewareResponse 为 null/undefined）
        // 2. 或者中间件返回了 next
        // 需要判断是否命中边缘函数

        runEdgeFunctions();

        //没有命中边缘函数，执行回源
        if (!matchedFunc) {
          // 允许压缩的文件后缀白名单
          const ALLOW_COMPRESS_SUFFIXES = [
            '.html', '.htm', '.xml', '.txt', '.text', '.conf', '.def', '.list', '.log', '.in',
            '.css', '.js', '.json', '.rss', '.svg', '.tif', '.tiff', '.rtx', '.htc',
            '.java', '.md', '.markdown', '.ico', '.pl', '.pm', '.cgi', '.pb', '.proto',
            '.xhtml', '.xht', '.ttf', '.otf', '.woff', '.eot', '.wasm', '.binast', '.webmanifest'
          ];
          
          // 检查请求路径是否有允许压缩的后缀
          const pathname = urlInfo.pathname;
          const suffix = getSuffix(pathname);
          const hasCompressibleSuffix = ALLOW_COMPRESS_SUFFIXES.includes(suffix);
          
          // 如果不是可压缩的文件类型，删除 Accept-Encoding 头以禁用 CDN 压缩
          if (!hasCompressibleSuffix) {
              request.headers.delete('accept-encoding');
          }
          
          const originResponse = await fetch(request);
          
          // 如果中间件设置了响应头，合并到回源响应中
          if (middlewareResponseHeaders) {
            const mergedHeaders = new Headers(originResponse.headers);
            // 删除可能导致问题的编码相关头
            mergedHeaders.delete('content-encoding');
            mergedHeaders.delete('content-length');
            middlewareResponseHeaders.forEach((value, key) => {
              if (key.toLowerCase() === 'set-cookie') {
                mergedHeaders.append(key, value);
              } else {
                mergedHeaders.set(key, value);
              }
            });
            return new Response(originResponse.body, {
              status: originResponse.status,
              statusText: originResponse.statusText,
              headers: mergedHeaders,
            });
          }
          
          return originResponse;
        }
        
        // 命中了边缘函数，继续执行边缘函数逻辑

        const params = {};
        if (routeParams.id) {
          if (routeParams.mode === 1) {
            const value = urlInfo.pathname.match(routeParams.left);        
            for (let i = 1; i < value.length; i++) {
              params[routeParams.id[i - 1]] = value[i];
            }
          } else {
            const value = urlInfo.pathname.replace(routeParams.left, '');
            const splitedValue = value.split('/');
            if (splitedValue.length === 1) {
              params[routeParams.id] = splitedValue[0];
            } else {
              params[routeParams.id] = splitedValue;
            }
          }
          
        }
        const edgeFunctionResponse = await pagesFunctionResponse({request, params, env: {"VITE_SUPABASE_URL":"https://gpjprlcpdizkqcutfwvi.supabase.co","VITE_SUPABASE_ANON_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwanBybGNwZGl6a3FjdXRmd3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjc4MzQsImV4cCI6MjA4NTYwMzgzNH0.RGTCGx1Vm4DlIJyljpEXffgeKG7w5b8PS-9v2J5RsvM","VITE_APP_NAME":"NanoConnect","VITE_APP_URL":"http://localhost:5173"}, waitUntil, eo });
        
        // 如果中间件设置了响应头，合并到边缘函数响应中
        if (middlewareResponseHeaders && edgeFunctionResponse) {
          const mergedHeaders = new Headers(edgeFunctionResponse.headers);
          // 删除可能导致问题的编码相关头
          mergedHeaders.delete('content-encoding');
          mergedHeaders.delete('content-length');
          middlewareResponseHeaders.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') {
              mergedHeaders.append(key, value);
            } else {
              mergedHeaders.set(key, value);
            }
          });
          return new Response(edgeFunctionResponse.body, {
            status: edgeFunctionResponse.status,
            statusText: edgeFunctionResponse.statusText,
            headers: mergedHeaders,
          });
        }
        
        return edgeFunctionResponse;
      }
      addEventListener('fetch', event=>{return event.respondWith(handleRequest({request:event.request,params: {}, env: {"VITE_SUPABASE_URL":"https://gpjprlcpdizkqcutfwvi.supabase.co","VITE_SUPABASE_ANON_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwanBybGNwZGl6a3FjdXRmd3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjc4MzQsImV4cCI6MjA4NTYwMzgzNH0.RGTCGx1Vm4DlIJyljpEXffgeKG7w5b8PS-9v2J5RsvM","VITE_APP_NAME":"NanoConnect","VITE_APP_URL":"http://localhost:5173"}, waitUntil: event.waitUntil }))});