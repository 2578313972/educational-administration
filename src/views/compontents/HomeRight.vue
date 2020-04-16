<template>
    <div id="HomeRight">
        <div class="arrows" @click="change"><span :class="isCollapse?'el-icon-caret-right':'el-icon-caret-left'"></span></div>
        <div class="account">
            <div class="account_1">
                <i class="el-icon-s-custom"></i>退出
            </div>
            <div class="account_2"><i class="el-icon-s-custom"></i></div>
        </div>

        <el-tabs v-model="editableTabsValue" type="card" @tab-click="clickTab" @tab-remove="removeTab">
            <el-tab-pane
                v-for="item in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                :closable="item.title==='首页'?false:true"
            >
                <router-view />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    data(){
        return{
            editableTabsValue:"1"
        }
    },
    props:{
        value:String,
        editableTabs:Array,
        isCollapse:Boolean
    },
    watch:{
        value(newVal){
            this.editableTabsValue = newVal
        }
    },
    methods: {
        change(){
            this.$emit('change')
        },
        clickTab(e){
            this.$emit("clickTab",e.index,this.editableTabsValue)
        },
        removeTab(targetName) {
            this.$emit('removeTab',targetName)
        }
    }

}
</script>

<style lang="less">
    #HomeRight{
        position: relative;
        .arrows{
            width: 40px;
            line-height: 70px;
            position: absolute;
            text-align: center;
            font-size: 30px;
            left: 0px;
            top: 0px;
            z-index: 2;
            color: white;
            background-color: #008181;
            cursor: pointer;
        }
        .account{
            width: 120px;
            line-height: 70px;
            position: absolute;
            font-size: 30px;
            right: 0px;
            display: flex;
            justify-content: center;
            top: 0px;
            .account_1{
                i{margin-right: 5px;}
                color: #5D636A;
                margin-top: 6px;
            }
            .account_2{
                width: 40px;
                line-height: 40px;
                font-size: 25px;
                margin: auto 10px;
                text-align: center;
                border-radius: 50%;
                color: white;
                background-color: #C2C6CE;
            }
        }
        .el-tabs.el-tabs--card.el-tabs--top{
            padding-top: 29px;
        }
        .el-tabs__header.is-top{
            width: 100%;
            box-sizing: border-box;
            padding-left: 50px;
            padding-right: 120px;
        }
    }
</style>