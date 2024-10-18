import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();


const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
});

async function criarAssistente() {
     const assistant = await openai.beta.assistants.create({
          name: 'Sabe tudo de futebol',
          instructions: "Voce entende muito de tatica de futebol.",
          tools: [{ type: "code_interpreter" }],
          model: "gpt-3.5-turbo"
     })
     console.log("Assitente criado.", assistant)
}

async function createThread() {
     const thread = await openai.beta.threads.create();
     console.log("Thread criada:", thread)
}
// createThread()
async function mensagem(text) {


     const message = await openai.beta.threads.messages.create(
          "thread_dcToOhg1MaXOhwYYbnP9wsGY",
          {
               role: "user",
               content: text
          }
     )
     console.log("Mensagem enviada:", message)
}


console.log("Mensagem")
mensagem("Ok, e de basquete, voce entende?")
console.log("fim msg")




async function run() {
     const run = openai.beta.threads.runs.stream("thread_dcToOhg1MaXOhwYYbnP9wsGY", {
          assistant_id: "asst_4pw1omqr0HJHQ4f7QQaufB7L"
     })
          .on('textCreated', (text) => process.stdout.write('\nassistant > '))
          .on('textDelta', (textDelta, snapshot) => process.stdout.write(textDelta.value))
          .on('toolCallCreated', (toolCall) => process.stdout.write(`\nassistant > ${toolCall.type}\n\n`))
          .on('toolCallDelta', (toolCallDelta, snapshot) => {
               if (toolCallDelta.type === 'code_interpreter') {
                    if (toolCallDelta.code_interpreter.input) {
                         process.stdout.write(toolCallDelta.code_interpreter.input);
                    }
                    if (toolCallDelta.code_interpreter.outputs) {
                         process.stdout.write("\noutput >\n");
                         toolCallDelta.code_interpreter.outputs.forEach(output => {
                              if (output.type === "logs") {
                                   process.stdout.write(`\n${output.logs}\n`);
                              }
                         });
                    }
               }
          });
}
run()