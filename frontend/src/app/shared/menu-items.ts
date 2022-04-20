import { Injectable } from "@angular/core";

export interface Menu {
    state: string;
    name: string;
    icon: string;
    role: string;
}

const MAINITEMS = [
    {state : 'dashboard',name:'Dashboard',icon:'dashboard',role:''},
    {state : 'category',name:'Manage Category',icon:'category',role:'admin'}
];

@Injectable()
export class MenuItems{
    getMenuitem(): Menu[]{
        return MAINITEMS;
    }
}