var request = require('request');
var fs = require("fs")

var bunny={}
bunny.createZone=function (zone) {
    return new Promise(function (resolve,reject) {
        request({
            method: 'POST',
            url: 'https://bunnycdn.com/api/storagezone',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "AccessKey":"48cd6d92-6396-4cd4-8167-fd25c3e8e79c43de8901-dd94-46e8-96a0-f99bbfdc4a0c"
            },
            body: JSON.stringify({name:zone})
        }, function (error, response, body) {
            console.log('Status:', response.statusCode);
            resolve(response.statusCode)
        });
    })

}
bunny.uploadFile=function(file,zone) {
    return new Promise(function (resolve,reject) {
        request({
                method: 'PUT',
                url: 'https://storage.bunnycdn.com/'+zone+'/'+file.substring(file.lastIndexOf("/")+1),
                headers: {
                    'Checksum': '',
                    'AccessKey': '15691732-cdc2-429f-8334d6b41c5e-448f-4781'
                },
                formData:{ file: fs.createReadStream(file) }
            },
            function (error, response, body) {
                if (error) {
                    console.error('upload failed:', error);
                    reject(err)
                }
                console.log(body)
                resolve(true)
            });
    })
}
bunny.uploadDir=function(dir,zone,socket) {
    return new Promise(function (resolve,reject) {
        fs.readdir(dir, function(err, files) {
            if(err)
                return console.log("52 "+err)
            console.log(files)
            var count=0
            var promises=files.map(function (file){
                return new Promise(function (resolve,reject) {
                    bunny.uploadFile(dir+'/'+file,zone).then(function (value) {
                        count+=1
                        if(socket)
                            socket.emit('bunnyUpload',count*100/files.length)
                        resolve(true)
                    }).catch(function (e) {
                        console.log("error ")
                        console.log(e)
                        reject(e)
                    })
                })
            })
            Promise.all(promises).then(function () {
                resolve(true)
            }).catch(function () {
                resolve(false)
            })
        })
    })
}

module.exports=bunny