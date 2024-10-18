import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();


const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
});


async function criarPlPlayers() {
     const file = await openai.files.create({
          file: fs.createReadStream("pl-players.csv"),
          purpose: "assistants",
     })
     console.log("Arquivo pl-players.csv carregado.", file)
}

async function CriarAssitente() {

     const file = await openai.files.create({
          file: fs.createReadStream("pl.csv"),
          purpose: "assistants",
     })

     const assistant = await openai.beta.assistants.create({
          name: 'Sabe tudo de futebol',
          instructions: "Voce entende muito de tatica de futebol.",
          tools: [{ type: "code_interpreter" }],
          tool_resources: {
               "code_interpreter": {
                    "file_ids": [file.id]
               }
          },
          model: "gpt-3.5-turbo"
     })
     console.log("Assitente criado.", assistant)


}

// CriarAssitente()


async function createThread() {
     const thread = await openai.beta.threads.create()
     console.log("Thread criada:", thread)
}

async function Mensagem(text) {

     const message = await openai.beta.threads.messages.create(
          "thread_FdL9Yu9CLWbUf2Ub0O9ekR2z",
          {
               role: "user",
               content: text,
               attachments: [
                    {
                         file_id: "file-8hSaJzbIwWeU6DK4AtdT1VNK",
                         tools: [{ type: "code_interpreter" }]
                    }
               ]
          }
     )
     console.log("Mensagem enviada:", message)
}



async function run() {
     const run = openai.beta.threads.runs.stream("thread_FdL9Yu9CLWbUf2Ub0O9ekR2z", {
          assistant_id: "asst_cwK6XPyhsM1EEtoQ1KatukMq"
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
// Mensagem("Me fale quem foram os 10 maiores goleadores dessa temporada")
run()

// criarPlPlayers()