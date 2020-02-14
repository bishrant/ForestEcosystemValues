import { State, Selector, Action, StateContext } from '@ngxs/store';
import { SidebarControl } from './sidebarControls.model';
import { ChangeControl } from './sidebarControls.actions';

@State<SidebarControl>({
    name: 'controls',
    defaults: {name: 'test'}
})
export class SidebarControlsState {
    @Selector()
    static getControl(state: SidebarControl) {
        return state.name
    }

    @Action(ChangeControl)
    change(ctx: StateContext<SidebarControl>, {payload}: ChangeControl) {
        const state = ctx.getState();
        ctx.setState({...state, name: payload});
    }
}