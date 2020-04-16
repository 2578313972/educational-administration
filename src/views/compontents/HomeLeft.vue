<template>
    <div id="HomeLeft">
        <el-menu
        background-color="#FFEB3A"
        class="el-menu-vertical-demo top-el-menu"
        :collapse="isCollapse"
        >
            <el-menu-item class="tl-item">
                <img class="img asideImg" src="../../assets/logo.png" />
                <span style="color:#24A33A;">自学无忧教育</span>
            </el-menu-item>
        </el-menu>

        <el-menu
        :style="{height:height-70+'px'}"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        class="el-menu-vertical-demo"
        router
        @select="select"
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

<style lang="less" scoped>
    #HomeLeft{
        .asideImg{width: 50px;height: 50px;margin: auto 5px;}
        .font{color: #24A33A;font-weight: 600;font-size: 18px;}
        .el-menu{border-right:0px;}
        .el-menu-item.is-active{background-color: rgb(67,74,80) !important;}
        .el-menu-vertical-demo.top-el-menu .el-menu-item.tl-item{background-color: rgb(255, 235, 58) !important;}
        .tl-item{
            padding: 0px !important;
        }
        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 200px;
        }
    }
</style>