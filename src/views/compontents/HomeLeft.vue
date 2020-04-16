<template>
    <div id="HomeLeft">
        <div style="line-height:70px;background:#FFEB3A;display:flex;">
            <div class="asideImg">
                <img class="img" src="../assets/logo.png" />
            </div>
            <div v-show="!isCollapse" class="font">
                自学无忧教育
            </div>
        </div>
        <el-menu
        :style="{height:height-70+'px'}"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"

        @select="select"
        router
        :default-active="active"
        :collapse="isCollapse">
            <el-submenu :index="index.toString()" v-for="(item, index) in selectData" :key="item.name">
                <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item v-for="(data, index2) in item.data" :key="index2"  :index="data.url">{{data.name}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
    data(){
        return{
            height:0,
        }
    },
    props:{
        selectData:Array,
        active:String,
        isCollapse:Boolean
    },
    created() {
        this.height = window.innerHeight
    },
    methods:{
        select(url,data){
            this.$emit('select',url,data)
        }
    }
}
</script>

<style lang="less">
    #HomeLeft{
        .asideImg{width: 50px;height: 50px;margin: auto 5px;}
        .el-menu{border-right:0px;}
        .el-menu-item.is-active{background-color: rgb(67,74,80) !important;}
    }
</style>