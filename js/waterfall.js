/* jshint asi:true */
//先等图片都加载完成
//再执行布局函数

/**
 * 执行主函数
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
(function() {

  /**
     * 内容JSON
     */
  var demoContent = [
    {
      demo_link: 'https://shen-xmas.github.io/',
      code_link: 'https://github.com/Shen-Xmas/Shen-Xmas.github.io',
      title: '我的博客',
      core_tech: 'JekyII, JavaScript, HTML, CSS',
      description: '我的博客. 详情见 <a href ="https://shen-xmas.github.io/">这里</a>。'
    },{
      demo_link: 'https://github.com/Shen-Xmas/spring-boot-demo',
      code_link: 'https://github.com/Shen-Xmas/spring-boot-demo',
      title: 'Java Spring-Boot demos',
      core_tech: 'Java, Spring Boot, 各种中间件 ..',
      description: '适合初学者入门的一些demo, 个人的一些学习思考, 欢迎指正. 详情见 <a href ="https://github.com/Shen-Xmas/spring-boot-demo">这里</a>。'
    }
  ];

  contentInit(demoContent) //内容初始化
}());

/**
 * 内容初始化
 * @return {[type]} [description]
 */
function contentInit(content) {
  var htmlStr = ''
  for (var i = 0; i < content.length; i++) {
    htmlStr += '<div class="grid-item">' + '   <h3 class="demo-title">' + '       <a href="' + content[i].demo_link + '">' + content[i].title + '</a>' + '   </h3>' + '   <p>主要技术：' + content[i].core_tech + '</p>' + '   <p>' + content[i].description + '       <a href="' + content[i].code_link + '">源代码 <i class="fa fa-code" aria-hidden="true"></i></a>' + '   </p>' + '</div>'
  }
  var grid = document.querySelector('.grid')
  grid.insertAdjacentHTML('afterbegin', htmlStr)
}

/**
 * 初始化栅格布局
 * @return {[type]} [description]
 */
function initGrid() {
  var msnry = new Masonry('.grid', {
    // options
    itemSelector: '.grid-item',
    columnWidth: 250,
    isFitWidth: true,
    gutter: 20
  })
}
