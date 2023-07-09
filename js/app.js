document.querySelector("#clear").addEventListener("click",(e)=>{
  // console.log(e)
  document.querySelector("#results").innerHTML=""
  document.querySelector("#btnsCont").classList.add('hide');
})

document.querySelector("#results").addEventListener("click",(e)=>{
// .forEach((a)=>{
	// console.log(e)
	if(e.target.tagName === 'IMG'){
		saveAs(e.target.src, e.target.dataset.fname);
	}
	// a.addEventListener("click",(e)=>{
	// saveAs(blob, "pretty image.png");
// })
})


document.querySelector("#dlAll").addEventListener("click",(e)=>{
  // document.querySelector("#results").innerHTML=""
  // document.querySelector("#btnsCont").classList.add('hide');
  const zip = new JSZip();
  var fnms=[];
  document.querySelectorAll("img").forEach((a)=>{
	  var name=a.dataset.fname;
	  if(fnms.includes(name)){
		var ind=name.lastIndexOf('.');
		name=name.slice(0,ind)+'(1)'+name.substr(ind);
		
	}
	fnms.push(name)
	zip.file(name, a.src.replace(/^data:image\/?[A-z]*;base64,/,''), {base64: true});
  })
  zip.generateAsync({type:"blob"}).then(function(content) {
    // see FileSaver.js
    saveAs(content, "compressed-images.zip");
	});
})




document.querySelector("#fileInpt").addEventListener("change",(e)=>{
  // console.log(e)
  compressor(document.querySelector("#fileInpt").files);
})


window.addEventListener('drop', proceedFiles, true);
function proceedFiles(event) {

    event.preventDefault();
    let data = event.dataTransfer,
    target = event.target,
    files;
    if (data) {
      files = data.files
    } else {
      files = target.files
    }
	
	compressor(files)

	
	//console.log(files);
  }
  
window.addEventListener('dragover', function (event) {
    event.preventDefault();
  }, true);
  
  
  
function formatBytes(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}`} 
function compressor(files,width=false) {
    width=document.querySelector("#useCval").checked;
    if(width){
	    width=parseInt(document.querySelector("#cCval").value);
		for (let i = 0; i < files.length; i++){
		    lrz(files[i], {width: width})
			    .then(function (rst) {
				    loadResult(rst)
				})
				.catch(function (err) {
				    console.log(err);
                });
		}
		    
			
	}else{
	    for (let i = 0; i < files.length; i++){
		    //console.log(files[i].size )
			lrz(files[i])
			    .then(function (rst) {
				   // sourceSize = toFixed2(that.files[0].size / 1024),
                //resultSize = toFixed2(rst.fileLen / 1024)
				    
					loadResult(rst)
				})
				.catch(function (err) {
				    console.log(err);
                });
		}
	}



}

function loadResult(rst){

	// console.log(formatBytes(rst.fileLen));
	//console.log(rst.origin);
	// console.log(rst.origin.name);
	// console.log(formatBytes(rst.origin.size));
	//console.log(rst);
	// document.querySelector('#filesSlot').appendChild(img);
	var bDiv=document.createElement('div');
	bDiv.classList.add("col-xs-3","text-center");
	var resB=document.createElement('p');
	resB.innerHTML='<span style="color:red;">'+formatBytes(rst.origin.size)+'</span> → <span style="color:green;">'+formatBytes(rst.fileLen)+'</span>';
	
	var img=new Image();
	img.onload=()=>{
		img.dataset.fname=rst.origin.name;
		bDiv.appendChild(img);
		bDiv.appendChild(resB);
		document.querySelector("#results").appendChild(bDiv);
		document.querySelector("#btnsCont").classList.remove('hide');
	}
	img.src=rst.base64;
} 

