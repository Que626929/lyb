<template>
    <div>
        <el-form :inline="true" class="demo-form-inline" :model="cForm">
            <el-form-item label="一级分类">
                <el-select placeholder="请选择" v-model="cForm.Category1Id" @change="handler1" :disabled="show">
                    <el-option :label="c1.name" :value="c1.id" v-for="(c1, index) in list1" :key="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select placeholder="请选择" v-model="cForm.Category2Id" @change="handler2" :disabled="show">
                    <el-option :label="c2.name" :value="c2.id" v-for="(c2, index) in list2" :key="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select placeholder="请选择" v-model="cForm.Category3Id" @change="handler3" :disabled="show">
                    <el-option :label="c3.name" :value="c3.id" v-for="(c3, index) in list3" :key="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'CategorySelect',
    data() {
        return {
            //一级分类的数据
            list1: [],
            //二级分类的数据
            list2: [],
            //三级分类的数据
            list3: [],
            //菜单id
            cForm: {
                Category1Id: '',
                Category2Id: '',
                Category3Id: '',
            }
        };
    },
    props:['show'],
    mounted() {
        //获取一级分类的数据
        this.getCategory1List();
    },
    methods: {
        //获取一级分类的数据
        async getCategory1List() {
            let result = await this.$API.attr.reqCategory1List();
            if (result.code == 200) {
                this.list1 = result.data;
            }
        },
        //一级分类的select事件的回调（当一级分类的option发生变化时获取二级分类的数据）
        async handler1() {
            //清除数据
            this.list2 = [],
                this.list3 = [],
                this.cForm.Category2Id = '',
                this.cForm.Category3Id = ''
            //解构出Category1Id
            const { Category1Id } = this.cForm;
            //把ID传递给父组件attr
            this.$emit('getCategoryId', { CategoryId: Category1Id, level: 1 });
            //发请求获取二级分类的数据
            let result = await this.$API.attr.reqCategory2List(Category1Id);
            if (result.code == 200) {
                this.list2 = result.data;
            }
        },
        //二级分类的select事件的回调（当二级分类的option发生变化时获取三级分类的数据）
        async handler2() {
            //清除数据
            this.list3 = [],
                this.cForm.Category3Id = ''
            //解构出Category1Id
            const { Category2Id } = this.cForm;
            //把ID传递给父组件attr
            this.$emit('getCategoryId', { CategoryId: Category2Id, level: 2 });
            //发请求获取二级分类的数据
            let result = await this.$API.attr.reqCategory3List(Category2Id);
            if (result.code == 200) {
                this.list3 = result.data;
            }
        },
        //三级分类的事件回调
        handler3() {
            //解构Category3Id
            const { Category3Id } = this.cForm;
            //把ID传递给父组件attr
            this.$emit('getCategoryId', { CategoryId: Category3Id, level: 3 });
        }
    }
};
</script>

<style scoped lang="scss">

</style>
