# gulpforreact

用es6的语法写React组建喽

###A:首先先安装node依赖库
请先执行一下命令，时间有些长，请耐心等待

    npm install

###B:外层项目目录结构

    js
    --jsx
    --es6
    --*.min.js

    images
    --*.jpg,*.png

    css
    --less
    --*.min.css

    *.html
    
###C：命令执行参数

    gulp --isflexible true 开启pxtorem的转换,
    
    默认:
    gulp 监听js/jsx/*.jsx,css/less/*.less，images和html，针对jsx和less会进行变动更新后压缩
    
    isflexible参数是是否开启pxtorem的转换，此字段默认是关闭转换，如果打开则需要flexible.js来配合使用。
    flexible github地址：https://github.com/amfe/lib-flexible
    需要在header里加入此js
    
###D:Browsersync代理监听nginx的vhost
Browsersync会启动一个server，如果想要监听nginx配置的vhost域名，则通过browsersync的proxy配合nginx的vhost相同域名即可。
用法如下：

    1):Browsersync启动如下：
    Browsersync({
        proxy:"test.xxx.com"
    });

    2):nginx的vhost为test.xxx.com.conf
这样browser就会通过代理来监听nginx设置的vhost。如果实现接口跨域配置vhost里的proxy即可
    
###E:增加config文件来配置监听路径
    {
        "path":{
          "rootPath":"./project/",//需要监听的项目根目录
          "imagePath":"./project/images/",//监听项目image文件目录
          "jsPath":"./project/js/",//监听项目javscript文件目录
          "cssPath":"./project/css/",//监听项目css文件目录
          "htmlPath":"./project/html" //监听项目html文件目录
        },
        "server":{
          "port":8080 //启动browsersync的port设置，暂时没用到
        }
    }
