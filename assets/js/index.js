$(function () {
  getUserInfo()//调用getUserInfo () 获取用户基本信息
  //点击按钮,实现退出功能
  var layer = layui.layer
  $('#btnLogout').on('click', function () {
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      localStorage.removeItem('token')//清空本地存储中的token
      location.href = '/login.html'//重新跳转到登录页面
      layer.close(index);//关闭confirm询问框
    })
  })
})

function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers: {// headers 就是请求头配置对象
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败! ')
      }
      // 调用 renderAvatar 渲染用户头像
      renderAvatar(res.data)
    },
    // 不论成功还是失败,最终都会调用complete回调函数
    // complete: function (res) {
    //   // console.log('执行了complete 回调:');
    //   // console.log(res);
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败! ') {
    //     localStorage.removeItem('token')
    //     location.href = '/login.html'
    //   }
    // }
  })
}

//渲染用户的头像
function renderAvatar(user) {
  var name = user.nickname || user.username //1.获取用户的名称
  $('#welcom').html('欢迎&nbsp;&nbsp;' + name)//设置欢迎的文本
  if (user.user_pic !== null) {
    //渲染图片头像
    $('.layui-nav-img').attr('src', user.ser_pic).show
    $('.text-avatar').hide()
  } else {
    //渲染文本头像
    $('layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}
