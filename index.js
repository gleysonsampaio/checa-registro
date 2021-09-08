var express = require('express');
var app = express();
const serverPort = 3000;

app.get('/:id', async function (req, res) {
    var domainToSearch = req.params.id
    var disponivel = false;
    var disponivelMsg = "Domínio não disponível";
    const puppeteer = require("puppeteer");
    // const domainToSearch = process.argv[2];
    const browser = await puppeteer.launch({ headless: true });
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
    console.log("Servidor ativo:", serverPort);
});