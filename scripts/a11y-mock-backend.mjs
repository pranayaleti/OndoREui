/**
 * Minimal mock backend for Playwright a11y runs.
 * Serves GET /api/properties/public so generateStaticParams does not ECONNREFUSED
 * when the real OndoREBackend is not running.
 */
import http from "node:http"

const PORT = Number(process.env.A11Y_MOCK_BACKEND_PORT ?? 3030)
const HOST = "127.0.0.1"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
}

const server = http.createServer((req, res) => {
  const url = req.url?.split("?")[0] ?? ""

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders)
    res.end()
    return
  }

  if (req.method === "GET" && url === "/api/properties/public") {
    res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" })
    res.end(JSON.stringify({ data: [], pagination: { total: 0 } }))
    return
  }

  if (req.method === "GET" && url.startsWith("/api/properties/public/")) {
    res.writeHead(404, { ...corsHeaders, "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Not found" }))
    return
  }

  if (req.method === "GET" && url === "/health") {
    res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" })
    res.end(JSON.stringify({ status: "ok" }))
    return
  }

  res.writeHead(404)
  res.end()
})

server.listen(PORT, HOST, () => {
  console.log(`[a11y-mock-backend] listening on http://${HOST}:${PORT}`)
})

function shutdown() {
  server.close(() => process.exit(0))
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
