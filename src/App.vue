<template>
  <div id="app" v-if="calculado" :key="chave">
    <div id="slide-activator"></div>
    <div id="menu">
      <div class="dropdown-wrapper">
        <div class="dropdown">
          <b>SETOR</b>
        </div>
        <div class="dropdown-content">
          <div
            class="dropdown-items"
            :class="{ ativo: ativos.setor == -1 }"
            @click="filtra('setor',-1)"
          ></div>
          <div
            class="dropdown-items"
            v-for="(setor, index) in setores"
            :key="setor.id"
            :class="{ ativo: ativos.setor == index }"
            @click="filtra('setor',index)"
          >
            <span>{{ setor }}</span>
          </div>
        </div>
      </div>

      <div class="dropdown-wrapper">
        <div class="dropdown">
          <b>FUNÇÃO</b>
        </div>
        <div class="dropdown-content">
          <div
            class="dropdown-items"
            :class="{ ativo: ativos.funcao == -1 }"
            @click="filtra('funcao',-1)"
          ></div>
          <div
            class="dropdown-items"
            v-for="(funcao, index) in funcoes"
            :key="funcao.id"
            :class="{ ativo: ativos.funcao == index }"
            @click="filtra('funcao',index)"
          >
            <span>{{ funcao }}</span>
          </div>
        </div>
      </div>
      <div></div>
      <div class="vertical-line"></div>
      <div class="tabela-seletor">
        <router-link :to="{name:'status', params:$route.params}" class="area" :class="{current: $route.name == 'status'}">
          <b>STATUS</b>
        </router-link>
        <router-link  :to="{name:'extra', params:{tabela}}" class="area" :class="{current: $route.name == 'extra'}">
          <b>HORA EXTRA</b>
        </router-link >
        <router-link :to="{name:'porPessoa', params:{tabela}}" class="area" :class="{current: $route.name == 'porPessoa'}">
          <b>POR PESSOA</b>
        </router-link>
        <router-link :to="{name:'valor', params:{tabela}}" class="area" :class="{current: $route.name == 'valor'}">
          <b>VALORES</b>
        </router-link>
      </div>

      <div class="vertical-line">
      </div>
      <div>
        <button class="area" @click="modoImpressao">Modo Impressão</button>
        <button class="area" @click="Imprimir">Imprimir</button>
      </div>
    </div>
    <div>
      <router-view :periodo="periodo" :tabela="tabela" :tamanho="tamanho" :cores="cores" :setores="strFiltr" :he="he"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      ativos: {
        setor: -1,
        funcao: -1
      },
      tabela: [],
      total: [],
      cores: {},
      he: {},
      atual: "valores",
      tamanho: 0,
      setores: [],
      strFiltr: [],
      funcoes: [],
      chave:0,
      periodo: [],
      calculado:false
    };
  },
  methods: {
    modoImpressao(){
      const rota = this.$route.params
      const nome = this.$route.name
      const novaRota = `/#/${nome}/print/${rota.estab}/${rota.periodo}`

      window.location.href = novaRota
    },
    Imprimir(){
      const menu = document.querySelector('#menu')
      menu.classList.add('noshow')
      window.print()
      menu.classList.remove('noshow')
    },
    filtra(tipo,index){
      this.ativos[tipo] = index
      let func = this.total
      if(this.ativos.setor >= 0){
        func = func.filter((f) => f.setor == this.setores[this.ativos.setor])
      }
       if(this.ativos.funcao >= 0){
        func = func.filter((f) => f.job == this.funcoes[this.ativos.funcao])
      }
      func = this.criaObjEscala(func)
      this.strFiltr = Object.keys(func)
      console.log(this.strFiltr)
      this.tabela = Object.values(func)
      this.chave += 1
    },

    pegaCor(status) {
      if (this.cores[status] != undefined) {
        return {
          "background-color": this.cores[status].color,
        };
      }
      return {};
    },

    criaObjEscala(escala){
      return escala.reduce((obj, funcionario) => {
        if (obj[funcionario.setor] == undefined) {
          obj[funcionario.setor] = {};
        }
        if(obj[funcionario.setor][funcionario.job] == undefined){
          obj[funcionario.setor][funcionario.job] = []
        }
        obj[funcionario.setor][funcionario.job].push({
          job: funcionario.job,
          setor: funcionario.setor,
          nome: funcionario.user,
          status: funcionario.status,
          extra: funcionario.extra,
          show: true
        });
        return obj;
      }, {});
    },

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
    criaTotal(funcao) {
      const total = funcao[0].status.map(() => 0);
      for (let funcionario of funcao) {
        for (let index in total) {
          total[index] +=
            this.calcularValor(funcionario.extra[index], index, funcionario) *
            1;
        }
      }
      return total;
    },

    somaTodos() {
      const funcoes = Object.keys(this.tabela);
      const inicio = this.tabela[funcoes[0]][0].status.map(() => 0);
      return funcoes.reduce((soma, funcao) => {
        const total = this.criaTotal(this.tabela[funcao]);
        soma = soma.map((atual, index) => {
          return atual + total[index] * 1;
        });
        return soma;
      }, inicio);
    }
  },
  async mounted() {
    const periodo = await fetch(this.$store.getters.link('periodo',this.$route.params)).then(response => response.json())
    const escala = await fetch(
      this.$store.getters.link("escala", this.$route.params)
    ).then((response) => response.json())
    .then(obj => {
      return obj.map(o => {
        o.show = true
        return o
      })
    });
    const cores = await fetch(
      this.$store.getters.link("cor", this.$route.params)
    )
      .then((response) => response.json())
      .then((cores) => {
        return cores.reduce((obj, cor) => {
          obj[cor.name] = cor;
          return obj;
        }, {});
      });
    let setores = escala.map((func) => func.setor);
    let funcoes = escala.map((func) => func.job);
    setores = Array.from(new Set(setores));
    funcoes = Array.from(new Set(funcoes));
    const he = await fetch(
      this.$store.getters.link("hora", this.$route.params)
    ).then((response) => response.json());
    const objFuncoes = this.criaObjEscala(escala)
    this.cores = cores;
    this.he = he;
    this.tabela = Object.values(objFuncoes);
    this.tamanho = escala[0].status.length;
    this.total = escala;
    this.setores = setores;
    this.funcoes = funcoes;
    this.strFiltr = setores;
    this.calculado = true;
    this.periodo = periodo;
    console.log('acabou')
  },
};
</script>

