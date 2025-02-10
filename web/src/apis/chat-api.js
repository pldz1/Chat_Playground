

async function chatAPI(endpoint, apikey, deployment) {
    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
    useProxy(client);
  
    // 请求
    const results = await client.chat.completions.create({
      messages: [{ role: "user", content: [{ type: "text", text: "Hello?" }] }],
      stream: true,
    });
  
    for await (const chunk of results) {
      console.log(chunk.choices[0]?.delta?.content || "");
    }
  }