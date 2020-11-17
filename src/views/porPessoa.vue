<template>
  <div id="status">
      <table class="tabela-print">
          <tbody v-for="(setor,index) in tabela" :key="setor.id">
            <tr class="setor">
                <th :colspan="tamanho + 1">{{setores[index]}}</th>        
            </tr>  
            <tr v-for="(linha) in criaSetor(setor)" :key="linha.id">
                <td v-for="valor in linha" :class="valor.class" :colpan="valor.colspan" :style="valor.style" :key="valor.id">
                    {{valor.valor}}
                </td>
            </tr>
            <tr>
                <br>
            </tr>
            <nomseq :tamanho="tamanho" :periodo="periodo" nome="TOTAL"/>
            <tr>
                <td>TOTAL</td>
                <td v-for="valor in calculaSomaTotal()" :key="valor.id">{{valor}}</td>
            </tr>
            <!-- <tr class="setor">
                <th :colspan="tamanho + 1">{{setores[index]}}</th>        
            </tr>  

            <span v-for="funcao in Object.keys(setor)" :key="funcao.id" v-remove>
            <tr>
            <th class="funcao" :colspan="tamanho + 1" >{{funcao}} - {{setor[funcao][0].setor}}</th>
            </tr> 
           <nomseq :tamanho="tamanho" :periodo="periodo"/>
            <tr  v-for="funcionario in setor[funcao]" :key="funcionario.id">
                <td class="nome">{{funcionario.nome}}</td>
                <td v-for="(extra,index) in funcionario.extra" :key="extra.id" v-money>{{calcularValor(extra,index,funcionario)}}</td>
            </tr>
            <tr>
                <td>TOTAL</td>
                <td v-for="total in criaTotal(setor[funcao])" :key="total.id" v-money>{{total}}</td>
            </tr>
            </span>            -->
          </tbody>
      </table>
  </div>
</template>

<script>

import Vue from 'vue'
import nomseq from '../components/nomeESequencia'

export default {
    props:['tabela','tamanho','setores','he','periodo'],
    components:{
        nomseq
    },
    methods:{
        criaSetor(setor){
            const funcao = {
                colspan: this.tamanho + 1,
                class: 'funcao',
                style: {}
            }
            const mes = this.criaMes()
            mes.unshift('Nome')
            const data = {
                colpan: 1,
                class:  'nome-data',
            }
            const dataOBJ = mes.map(valor => {
                const dt = {...data}
                dt.valor = valor
                return dt
            })
            const retorno = []
            Object.keys(setor).forEach(func => {
                const f = {...funcao}
                f.valor = func + ' - ' + setor[func][0].setor
                retorno.push([f])
                retorno.push(dataOBJ)
                setor[func].forEach((funcionario,i) => {
                    let valores = [
                        {
                            class:'nome',
                            colspan: 1,
                            valor: funcionario.nome
                        }
                    ]

                    const st = funcionario.extra.map((extra,index) => {
                        return {
                            class:'',
                            colspan: 1,
                            valor: this.calcularValor(extra,index,setor[func][i])
                        }
                    })

                    valores = valores.concat(st)
                    retorno.push(valores)
                })

                    let total = [{
                            class:'',
                            colspan: 1,
                            valor: 'TOTAL:'
                    }]

                    const t = this.criaTotal(setor[func]).map((val) => {
                        return {
                            class: '',
                            colspan: 1,
                            valor: val
                        }
                    })
                    
                    total = total.concat(t)
                    retorno.push(total)
            })
            return retorno
        },
        criaMes(){
        const periodo = this.periodo
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
          return mes
      },
        calcularValor(extra, index, funcionario) {
        const status = funcionario.status[index];
        const funcao = funcionario.job;

        if(this.he[funcao] != undefined){
            if (this.he[funcao][status] != undefined) {
                return (
                parseFloat(extra * this.he[funcao][status].extra) +
                parseFloat(this.he[funcao][status].fixo)
                ).toFixed(2);
            }
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

        criaTotal(funcao,mascara=true) {
        const total = funcao[0].status.map(() => 0);
            for (let funcionario of funcao) {
                for (let index in total) {
                total[index] +=
                    this.calcularValor(funcionario.extra[index], index, funcionario) * 1;
                }
            }
            if(mascara){
                return total.map(valor => this.dinheiro(valor));
            }
            return total
        },
        calculaSomaTotal(){
            const tam = []
            for(let i=0;i<this.tamanho;i++){
                tam.push(0)
            }
            
            const total = this.tabela.reduce((soma,setor) => {
                Object.keys(setor).forEach((chave) => {
                    const val = this.criaTotal(setor[chave],false)                    
                    soma = soma.map((valor,index) => valor + val[index])
                })
                return soma
            },tam)   
            
            return total.map(val => this.dinheiro(val))
        }
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
    width: 100%;
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
    width: 100%;
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