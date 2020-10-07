<template>
  <div class="grid-area">
      <table v-for="funcao in tabela" :key="funcao.id">
          <thead class="flex">
                <th colspan="4">
                    {{funcao.nome}}
                </th>
            </thead>
            <thead>
                <th class="head">
                    STATUS
                </th>
                <th class="head">
                    Quantidade
                </th>
                <th class="head">
                    Valor Unitário
                </th>
                <th class="head">
                    TOTAL
                </th>
            </thead>
            <tbody>
                <tr v-for="status in funcao.PPU" :key="status.id">
                    <td class="status">{{status.nome}}</td>
                    <td class="data">{{status.quantidade}}</td>
                    <td class="data" v-money>{{status.valor}}</td>
                    <td class="data" v-money>{{status.quantidade * status.valor}}</td>
                </tr>
                <tr>
                    <td colspan="3" class="total">TOTAL</td>
                    <td class="totalvalue" v-money>{{funcao.total}}</td>
                </tr>
            </tbody>
      </table>
      <table class="linha">
          <thead>
              <th class="head" v-for="tag in total.areas" :key="tag.id">{{tag}}</th>
              <th class="head total">TOTAL</th>
          </thead>
          <tbody>
              <tr>
                  <td v-money class="data" v-for="valor in total.valores" :key="valor.id">{{valor}}</td>
                  <td v-money class="totalvalue">{{total.total}}</td>
              </tr>
             
          </tbody>
      </table>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
    data(){
        return{
            tabela: {},
            total: {}
        }
    },
    methods:{
        montaArrayParaTabela(funcao,precos){
            const status = this.somaStatusIguais(funcao)
            return Object.keys(status).map(chave => {
                return {
                    nome: chave,
                    quantidade: status[chave],
                    valor: precos[chave] == undefined ? 0 : precos[chave]
                }
            })
        },
        montaTotal(PPU){
            return PPU.reduce((total,obj) => {
                return total + obj.quantidade*obj.valor
            },0)
        },
        somaStatusIguais(funcao){
            return funcao.reduce((obj,valor) => {
                if(obj[valor] == undefined){
                    obj[valor] = 1
                }
                else{
                    obj[valor]++
                }
                return obj
            },{})
        }
    },
    async mounted(){
        const status = await fetch("http://localhost:3003/status").then(response => response.json())
        const valorPorStatus = await fetch("http://localhost:3003/statusValor").then(response => response.json())
        const funcoes = Object.keys(status)
        const tabela = funcoes.map(chave => {
            const PPU = this.montaArrayParaTabela(status[chave],valorPorStatus[chave])
            return {
                nome: chave,
                PPU: PPU,
                total: this.montaTotal(PPU)

            }
        })
        this.total = {
            areas: tabela.map((obj) => {return obj.nome}),
            valores: tabela.map((obj) => {return obj.total}),
            total: tabela.map((obj) => {return obj.total}).reduce((sum,valor) => { return sum+valor})
        }
        this.tabela = tabela
    }
}

Vue.directive('money',{
    inserted(el){
        console.log('entrou aqui')
        let valor = parseFloat(el.innerHTML).toFixed(2) + ''
        valor = valor.replace('.',',')
        if(valor.match(/^\d$/)){
            valor += ',00'
        }
        else if(valor.match(/^\d,\d$/)){
            valor += '0'
        }

        valor = valor.replace(/(\d)(?=(\d{3})+,)/,'$1.')
        el.innerHTML = valor
    }
})
</script>

<style>
.grid-area{
    display: grid;
    padding-top: 30px;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 20px;
    row-gap: 20px;
    grid-template-rows: repeat(auto-fill,auto)
}

.head{
    border-style:solid;
    padding: 2px;
    border-width: 1px;
    background-color:lightcyan;
}

.status{
    background-color:lightcoral;
}

.linha{
    grid-column: 1/ span 3;
}

.data{
    background-color: lightgrey;
}

.total{
    background-color:rgb(117, 211, 117);
}

.totalvalue{
    background-color: rgb(157, 247, 242);
}
td{
    border-style: solid;
    border-width: 1px;
}
</style>