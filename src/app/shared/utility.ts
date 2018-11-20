import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class Utility {
    private config: any = {};
    
    constructor(private router: Router) { }

    SwalSuccessPopUp(title?,url?) {
     return   Swal({
            title: title,
            // text: 'You will not be able to recover this imaginary file!',
            type: 'success',//
            showCancelButton: true,
            confirmButtonText: 'Yes',
            // cancelButtonText: 'No, keep it'
        }).then((result) => {
            debugger;
            if (result.value) {
                this.router.navigate([url]);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal('error')
            }
        })
    }
    SwalwarningPopUp(title?,url?) {
        return Swal({
            title: title,
            // text: 'You will not be able to recover this imaginary file!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            // cancelButtonText: 'No, keep it'
        }).then((result) => {
            debugger;
            if (result.value) {
                this.router.navigate([url]);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal('error')
            }
        })
    }
}