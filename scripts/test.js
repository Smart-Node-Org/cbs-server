var spawn = require('child_process').spawn

function timeConverter(x){
			var arr=x.split(":")
			var h=parseInt(arr[0])
			var m=parseInt(arr[1])
			var s=parseInt(arr[2].substr(0,arr[2].indexOf('.')))
			var ms=arr[2].substring(arr[2].indexOf('.')+1)
			if(ms.length==1)
			   ms=ms+"00"
			else if(ms.length==2)
			   ms=ms+"0"
			   
			ms=parseInt(ms)
			return ms+s*1000+m*60000+h*3600000

		}
function findTime(path_id){
    return new Promise(function(resolve,reject){
		var start=spawn('mp4info',['/var/www/atc-edu.com/html/video/'+path_id+'/video.mp4'])
		start.stdout.on('data', (data) => {
		  var duIndex=data.indexOf("duration")
		  resolve(parseInt(data.toString().substring(duIndex+12,duIndex+18)))
		});

   })
}
function cancelHLS(path_id){
   return new Promise(function(resolve,reject){
	   var bash=spawn('bash',['~/atc/server/scripts/dehls.sh',path_id])
	   bash.on('exit', function (code, signal) {
		  console.log('Done !');
		  resolve(true)
		});
	})
}

function processHLS(path_id){
	findTime(14).then(function(data){
	   var total_time=data
	   console.log("total_time is "+total_time)
	   var bash=spawn('bash',['/root/atc/server/scripts/hls.sh'],{
        stdio: 'pipe'
      })	
		
        bash.stderr.on('data', (data) => {
		 if(data.toString().startsWith("frame=") && data.toString().includes("time=")){
		      data.toString().split(" ").forEach(function(p){
			     if(p.startsWith("time")){
				     console.log(p.substring(5))
				     var progressed=timeConverter(p.substring(5))*100/total_time
			         console.log(progressed+"%")
				 }
			  })
			  
		  }
		});
		bash.on('exit', function (code, signal) {
		  console.log(`Done ! code: ${code}, signal: ${signal}`);
		});
	})
}
cancelHLS(14).then(function(){
    processHLS(14)
})


