import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
  
import config from 'app/config';
import backend from 'app/backend';
import { notifySuccess } from 'app/notify';

import { AktoriusForCU } from './models';


/**
 * Component state.
 */
class State
{	
	vardas: string ='';
    pavarde: string ='';
    gimimo_data: Date = new Date(Date.now());
    lytis: string ='';
    salis: string ='';

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
function AktoriusCreate() {
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
			if( state.vardas.trim() === "" )
				state.isNameErr = true;

			//errors found? abort
			if( state.isNameErr )
				return;

			//drop timezone from date, otherwise we will see wrong dates when they come back from backend
			let localDate = new Date(state.gimimo_data.getTime() - state.gimimo_data.getTimezoneOffset() * 60 *1000);
			let onlyDate = localDate.toISOString().split('T');

			//collect entity data
			let aktorius = new AktoriusForCU();

			aktorius.vardas = state.vardas;
			aktorius.pavarde = state.pavarde;
			aktorius.gimimo_data = onlyDate[0];
			aktorius.lytis = state.lytis;
			aktorius.salis = state.salis;

			
			//request entity creation
			backend.post(
				config.backendUrl + "/aktorius/create",
				aktorius
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



					<label htmlFor="vardas" className="form-label">Vardas:</label>
					<InputText 
						id="vardas" 
						className={"form-control " + (state.isNameErr ? "is-invalid" : "")}
						value={state.vardas}
						onChange={(e) => update(() => state.vardas = e.target.value)}
						/>
					{state.isNameErr && 
						<div className="invalid-feedback">Name must be non empty and non whitespace.</div>
					}

					<label htmlFor="pavarde" className="form-label">Pavardė:</label>
					<InputText 
						id="pavarde" 
						className={"form-control " + (state.isNameErr ? "is-invalid" : "")}
						value={state.pavarde}
						onChange={(e) => update(() => state.pavarde = e.target.value)}
						/>
					{state.isNameErr && 
						<div className="invalid-feedback">Name must be non empty and non whitespace.</div>
					}

					<label htmlFor="gimimo_data" className="form-label">Gimimo Data:</label>
					<Calendar
						id="gimimo_data"
						className="form-control"
						value={state.gimimo_data}		
						onChange={(e) => update(() => state.gimimo_data = e.target.value as Date)}				
						dateFormat="yy-mm-dd"
						/>

					<label htmlFor="lytis" className="form-label">Lytis:</label>
					<InputText 
						id="lytis" 
						className={"form-control " + (state.isNameErr ? "is-invalid" : "")}
						value={state.lytis}
						onChange={(e) => update(() => state.lytis = e.target.value)}
						/>
					{state.isNameErr && 
						<div className="invalid-feedback">Name must be non empty and non whitespace.</div>
					}

					<label htmlFor="salis" className="form-label">Šalis:</label>
					<InputText 
						id="salis" 
						className={"form-control " + (state.isNameErr ? "is-invalid" : "")}
						value={state.salis}
						onChange={(e) => update(() => state.salis = e.target.value)}
						/>
					{state.isNameErr && 
						<div className="invalid-feedback">Name must be non empty and non whitespace.</div>
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
export default AktoriusCreate;