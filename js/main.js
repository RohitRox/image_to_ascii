$(document).ready( function(){
		
		var H = 240, W = 320;
		var URL = window.webkitURL || window.URL;

		if (window.FileReader) {
			
			document.getElementById('img_file').addEventListener('change', handleFileSelectAndRenderViaCanvas, false);
			document.getElementById('img_go').addEventListener('click', handleFileSelectAndRenderViaLink, false);

		} else 
		{
			alert('This browser does not support FileReader ! ');
		}

		$('#ascii_generate').click(function(){
			var img_src = document.getElementById("img_op");
			cvs = document.createElement('canvas');
			cvs.width = W;
			cvs.height = H; 
			var tc = cvs.getContext("2d");
			tc.fillStyle = "white";
			tc.fillRect(0, 0, W, H);
			//drawing the image on the canvas
			tc.drawImage(img_src, 0, 0, W, H);
		});

		function handleFileSelectAndRender(evt) {
			var files = evt.target.files;
			var f = files[0];
			var reader = new FileReader();

			reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('img_op').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="320" />'].join('');
			};
			})(f);

			reader.readAsDataURL(f);
		}

		function handleFileSelectAndRenderViaCanvas(e) {
			var cvs = document.getElementById('img_buff');
			var ctx = cvs.getContext('2d');
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, W, H);

			reader = new FileReader;

			reader.onload = function(event) {
			var img = new Image;
			img.src = event.target.result;
			img.onload = function() {
			ctx.drawImage(img, 0,0,W,H);
			console.log('the image is drawn');
			};

			};

			reader.readAsDataURL(e.target.files[0]);

		}

		function handleFileSelectAndRenderViaLink(e)
		{	var cvs = document.getElementById('img_buff');
			var ctx = cvs.getContext('2d');
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, W, H);
			var img = new Image;
			img.src = $('#img_link').val();
			img.onload = function() {
			ctx.drawImage(img, 0,0,W,H);
			console.log('the image is drawn');
			};
		}
});
