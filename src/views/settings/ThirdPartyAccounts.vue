<template>
  <div class="header-margin" style="box-shadow: none"></div>
  <div id="settings" class="ms-4">
    <div id="_imgflip_credentials" class="ps-2 c_lightgray">
      <h1>Imgflip</h1>
      <label for="imgflip_user">Username</label><br>
      <input v-model="username"
             class="ms-3 font-bold big-on-small c_lightgray" id="imgflip_user"
             style="height: 4ch; background: black">
      <br><label for="imgflip_pass">Password</label><br>
      <input v-model="password"
             type="password" class="ms-3 font-bold big-on-small c_lightgray" id="imgflip_pass"
             style="height: 4ch; background: black">
      <br>
      <button title="Save Setting" class="btn btn-outline-success ms-3 mt-2"
              v-on:click="commitImgFlipCredentials">
        <i class="bi bi-layer-backward px-1" style="font-size: 150%"/> Save
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThirdPartyAccounts',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  mounted () {
    this.username = this.$store.state.imgFlipUsername
    this.password = this.$store.state.imgFlipPassword
  },
  methods: {
    commitImgFlipCredentials: function () {
      this.$store.commit('setImgFlipAccount', {
        username: this.username,
        password: this.password
      })
      this.$notify(
        {
          title: 'Imgflip Account Updated',
          text: 'Credentials change was submitted.',
          type: 'info'
        })
    }
  }
}
</script>

<style scoped>

.c_lightgray {
  color: #aeaeb7;
}

.header-margin {
  min-height: 60px;
}

</style>
