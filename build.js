const fs = require('fs')
const path = require('path');
const child_process = require('child_process');

/**
 * src 目录下文件
 * dist 打包的目标文件
 */
copyDir('./src/*', './dist')


// 复制文件 -> 编译文件
function copyDir(src, dist) {
    if (fs.existsSync(dist)) {
        copyFile(src, dist)
    }else{
        fs.mkdir(dist, function (err) {
            if (err) {
                console.log(err)
                return
            }
            copyFile(src, dist)
        })
    }
    function copyFile(src, dist){
        // 如果是windows
        if(process.platform === 'win32'){
            child_process.exec(`ROBOCOPY src ${dist} /E /MT:30`,function () {
                compile()
            });
        }else{
            child_process.exec(`cp -r ${src} ${dist}`,function () {
                compile()
            });
        }
    }
}
// 编译文件
function compile( src = 'dist') {
    let startPath = process.cwd()
    fs.readdir(src,{withFileTypes:true},  function (err, files) {
        files.forEach(file=>{
            if(file.isDirectory()){
                let dir = `${src}/${file.name}`
                compile(dir)
            }else{
                // 获取当前文件名称
                let fileName = file.name.split('.')[0]
                // 具体目录
                process.chdir(src);
                // 如果是windows
                if(process.platform === 'win32'){
                    // 编译MJML文件
                    const compile = child_process.exec(`mjml ${fileName}.mjml -o ${fileName}.html`)
                    compile.on('close', (code) => {
                        console.log('编译成功:',`${fileName}.mjml`)
                        let filePath = path.join(__dirname,`${src}/${fileName}.mjml`)
                        child_process.exec(`del ${filePath}`)
                    });
                }else{
                    // 编译MJML文件
                    const compile = child_process.spawn(`mjml`, [`${fileName}.mjml`,`-o`,`${fileName}.html`], {cwd: path.resolve(__dirname, src)})
                    compile.on('close', code => {
                        // 删除MJML文件
                        child_process.spawn(`rm`, [`${fileName}.mjml`], {cwd: path.resolve(__dirname, src)})
                        console.log('编译成功:',`${fileName}.mjml`)
                    })
                }
                // 复原目录
                process.chdir(startPath);
            }
        })
    })
}
