<template>
  <div id="app">
    <div id="linha1">
     <div id="logo">
        <img src="./assets/logo.png" alt="logo perbras" />
     </div>
      <div id="titulo">STATUS x PPU</div>
      <div id="contrato">CONTRATO: {{ contrato.nome }}</div>
      <div id="estab">ESTABELECIMENTO: {{ contrato.nome }}</div>
    </div>
    <div id="tabela">
      <table  v-for="funcao in tabela" :key="funcao.id">
        <thead>
          <th colspan="4" class="head header-1">{{funcao.funcao}}</th>
        </thead>
        <thead>
          <th class="head header-2">STATUS</th>
          <th class="head header-2">Quantidade</th>
          <th class="head header-2">Unitário</th>
          <th class="head header-2">TOTAL</th>
        </thead>
        <tbody>
          <tr v-for="status in funcao.padrao" :key="status.id">
            <td class="square header-3">{{status.status}}</td>
            <td class="square header-4">{{status.quantidade}}</td>
            <td class="square header-4" v-money>{{status.unitario}}</td>
            <td class="square header-5" v-money>{{status.total}}</td>
          </tr>
        </tbody>
        <thead>
          <th colspan="4" class="head"><br></th>
        </thead>
        <tbody>
          <tr v-for="status in funcao.especial" :key="status.id">
            <td class="square header-3">{{status.status}}</td>
            <td class="square header-4">{{status.base}}(+{{status.extra}}hrs)</td>
            <td class="square header-4"><span v-money>{{status.unitario.base}}</span>(+<span v-money>{{status.unitario.extra}}</span> p/hora)</td>
            <td class="square header-4" v-money>{{status.total}}</td>
          </tr>
          <tr>
            <th class="head header-2" colspan="2">TOTAL</th>
            <td class="square header-5" v-money colspan="2">{{funcao.total}}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr><br></tr>
          <tr><br></tr>
          <tr>
            <td class="total-header header-2" colspan="3">TOTAL</td>
            <td class="total-value header-5" v-money>{{total}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "App",
  data() {
    return {
      tabela: {},
      total: {},
      contrato: {},
    };
  },
  methods: {
    somaTotal(obj) {
      return obj.reduce((soma, valor) => {
        return soma + valor.total;
      }, 0);
    },

    contaStatus(status) {
      return status.reduce((obj, atual) => {
        if (obj[atual] != undefined) {
          obj[atual]++;
        } else {
          obj[atual] = 1;
        }
        return obj;
      }, {});
    },

    contaHoras(status, horas) {
      return status.reduce((obj, atual, index) => {
        if (obj[atual] != undefined) {
          obj[atual] += horas[index];
        } else {
          obj[atual] = horas[index];
        }
        return obj;
      }, {});
    },
    montaEspecial(especial) {
      const contagem = this.contaStatus(especial.status);
      const horas = this.contaHoras(especial.status, especial.horas);
      // console.log('contagem:',contagem)
      // console.log('horas:',horas)
      // console.log('especial:',especial)
      return Object.keys(contagem).map((chave) => {
        console.log('obj:',especial[chave],'chave:',chave)
        return {
          status: chave,
          unitario: especial.valor[chave],
          base: contagem[chave],
          extra: horas[chave],
          total:
            contagem[chave] * especial.valor[chave].base +
            horas[chave] * especial.valor[chave].extra,
        };
      }, []);
    },
    montaPadrao(padrao) {
      const contagem = this.contaStatus(padrao.status);
      // console.log('contagem:', contagem)
      return Object.keys(contagem).map((chave) => {
        const unitario =
          padrao.valor[chave] == undefined ? 0 : padrao.valor[chave];
        return {
          status: chave,
          unitario,
          quantidade: contagem[chave],
          total: contagem[chave] * unitario,
        };
      });
    },
  },
  async mounted() {
    this.contrato = await fetch(
      "http://localhost:3003/contrato"
    ).then((response) => response.json());
    const status = await fetch(
      "http://localhost:3003/ppuStatus"
    ).then((response) => response.json());
    const tabela = status.map((funcao) => {
      const padrao = this.montaPadrao(funcao.padrao);
      // console.log('padrao:',padrao)
      const especial = this.montaEspecial(funcao.horaExtra);
      // console.log('especial:',especial)
      return {
        funcao: funcao.funcao,
        padrao: padrao,
        especial: especial,
        total: this.somaTotal(padrao) + this.somaTotal(especial),
      };
    });
    const total = tabela.reduce((soma, obj) => soma + obj.total,0);
    this.tabela = tabela;
    this.total = total;
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

    valor = valor.replace(/(\d)(?=(\d{3})+,)/, "$1.");
    el.innerHTML = valor;
  },
});
</script>

<style>
#app {
  display: grid;
  height: 100%;
  margin:5px;
  grid-template-rows: auto 1fr;
}

#linha1{
  height: 100%;
  display: grid;
  grid-template-rows:70% 30%;
  grid-template-columns: 10% 45% 45%;
  grid-template-areas: 
  "img titulo titulo"
  "img contrato estab"
}

#linha1 > #logo{
  grid-area: img;
  border-style:solid;
  border-right: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#linha1 > #titulo{
  grid-area: titulo;
  font-size: 2rem;
  border-style: solid;
  text-align: center;
}

#linha1 > #contrato{
  grid-area: contrato;
  border-style:solid;
  border-top-width: 0px;
  border-right: 0px;
  text-align: center;
}

#linha1 > #estab{
  grid-area: estab;
  border-style:solid;
  border-top-width: 0px;
  text-align: center;
}

/*************************************************************/

#tabela{
  height: 100%;
  width: 100%;

  border-style:solid;
  border-top: 0px;
}

#tabela > table{
  width: 100%;
}

.head{
  border-right: solid;
  border-bottom: solid;
}

.header-1{
  background-color:#e86a61;
}

.header-2{
  background-color:#edbd6f;
}

.header-3{
  background-color:#9fccb3;
}

.header-4{
  background-color:#c5c5c5;
}

.header-5{
  background-color:#a9d6d6;
}
.header-6{
  background-color:#09f8f4;
}
.square{
  border-right: solid;
  border-bottom: solid;
}

.total-header{
  border-top: solid;
  border-right: solid;
}
.total-value{
  border-top: solid;
}
</style>
