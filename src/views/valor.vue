<template>
  <div id="valor">
      <table class="tabela">
          <tbody>
              <tr>
                  <td class="header">ÁREA</td>
                  <td class="header" v-for="dia in montaDias()" :key="dia.id">{{dia}}</td>
                  <td class="header" >TOTAL</td>
              </tr>
              <tr v-for="linha in montaObj()" :key="linha.id">
                  <td v-for="dado in linha" :key="dado.id" class="dados">
                     {{dado}}
                  </td>
              </tr>
              <tr>
                  <td class="total" v-for="valor in montaTotal()" :key="valor.id">{{valor}}</td>
              </tr>
          </tbody>
      </table>
  </div>
</template>

<script>
export default {
    props:['tabela','tamanho','setores','periodo','he'],
    methods:{
        dinheiro(valor){
            valor = parseFloat(valor).toFixed(2) + "";
            valor = valor.replace(".", ",");
            if (valor.match(/^\d$/)) {
            valor += ",00";
            } else if (valor.match(/^\d,\d$/)) {
            valor += "0";
            }

            valor = valor.replace(/(\d)(?=(\d{3})+,)/g, "$1.");
            return valor;
         },

        montaDias(){
            const tam = parseInt(this.tamanho)
            const inicio = parseInt(this.periodo.range.inicio)
            const mes = parseInt(this.periodo.range.totalDias)
            const arr = []
            for(let i=0;i<tam;i++){
                let valor = 0
                if(i<=mes){
                    valor = parseInt(inicio + i)
                }
                else{
                    valor = parseInt(i - mes)
                }

                arr.push(valor)
            }

            return arr
        },
        montaObj(montar = true){      
            const arrInicio = []
            const respostaFinal = []

            for(let i=0;i<this.tamanho;i++){arrInicio.push(0)}
            for(let area of this.tabela){

                for(let prof of Object.keys(area)){
                    let soma = undefined
                    soma = [...arrInicio]
                    for(let func of area[prof]){
                        for(let index in func.status){
                            let status = func.status[index]
                            let he = func.extra[index]
                            
                            let val = {fixo:0,extra:0}
                            if(this.he[prof] != undefined){
                                if(this.he[prof][status]){
                                    val = this.he[prof][status]
                                }
                            }
                            
                            
                            soma[index] += 1*parseFloat(val.fixo + val.extra * he)
                        }
                    }
                    console.log(soma.length)
                    soma.push(soma.reduce(((soma,atual) => soma + atual)))
                    respostaFinal.push([prof + ' - ' + area[prof][0].setor].concat(soma))
                    
                }
            }
            
            if(montar){
                return respostaFinal.map((linha,) => {
                return linha.map((valor,i) => {
                    if(i == 0){return valor}
                    return this.dinheiro(valor)
                })
                })
            }

            return respostaFinal
        },
        montaTotal(){
            const final = this.montaObj(false)
            
            let total = final.reduce((arr1,arr2) => {
                return arr1.map((val,i) => {
                    return val + arr2[i]
                })
            },final[0].map(() => 0))
            total = total.map(valor => this.dinheiro(valor))
            total[0] = 'TOTAL'
            return total
        }
    },

    mounted(){
        this.montaObj()
    }
}
</script>

<style>
#valor{
    width: 100%;
    padding: 15px 5px ;
}

.tabela{
    font-size: inherit;
    table-layout: fixed;
}

.tabela > tbody > tr > td{
    font-size: 0.5rem;
}

.dados:first-child{
    width: 20%;
    background-color: #fff9c4;
}
.dados:not(:first-child){
    background-color: lightgray;
}
.dados:last-child{
    font-weight: bold;
    width: 5%;
    background-color: lightcoral;
    font-size: 0.6rem !important;
}

.header:first-child{
    width: 14%;
}

.header:last-child{
    width: 5%;
    font-size: 0.6rem !important;
}

.total:last-child{
    font-weight: bolder;
    font-size: 0.7rem !important;
}

</style>