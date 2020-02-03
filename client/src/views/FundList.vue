<template>
  <div class="fillcontainer">
      <div>
      <el-form :inline="true" ref="search_data" :model="search_data">
        <el-form-item label="投标时间筛选:">
          <el-date-picker v-model="search_data.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>--
          <el-date-picker v-model="search_data.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="search" @click="handleSearch()">筛选</el-button>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button
            type="primary"
            size="small"
            icon="view"
            @click="onAddMoney()"
            v-if="user.identity =='manager'"
          >添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        max-height="450"
        border
        :default-sort="{prop: 'date', order: 'descending'}"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
        <el-table-column prop="date" label="创建时间" align="center" width="250" sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="收支类型" align="center" width="150"></el-table-column>
        <el-table-column prop="describe" label="收支描述" align="center" width="180"></el-table-column>
        <el-table-column prop="income" label="收入" align="center" width="170">
          <template slot-scope="scope">
            <span style="color:#00d053">+ {{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expend" label="支出" align="center" width="170">
          <template slot-scope="scope">
            <span style="color:#f56767">- {{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cash" label="账户现金" align="center" width="170">
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" width="220"></el-table-column>
        <el-table-column prop="operation" align="center" label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="edit"
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
              v-if="user.identity =='manager'"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="delete"
              size="small"
              v-if="user.identity =='manager'"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
          <el-col :span="24">
              <div class="pagination">
                   <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="paginations.page_index"
                    :page-sizes="paginations.page_sizes"
                    :page-size="paginations.page_size"
                    :layout="paginations.layout"
                    :total="paginations.total">
                    </el-pagination>
              </div>
          </el-col>
      </el-row>
    </div>
    <!-- 弹框页面 -->
    <Dialog :dialog="dialog" :form="form" @update="getProfile"></Dialog>
  </div>
</template>

<script>
import Dialog from "../components/Dialog"
export default {
    components:{
        Dialog
    },
    data(){
        return{
            paginations:{
                page_index:1,//当前位于哪一页
                total:10,//当前数据的总数
                page_size:5,//一页显示多少条
                page_sizes:[5,10,15,20],
                layout:"total, sizes, prev, pager, next, jumper"//翻页属性
            },
            tableData:[],
            allTableData:[],
            filterTableData:[],
            search_data: {
                startTime: "",
                endTime: ""
            },
            dialog: {
                show: false,
                title: "",
                option: "edit"
            },
            form: {
                type: "",
                describe: "",
                income: "",
                expend: "",
                cash: "",
                remark: "",
                id: ""
            }
        }
    },
    computed:{
        user(){
            return this.$store.getters.user
        }
    },
    created(){
        this.getProfile()
    },
    methods:{
        getProfile(){
            // 获取表格数据
            this.$axios("/api/profile").then(res => {
            // this.tableData = res.data;
            this.allTableData = res.data;
            this.filterTableData = res.data;
            // 设置分页数据
            this.setPaginations();
            });

        },
        handleEdit(index,row){
            this.dialog={
                show:true,
                title:"修改资金信息",
                option:"edit"
            } 
            this.form={
                type: row.type,
                describe: row.describe,
                income: row.income,
                expend:row.expend,
                cash: row.cash,
                remark: row.remark,
                id: row._id
            }
        },
        handleDelete(index,row){
            this.$axios.delete(`/api/profile/delete/${row._id}`)
            .then(res=>{
                this.$message({
                    message:"删除成功"
                })
                this.getProfile();
            })
        },
        handleSearch(){
          if(!this.search_data.startTime||!this.search_data.endTime){
            this.$message({
              message:"请选择时间区间",
              type:"warning"
            })
            this.getProfile();
            return;
          }
          const sTime=this.search_data.startTime.getTime();
          const eTime=this.search_data.endTime.getTime();
          this.allTableData=this.filterTableData.filter(item=>{
            let date=new Date(item.date);
            let time=date.getTime(); 
            return time >= sTime && time <= eTime;
          });
            console.log(sTime)
          // 分页数据的调用
          this.setPaginations();
        },
        onAddMoney(){
            this.dialog={
                show:true,
                title:"添加资金信息",
                option:"add"
            } 
            this.form= {
                type: "",
                describe: "",
                income: "",
                expend: "",
                cash: "",
                remark: "",
                id: ""
            }
        },
        handleSizeChange(page_size){
            this.paginations.page_index=1;
            this.paginations.page_size=page_size;
            this.tableData=this.allTableData.filter((item,index)=>{
                return index<page_size
            })
        },
        handleCurrentChange(page){
            //获取当前页数据的下标
            let index=this.paginations.page_size*(page-1);
            //获取数据的总数
            let nums=this.paginations.page_size*page;
            let tables=[];
            for(let i=index;i<nums;i++){
                 if(this.allTableData[i]){
                     tables.push(this.allTableData[i])
                 }
                 this.tableData=tables;
            }
           this.paginations.page_index=page;
            console.log(index)
            // console.log(nums)
        },
        setPaginations(){
            //分页属性
            this.paginations.total=this.allTableData.length;
            this.paginations.page_index=1;
            this.paginations.page_size=5;
            //设置默认的分页数据
            this.tableData=this.allTableData.filter((item,index)=>{
                return index<this.paginations.page_size
            })
        }
    }
}
</script>

<style scoped>
.fillcontainer {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>