class DropBoxController {


    constructor() {
        this.btnSendFileEl = document.querySelector("#btn-send-file");
        this.inputFilesEl = document.querySelector("#files");
        this.snackModalEl = document.querySelector("#react-snackbar-root");
        this.progressBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg");
        this.filenameEl = document.querySelector(".filename");
        this.timeleftEl = document.querySelector(".timeleft");

        this.connectFireBase();
        this.initEvents();
    }

    connectFireBase() {  
        let initializeApp = "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";      
        const firebaseConfig = {
            apiKey: "AIzaSyAupJy2fxcidP6SguF4ZiVbWcj7zb5mw30",
            authDomain: "dropbox-clone-13ef0.firebaseapp.com",
            databaseURL: "https://dropbox-clone-13ef0-default-rtdb.firebaseio.com",
            projectId: "dropbox-clone-13ef0",
            storageBucket: "dropbox-clone-13ef0.appspot.com",
            messagingSenderId: "559956481192",
            appId: "1:559956481192:web:21cacf79f060c591ee5e9d"
          };
        
          // Initialize Firebase
          const app = initializeApp(firebaseConfig);
        
    }

    initEvents() {

        this.btnSendFileEl.addEventListener('click', event => {
            this.inputFilesEl.click();
        });

        this.inputFilesEl.addEventListener('change', event => {

            console.log(event.target.files);

            this.uploadTask(event.target.files);

            this.modalShow();

            this.inputFilesEl.value = '';

        });


    }

    modalShow(show = true) {

        this.snackModalEl.style.display = (show) ? "block" : "none";
    }

    uploadTask(files) {

        let promisses = [];

        [...files].forEach(files => {

            promisses.push(new Promise((resolve, reject) => {

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event => {

                    this.modalShow(false);

                    try {
                        resolve(JSON.parse(ajax.responseText));
                    } catch (e) {
                        reject(e);
                    }
                };
                ajax.upload.onprogress = event => {

                    this.uploadFiles(event, files);

                };

                ajax.onerror = event => {

                    this.modalShow(false);

                    reject(event);
                }
                let formData = new FormData();

                formData.append('input-file', files);

                this.startUploadTime = Date.now();

                ajax.send(formData);

            }));

        });

        return Promise.all(promisses);

    }

    uploadFiles(event, file) {

        let timespand = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded / total) * 100);

        let timeleft = ((100 - porcent) * timespand) / porcent;


        this.progressBarEl.style.width = `${porcent}%`;

        this.filenameEl.innerHTML = file.name;
        this.timeleftEl.innerHTML = this.formatTimeToHuman(timeleft);

        console.log(timespand, timeleft, porcent)


    }


    formatTimeToHuman(duration) {
        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        }
        if (minutes > 0) {
            return `${minutes} minutos e ${seconds} segundos`;
        }
        if (seconds > 0) {
            return `${seconds} segundos`;
        }
        return '';
    }

    getFileViewIcon() {

    }
    getFileView() {

    }
}