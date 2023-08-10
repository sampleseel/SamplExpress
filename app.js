const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
const server = require('./server')


//Pago Tarjeta
const flowtarjeta = addKeyword("tarjeta").addAnswer(
    "En un momento te mando el link de pago."
  );
  
  //Orden
  const flowOrder = addKeyword([EVENTS.ORDER])
  /* .addAnswer('Este mensaje envia tres botones', {
      buttons: [{ body: 'Boton 1' }, { body: 'Boton 2' }, { body: 'Boton 3' }],
  }) */
    .addAnswer("Muy bien", { capture: false }, (ctx) => {
      console.log(ctx.message);
      console.log(ctx.message.orderMessage.orderId)
      console.log(ctx.message.orderMessage.itemCount)
      console.log(ctx.message.orderMessage.totalAmount1000)
    }) 
    .addAnswer(["Como va a ser tu forma de pago?","*Efectivo* o *Tarjeta*"],
    null,
    null,
    [flowtarjeta]);
      
  
  //Second
  const flowCurso = addKeyword(["curso", "cursos", "interesa"])
    .addAnswer("Te comparto el link con la cartera de cursos disponibles")
    .addAnswer("🙌 https://wa.me/c/5215537700574", { capture: false }, null, [
      flowOrder,
    ]);
  
  //First
  const flowPrincipal = addKeyword("hola")
    .addAnswer("*Bienvenid@*")
    .addAnswer(
      [
        "Te muestro los servicios disponibles:",
        "*Cursos:* conoce nuestra cartera completa",
        "*Consultoría:* te ayudamos en cualquier tema que tengas",
        "*Otro:* buscas algo más especifico?",
      ],
      null,
      null,
      [flowCurso]
    );

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    server.main();
}

main()
