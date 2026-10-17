I want to build an HTML, CSS, and JavaScript landing page for my bill-splitting app, where I should be able to upload a restaurant bill or receipt image and see how the bill can be split among friends.

I’m going to call this project **“Split Snap — 0 to Shipped.”**

The app should allow users to upload a restaurant bill image or PDF and display a mock analysis of the bill. I only want to see the extracted food items, their prices, the total bill amount, and how much each person needs to pay.

The UI should show:

* **Bill Upload:** A drag-and-drop area where users can upload a receipt image or PDF.
* **Extracted Items:** A list of food items and their prices.
* **Total Bill:** The subtotal, tax, tip, and final bill amount.
* **Split Among Friends:** Allow users to specify the number of people sharing the bill.
* **Individual Shares:** Show how much each person needs to pay.
* **Mock Results:** Display sample extracted items and calculated amounts so the interface works as a demo.

This is going to be a **mock design**, so just build the frontend using HTML, CSS, and vanilla JavaScript. No backend server, database, or real AI integration is needed.

Make the design modern, clean, responsive, and user-friendly. Use a polished dashboard layout with clear sections, attractive colors, rounded cards, and intuitive upload and bill-splitting interactions.

The goal is to build a working frontend prototype for **Split Snap — 0 to Shipped**, where users can upload a sample receipt, view mock extracted items, and see how the bill is split among friends.

I want to convert this entire project into a react project

The application should allow users to upload a restaurant bill or receipt as a PDF or image and split the bill among friends. The app should display the extracted food items, prices, total bill amount, and each person's share. The AI-powered receipt extraction feature will be added later, so for now, use mock data and JavaScript calculations to demonstrate the functionality. 

backend folder should container server.js, routes folder, controller folder, service folder, config folder, middleware folder and utils.js

backend folder should container server.js, routes folder, controller folder, service folder, config folder, middleware folder and utils.js

Connect my Split Snap website to Labd AI using the appropriate API integration. First, inspect my existing project structure and identify the correct files to update. Verify the official Labd AI API documentation, authentication method, and supported endpoints before implementing the integration. Store API credentials securely in backend environment variables and never expose API keys in frontend code. Integrate Labd AI into my existing Split Snap website without breaking its current features or design. Implement the required AI functionality, loading states, error handling, and API response processing. Reuse the existing framework and components wherever possible. Test the integration and provide clear instructions for running the project locally in VS Code. If Labd AI API documentation or credentials are unavailable, ask me for the official documentation link before proceeding. Do not invent API endpoints or authentication formats.


Quickstart: call labd from a program
Send the conversation so far as messages, each a role (user or assistant) and its content, ending on the user's turn. labd answers once, in JSON: message.content is the reply and credits.percentLeft is what is left of your allowance. Nothing is remembered between requests, so send the earlier turns yourself when you want a conversation.

curl https://agent.thedevlabs.io/v1/api/chat \
  -H "Authorization: Bearer $LABD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Explain closures in one paragraph."}]}'
const res = await fetch('https://agent.thedevlabs.io/v1/api/chat', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.LABD_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Explain closures in one paragraph.' }],
  }),
});
const { message, credits } = await res.json();
console.log(message.content, `${credits.percentLeft}% left`);
Keep the key on a server. labd does not answer browsers on other sites, so a key in a web page is a key anyone viewing it can copy and nothing you can use.
401 the key is wrong or revoked · 402 the allowance is used up · 403 the API is switched off · 429 too many requests this minute, wait and retry.
Every answer spends the same allowance as labd in the portal, your editor and your terminal.