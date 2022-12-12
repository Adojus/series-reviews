import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
  
import config from 'app/config';
import backend from 'app/backend';
import { notifySuccess } from 'app/notify';

import { KategorijaForCU } from './models';


/**
 * Component state.
 */
class State
{	
	pavadinimas: string = "";

	isNameErr : boolean = false;
	isSaveErr : boolean = false;

	/**
	 * Resets error flags to off.
	 */
	resetErrors() {
		this.isNameErr = false;
		this.isSaveErr = false;
	}

	/**
	 * Makes a shallow clone. Use this to return new state instance from state updates.
	 * @returns A shallow clone of this instance.
	 */
	shallowClone() : State {
		return Object.assign(new State(), this);
	}
}


/**
 * Log-in section in nav bar. React component.
 * @returns Component HTML.
 */
function KategorijaCreate() {
	//get state container and state updater
	const [state, setState] = useState(new State());

	//get router navigator
	const navigate = useNavigate();

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

	/**
	 * Handles'save' command.
	 */
	let onSave = () => {
		update(() => {
			//reset previous errors
			state.resetErrors();

			//validate form
			if( state.pavadinimas.trim() === "" )
				state.isNameErr = true;

			//errors found? abort
			if( state.isNameErr )
				return;


			//collect entity data
			let kategorija = new KategorijaForCU();
			kategorija.pavadinimas = state.pavadinimas;
			
			//request entity creation
			backend.post(
				config.backendUrl + "/kategorija/create",
				kategorija
			)
			//success
			.then(resp => {
				//redirect back to entity list on success
				navigate("./../", { state : "refresh" });

				//show success message
				notifySuccess("Entity created.");
			})
			//failure
			.catch(err => {
				updateState(state => state.isSaveErr = true);
			});
		});		
	}

	//render component html
	let html = 
		<>
		<div className="d-flex flex-column h-100 overflow-auto">
			<div className="mb-1">Create new entity</div>

			<div className="d-flex justify-content-center">
				<div className="d-flex flex-column align-items-start" style={{width: "80ch"}}>					
					{state.isSaveErr &&
						<div 
							className="alert alert-warning w-100"
							>Saving failed due to backend failure. Please, wait a little and retry.</div>
					}	



					<label htmlFor="pavadinimas" className="form-label">Pavadinimas:</label>
					<InputText 
						id="pavadinimas" 
						className={"form-control " + (state.isNameErr ? "is-invalid" : "")}
						value={state.pavadinimas}
						onChange={(e) => update(() => state.pavadinimas = e.target.value)}
						/>
					{state.isNameErr && 
						<div className="invalid-feedback">Pavadinimas must be non empty and non whitespace.</div>
					}
				


				</div>
			</div>

			<div className="d-flex justify-content-center align-items-center w-100 mt-1">
				<button
					type="button"
					className="btn btn-primary mx-1"
					onClick={() => onSave()}
					><i className="fa-solid fa-floppy-disk"></i> Save</button>
				<button
					type="button"
					className="btn btn-primary mx-1"
					onClick={() => navigate("./../")}
					><i className="fa-solid fa-xmark"></i> Cancel</button>
			</div>
		</div>
		</>;

	//
	return html;
}

//
export default KategorijaCreate;