<template>
  <tr :key="chave">
    <th class="nome-data">{{colocar}}</th>
    <th class="nome-data" id="data" v-for="numero in criaMes" :key="numero.id">{{ numero }}</th>
  </tr>
</template>

<script>
export default {
    data(){
      return {
        mes: [],
        chave: 0,
        colocar: ''
      }
    },
    computed:{
      criaMes(){
        const periodo = this.periodo
        console.log('periodo:',periodo)
          let novo = 0
          const mes = []
          for(let i = 0;i<this.tamanho;i++){
            if(i > periodo.range.totalDias){
              novo = i - periodo.range.totalDias
            }
            else{
              novo = i + periodo.range.inicio
            }
            mes.push(novo)
          }
            console.log('mes:',mes)
          return mes
      }
    },
    mounted(){
      if(this.nome != undefined){
        this.colocar = this.nome
      }
      
    },
    props:['tamanho','periodo','nome'],
};
</script>

<style>
.nome-data{
  border-style: solid;
    border-color:black;
}
</style>