import { serve } from 'https://deno.land/std/http/server.ts'
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { cors } from 'https://deno.land/x/hono/middleware.ts'
import { prettyJSON } from 'https://deno.land/x/hono/middleware.ts'
import { OpenAI } from 'https://deno.land/x/openai/mod.ts'
import 'https://deno.land/x/dotenv/load.ts'

const apiKey = Deno.env.get('API_KEY')
const openai = new OpenAI(apiKey)

// Define a function that generates code based on a text prompt
async function generateCode(prompt) {
  // Use the OpenAI API to generate code using the davinci model
  const res = await openai.createCompletion(prompt)

  // Return the generated code
  return res.choices[0].text
}

// Create a new instance of the hono framework
const app = new Hono()
// const app = hono()

// Use global middleware to enable CORS and pretty-print JSON responses
app.use('*', cors())
app.use('*', prettyJSON())

// Use a middleware function to ensure that requests have the correct Content-Type
app.post('*', async (c, next) => {
  if (!c.req.header('Content-Type')?.includes('application/json')) {
    return c.json({ message: `Method not allowed.` }, 405)
  }
  await next()
})

// Define an HTTP route for the homepage
app.get('/', async (c) => {
  return c.json({ message: `Welcome to the Hi` })
})

// Define an HTTP route for generating code
app.get('/generate/:input', async (c) => {
  // Get the user input from the url  parameter
  const { input } = c.req.param()

  // Generate code based on the user input
  const code = await generateCode(input)

  // Return the generated code in the response
  return c.json({ code })
  // return input
})

// Start the hono server
serve(app.fetch)
