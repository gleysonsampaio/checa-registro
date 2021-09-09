require('dotenv/config');
var cors = require('cors');
var express = require('express');
var app = express();
app.use(cors());
const serverPort = process.env.PORT || 3333;

app.get('/', async function (req, res) {
    var domainToSearch = req.query.url;
    console.log("URL consultada:", domainToSearch);
    var disponivel = false;
    var disponivelMsg = "Domínio não disponível";
    if(domainToSearch == null || domainToSearch.length < 4){
        res.json({ sucesso: false, dominio: "Não informado", mensagem: "Informe o dominio em ?url=dominiodesejado.com.br" });
        return;
    }
    const puppeteer = require("puppeteer");
    // const domainToSearch = process.argv[2];
    const browser = await puppeteer.launch({
        headless: true, args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
    });
    const page = await browser.newPage();
    await page.goto("https://registro.br");
    await page.type("#is-avail-field", domainToSearch);
    await page.click("button[type=submit]");
    await page.waitForTimeout(1000);
    disponivel = await page.evaluate(() => {
        var retorno = false;
        const pageAvailable = document.querySelector('.is-avail-response-available');
        if (pageAvailable) retorno = true;
        return retorno;
    });
    if (disponivel) disponivelMsg = "Domínio DISPONÍVEL. Vamos nessa!";
    await page.screenshot({ path: 'domain.png' });
    await browser.close();
    res.json({ sucesso: disponivel, dominio: domainToSearch, mensagem: disponivelMsg });
});

app.listen(serverPort, function () {
    console.log("Servidor ativo - Porta:", serverPort);
});