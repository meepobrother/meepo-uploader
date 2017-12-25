import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CoreService } from 'meepo-core';
@Injectable()
export class UploaderService {
    uploader: any;
    plupload: any;

    fileAdd$: Subject<any> = new Subject();
    error$: Subject<any> = new Subject();
    fileProgress$: Subject<any> = new Subject();
    fileLoaded$: Subject<any> = new Subject();
    filesRemoved$: Subject<any> = new Subject();

    width: number = 320;
    height: number = 320;
    quality: number = 90;
    max: number = 9;

    time: any = new Date().getTime();
    constructor(
        public core: CoreService
    ) {
        console.log('uploader service', this.time);
    }

    init(plupload: any, browse: any) {
        console.log('uploader 初始化');
        this.plupload = plupload || window['plupload'];
        let url = this.core.murl('entry//upload', { m: 'imeepos_runner' }, false);
        this.uploader = new this.plupload.Uploader({
            browse_button: browse,
            url: this.core.murl('entry//upload', { m: 'imeepos_runner' }, false),
            chunk_size: '1mb',
            unique_names: true,
            flash_swf_url: 'https://meepo.com.cn/meepo/libs/plupload-2.3.6/js/Moxie.swf',
            silverlight_xap_url: 'https://meepo.com.cn/meepo/libs/plupload-2.3.6/js/Moxie.xap',
            filters: {
                max_file_size: '10m',
                mime_types: [
                    { title: "Image files", extensions: "jpg,gif,png" }
                ]
            },
            resize: { width: this.width, height: this.height, quality: this.quality },
        });
        // 添加文件
        this.uploader.bind('FilesAdded', (up, files: any[]) => {
            // 生成预览文件
            let oldLen = this.uploader.files.length - files.length;
            this.uploader.files.splice(this.max, this.uploader.files.length);
            files = files.slice(0, this.max - oldLen);
            let hasAdd = false;
            files.map((file, i) => {
                console.log('add file');
                if (!file || !/image\//.test(file.type)) return; //确保文件是图片
                if (file.type == 'image/gif') {
                    let fr = new window['moxie'].file.FileReader();
                    fr.onload = () => {
                        file.imgsrc = fr.result;
                        fr.destroy();
                        fr = null;
                        console.log('add file');
                        this.fileAdd$.next(this.uploader.files);
                        hasAdd = true;
                    }
                    fr.readAsDataURL(file.getSource());
                } else {
                    var preloader = new window['moxie'].image.Image();
                    preloader.onload = () => {
                        preloader.downsize(this.width, this.height);
                        var imgsrc =
                            preloader.type == 'image/jpeg' ?
                                preloader.getAsDataURL('image/jpeg', 80) :
                                preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                        file.imgsrc = imgsrc;
                        preloader.destroy();
                        preloader = null;
                        console.log('add file');
                        this.fileAdd$.next(this.uploader.files);
                        hasAdd = true;
                    };
                    preloader.load(file.getSource());
                }
            });
            if (hasAdd) {
                this.fileAdd$.next(this.uploader.files);
            }
        });
        // 上传中...
        this.uploader.bind('UploadProgress', (up, file) => {
            this.fileProgress$.next(file);
        });
        // 全部上传完成
        this.uploader.bind('UploadComplete', (up, files) => {
        });
        // 单个文件上传完成
        this.uploader.bind('FileUploaded', (up, file, info) => {
            let response = info.response;
            let result = JSON.parse(response);
            if (result.url) {
                file.url = result.url;
            }
            this.fileLoaded$.next(file);
        });
        // 文件移除触发
        this.uploader.bind('FilesRemoved', (up, files) => {
            this.filesRemoved$.next(this.uploader.files);
        });
        // 上传失败
        this.uploader.bind('Error', (up, err) => {
            this.error$.next(err);
        });
        this.uploader.init();
        console.log(this.uploader);
    }

    start() {
        this.uploader.start();
    }

    remove(file) {
        this.uploader.removeFile(file);
        this.uploader.refresh();
    }

    reload(file) {
        this.uploader.refresh();
    }
}