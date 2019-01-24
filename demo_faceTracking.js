function main(){
    var CVD; //return of Canvas2DDisplay

    const canvasCut = document.querySelector('#cutface');
    const canvasCxt = canvasCut.getContext('2d');
    const video = document.querySelector('video');

    JEEFACEFILTERAPI.init({
        canvasId: 'jeeFaceFilterCanvas',
        NNCpath: '../../../dist/', //root of NNC.json file
        spec:{},
        contador: 0,
        callbackReady: function(errCode, spec){
            this.spec = spec;
            this.contador = 0;
            if (errCode){
                console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
                return;
            }

            console.log('INFO : JEEFACEFILTERAPI IS READY');
            CVD = JEEFACEFILTERAPI.Canvas2DDisplay(spec);
            CVD.ctx.strokeStyle='yellow';

            video.srcObject = this.spec.GL.canvas.captureStream();
            video.width = this.spec.GL.canvas.width;
            video.height = this.spec.GL.canvas.height;

            
        }, //end callbackReady()

        //called at each render iteration (drawing loop)
        callbackTrack: function(detectState){
            
            if (detectState.detected>0.6){
                this.contador ++;
                //draw a border around the face
                var faceCoo=CVD.getCoordinates(detectState);
                CVD.ctx.clearRect(0,0,CVD.canvas.width, CVD.canvas.height);
                CVD.ctx.strokeRect(faceCoo.x, faceCoo.y, faceCoo.w, faceCoo.h);
                CVD.update_canvasTexture();

                
                canvasCut.width = faceCoo.w;
                canvasCut.height = faceCoo.h;
                canvasCxt.drawImage(video, faceCoo.x, faceCoo.y+(faceCoo.h/2), faceCoo.w, faceCoo.h, 0, 0, faceCoo.w, faceCoo.h);
                if(this.contador == 10){
                    console.log(canvasCut.toDataURL());
                    
                }
                
            }
            CVD.draw();
           
            
        } //end callbackTrack()
    }); //end JEEFACEFILTERAPI.init call
} //end main()