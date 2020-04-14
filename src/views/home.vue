<template>
    <div id="">
        <el-container>
            <el-aside width="200px">
                <div style="height:70px;background:#545c64;"></div>
                <el-menu
                :style="{height:height-70+'px'}"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                :default-active="active"
                class="el-menu-vertical-demo"
                :collapse="isCollapse">
                    <el-submenu :index="index.toString()" v-for="(item, index) in msg" :key="item.name">
                        <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span slot="title">{{item.name}}</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item v-for="(data, index2) in item.data" :key="index2" @click="seleaddTab(item,index2)" :index="data.url">{{data.name}}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="tabclick">
                <el-tab-pane
                    v-for="(item) in editableTabs"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
                >
                    <router-view></router-view>
                </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                height:0,
                isCollapse:false,
                addNum:'0',
                active:"FrontOne",
                msg:[
                    {
                        name:"Student",
                        data:[
                            {url:"FrontOne",name:"获取班级所有信息"},
                            {url:"FrontTow",name:"添加学生"}
                        ]
                    },
                    {
                        name:"FrontTow",
                        data:[
                            {url:"FrontThree",name:"获取班级考试信息"}
                        ]
                    }
                ],
                editableTabsValue: '1',// 默认显示
                historeTabs:[],
                editableTabs: [
                    {title:"获取班级所有信息",name:"1",url:"FrontOne"}
                ]
            }
        },
        created() {
            this.height = window.innerHeight
            this.addNum = this.editableTabs.length
        },
        methods: {
            seleaddTab(e,index){ // 添加选项卡
                this.active = e.data[index].url
                for(let i in this.editableTabs){
                    if(this.editableTabs[i].title === e.data[index].name){
                        if(this.$route.name !== this.editableTabs[i].url) this.$router.push(this.editableTabs[i].url)
                        this.editableTabsValue = this.editableTabs[i].name
                        return
                    }
                }
                this.$router.push(e.data[index].url)
                this.editableTabs.push({title: e.data[index].name,name: (this.addNum+1).toString() ,url:e.data[index].url})
                this.addNum++
                this.editableTabsValue = this.addNum.toString()
            },
            tabclick(e){ // 点击选项卡
                this.active = this.editableTabs[e.index].url
                if(this.$route.name !== this.editableTabs[e.index].url) this.$router.push(this.editableTabs[e.index].url)
            },
            removeTab(targetName) { // 删除选项卡
                let tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
                if (activeName == targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name == targetName) {
                            if(this.historeTabs[0]){

                            }
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                this.active = nextTab.url
                                activeName = nextTab.name;
                            }
                            this.active = ""
                        }
                    });
                }
                this.editableTabsValue = activeName;
                this.editableTabs = tabs.filter(tab => tab.name !== targetName);
            }
        },
        watch:{
            active(){
                this.historeTabs.unshift(this.active)
                this.historeTabs = [...new Set(this.historeTabs)]
            }
        }
    };
</script>

<style lang="less" scoped >
.el-submenu .el-menu-item{
    min-width: 0;
}
.el-main{padding: 0;}
</style>
