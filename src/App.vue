<template>
  <div id="app">
    <div class="table-wrapper">
      <table v-if="atual == 'status'" id="status">
      <thead>
        <th :colspan="tabela[0][0].status.length + 1">Status dos Funcionários</th>
      </thead>
       <tbody v-for="funcao in tabela" :key="funcao.id">
         <tr>
           <th class="profissao" :colspan="tamanho + 1">{{funcao[0].job}}</th>
         </tr>
         <tr>
           <th class="nome">Nome</th>
           <th class="status" v-for="numero in tamanho" :key="numero.id">
             {{numero}}
           </th>
         </tr>
         <tr v-for="funcionario in funcao" :key="funcionario.id">
           <td>{{funcionario.nome}}</td>
           <td v-for="status in funcionario.status" :style="pegaCor(status)" :key="status.id">
             {{status}}
           </td>
         </tr>
         <tr><br></tr>
       </tbody>
    </table>
    <table v-if="atual == 'hora extra'" id="hora-extra">
      <thead>
        <th :colspan="tabela[0][0].status.length + 1">Hora Extra dos Funcionários</th>
      </thead>
       <tbody v-for="funcao in tabela" :key="funcao.id">
         <tr>
           <th class="profissao" :colspan="tamanho + 1">{{funcao[0].job}}</th>
         </tr>
         <tr>
           <th class="nome">Nome</th>
           <th class="status" v-for="numero in tamanho" :key="numero.id">
             <span v-if="numero < 10" class="invisivel">0</span>
             {{numero}}
           </th>
         </tr>
         <tr v-for="funcionario in funcao" :key="funcionario.id">
           <td>{{funcionario.nome}}</td>
           <td class="hora" v-for="extra in funcionario.extra" :key="extra.id">
             {{extra}}
           </td>
         </tr>
         <tr><br></tr>
       </tbody>
    </table>
    <table v-if="atual == 'valores'" id="valores">
      <!-- <thead>
        <th :colspan="tamanho + 1">Status x PPU</th>
      </thead> -->

       <tbody v-for="funcao in tabela" :key="funcao.id">
         <tr>
           <th class="profissao" :colspan="tamanho + 1">{{funcao[0].job}}</th>
         </tr>
         <tr>
           <th class="nome">Nome</th>
           <th class="status" v-for="numero in tamanho" :key="numero.id">
             {{numero}}
           </th>
         </tr>
         <tr v-for="funcionario in funcao" :key="funcionario.id">
           <td>{{funcionario.nome}}</td>
           <td v-money class="hora" v-for="(extra,index) in funcionario.extra" :key="extra.id">
             {{calcularValor(extra,index,funcionario)}}
           </td>
         </tr>
         <tr> 
           <td>TOTAL</td>
           <td v-money v-for="valor in criaTotal(funcao)" :key="valor.id">{{valor}}</td>
         </tr>
         <tr><br></tr>
       </tbody>
       <tbody>
         <tr>
           <td><br></td>
           <th class="status" v-for="numero in tabela[0][0].status.length" :key="numero.id">
             {{numero}}
           </th>
         </tr>
         <tr>
           <td>TOTAL</td>
           <td v-money v-for="valor in somaTodos()" :key="valor.id">{{valor}}</td>
         </tr>
         <tr><br></tr>
       </tbody>
    </table>
    </div>
    <div id="menu-botoes">
      <div>
        <button type="button" class="btn btn-secondary" @click="atual='status'">Status</button>
      <button type="button" class="btn btn-secondary" @click="atual='hora extra'">Hora Extra</button>
      <button id="botaoInicial" type="button" class="btn btn-secondary" @click="atual='valores'">Valores</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "App",
  data() {
    return {
      tabela: [],
      cores: {},
      he: {},
      atual: 'valores',
      tamanho: 0
    }
  },
  methods: {
    pegaCor(status){
      if(this.cores[status] != undefined){
        return {
        "background-color": this.cores[status].color
        }
      }
      return {}
      
    },
    calcularValor(extra,index,funcionario){
      const status = funcionario.status[index]
      const funcao = funcionario.job
      if(this.he[funcao][status] != undefined){
        return (parseFloat(extra * this.he[funcao][status].extra) + parseFloat(this.he[funcao][status].fixo)).toFixed(2)
      }
      return 0
    },
    criaTotal(funcao){
      const total = funcao[0].status.map(() => 0)
      for(let funcionario of funcao){
        for(let index in total){
          total[index] += (this.calcularValor(funcionario.extra[index],index,funcionario)*1)
        }
      }
      return total
    },
    somaTodos(){
      const funcoes = Object.keys(this.tabela)
      const inicio = this.tabela[funcoes[0]][0].status.map(() => 0)
      return funcoes.reduce((soma,funcao) => {
        const total = this.criaTotal(this.tabela[funcao])
        soma = soma.map((atual, index) => {
          return atual + total[index]*1
        })
        
        return soma
      },inicio)
    }
  },
  async mounted() {
    const escala = await fetch(this.$store.getters.link('escala',this.$route.params)).then(response => response.json())
    const cores = await fetch(this.$store.getters.link('cor',this.$route.params)).then(response => response.json())
    .then(cores => {
      return cores.reduce((obj,cor) => {
        obj[cor.name] = cor
        return obj
      },{})
    })
    const he = await fetch(this.$store.getters.link('hora',this.$route.params)).then(response => response.json())
    const objFuncoes = escala.reduce((obj,funcionario) => {
      if(obj[funcionario.job] == undefined){
        obj[funcionario.job] = []
      }
      obj[funcionario.job].push({
        job: funcionario.job,
        nome: funcionario.user,
        status: funcionario.status,
        extra: funcionario.extra
      })
      return obj
    },{})
    this.cores = cores
    this.he = he
    this.tabela = Object.values(objFuncoes)
    this.tamanho = this.tabela[0][0].status.length
    
  }
};

Vue.directive("money", {
  inserted(el) {
    let valor = parseFloat(el.innerHTML).toFixed(2) + "";
    valor = valor.replace(".", ",");
    if (valor.match(/^\d$/)) {
      valor += ",00";
    } else if (valor.match(/^\d,\d$/)) {
      valor += "0";
    }

    valor = valor.replace(/(\d)(?=(\d{3})+,)/g, "$1.");
    el.innerHTML = valor;
  },
});
</script>

<style>



#app {
  display: grid;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  grid-template-rows: auto 1fr;
}

#valores{
  font-size: 0.75rem;
}

#status{
  font-size: 0.9rem;
}

#hora-extra{
  font-size: 0.9rem;
  width: 100%;
}


td,th{
  border-style: solid;
  overflow: hidden;
  font-size: inherit;
}

.profissao{
  background-color: rgb(66, 196, 152);
}

.nome{
  background-color:  rgb(187, 187, 187);
}


#hora-extra > tbody > tr > th{
  width:10px !important;
  white-space: nowrap;
}

#menu-botoes{
  position: fixed;
  width: 100%;

  bottom: 0;
  margin-bottom: 5px;
  right: 0;
  display: flex;
  justify-content: center;
}


#menu-botoes > button{
  margin-right:5px
}

.table-wrapper{
  width: 100vw;
  overflow: auto;
  margin-bottom: 20px;
  padding:10px;
}

.invisivel{
  color: white;
}

.hora{
  background-color: rgb(160, 160, 160);
} 

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
  border-radius: 50px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>
