<template>
  <div id="status">
      <table class="tabela">
          <tbody v-for="(setor,index) in tabela" :key="setor.id">
            <tr class="setor">
                <th :colspan="tamanho + 1">{{setores[index]}}</th>        
            </tr>  

            <span v-for="funcao in Object.keys(setor)" :key="funcao.id" v-remove>
            <tr>
            <th class="funcao" :colspan="tamanho + 1" >{{funcao}} - {{setor[funcao][0].setor}}</th>
            </tr> 
           <nomseq :tamanho="tamanho" :periodo="periodo"/>
            <tr  v-for="funcionario in setor[funcao]" :key="funcionario.id">
                <td class="nome">{{funcionario.nome}}</td>
                <td v-for="extra in funcionario.extra" :key="extra.id">{{extra}}</td>
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
    props:['tabela','tamanho','setores','periodo'],
    components:{
        nomseq
    },
    methods:{
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

.status{
    background-color: #00acc1;
}

.sticky{
    position: sticky;
    top: 0;
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