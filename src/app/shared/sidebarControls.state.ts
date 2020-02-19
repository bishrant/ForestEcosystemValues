import { State, Selector, Action, StateContext } from '@ngxs/store';
import { SidebarControl } from './sidebarControls.model';
import { ChangeControl, ChangeReportData, ChangeActiveLayers } from './sidebarControls.actions';
import { Injectable } from '@angular/core';

@State<SidebarControl>({
    name: 'controls',
    defaults:
    {
        controlName: 'test',
        reportData: null,
        activeLayers: null
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
        ctx.setState({ ...state, reportData: payload });
    }

    @Action(ChangeActiveLayers)
    changeActiveLayers(ctx: StateContext<SidebarControl>, { payload }: ChangeActiveLayers) {
        // const state = ctx.getState();
        // console.log(state, payload);
        // state.activeLayers = payload;
        // ctx.setState({...state});
        // ctx.setState({ ...state, activeLayers: payload });
        ctx.patchState({activeLayers: payload})
    }

}