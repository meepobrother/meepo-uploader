import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from './uploader/uploader';
import { FileSelectDirective } from './uploader/file-selecter';
import { UploaderLoaderService } from './loader';
import { UploaderService } from './uploader.service';
import { MeepoCoreServiceModule } from 'meepo-core';
@NgModule({
    declarations: [
        UploaderComponent,
        FileSelectDirective
    ],
    imports: [
        CommonModule,
        MeepoCoreServiceModule
    ],
    exports: [
        UploaderComponent,
        FileSelectDirective
    ],
    providers: [
        UploaderLoaderService,
        UploaderService
    ],
})
export class UploaderModule { }
