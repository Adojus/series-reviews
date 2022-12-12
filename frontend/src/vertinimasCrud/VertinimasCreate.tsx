import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
  
import config from 'app/config';
import backend from 'app/backend';
import { notifySuccess } from 'app/notify';

import { VertinimasForCU } from './models';
import { Dropdown } from 'primereact/dropdown';


/**
 * Component state.
 */
class State
{	
	
	komentaras: string = "";
	ivertinimas: number = 0;
	fk_naudotojo_id: number = 0;
	fk_serialo_id: number = 0;

	isNameErr : boolean = false;
	isSaveErr : boolean = false;

	isIvertinimasErr : boolean = false;
	isFkNaudotojoErr : boolean = false;
	isFkSerialoErr : boolean = false;

	/**
	 * Resets error flags to off.
	 */
	resetErrors() {
		this.isNameErr = false;
		this.isSaveErr = false;
		this.isIvertinimasErr = false;
		this.isFkNaudotojoErr = false;
		this.isFkSerialoErr = false;
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
function VertinimasCreate() {
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
			if( state.komentaras.trim() === "" )
				state.isNameErr = true;
			//errors found? abort
			if( state.isNameErr )
				return;

			//validate form
			if( state.ivertinimas < 1 )
			state.isIvertinimasErr = true;
			//errors found? abort
			if( state.isIvertinimasErr )
				return;

			//validate form
			if( state.fk_naudotojo_id < 1)
			state.isFkNaudotojoErr = true;
			//errors found? abort
			if( state.isFkNaudotojoErr )
				return;

			//validate form
			if( state.fk_serialo_id < 1 )
			state.isFkSerialoErr = true;
			//errors found? abort
			if( state.isFkSerialoErr )
				return;

			//drop timezone from date, otherwise we will see wrong dates when they come back from backend

			//collect entity data
			let vertinimas = new VertinimasForCU();
			vertinimas.komentaras = state.komentaras;
			vertinimas.ivertinimas = state.ivertinimas;
			vertinimas.fk_naudotojo_id = state.fk_naudotojo_id;
			vertinimas.fk_serialo_id = state.fk_serialo_id;
			
			//request entity creation
			backend.post(
				config.backendUrl + "/vertinimas/create",
				vertinimas
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


					<label htmlFor="komentaras" className="form-label">Komentaras:</label>
					<InputText 
						id="komentaras" 
						className={"form-control " + (state.isNameErr ? "is-invalid" : "")}
						value={state.komentaras}
						onChange={(e) => update(() => state.komentaras = e.target.value)}
						/>
					{state.isNameErr && 
						<div className="invalid-feedback">Komentaras must be non empty and non whitespace.</div>
					}

					<label htmlFor="ivertinimas" className="form-label">Įvertinimas:</label>
					<InputText 
						id="ivertinimas" 
						className={"form-control " + (state.isIvertinimasErr ? "is-invalid" : "")}
						value={state.ivertinimas}
						onChange={(e) => update(() => state.ivertinimas = Number(e.target.value))}
						/>
					{state.isIvertinimasErr && 
						<div className="invalid-feedback">Ivertinimas invalid value.</div>
					}

					<label htmlFor="fk_naudotojo_id" className="form-label">Sezonų skaičius:</label>
					<InputText 
						id="fk_naudotojo_id" 
						className={"form-control " + (state.isFkNaudotojoErr ? "is-invalid" : "")}
						value={state.fk_naudotojo_id}
						onChange={(e) => update(() => state.fk_naudotojo_id = Number(e.target.value))}
						/>
					{state.isFkNaudotojoErr && 
						<div className="invalid-feedback">Naudotojo ID invalid value.</div>
					}

					<label htmlFor="fk_serialo_id" className="form-label">Epizodų skaičius:</label>
					<InputText 
						id="fk_serialo_id" 
						className={"form-control " + (state.isFkSerialoErr ? "is-invalid" : "")}
						value={state.fk_serialo_id}
						onChange={(e) => update(() => state.fk_serialo_id = Number(e.target.value))}
						/>
					{state.isFkSerialoErr && 
						<div className="invalid-feedback">Serialo ID invalid value.</div>
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
export default VertinimasCreate;