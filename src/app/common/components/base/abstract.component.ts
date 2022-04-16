import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({ template: '' })
export class AbstractComponent implements OnInit, OnDestroy {
    subscriptions = [];
    ngOnInit(): void {
    }
    ngOnDestroy(): void {
        this.subscriptions.reverse().forEach(subscription => subscription.unsubscribe());
    }
}
