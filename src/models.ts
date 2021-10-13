// KARTVERKET API-TYPER
export interface Metadata {
    treffPerSide: number;
    side: number;
    totaltAntallTreff: number;
    viserFra: number;
    viserTil: number;
    sokeStreng: string;
}

export interface Representasjonspunkt {
    øst: number;
    nord: number;
    koordsys: number;
}

export interface Fylker {
    fylkesnavn: string;
    fylkesnummer: string;
}

export interface Kommuner {
    kommunenummer: string;
    kommunenavn: string;
}

export interface Location {
    skrivemåte: string;
    skrivemåtestatus: string;
    navnestatus: string;
    språk: string;
    navneobjekttype: string;
    stedsnummer: number;
    stedstatus: string;
    representasjonspunkt: Representasjonspunkt;
    fylker: Fylker[];
    kommuner: Kommuner[];
}

export interface LocationResponse {
    metadata: Metadata;
    navn: Location[];
}
