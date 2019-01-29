<template>
  <v-toolbar dark color="primary" >
    <v-toolbar-title class="white--text">LOGO</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn flat>sell</v-btn>

    <v-btn icon>
      <v-icon>shopping_cart</v-icon>
    </v-btn>

    <v-flex xs10 sm4 md2>
      <v-text-field label="search products" solo ></v-text-field>
    </v-flex>

  </v-toolbar>
</template>

<script>
export default {
  name: "navbar"
};
</script>
