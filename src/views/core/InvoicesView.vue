<template>
  <div class="invoices">
    <div style="min-height: 10vh"></div>
    <section
      class="container">
      <div class="text-light p-3">
        <div class="flex">
          <h1 class="font-bold">
            Invoices
          </h1>
          <button class="btn btn-outline-warning ms-5" v-on:click="loadInvoices()">Show Invoices</button>
        </div>
      </div>
    </section>
    <div v-show="!emptyInvoices" id="invoicesSection" :style="{ backgroundImage: bg }" style="min-height: 100vh">
      <section>
        <div class="mt-4" style="min-height: 3vh"></div>
        <div class="container">
          <div class="col" v-for="invoice in invoicesList" :key="invoice">
            <div class="card text-center mb-5"
                 style="background: black; color: white">
              <div class="card-title">
                <h3 class="font-bold m-3">
                  <span>
                    <i class="bi bi-file-earmark-text ms-md-5"/>
                    {{ JSON.parse(invoice).text }}
                    #{{ JSON.parse(invoice).uID }}
                  </span>
                  <span style="padding-left: 1rem">
                    <i class="bi bi-calendar3-event ms-md-5"/>
                    {{ JSON.parse(invoice).date }}
                  </span>
                </h3>
              </div>
              <table class="invoice_positions">
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Net</th>
                  <th>Gross</th>
                </tr>
                <tr v-for="item in JSON.parse(invoice).items" :key="item">
                  <td>{{ JSON.parse(item).d }}</td>
                  <td>{{ JSON.parse(item).n }}</td>
                  <td>{{ JSON.parse(item).np }} €</td>
                  <td>{{ JSON.parse(item).gp }} €</td>
                </tr>
              </table>
              <div class="mt-5"/>
              <table class="invoice_status">
                <tr>
                  <th scope="row">Total:</th>
                  <td><span class="h2 font-bold">
                    {{ JSON.parse(invoice).grossTotal }} €
                  </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Paid:</th>
                  <td><span class="h2 font-bold">
                    {{ getPaidAmount(JSON.parse(invoice).grossPaid) }}
                  </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Status:</th>
                  <td><span class="h2 font-bold">
                    {{ JSON.parse(invoice).statusText }}
                  </span>
                  </td>
                </tr>
              </table>
              <div class="text-start text-black font-bold p-2 m-3" style="border-radius: 1rem; background: white">
                Customer Note:
                <span class="ms-2 font-bold lead">
                  {{ JSON.parse(invoice).customerNote }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style="min-height: 5vh"></div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WInvoices',
  data () {
    return {
      invoicesList: {},
      angle: '180',
      color1: 'rebeccapurple',
      color2: 'darkblue'
    }
  },
  computed: {
    bg () {
      return `linear-gradient(${this.angle}deg, ${this.color1}, ${this.color2})`
    },
    emptyInvoices () {
      const x = JSON.stringify(this.invoicesList) === '{}'
      console.log(x)
      return x
    }
  },
  methods: {
    loadInvoices () {
      this.invoicesList = {}
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      fetch(
        this.$store.state.serverIP + '/api/m3/owninvoices',
        {
          method: 'get',
          headers: headers
        }
      )
        .then((res) => res.json())
        .then((data) => (this.invoicesList = data.resultsList.slice().reverse()))
    },
    getPaidAmount (grossPaid) {
      let paidAmount = ''
      if (grossPaid !== undefined) {
        paidAmount = grossPaid + ' €'
      } else {
        paidAmount = '0 €'
      }
      return paidAmount
    }
  }
}
</script>

<style scoped>

th {
  font-size: 125%;
}

.invoice_positions th, .invoice_positions td {
  border: 1px dotted gray;
}

.invoice_status td {
  text-align: left;
}

.invoice_status th {
  width: 100px;
}

</style>
