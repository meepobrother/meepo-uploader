import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
export const loadMaps: any = {};
import { DOCUMENT } from '@angular/common';
import "rxjs/add/operator/take";
@Injectable()
export class UploaderLoaderService {
    load$: Subject<any> = new Subject();
    time: any = new Date().getTime();
    constructor(
        @Inject(DOCUMENT) public document: any
    ) {
        console.log('uploader loader time ', this.time);
    }

    init() {
        this._loadSrc('https://meepo.com.cn/meepo/libs/plupload-2.3.6/js/moxie.min.js', 'moxie', () => {
            this._loadSrc('https://meepo.com.cn/meepo/libs/plupload-2.3.6/js/plupload.full.min.js', 'plupload', () => {
                this.load$.next(window['plupload']);
            });
        });
    }

    _loadSrc(src: string, name: string, cb?: any) {
        if (loadMaps[name]) {
            loadMaps[name] = window[name];
            if (cb) {
                cb(window[name]);
            } else {
                this.load$.next({ name: name, libs: window[name] });
            }
        } else {
            const script = this.document.createElement('script');
            script.src = src;
            script.type = 'text/javascript';
            script.onload = () => {
                loadMaps[name] = window[name];
                if (cb) {
                    cb(window[name]);
                } else {
                    this.load$.next({ name: name, libs: window[name] });
                }
            };
            this.document.getElementsByTagName('head')[0].appendChild(script);
        }
        return this;
    }
}