<style>
.dropdown {
  position: relative;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-radius: 5px;
  border-color: #eeeeee;
  color: #eeeeee;
}

.noshow{
  display: none !important;
}
.dropdown-content {
  display: none;
  position: absolute;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 0px 0px 0px 0px;
  overflow: auto;
  max-height: 300px;
  z-index: 20;
}
.dropdown-content:active {
  display: none;
}
.dropdown-wrapper:hover > .dropdown-content {
  display: block;
}
.dropdown:hover ~ .dropdown-content {
  display: block;
}
.ativo {
  background-color: rgb(160, 160, 160) !important;
}
.dropdown-items {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 100%;
  background-color: #f9f9f9;
  text-align: center;
  height: 50px;
}
.dropdown-items:hover {
  background-color: rgba(187, 187, 187, 0.986);
}
.vertical-line{
  border-left: solid;
  border-width: 3px;
  border-color: #eeeeee;
}
.tabela-seletor{
  display: flex;
  column-gap: 10px;
  padding-left: 10px;
}
.area{
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-radius: 5px;
  padding: 0px 20px;
  border-color: #006064;
  color: #006064;
  text-decoration: none;
}
.area:hover{
  text-decoration: none;
  color: #006064;
}
.current{
  border-color:#e0f7fa;
  color:#e0f7fa !important;
}
#app {
  display: grid;
  height: 100vh;
  width: 100vw;
  overflow: scroll;
  grid-template-rows: auto 1fr;
}
#menu {
  position: absolute;
  transition: 0.3s;
  display: grid;
  grid-template-columns: 80px 80px 15px 5px 1fr 15px 1fr;
  padding: 5px;
  column-gap: 5px;
  row-gap: 5px;
  top: -60px;
  height: 60px;
  width: 100%;
  -webkit-animation: slide 0.5s forwards;
  -webkit-animation-delay: 2s;
  z-index: 15;
  background: rgb(62, 196, 120);
  background: linear-gradient(
    58deg,
    rgba(62, 196, 120, 1) 20%,
    rgba(129, 227, 182, 1) 47%
  );
}
#slide-activator {
  position: absolute;
  top: 0px;
  height: 50px;
  width: 100%;
  padding: 3px 10px;
  border-width: 2px;
  border-radius: 50px;
  
  z-index: 10;
}
#slide-activator:hover ~ #menu {
  transition: 0.5s;
  top: 0;
}
#menu:hover {
  transition: 1s;
  top: 0;
}
::-webkit-scrollbar {
  width: 5px;
}
/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: darkgrey;
  border-radius: 1000px;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: grey;
}
</style>