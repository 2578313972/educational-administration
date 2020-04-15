<template>
    <div id="">
        <el-container>
            <el-aside :style="{width:isCollapse?'64px':'200px',transition:isCollapse?'0s':'.5s'}">
                <div style="height:70px;background:yellow;display:flex;line-height:70px;transition:.3;">
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
            <el-main style="position: relative;">

                <div class="back" @click="little"><span :class="!isCollapse?'el-icon-caret-left':'el-icon-caret-right'"></span></div>

                <el-tabs v-model="editableTabsValue" type="card"  @tab-remove="removeTab" @tab-click="tabclick">
                    <el-tab-pane
                        class="el-tab-top"
                        v-for="(item) in editableTabs"
                        :key="item.name"
                        :label="item.title"
                        :name="item.name"
                        :closable="item.bool"
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
                isCollapse:true,
                addNum:'0',
                active:"",
                msg:[
                    {
                        name:"基础数据",
                        data:[
                            {url:"/FrontOne",name:"班级管理"},
                            {url:"/FrontTow",name:"学生管理"},
                            {url:"/FrontThree",name:"老师管理"},
                            {url:"/FrontFore",name:"修改密码"}
                        ]
                    },
                    {
                        name:"在线测试",
                        data:[
                            {url:"/Queen_1",name:"老师出卷"},
                            {url:"/Queen_2",name:"试卷管理"},
                            {url:"/Queen_3",name:"安排测试"},
                            {url:"/Queen_4",name:"批阅试卷"},
                            {url:"/Queen_5",name:"测试成绩"},
                        ]
                    }
                ],
                editableTabsValue: '1',// 默认显示
                historeTabs:[],
                editableTabs: [
                    {title:"首页",name:"1",url:"/"}
                ]
            }
        },
        created() {
            this.height = window.innerHeight
            this.addNum = this.editableTabs.length
        },
        methods: {
            little(){
                this.isCollapse = !this.isCollapse
            },
            seleaddTab(e,index){ // 添加选项卡
            console.log(e,index)
                this.active = e.data[index].url
                for(let i in this.editableTabs){
                    if(this.editableTabs[i].title === e.data[index].name){
                        if(this.$route.name !== this.editableTabs[i].url) this.$router.push(this.editableTabs[i].url)
                        this.editableTabsValue = this.editableTabs[i].name
                        return
                    }
                }
                this.$router.push(e.data[index].url)
                this.addNum++
                this.editableTabs.push({title: e.data[index].name,name: this.addNum.toString() ,url:e.data[index].url,bool:true})
                this.editableTabsValue = this.addNum.toString()
            },
            tabclick(e){ // 点击选项卡
                this.active = this.editableTabs[e.index].url
                if(this.$route.name !== this.editableTabs[e.index].url) this.$router.push(this.editableTabs[e.index].url)
            },
            removeTab(targetName) { // 删除选项卡
            if(targetName==="1")return
                let tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
                if (activeName == targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name == targetName) {
                            if(this.historeTabs[0]){

                            }
                            if(tabs.length===2){
                                this.active = "/"
                                this.$router.push("/")
                            }
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                this.active = nextTab.url
                                activeName = nextTab.name;
                            }else{
                                this.active = ""
                            }

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
.asideImg{width: 50px;height: 50px;margin: auto 5px;}
.font{font-size: 16px;color: #24A33A;font-weight: 600;}
.back{position: absolute;height: 70px;width: 30px;color:white;background-color: #24A33A;left:0px;top: 0px;font-size:22px;text-align: center;line-height: 70px;cursor: pointer;}
.el-menu{border-right:0px}

.el-menu-item.is-active{background: rgb(67,74,80)!important ;}
.el-main{padding: 29px 0px 0px 30px;}
.el-tab-top{padding-left: 60px !important ;}
// .el-main .el-tabs__header.is-top{padding: 50px;}
</style>
