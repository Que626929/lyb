<template>
    <div>
        <!-- 按钮 -->
        <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="showDialog">添加</el-button>
        <!-- 
        表格组件 
        data:表格组件将来需要展示的数据-----数组类型
        border：是给表格添加边框
        column属性
        label:显示标题
        width:对应列的宽度
        align:标题的对齐方式
    -->
        <el-table style="width:100%" border :data="list">
            <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
            <el-table-column label="品牌名称" prop="tmName" width="width"></el-table-column>
            <el-table-column label="品牌LOGO" prop="logoUrl" width="width">
                <template slot-scope="{row,$index}">
                    <img :src="row.logoUrl" style="width:100px;height:100px;">
                </template>
            </el-table-column>
            <el-table-column label="操作" prop="prop" width="width">
                <template slot-scope="{row,$index}">
                    <el-button type="warning" icon="el-icon-edit" size="mini"
                        @click="updateTradeMark(row)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                        @click="deleteTradeMark(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 
            分页器 
            total:代表分页器一共需要展示数据条数
            current-page:代表当前页
            page-size：代表每页需要展示多少条数据
            page-sizes：代表可以设置每一页展示多少条数据
            layout：可以实现器布局
            page-count:按钮的数量 如果是9，连续的页码是7
        -->
        <el-pagination style="margin-top:20px;textAlign:center" :total="total" :current-page="page" :page-size="limit"
            :page-count="7" :page-sizes="[3, 5, 10]" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" layout="prev,pager,next,jumper,->,sizes,total">
        </el-pagination>
        <!-- 添加和修改的对话框 -->
        <el-dialog :title="this.tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
            <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpadteTradeMark">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'tradeMark',
    data() {
        return {
            //代表分页器第几页
            page: 1,
            //代表页数展示数据条数
            limit: 3,
            //总共数据条数
            total: 0,
            //列表展示的数据
            list: [],
            //控制对话框是否显示
            dialogFormVisible: false,
            //收集的品牌信息
            tmForm: {
                tmName: '',
                logoUrl: ''
            },
            //表单验证规则
            rules: {
                tmName: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
                ],
                logoUrl: [
                    { required: true, message: '请选择品牌图片' }
                ],
            }
        };
    },
    mounted() {
        //获取列表数据的方法
        this.getPageList();
    },
    methods: {
        //获取品牌列表数据
        async getPageList() {
            //解构出page,limit
            const { page, limit } = this;
            //获取品牌列表数据的接口
            let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
            if (result.code == 200) {
                //分别是展示数据总条数与列表展示的数据
                this.total = result.data.total;
                this.list = result.data.records;
            }
        },
        //切换页码
        handleCurrentChange(pager) {
            this.page = pager;
            this.getPageList();
        },
        //当分页器某一页需要展示数据条数发生变化的时候会触发
        handleSizeChange(limit) {
            this.limit = limit;
            this.getPageList();
        },
        //添加按钮
        showDialog() {
            //添加之前清空数据
            this.tmForm = { tmName: '', logoUrl: '' }
            //显示对话框
            this.dialogFormVisible = true;
        },
        //修改
        updateTradeMark(row) {
            this.dialogFormVisible = true;
            //浅拷贝操作数据
            this.tmForm = { ...row };
        },
        //图片上传成功
        handleAvatarSuccess(res, file) {
            //res:上传成功之后返回前端数据
            //file:上传成功之后服务器返回前端数据
            //收集品牌图片
            this.tmForm.logoUrl = res.data;
        },
        //图片上传成功之前
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //确定按钮
        addOrUpadteTradeMark() {
            //判断表单验证是否通过
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    this.dialogFormVisible = false;
                    //发请求（添加或修改品牌）
                    let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm);
                    if (result.code == 200) {
                        this.$message({
                            type: 'success',
                            message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
                        });
                        //如果添加品牌：停留在第一页，修改品牌应该留在当前页面
                        this.getPageList(this.tmForm.id ? this.page : 1);
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //删除品牌信息
        deleteTradeMark(row) {
            //弹窗
            this.$confirm(`你确定删除${row.tmName}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                //用户点击确定按钮时会触发
                //向服务器发请求
                let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
                if (result.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //再次获取品牌列表数据
                    this.getPageList(this.list.length>1?this.page:this.page-1);
                }
            }).catch(() => {
                //用户点击取消按钮时会触发
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
};
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
