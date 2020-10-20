<template>
  <div id="status">
      <table class="tabela-valores">
          <tbody v-for="(setor,index) in tabela" :key="setor.id">
            <tr class="setor">
                <th :colspan="tamanho + 1">{{setores[index]}}</th>        
            </tr>  

            <span v-for="funcao in Object.keys(setor)" :key="funcao.id" v-remove>
            <tr>
            <th class="funcao" :colspan="tamanho + 1" >{{funcao}} - {{setor[funcao][0].setor}}</th>
            </tr> 
           <nomseq :tamanho="tamanho"/>
            <tr  v-for="funcionario in setor[funcao]" :key="funcionario.id">
                <td class="nome">{{funcionario.nome}}</td>
                <td v-for="(extra,index) in funcionario.extra" :key="extra.id" v-money>{{calcularValor(extra,index,funcionario)}}</td>
            </tr>
            <tr>
                <td>TOTAL</td>
                <td v-for="total in criaTotal(setor[funcao])" :key="total.id" v-money>{{total}}</td>
            </tr>
            </span>           
          </tbody>
      </table>
  </div>
</template>

<script>
import Vue from 'vue'
import nomseq from '../components/nomeESequencia'

export default {
    props:['tabela','tamanho','setores','he'],
    components:{
        nomseq
    },
    methods:{
        calcularValor(extra, index, funcionario) {
        const status = funcionario.status[index];
        const funcao = funcionario.job;
            if (this.he[funcao][status] != undefined) {
                return (
                parseFloat(extra * this.he[funcao][status].extra) +
                parseFloat(this.he[funcao][status].fixo)
                ).toFixed(2);
            }
        return 0;
        },
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

        criaTotal(funcao) {
        const total = funcao[0].status.map(() => 0);
            for (let funcionario of funcao) {
                for (let index in total) {
                total[index] +=
                    this.calcularValor(funcionario.extra[index], index, funcionario) *
                    1;
                }
            }
            return total.map(valor => this.dinheiro(valor));
        },
    },
    mounted(){
        
    }
}

Vue.directive('remove',{
    inserted(el){
        const sub = el.innerHTML
        const parent = el.parentNode
        parent.innerHTML = parent.innerHTML.replace(/<span[.\n]*<\/span>/,sub)
        
        
        
    }
})


</script>

<style>
#status{
    height: 100%;
    padding: 15px;
}

.setor{
    background-color: #81c784;
}

.sticky{
    position: sticky;
    top: 0;
}

.funcao{
    background-color: #006064;
    color: white;
}

.nome{
   background-color: #fff9c4 ; 
}

.status{
    background-color: #00acc1;
}

.tabela-valores{
    border-style: solid;
    border-color:black;
    width: 100%;
    font-size: 0.6rem;
}

.tabela > thead{
    border-style: solid;
    border-color:black;
}

.tabela > tbody > tr{
    border-style: solid;
    border-color:black;
}

.tabela > tbody > tr > th,td{
    border-style: solid;
    border-color:black;
}




</style>