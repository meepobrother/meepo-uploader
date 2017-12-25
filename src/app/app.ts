import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from './uploader/uploader';
import { UploaderLoaderService } from './loader';
import { UploaderService } from './uploader.service';
import { MeepoCoreServiceModule } from 'meepo-core';
import { UuidModule } from 'meepo-uuid';
@NgModule({
    declarations: [
        UploaderComponent
    ],
    imports: [
        CommonModule,
        MeepoCoreServiceModule,
        UuidModule
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
