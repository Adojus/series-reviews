import { useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Toast } from 'primereact/toast';

import appState from './appState';

import './App.scss';


import NavMenu from '../navmenu/NavMenu';
import Footer from 'footer/Footer';
import About from 'about/About';
import NoMatch from 'about/NoMatch';
//import EntityCrud from 'entityCrud/EntityCrud';<Route path="/entityCrud/*" element={<EntityCrud/>}/>
import SerialaiCrud from 'serialaiCrud/SerialaiCrud';
import KategorijaCrud from 'kategorijaCrud/KategorijaCrud';
import AktoriusCrud from 'aktoriusCrud/AktoriusCrud';


class State {
	isInitialized : boolean = false;

	/**
	 * Makes a shallow clone. Use this to return new state instance from state updates.
	 * @returns A shallow clone of this instance.
	 */
	shallowClone() : State {
		return Object.assign(new State(), this);
	}
}


/**
 * Application. React component.
 * @returns Component HTML.
 */
function App() {
	//get state container and state updater
	const [state, setState] = useState(new State());

	//get ref to interact with the toast
	const toastRef = useRef<Toast>(null);


	/**
	 * This is used to update state without the need to return new state instance explicitly.
	 * It also allows updating state in one liners, i.e., 'update(state => state.xxx = yyy)'.
	 * @param updater State updater function.
	 */
	let update = (updater : () => void) => {
		updater();
		setState(state.shallowClone());
	}

	let updateState = (updater : (state : State) => void) => {
		setState(state => {
			updater(state);
			return state.shallowClone();
		})
	}

	//initialize
	if( !state.isInitialized )
	{
		//subscribe to app state changes
		appState.when(appState.isLoggedIn, () => {
			//this will force component re-rendering
			updateState(state => {});
		});

		//subscribe to user messages
		appState.msgs.subscribe(msg => {
			update(() => toastRef.current?.show(msg));
		});

		//indicate initialization is done
		updateState(state => state.isInitialized = true);
	}

	//render component HTML
	let html =
		<Router>
			<NavMenu/>
			<Toast ref={toastRef} position="top-right"/>
			<div className="shadow-sm bg-body rounded flex-grow-1 overflow-hidden p-1">
				<Routes>
					{ appState.isLoggedIn.value &&
						<>						
						<Route path="/serialaiCrud/*" element={<SerialaiCrud/>}/>
						<Route path="/kategorijaCrud/*" element={<KategorijaCrud/>}/>
						<Route path="/aktoriusCrud/*" element={<AktoriusCrud/>}/>
						<Route path="/" element={<About/>}/>
						<Route path="*" element={<NoMatch/>}/>
						</>
					}					
				</Routes>
				{ !appState.isLoggedIn.value &&
					<div className="d-flex flex-column h-100 justify-content-center align-items-center">
						<span className="alert alert-primary mx-2">Please, log in to see content.</span>
					</div>
				}
			</div>
			<Footer/>
		</Router>;
	
	//
	return html;
}

export default App;