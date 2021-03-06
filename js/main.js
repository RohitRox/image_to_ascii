$(document).ready( function(){
		
		var H = 240, W = 240;
		var r, g, b, gray;
		var character, line = "";
		var URL = window.webkitURL || window.URL;
		var x1, y1, x2,y2,x,y;
		var crop_flag = false;

		if (window.FileReader) {
			
			document.getElementById('img_file').addEventListener('change', handleFileSelectAndRenderViaCanvas, false);
			//document.getElementById('img_go').addEventListener('click', handleFileSelectAndRenderViaLink, false);

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

			// From thecodeplayer walkthrough

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
			generate_canvas_img();		
		});
	
		function generate_canvas_img(){
			var img_buff = document.getElementById("img_buff");
			var tc = img_buff.getContext("2d");
			var pixels = tc.getImageData(0, 0, W, H);
			var colordata = pixels.data;

			var ascii_img = document.createElement('canvas');
			ascii_img.className = 'the_output';
			ascii_img.height = H*8;
			ascii_img.width = W*8;
			var ascii_ctx = ascii_img.getContext('2d');
			ascii_ctx.fillStyle = "black";
			ascii_ctx.font        = "normal 10px monospace";
			var k = 1, j=1;
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
					if($('#color_check').is(':checked')){
						ascii_ctx.fillStyle = "rgba("+r+","+g+","+b+",1)";
					}	
					ascii_ctx.fillText(character, j, k);
					j = j+8;
					if(i != 0 && (i/4)%W == 0) //if the pointer reaches end of pixel-line
					{	
						k+=8;
						j =0;
					}
				
				}
			img_notice()
			$('.wrap-up').append(ascii_img);
		}

		function handleFileSelectAndRender(evt) {
			var files = evt.target.files;
			var f = files[0];
			var reader = new FileReader();

			reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('img_buff').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="320" />'].join('');
			};
			})(f);

			reader.readAsDataURL(f);
		}

		function handleFileSelectAndRenderViaCanvas(e) {
			var cvs = document.getElementById('img_buff');
			var ctx = cvs.getContext('2d');
			$('.notice').remove();

			var reader = new FileReader;

			reader.onload = function(event) {
				console.log(event.target.result);
			var img = new Image;
			img.src = event.target.result;

			img.onload = function() {
				W = this.width;
				H = this.height;
				cvs.width = W;
				cvs.height = H;
				ctx.clearRect(0,0,W,H);
				ctx.drawImage(img, 0,0,W,H);
				//console.log('the image is drawn');
				if( H > 220 || W > 220){
					big_image();
				}
				$('#control').show();
				
			};

			};

			reader.readAsDataURL(e.target.files[0]);

		}

		function handleFileSelectAndRenderViaLink(e)
		{	var cvs = document.getElementById('img_buff');
			var ctx = cvs.getContext('2d');
			var img = new Image;
			img.src = $('#img_link').val();
			img.onload = function() {
			H = this.height;
			W = this.width;
			cvs.width = W;
			cvs.height = H;
			ctx.clearRect(0,0,W,H);
			ctx.drawImage(img, 0,0,W,H);
			//console.log('the image is drawn');
			localStorage.setItem( "savedImageData", cvs.toDataURL("image/png") );
			};
			img.crossOrigin = "Anonymous";
		}

		function big_image(){
			if($('.notice').length < 1){
				var txt = "You choosed bigger image. You may crop the image.";
				$('#img_buff').Jcrop({onSelect: coord ,aspectRatio: 1});
				$('#img_head').after('<p class="notice">'+txt+'</p>');
			}

		}
		function img_notice(){
			if($('.save-notice').length < 1){
				var txt = "Right click the image and save it or simply double click the generated image";
				$('#control').after('<p class="save-notice">'+txt+'</p>');
			}

		}

		function coord(c){
			x1 = c.x;
			y1 = c.y;
			x2 = c.x2;
			y2 = c.y2;
			x = c.w;
			y = c.h;
			crop_flag = true;
		}

		$('#cropper').click(function(){
			if (!crop_flag){
				alert('You must first crop the image !');
				return;
			}
			var img_buff = document.getElementById("img_buff");
			var tc = img_buff.getContext("2d");
			var pixels = tc.getImageData(x1, y1, x, y);
			var colordata = pixels.data;

			var ascii_img = document.createElement('canvas');
			ascii_img.className = 'the_output';
			ascii_img.height = x*8;
			ascii_img.width = y*8;
			var ascii_ctx = ascii_img.getContext('2d');
			ascii_ctx.fillStyle = "black";
			ascii_ctx.font        = "normal 10px monospace";
			var k = 1, j=1;
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
					if($('#color_check').is(':checked')){
						ascii_ctx.fillStyle = "rgba("+r+","+g+","+b+",1)";
					}	
					ascii_ctx.fillText(character, j, k);
					j = j+8;
					if(i != 0 && (i/4)%x == 0) //if the pointer reaches end of pixel-line
					{	
						k+=8;
						j =0;
					}
				
				}
			img_notice()
			$('.wrap-up').append(ascii_img);
		});

		$('.the_output').live('dblclick',function(){
			 window.open(this.toDataURL("image/png"));
		});
});
