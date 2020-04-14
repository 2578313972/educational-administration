<template>
    <div id="">
        <el-container>
            <el-aside width="200px">
                <div style="height:70px;"></div>
                <el-menu
                :style="{height:height-70+'px'}"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                default-active="1-4-1"
                class="el-menu-vertical-demo"
                :collapse="isCollapse">
                    <el-submenu :index="index.toString()" v-for="(item, index) in msg" :key="item.name">
                        <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span slot="title">{{item.name}}</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item v-for="(data, index2) in item.data" :key="index2" @click="seleaddTab(item,index2)" :index="index.toString()+index2.toString()">{{data.name}}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
                <el-tab-pane
                    v-for="(item) in editableTabs"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
                    @tab-click="tabclick"
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
                editableTabs: [],
                tabIndex: 2
            }
        },
        created() {
            this.height = window.innerHeight
        },
        methods: {
            seleaddTab(e,index){
                console.log(e,index)

                for(let i in this.editableTabs){
                    if(this.editableTabs[i].title === e.data[index].name){
                        return
                    }
                }


                this.$router.push(e.data[index].url)
                this.editableTabs.push({title: e.data[index].name,name: (this.editableTabs.length+1).toString() ,url:e.data[index].url})
            },
            tabclick(e){
                console.log(e)
            },
            addTab(targetName) {
                let newTabName = ++this.tabIndex + '';
                this.editableTabs.push({
                title: 'New Tab',
                name: newTabName,
                content: 'New Tab content'
                });
                this.editableTabsValue = newTabName;
            },

            removeTab(targetName) {
                let tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }
                this.editableTabsValue = activeName;
                this.editableTabs = tabs.filter(tab => tab.name !== targetName);
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
