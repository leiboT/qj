module.exports=function(grunt){
    //任务配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            js: {
                files:['js/**/*.js'],
                tasks:['default'],
                options: {livereload:false}
            },
            babel:{
                files:'js/**/*.js',
                tasks:['babel']
            }
        },
        jshint:{
            build:['js/**/*.js'],
            options:{
                jshintrc:'.jshintrc' //检测JS代码错误要根据此文件的设置规范进行检测，可以自己修改规则
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'js',
                src: '**',
                dest: 'dist/'
            }
        },
        babel: {
            options: {
                sourceMap: false,
                presets: ['babel-preset-env']

            },
            dist: {
                files: [{
                    expand:true,
                    cwd:'dist/', //js目录下
                    src:['**/*.js'], //所有js文件
                    dest:'dist/'  //输出到此目录下
                }]
            }
        },
        uglify: {
            options: {
                banner: '/*\nProject-name <%= pkg.name %>\nCreate by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %>\n */',
                mangle: true, //混淆变量名
                comments: 'false' //false（删除全部注释），some（保留@preserve @license @cc_on等注释）
            },
            my_target: {
                files: [{
                    expand:true,
                    cwd:'dist/', //js目录下
                    src:['**/*.js'], //所有js文件
                    dest:'dist/'  //输出到此目录下
                }]
            }
        },
        cssmin: {
            options: {
                stripBanners:true, //合并时允许输出头部信息
                banner: '/*\nProject-name <%= pkg.name %>\nCreate by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %>\n */'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'css/',
                    src: ['**/*.css'],
                    dest: 'dest/'
                }]
            }
        }
    });

    //载入uglify插件，压缩js
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //注册任务
    grunt.registerTask('default', ['copy','babel','uglify','cssmin','watch']);
};