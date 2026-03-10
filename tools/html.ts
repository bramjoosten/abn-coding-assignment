/**
 * @fileoverview Generates the index.html shell for both dev and production builds.
 */

export function generateHtml(scriptPath: string, cssPath?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#000000">
  <title>TV Show Dashboard</title>
  <style>html,body{margin:0;padding:0;background:#000000}</style>
  ${cssPath ? `<link rel="stylesheet" href="/${cssPath}">` : ''}
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/${scriptPath}"></script>
</body>
</html>`
}
