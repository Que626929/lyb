<template>
    <div>
        <el-card style="margin: 20px 0px;">
            <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0"></CategorySelect>
        </el-card>
        <el-card>
            <div v-show="scene == 0">
                <!-- spu列表 -->
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu"
                    ref="spu">添加SPU</el-button>
                <el-table border :data="records">
                    <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                    <el-table-column label="spu名称" prop="spuName" width="width"></el-table-column>
                    <el-table-column label="spu描述" prop="description" width="width"></el-table-column>
                    <el-table-column label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
                            <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu"
                                @click="updateSpu(row)"></hint-button>
                            <hint-button type="info" icon="el-icon-info" size="mini"
                                title="查看当前spu全部sku列表"></hint-button>
                            <el-popconfirm :title="`确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu"
                                    slot="reference"></hint-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination style="text-align: center;" :total="total" :current-page="page" :page-sizes="[3, 5, 10]"
                    :page-size="limit" layout="prev,pager,next,jumper,->,sizes,total"
                    @current-change="handleCurrentChange" @size-change="handleSizeChange">
                </el-pagination>
            </div>
            <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
            <SkuForm v-show="scene == 2" ref="sku" @changScenes="changScenes"></SkuForm>
        </el-card>
    </div>
</template>

<script>
import SkuForm from '@/views/product/Spu/SkuForm';
import SpuForm from '@/views/product/Spu/SpuForm';
export default {
    name: 'spu',
    data() {
        return {
            category1Id: '',
            category2Id: '',
            category3Id: '',
            show: true,
            page: 1,//当前页
            limit: 3,//每页展示多少条数据
            records: [],//spu列表数据
            total: 0,//一共有多少页
            scene: 0//0代表展示SPU列表数据 1代表添加SPU|修改SPU 2代表添加SKU
        };
    },
    components: {
        SkuForm,
        SpuForm
    },
    methods: {
        getCategoryId({ CategoryId, level }) {
            if (level == 1) {
                this.category1Id = CategoryId;
                //清除数据
                this.category2Id = '',
                    this.category3Id = ''
            } else if (level == 2) {
                this.category2Id = CategoryId;
                this.category3Id = ''
            } else {
                this.category3Id = CategoryId;
                //发请求获取数据
                this.getSpuList();
            }
        },
        //获取spu列表
        async getSpuList() {
            const { page, limit, category3Id } = this;
            //发请求
            let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
            if (result.code == 200) {
                this.records = result.data.records;
                this.total = result.data.total;
            }
        },
        //切换页码
        handleCurrentChange(page) {
            this.page = page;
            this.getSpuList();
        },
        //当分页器的某一个展示数据条数发生变化的回调
        handleSizeChange(limit) {
            //修改参数
            this.limit = limit;
            //再次发请求
            this.getSpuList();
        },
        //添加SPu
        addSpu() {
            this.scene = 1;
            //通知子组件SpuForm发请求--两个
            this.$refs.spu.addSpuData(this.category3Id);
        },
        //修改Spu
        updateSpu(row) {
            this.scene = 1;
            this.$refs.spu.initSpuData(row);
        },
        //自定义事件的回调
        changeScene({ scene, flag }) {
            this.scene = scene;
            //子组件通知父组件切换场景，再次获取数据
            this.getSpuList();
            if (flag == '修改') {
                //停留在当前页
                this.handleCurrentChange(this.page);
            } else {
                //停留在第一页
                this.handleCurrentChange(1);
            }
        },
        //删除spu的回调
        async deleteSpu(row) {
            //发请求
            let result = await this.$API.spu.reqDeleteSpu(row.id);
            if (result.code == 200) {
                //提示信息
                this.$message({ type: 'success', message: '删除成功！' });
                //重新获取数据
                this.getSpuList();
                //代表SPU个数大于1删除的时候停留在当前页，如果SPU个数小于1，回到上一页
                this.handleCurrentChange(this.records.length > 1 ? this.page : this.page - 1);
            }
        },
        //添加sku的回调
        addSku(row){
            //切换场景2
            this.scene=2;
            //父组件调用子组件的方法，让子组件发请求
            this.$refs.sku.getData(this.category1Id,this.category2Id,row);
        },
        //skuform通知父组件切换场景0
        changScenes(scene){
            this.scene=scene;
        }
    }
};
</script>

<style scoped lang="scss">

</style>
