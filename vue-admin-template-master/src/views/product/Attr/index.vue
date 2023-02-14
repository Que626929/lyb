<template>
    <div>
        <el-card style="margin: 20px 0px;">
            <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
        </el-card>
        <el-card>
            <div v-show="isShowTable">
                <el-button type="primary" icon="el-icon-plus" @click="addAttr" :disabled="!Category3Id">添加属性</el-button>
                <el-table style="width:100%" border :data="attrList">
                    <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                    <el-table-column label="属性名称" prop="attrName" width="150"></el-table-column>
                    <el-table-column label="属性值列表" width="width">
                        <template slot-scope="{row,$index}">
                            <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id"
                                style="margin: 0px 20px;">{{ attrValue.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="{row,$index}">
                            <el-button type="warning" icon="el-icon-edit" size="mini"
                                @click="updateAttr(row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加属性的结构 -->
            <div v-show="!isShowTable">
                <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
                    <el-form-item label="属性名">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
                    :disabled="!attrInfo.attrName">添加属性值</el-button>
                <el-button @click="isShowTable = true">取消</el-button>
                <el-table border style="margin: 20px 0px; width: 100%;" :data="attrInfo.attrValueList">
                    <el-table-column label="序号" type="index" width="80"></el-table-column>
                    <el-table-column label="属性值名称" width="width">
                        <template slot-scope="{row,$index}">
                            <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag"
                                @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
                            <span v-else @click="toEdit(row, $index)" style="display: block;">{{ row.valueName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteArrtValue($index)">
                                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
                <el-button @click="isShowTable = true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep';
export default {
    name: 'attr',
    data() {
        return {
            Category1Id: '',
            Category2Id: '',
            Category3Id: '',
            //品牌属性列表
            attrList: [],
            isShowTable: true,
            //收集新增属性与修改属性
            attrInfo: {
                attrName: '',//属性名
                attrValueList: [],//属性值，因为属性值可以有多个因此用数组
                categoryId: 0,//三级分类的id
                categoryLevel: 3,//因为服务器也需要区分几级id
            }
        };
    },
    methods: {
        //自定义事件的回调
        getCategoryId({ CategoryId, level }) {
            //区分id
            if (level == 1) {
                this.Category1Id = CategoryId;
                //清除数据
                this.Category2Id = '';
                this.Category3Id = ''
            } else if (level == 2) {
                //清除数据
                this.Category3Id = '';
                this.Category2Id = CategoryId;
            } else {
                this.Category3Id = CategoryId;
                //发请求获取品牌属性
                this.getAttrList();
            }
        },
        //获取品牌属性
        async getAttrList() {
            const { Category1Id, Category2Id, Category3Id } = this;
            let result = await this.$API.attr.reqAttrList(Category1Id, Category2Id, Category3Id);
            if (result.code == 200) {
                this.attrList = result.data;
            }
        },
        //添加属性值
        addAttrValue() {
            this.attrInfo.attrValueList.push({
                attrId: this.attrInfo.id,
                valueName: '',
                //添加一个标记，用于切换查看模式与显示模式
                flag: true
            });
            //为新添加的属性值文本框自动聚焦
            this.$nextTick(() => {
                this.$refs[this.attrInfo.attrValueList.length - 1].focus();
            })
        },
        //添加属性的按钮的回调
        addAttr() {
            this.isShowTable = false,
                this.attrInfo = {
                    attrName: '',//属性名
                    attrValueList: [],//属性值，因为属性值可以有多个因此用数组
                    categoryId: this.Category3Id,//三级分类的id
                    categoryLevel: 3,//因为服务器也需要区分几级id
                }
        },
        //修改按钮的回调
        updateAttr(row) {
            this.isShowTable = false;
            //cloneDeep()使用深拷贝
            this.attrInfo = cloneDeep(row);
            this.attrInfo.attrValueList.forEach(item => {
                // item.flag=false;
                //这样写也可以给属性值添加flag属性，但是会发现视图不会跟着变化（因为flag不是响应式数据）
                //因为Vue无法探测普通的新增property，这样写的属性并非响应式属性
                //第一个参数：对象 第二个参数：添加新的响应式属性 第三个参数：新的响应式属性的属性值
                this.$set(item, 'flag', false);
            })
        },
        //失去焦点的回调
        toLook(row) {
            //如果属性值为空不能作为新的属性值，需要给用户提示
            if (row.valueName.trim() == "") {
                this.$message({
                    message: "请输入一个正常的属性值！",
                    type: 'error'
                });
                return;
            }
            //新增的属性值不能与已有的属性值重复
            let isRepat = this.attrInfo.attrValueList.some((item) => {
                //需要将row从数组里面判断的时候去除
                //row：最新新增的属性值【数组的最后一项元素】
                //判断的时候，需要把已有的数组当中新增的这个属性值去除
                if (row !== item) {
                    return row.valueName == item.valueName;
                }
            });
            if (isRepat) {
                this.$message({
                    message: "属性值已存在,请重新输入！",
                    type: 'error'
                })
                return;
            }
            row.flag = false;
        },
        //切换编辑模式
        toEdit(row, index) {
            row.flag = true;
            //获取input节点，实现自动聚焦
            //$nextTick()，当节点渲染完毕了，会执行一次
            this.$nextTick(() => {
                //获取相应的input表单元素实现聚焦
                this.$refs[index].focus();
            })
        },
        //气泡确认框确定按钮的回调
        //最新版本的ElementUI是2.15.6，目前模板中的版本号2.13.x
        deleteArrtValue(index) {
            this.attrInfo.attrValueList.splice(index, 1);
        },
        //保存按钮的回调
        async addOrUpdateAttr() {
            //整理参数
            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
                if (item.valueName != '') {
                    //删除flag属性
                    delete item.flag;
                    return true;
                }
            });
            try {
                //发请求
                await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
                //显示表格
                this.isShowTable = true,
                    this.$message({ type: 'success', message: '保存成功！' });
                //重新获取最新的数据
                this.getAttrList();
            } catch (error) {
                this.$message({ type: 'error', message: '保存失败！' });
            }

        }
    }
};
</script>

<style scoped lang="scss">

</style>
