<template>
  <v-card-title class="pt-0">
    <h5 class="text-uppercase grey--text text--darken-2">{{title}}</h5>
    <v-breadcrumbs class="grey--text" :items="items" divider=">"></v-breadcrumbs>
    <v-spacer></v-spacer>
    <v-flex xs3 v-if="!searchDisable">
      <v-autocomplete
      v-model="searchingModel"
      :items="searchItems"
      :loading="isLoading"
      :search-input.sync="handleSearch"
      :clearable="false"
      hide-details
      hide-selected
      item-text="houseName"
      item-value="houseName"
      label="Tìm kiếm">
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            Tìm kiếm 
            <strong>căn hộ</strong>
          </v-list-item-title>
        </v-list-item>
      </template>
        <template v-slot:item="{ item }">
        <v-list-item-avatar
          color="indigo"
          class="headline font-weight-light white--text"
        >
        <v-img :src="item.images[0].imgUrl"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item.houseName"></v-list-item-title>
        </v-list-item-content>
      </template>
      </v-autocomplete>
    </v-flex>
  </v-card-title>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    searchInput: {
      required: false,
      type: String,
      default: ""
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    searchItems: {
      type: Array,
      default: () => []
    },
    searchDisable: {
      type: Boolean,
      default: false
    },
    searchText: {
      type: String,
      default: ""
    },
    searchVal: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      search: this.searchInput,
      searchingModel: null,
      handleSearch: null
    };
  },
  created() {  
    this.items = this.$route.meta.breadcrumb
  },
  watch: {
    searchingModel: function(val) {
      if (val !== null) this.$emit('searchModel', val)
    },
    handleSearch: function(val) {
      const data = {
        val: val,
        items: this.searchItems
      }
      this.$emit('searchAutoComplete', data)
    },
    search: {
      handler: function() {
        this.$emit("search", this.search);
      }
    },
    searchInput: {
      handler: function() {
        this.search = this.searchInput;
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.v-breadcrumbs__item {
  color: #027beb !important;
}
.v-breadcrumbs__item--disabled {
  color: #bdbdbd !important;
}
</style>
