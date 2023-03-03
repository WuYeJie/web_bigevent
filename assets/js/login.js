$(function () {
  // 点击 去注册账号 的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击 去登录 的链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })
  // 从layui中获取form对象
  var form = layui.form //从layui中获取form对象
  var layer = layui.layer
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],//自定义pwd校验规则
    // 校验两次密码是否一致
    repwd: function (value) {
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致,请重新输入! '
      }
    }
  })

  //监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    $.post('http://www.liulongbin.top:3007/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功,请登录! ')
      $('#link_login').click() // 模拟人的点击行为
    })
  })

  // 监听登录表单的提交数据
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: 'http://www.liulongbin.top:3007/api/login',
      method: 'POST',
      data: $(this).serialize(),//快速获取表单中的数据
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败! ')
        }
        layer.msg('登录成功! ')
        // 将登录成功得到的token字符串,localStorage中
        localStorage.setItem('token', res.token)
        location.href = '/index.html'
      }
    })
  })
})
