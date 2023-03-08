$(function () {
  var layer = layui.layer
  var form = layer.form
  var laypage = layui.laypage;
  //定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (data) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
  }
  // 定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  var q = {
    pagenum: 1, //页码值,默认请求第一页的数据
    pagesize: 2,//每页显示几条数据默认每页显示2条
    cate_id: '',//文章分类的Id
    state: '',//文章的发布状态
  }
  initTable()
  initCate()

  //获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败! ')
        }
        //使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        //调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }

  //初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败! ')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('cate_id', res)
        $('[name=cate_id]').html(htmlStr)
        //通过layer重新渲染表单区域的UI结构
        form.render()
      }
    })
  }

  //为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    //为查询参数对象q中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件,重新渲染表格的数据
    initTable()
  })

  //定义渲染分页的方法
  function renderPage(total) {
    //调用laypage.render()方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox',//分页容器的Id
      count: total, //总数据条数
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum, //设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'rext', 'skip'],
      limits: [2, 3, 5, 10],
      //分页发生切换的时候,触发jump回调
      jump: function (obj, first) {
        console.log(obj.curr);
        //把最新的页码值,赋值到q这个查询参数对象中
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        // initTable()
        if (!first) {
          initTable()
        }
      }
    })
  }

  //通过代理的形式,为删除按钮绑定点击事件处理函数
  $('body').on('click', '.btn-delete', function () {
    var len = $('.btn-delete').length
    var id = $(this).attr('data-id')//获取到文章的id
    layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/:id' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败!')
          }
          layer.msg('删除文章成功! ')
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })

      layer.close(index);
    });
  })
})