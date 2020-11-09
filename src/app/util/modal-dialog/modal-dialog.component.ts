import { Component, OnInit, Input, Output, EventEmitter, HostListener, SimpleChanges } from '@angular/core';
import { fadeAnimation } from '../../animations';
import { fadeTransition } from '../../routerAnimation';
import { BasicDataService } from '../../services/basic-data.service';

@Component({
    selector: 'app-modal-dialog',
    templateUrl: './modal-dialog.component.html',
    styleUrls: ['./modal-dialog.component.css'],
    animations: [fadeAnimation, fadeTransition()]
})
export class ModalDialogComponent implements OnInit {
    @Input() visible: boolean;
    @Input() width = 12;
    @Output() hide = new EventEmitter<boolean>();
    private numModal: number;

    constructor(
        private basicDataService: BasicDataService
    ) { }

    // tslint:disable-next-line: use-life-cycle-interface
    ngOnChanges(changes: SimpleChanges) {
        if (this.visible) {
            this.numModal = this.basicDataService.addNumberModal();
        }
        if (!this.visible && this.numModal > 0) {
            this.basicDataService.removeNumberModal(this.numModal);
        }
    }

    ngOnInit() {
    }

    hideF() {
        // this.visible = false;
        this.hide.emit(true);
    }

    @HostListener('document:keydown', ['$event']) handleKeyDown(event) {
        if (event.keyCode === 27 && this.visible && this.numModal == this.basicDataService.currentNumberModal) {
            this.hideF();
        }
    }
}
