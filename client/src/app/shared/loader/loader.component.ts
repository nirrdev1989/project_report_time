import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

    isLoad: boolean

    constructor(private loaderService: LoaderService) { }

    ngOnInit(): void {
        this.loaderService.getLoadStatus().subscribe((result) => {
            console.log(result)
            this.isLoad = result
        })
    }

}
