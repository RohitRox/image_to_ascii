$(document).ready( function(){
		
		var H = 240, W = 320;
		var r, g, b, gray;
		var character, line = "";
		var URL = window.webkitURL || window.URL;

		if (window.FileReader) {
			
			document.getElementById('img_file').addEventListener('change', handleFileSelectAndRenderViaCanvas, false);
			document.getElementById('img_go').addEventListener('click', handleFileSelectAndRenderViaLink, false);

		} else 
		{
			alert('This browser does not support FileReader ! ');
		}

		$('#ascii_generate').click(function(){
			
			var img_buff = document.getElementById("img_buff");
			var tc = img_buff.getContext("2d");
			var pixels = tc.getImageData(0, 0, W, H);
			var colordata = pixels.data;

			var ascii = document.getElementById("asciified");
			for(var i = 0; i < colordata.length; i = i+4)
				{
					r = colordata[i];
					g = colordata[i+1];
					b = colordata[i+2];
					//converting the pixel into grayscale
					gray = r*0.2126 + g*0.7152 + b*0.0722;
					//overwriting the colordata array with grayscale values
					//colordata[i] = colordata[i+1] = colordata[i+2] = gray;
					
					//text for ascii art.
					//blackish = dense characters like "W", "@"
					//whitish = light characters like "`", "."
					if(gray > 250) character = " "; //almost white
					else if(gray > 230) character = "`";
					else if(gray > 200) character = ":";
					else if(gray > 175) character = "*";
					else if(gray > 150) character = "+";
					else if(gray > 125) character = "#";
					else if(gray > 50) character = "W";
					else character = "@"; //almost black
					
					//newlines and injection into dom
					if(i != 0 && (i/4)%W == 0) //if the pointer reaches end of pixel-line
					{
						ascii.appendChild(document.createTextNode(line));
						//newline
						ascii.appendChild(document.createElement("br"));
						//emptying line for the next row of pixels.
						line = "";
					}
					
					line += character;
				}
		});

		$('#ascii_generate_img').click(function(){
			
			var img_buff = document.getElementById("img_buff");
			var tc = img_buff.getContext("2d");
			var pixels = tc.getImageData(0, 0, W, H);
			var colordata = pixels.data;

			var ascii_img = document.createElement('canvas');
			ascii_img.height = H*2;
			ascii_img.width = W*4;
			var ascii_ctx = ascii_img.getContext('2d');
			//ascii_ctx.fillRect(0, 0, ascii_img.width, ascii_img.height);
			ascii_ctx.fillStyle = 'black';
			ascii_ctx.font        = "normal 4px monospace";

			var k = 1;
			for(var i = 0; i < colordata.length; i = i+4)
				{
					r = colordata[i];
					g = colordata[i+1];
					b = colordata[i+2];
					//converting the pixel into grayscale
					gray = r*0.2126 + g*0.7152 + b*0.0722;
					//overwriting the colordata array with grayscale values
					//colordata[i] = colordata[i+1] = colordata[i+2] = gray;
					
					//text for ascii art.
					//blackish = dense characters like "W", "@"
					//whitish = light characters like "`", "."
					if(gray > 250) character = " "; //almost white
					else if(gray > 230) character = "`";
					else if(gray > 200) character = ":";
					else if(gray > 175) character = "*";
					else if(gray > 150) character = "+";
					else if(gray > 125) character = "#";
					else if(gray > 50) character = "W";
					else character = "@"; //almost black
					
					line += character;

					//newlines and injection into dom
					if(i != 0 && (i/4)%W == 0) //if the pointer reaches end of pixel-line
					{	
						ascii_ctx.fillText(line, 1, k);
						k+=2;
						console.log(line);
						line = "";
					}
				
				}
			document.body.appendChild(ascii_img);
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

			reader = new FileReader;

			reader.onload = function(event) {
			var img = new Image;
			img.src = event.target.result;
			img.onload = function() {
				W = this.width;
				H = this.height;
				cvs.width = W;
				cvs.height = H;
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
