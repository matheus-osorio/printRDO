const axios = require('axios')


axios.get('http://localhost:3003/escala')
.then(response => response.data)
.then(escala => {
    axios.get('http://localhost:3003/cor')
    .then(response => response.data)
    .then(cor => {
        const cores = cor.map(c => c.name)
        const funcoes = escala.map(f => f.job)
        const obj = {}

        for(funcao of funcoes){
            for(cor of cores){
                if(obj[funcao] == undefined){
                    obj[funcao] = {}
                }
                obj[funcao][cor] = {
                    fixo: (100)*1 + (parseFloat(Math.random()*100000).toFixed(2) % 300).toFixed(2)*1,
                    extra: (parseFloat(Math.random()*100000).toFixed(2) % 30).toFixed(2)
                }
            }
        }

        console.log(JSON.stringify(obj))
    })
})
