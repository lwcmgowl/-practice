//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/mystaff.html");

//列表容器VIEW
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    bindings : {
        "#clueSource" : {
            observe : 'clueSource'
        },
        "#profession" : {
            observe : 'profession'
        },
        "#region" : {
            observe : 'region'
        },
        "#province" : {
            observe : 'province'
        },
        "#companyName" : {
            observe : 'companyName'
        },
        "#principal" : {
            observe : 'principal'
        }

    },
    events : {
        'submit' : 'load',
        'click #searchbtn' : function() {
            this.$el.submit();
        },
        'click #exportFile' : 'exportFile',
        'click #clear':'clear'
    },
    model : new marketModel(),
    template : marketTemplate,
    // collection : new marketCollection(),

    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        $("#province").html("<option value=''>选择所属省份</option>" + getOption(appcan.province));
        for (var n = 0; n < appcan.clueSources.length; n++) {
            var str = '<option value="' + n + '">' + appcan.clueSources[n] + '</option>';
            $("#clueSource").append(str);
        };
        $("#region").html("<option value=''>选择所属团队</option>" + getRegionOption());
        this.model.fetch({
            success : function(cols, resp, options) {
                $("#profession").html("<option value=''>选择行业类别</option>" + profession(resp.msg.list));

            },
            error : function(cols, resp, options) {

            },
            type : 1

        });
        self.load();
        document.onkeypress = function(e) {
                var code;
                if (!e) {
                    e = window.event;
                }
                if (e.keyCode) {
                    code = e.keyCode;
                } else if (e.which) {
                    code = e.which;
                }
                if (code == 13) {
                    marketListViewInstance.load();
                }
            }
    },
    //查询重置
    clear : function() {
        $('select,input').val('');
        this.load();
    },
    load : function() {
                var self = this;
               //行业类别
                var profession = $("#profession").val();
                //所属团队
                var region = $("#region").val();
                //数据来源
                var dataSource = $("#clueSource").val();
                //客户名称
                var companyName = $.trim($("#companyName").val());
                //省
                var province=$.trim($("#province").val());
                var marketUserId=appcanUserInfo.userId;
                var marketQuery=$.trim($("#people").val());
                if(marketQuery===''){
                      }else if(!reg1.test(marketQuery)){
                         $.danger("请输入正确负责人名称!");
                           return; 
                      }
                if(companyName===''){
                      }else if(!reg1.test(companyName)){
                         $.danger("请输入正确的客户名称/联系人/会议名称!");
                           return; 
                      }
         var param = {
                        dataType : "0",
                        profession : profession,
                        region : region,
                        dataSource : dataSource,
                        companyName : companyName,
                        province:province,
                        ifAffirm:"0",
                        marketQuery:marketQuery
                       
                 };
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/marketing/pageByMarketUserId',
                data : param
            },
            columns : [{
                "data" : "contactName",
                "width" : "80px",
                "title" : "联系人"
            }, {
                "data" : "mobile",
                "width" : "150px",
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "width" : "114px",
                "title" : "电话"
            }, {
                "data" : "companyName",
                "width" : "150px",
                "title" : "客户名称"
            }, {
                "data" : "dataSource",
                "title" : "数据来源"
            }, {
                "data" : "conferenceName",
                "class" : "ut-s",
                "title" : "会议名称"
            }, {
                "data" : "professionName",
                "title" : "行业类别"
            }, {
                "data" : "regionName",
                "title" : "所属团队"
            }, {
                "data" : "province",
                "title" : "所属省份"
            }, {
                "data" : "marketUserName",
                "title" : "负责人"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 4,
                width : "80px",
                render : function(i, j, c) {
                    if (c.dataSource)
                        return appcan.clueSources[c.dataSource];
                    else
                        return '';
                }
            }, {
                targets : 10,
                render : function(i, j, c) {
                    //editType 1 可编辑 2 不可编辑
                    var editType = 2;
                    var html = '<a class="btn btn-default btn-xs" href="#dynamicEdit/' + c.id + '/01/' + editType + '/' + encodeURIComponent(c.companyName) + '">跟进动态</a> ' + '<a class="btn btn-default btn-xs" href="#listviewDetail/' + c.id + '">查看</a> '
                    return html;
                }
            }]

        });
    },
    exportFile : function() {
        var marketUserId = appcanUserInfo.userId;
        var marketQuery = $.trim($("#principal").val());
        var province = $.trim($("#province").val());
        var data = {
                   "entityType" : "puisneMarketing",
                    "dataType" : "0",
                    "profession":$("#profession").val(),
                    "region" : $("#region").val(),
                    "dataSource" : $("#clueSource").val(),
                    "companyName" : $.trim($("#companyName").val()),
                    "marketQuery":marketQuery,
                     "ifAffirm":"0",
                     "province":province
        };
        var url = "/marketing/exportClue";
        marketViewService.exportFile(data, url)
    }
});
var marketListViewInstance = new marketListView();
