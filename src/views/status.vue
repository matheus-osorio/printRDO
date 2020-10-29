<template>
  <div id="status">
      <table class="tabela">
          <tbody v-for="(setor,index) in tabela" :key="setor.id">
            <tr class="setor">
                <th class="make-25">{{setores[index]}}</th>        
            </tr>  
            <tr v-for="linha in criaSetor(setor)" :key="linha.id">
                <td v-for="valor in linha" :class="valor.class" :colpan="valor.colspan" :style="valor.style" :key="valor.id">
                    {{valor.valor}}
                </td>
            </tr>
          </tbody>
      </table>
  </div>
</template>

<script>
import Vue from 'vue'
// import nomseq from '../components/nomeESequencia'

export default {
    props:['tabela','tamanho','cores','setores','periodo'],
    components:{
        // nomseq
    },
    methods:{
        defineCor(status){
            return {
                "background-color": this.cores[status] == undefined ? '' : this.cores[status].color
            }
        },
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
                style: {}
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
                setor[func].forEach(funcionario => {
                    let valores = [
                        {
                            class:'nome',
                            style: {},
                            colspan: 1,
                            valor: funcionario.nome
                        }
                    ]

                    const st = funcionario.status.map(status => {
                        return {
                            class:'',
                            style: this.defineCor(status),
                            colspan: 1,
                            valor: status
                        }
                    })

                    valores = valores.concat(st)
                    retorno.push(valores)
                })
            })
            return retorno
        },
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

.funcao{
    background-color: #006064;
    color: white;
}

.nome{
   background-color: #fff9c4 ; 
}

.fullscreen{
    width: 1308px !important;
}

.status{
    background-color: #00acc1;
}

.tabela{
    border-style: solid;
    border-color:black;
    width: 100%;
    font-size: 0.9rem;
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