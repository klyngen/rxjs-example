import { LitElement, TemplateResult, html, css } from "lit";
import { customElement, query, queryAsync, state } from "lit/decorators.js";
import "@material/mwc-menu";
import "@material/mwc-textfield";
import { TextField } from "@material/mwc-textfield";
import { Menu } from "@material/mwc-menu/mwc-menu";
import { fromEvent, Observable, tap, map, mergeMap, mergeMapTo, of, debounceTime, first, ReplaySubject } from "rxjs";
import { ajax } from "rxjs/ajax";
import { LocationResponse, Location } from "./models";

@customElement("test-component")
export class TestComponent extends LitElement {

    @queryAsync("#inputfield")
    textArea: Promise<TextField> | undefined;

    @query("#menu")
    menu: Menu | undefined;

    @state()
    menuItems: Location[] = [];

    @state()
    selectedItem = "";

    project: ReplaySubject<string> = new ReplaySubject<string>(1);

    constructor() {
        super();
        this.textArea?.then(field => {
            this.mountListener(field);
        });
        this.project.next('jca');
    }

    static styles = css`
        .wrapper {
            position: relative;
        }
    `;

    render(): TemplateResult {
        return html`
            <h1>Lokasjons-søk</h1>
            <div class="wrapper">
                <mwc-textfield type="search" outlined id="inputfield" label="Søk etter et sted"></mwc-textfield>
                <mwc-menu corner="BOTTOM_START" activatable id="menu">
                    ${this.menuItems.map(item => this.renderListItem(item))}
                </mwc-menu>
            </div>
            <br>
            <h3>Results</h3>
            <code>${this.selectedItem}</code>
        `
    }

    private renderListItem(item: Location): TemplateResult {
        return html`
            <mwc-list-item @click="${() => this.showSelected(item)}">${item.skrivemåte}</mwc-list-item>
        `
    }

    private locationSearch(
        text: string,
        pageSize: number,
        page: number
    ): Observable<LocationResponse> {
        return ajax<LocationResponse>({
            url: `https://ws.geonorge.no/stedsnavn/v1/navn?sok=${text}&fuzzy=true&utkoordsys=4258&treffPerSide=${pageSize}&side=${page + 1
                }`,
            crossDomain: true,
            method: "GET",
        }).pipe(map((item) => item.response));
    }

    private mountListener(textArea: TextField) {
        this.project.pipe().subscribe(p => console.log(p));

        this.project.next('jca2');

        if (this.menu) {
            this.menu.anchor = textArea;
        }

        const observable = fromEvent(textArea, 'input')
            .pipe(
                map(e => e.target as TextField),
                debounceTime(300),
                mergeMap(element => this.locationSearch(element.value, 25, 0)),
                tap((items) => {
                    this.menuItems = items.navn;
                    console.log(items.navn);
                    this.openResultList();
                }),
            ).subscribe();
        //.subscribe((a) => console.log(a));
        // TODO: Add some RXJS here
    }


    private showSelected(item: any) {
        this.selectedItem = JSON.stringify(item);
    }

    private openResultList() {
        if (this.menu) {
            this.menu.open = true;
            this.textArea?.then(area => area.select());
        }
    }

    private closeResultList() {
        if (this.menu) {
            this.menu.open = false;
        }
    }


}
