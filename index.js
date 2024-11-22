import express from "express"
import fs from 'fs/promises'



const app = express();
app.use (express.json())

const PORT = 3000
app.listen(PORT,error=>{
    if(error){
        console.error("Doslo je do greske", error)

    }else{
        console.log(`Server runa na http://localhost:${PORT}`)
    }
})


app.get('/zaposlenici', async (req,res)=>{
    let trazenoIme = req.query.ime;
    let trazenaPozicija = req.query.pozicija;
    let sortirajPoGodinama = req.query.sortirajPoGodinama;
    try{
        const data =  await fs.readFile('zaposlenici.json', 'utf8')
        const zaposlenici = JSON.parse(data)

        if (sortirajPoGodinama === 'silazno'){
            zaposlenici.sort((a,b)=>a.godineStaza - b.godineStaza)
            res.status(200).send(zaposlenici)
        }else if (sortirajPoGodinama === 'uzlazno'){
            zaposlenici.sort((a,b)=>b.godineStaza - a.godineStaza)
            res.status(200).send(zaposlenici)
        }
    
        if (trazenoIme || trazenaPozicija){
            const filtriraniZaposlenici = zaposlenici.filter(z => z.ime === trazenoIme || z.pozicija === trazenaPozicija)
            res.status(200).send(filtriraniZaposlenici)
        }else{
            res.status(200).send(zaposlenici)
        }
    }
    catch(error){
        console.error("Greska u citanju datoteke", error)
        res.status(500).send('Error reading file')
    }
});

app.get('/zaposlenici/:id', async (req,res)=>{
    const zaposlenikId = parseInt(req.params.id)
    try{
        const data =  await fs.readFile('zaposlenici.json', 'utf8')
        const zaposlenici = JSON.parse(data)
        const rez = zaposlenici.find(z => z.id === zaposlenikId)
            if(rez){
                res.status(200).json(rez)
            }else{
                res.status(404).send('Zaposlenik nije pronađen');
            }
    }
    catch (error){
        console.error("Greska u citanju datoteke", error)
        res.status(500).send('Error reading file')
    }

})

app.put('/addZaposlenik', async(req,res) => {
    const zaposlenik = req.body
    if (Object.keys(zaposlenik).length === 0){
        return res.status(400).send('Niste poslali podatke.');
    }
    try{    
        const data =  await fs.readFile('zaposlenici.json', 'utf8')
        const zaposlenici = JSON.parse(data)
        zaposlenici.push(zaposlenik)

        console.log(zaposlenici)
        await fs.writeFile('zaposlenici.json', JSON.stringify(zaposlenici));
        res.status(200).send("Zaposlenik uspješno dodan")
    }
    catch (error){
        console.error("Greska u dodavanju zaposlenika", error)
        res.status(500).send('Greska u dodavanju zaposlenika')
    }
   
});

