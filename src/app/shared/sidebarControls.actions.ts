class ChangeControl {
    static readonly type = '[Control] Change Control';
    constructor(public payload: string) {}
}

class ChangeReportData {
    static readonly type = '[Control] Change Report Data';
    constructor(public payload: any) {}
}

class ChangeActiveLayers {
    static readonly type = '[Control] Change Active Layers';
    constructor(public payload: any) {}
}

export {ChangeControl, ChangeReportData, ChangeActiveLayers}