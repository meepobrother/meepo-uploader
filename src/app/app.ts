import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from './uploader/uploader';
import { UploaderLoaderService } from './loader';
import { UploaderService } from './uploader.service';
import { MeepoCoreServiceModule } from 'meepo-core';
import { UuidModule } from 'meepo-uuid';
import { AxiosModule } from 'meepo-axios';
import { UaModule } from 'meepo-ua';
import { JssdkModule } from 'meepo-jssdk';

@NgModule({
    declarations: [
        UploaderComponent
    ],
    imports: [
        CommonModule,
        MeepoCoreServiceModule,
        UuidModule,
        AxiosModule,
        UaModule,
        JssdkModule
    ],
    exports: [
        UploaderComponent
    ],
    providers: [
        UploaderLoaderService,
        UploaderService
    ],
})
export class UploaderModule { }
