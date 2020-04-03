import { State, Selector, Action, StateContext } from '@ngxs/store';
import { SidebarControl } from './sidebarControls.model';
import { ChangeControl, ChangeReportData, ChangeActiveLayers } from './sidebarControls.actions';
import { Injectable } from '@angular/core';

@State<SidebarControl>({
    name: 'controls',
    defaults:
    {
        controlName: 'test',
        reportData: {id: Math.random(), data: null},
        activeLayers: null,
        id: 0
    }
})
@Injectable()
export class SidebarControlsState {
    @Selector()
    static getControl(state: SidebarControl) {
        return state.controlName
    }

    @Selector()
    static getReportDataFromState(state: SidebarControl) {
        return state.reportData
    }

    @Selector()
    static getState(state: SidebarControl) {
        return state;
    }

    @Selector()
    static getActiveLayers(state: SidebarControl) {
        return state.activeLayers
    }

    @Action(ChangeControl)
    change(ctx: StateContext<SidebarControl>, { payload }: ChangeControl) {
        const state = ctx.getState();
        ctx.setState({ ...state, controlName: payload });
    }

    @Action(ChangeReportData)
    changeReportData(ctx: StateContext<SidebarControl>, { payload }: ChangeReportData) {
        const state = ctx.getState();
        ctx.setState({ ...state, reportData: {id: Math.random(), data: payload}, id: Math.random() });
    }

    @Action(ChangeActiveLayers)
    changeActiveLayers(ctx: StateContext<SidebarControl>, { payload }: ChangeActiveLayers) {
        // const state = ctx.getState();
        // state.activeLayers = payload;
        // ctx.setState({...state});
        // ctx.setState({ ...state, activeLayers: payload });
        ctx.patchState({activeLayers: payload})
    }

}